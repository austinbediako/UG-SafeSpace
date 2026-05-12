import { prisma } from "../config/database.js";
import { logger } from "../config/logger.js";
import { AppError, Errors } from "../middleware/error-handler.js";
import { createAuditEvent } from "../middleware/audit.js";
import { v4 as uuid } from "uuid";
import { deadlineService } from "./deadline.service.js";

// ─── Reference Number Generation ─────────────────────────────────────────────
// Format: UG-YYYY-XXXX where XXXX is a sequential counter per year.

async function generateCaseReference(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `UG-${year}-`;

  // Count existing complaints this year to get next number
  const count = await prisma.complaint.count({
    where: {
      reference: { startsWith: prefix },
    },
  });

  const number = (count + 1).toString().padStart(4, "0");
  return `${prefix}${number}`;
}

// ─── Submit Complaint (Intake) ───────────────────────────────────────────────

export interface ComplaintSubmission {
  reportType: string;
  misconductType: string;
  misconductDescription?: string;
  isAnonymous: boolean;
  complainantUserId?: string;
  complainantAffiliation: string;
  complainantDepartment?: string;
  complainantStudentStaffId?: string;
  incidentDate?: string;
  incidentLocation?: string;
  incidentDescription: string;
  respondentName: string;
  respondentStudentStaffId?: string;
  respondentDepartment: string;
  respondentAffiliation: string;
  respondentRelationship?: string;
  witnessInformation?: string;
  priorReportMade: boolean;
  priorReportDetails?: string;
  evidenceDescription?: string;
  consentToProcess: boolean;
}

export async function submitComplaint(
  input: ComplaintSubmission,
  meta: { ipAddress: string; userAgent: string }
) {
  const reference = await generateCaseReference();
  const trackingToken = input.isAnonymous ? uuid() : undefined;

  const complaint = await prisma.complaint.create({
    data: {
      reference,
      reportType: input.reportType as any,
      misconductType: input.misconductType as any,
      misconductDescription: input.misconductDescription || input.incidentDescription,
      isAnonymous: input.isAnonymous,
      complainantUserId: input.complainantUserId,
      complainantAffiliation: input.complainantAffiliation as any,
      complainantDepartment: input.complainantDepartment,
      complainantStudentStaffId: input.complainantStudentStaffId,
      trackingToken,
      incidentDate: input.incidentDate ? new Date(input.incidentDate) : null,
      incidentLocation: input.incidentLocation,
      incidentDescription: input.incidentDescription,
      respondentName: input.respondentName,
      respondentStudentStaffId: input.respondentStudentStaffId,
      respondentDepartment: input.respondentDepartment,
      respondentAffiliation: input.respondentAffiliation,
      respondentRelationship: input.respondentRelationship,
      witnessInformation: input.witnessInformation,
      priorReportMade: input.priorReportMade,
      priorReportDetails: input.priorReportDetails,
      evidenceDescription: input.evidenceDescription,
      consentToProcess: input.consentToProcess,
    },
  });

  await createAuditEvent({
    type: "CASE_CREATED",
    summary: `Complaint submitted: ${reference}`,
    actorUserId: input.complainantUserId,
    actorRole: "COMPLAINANT",
    metadata: { reference, isAnonymous: input.isAnonymous },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  logger.info({ reference, isAnonymous: input.isAnonymous }, "Complaint submitted");

  return {
    caseId: complaint.id,
    reference: complaint.reference,
    submittedAt: complaint.submittedAt.toISOString(),
    trackingToken,
    expectedAcknowledgmentBy: calculateExpectedAcknowledgment(complaint.submittedAt),
  };
}

// ─── Promote Complaint to Case ───────────────────────────────────────────────
// This is the ACKNOWLEDGMENT action. Committee acknowledges → complaint becomes case.

export async function acknowledgeComplaint(
  complaintId: string,
  acknowledgedBy: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint) throw Errors.notFound("Complaint");
  if (complaint.status !== "PENDING_REVIEW") {
    throw Errors.workflowViolation("Complaint has already been processed");
  }

  // Create the case in a transaction
  const result = await prisma.$transaction(async (tx) => {
    // Create the case entity
    const caseEntity = await tx.case.create({
      data: {
        reference: complaint.reference,
        stage: "ACKNOWLEDGMENT",
        status: "UNDER_REVIEW",
        reportType: complaint.reportType,
        misconductType: complaint.misconductType,
        misconductDescription: complaint.misconductDescription,
        isAnonymous: complaint.isAnonymous,
        complainantAffiliation: complaint.complainantAffiliation,
        complainantDepartment: complaint.complainantDepartment,
        respondentName: complaint.respondentName,
        respondentDepartment: complaint.respondentDepartment,
        incidentDate: complaint.incidentDate,
        incidentLocation: complaint.incidentLocation,
        incidentDescription: complaint.incidentDescription,
        witnessInformation: complaint.witnessInformation,
        priorReportMade: complaint.priorReportMade,
        priorReportDetails: complaint.priorReportDetails,
        acknowledgedAt: new Date(),
        complaintId: complaint.id,
      },
    });

    // Update complaint status
    await tx.complaint.update({
      where: { id: complaintId },
      data: {
        status: "PROMOTED_TO_CASE",
        acknowledgedAt: new Date(),
        promotedToCaseId: caseEntity.id,
      },
    });

    // Create complainant participant record (if not anonymous)
    if (complaint.complainantUserId) {
      await tx.caseParticipant.create({
        data: {
          caseId: caseEntity.id,
          userId: complaint.complainantUserId,
          role: "COMPLAINANT",
          addedBy: acknowledgedBy,
        },
      });
    }

    // Record stage transition
    await tx.stageTransition.create({
      data: {
        caseId: caseEntity.id,
        fromStage: "INTAKE",
        toStage: "ACKNOWLEDGMENT",
        transitionedBy: acknowledgedBy,
        reason: "Committee acknowledged complaint",
      },
    });

    return caseEntity;
  });

  await createAuditEvent({
    type: "STAGE_TRANSITIONED",
    caseId: result.id,
    actorUserId: acknowledgedBy,
    actorRole: "PANEL_CHAIR",
    summary: `Complaint acknowledged and promoted to case: ${result.reference}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return result;
}

// ─── Reject Complaint ────────────────────────────────────────────────────────

export async function rejectComplaint(
  complaintId: string,
  rejectedBy: string,
  reason: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const complaint = await prisma.complaint.findUnique({ where: { id: complaintId } });
  if (!complaint) throw Errors.notFound("Complaint");
  if (complaint.status !== "PENDING_REVIEW") {
    throw Errors.workflowViolation("Complaint has already been processed");
  }

  const updated = await prisma.complaint.update({
    where: { id: complaintId },
    data: {
      status: "REJECTED",
      rejectedAt: new Date(),
      rejectionReason: reason,
    },
  });

  await createAuditEvent({
    type: "CASE_CLOSED",
    actorUserId: rejectedBy,
    actorRole: "PANEL_CHAIR",
    summary: `Complaint rejected: ${complaint.reference}. Reason: ${reason}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return updated;
}

// ─── Stage Transition ────────────────────────────────────────────────────────
// The core workflow engine entry point. Validates transition legitimacy.

export async function transitionCaseStage(
  caseId: string,
  toStage: string,
  transitionedBy: string,
  reason?: string,
  meta?: { ipAddress: string; userAgent: string }
) {
  const caseEntity = await prisma.case.findUnique({
    where: { id: caseId },
    include: { participants: true },
  });

  if (!caseEntity) throw Errors.notFound("Case");

  // Validate the transition using the workflow engine
  const validTransitions = getValidTransitions(caseEntity.stage);
  if (!validTransitions.includes(toStage as any)) {
    throw Errors.invalidTransition(caseEntity.stage, toStage);
  }

  // Compute derived status from the new stage
  const newStatus = deriveStatusFromStage(toStage);

  const result = await prisma.$transaction(async (tx) => {
    // Update case
    const updated = await tx.case.update({
      where: { id: caseId },
      data: {
        stage: toStage as any,
        status: newStatus as any,
        ...(toStage === "INVESTIGATION" ? { investigationStartedAt: new Date() } : {}),
        ...(toStage === "RESPONDENT_NOTIFICATION" ? { respondentNotifiedAt: new Date() } : {}),
        ...(toStage === "CLOSED" ? { closedAt: new Date() } : {}),
      },
    });

    // Record transition
    await tx.stageTransition.create({
      data: {
        caseId,
        fromStage: caseEntity.stage,
        toStage: toStage as any,
        transitionedBy,
        reason,
      },
    });

    return updated;
  });

  // Activate deadlines for the new stage
  await deadlineService.activateStageDeadlines(caseId, toStage, result.submittedAt);

  await createAuditEvent({
    type: "STAGE_TRANSITIONED",
    caseId,
    actorUserId: transitionedBy,
    summary: `Case ${caseEntity.reference} transitioned from ${caseEntity.stage} to ${toStage}`,
    metadata: { fromStage: caseEntity.stage, toStage, reason },
    ipAddress: meta?.ipAddress,
    userAgent: meta?.userAgent,
  });

  return result;
}

// ─── Submit Respondent Response ──────────────────────────────────────────────

export async function submitRespondentResponse(
  caseId: string,
  userId: string,
  responseText: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const caseEntity = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseEntity) throw Errors.notFound("Case");

  if (caseEntity.stage !== "RESPONSE_WINDOW") {
    throw Errors.workflowViolation("Response can only be submitted during RESPONSE_WINDOW stage");
  }

  // Verify user is the respondent in this case
  const participant = await prisma.caseParticipant.findFirst({
    where: { caseId, userId, role: "RESPONDENT", isActive: true },
  });
  if (!participant) {
    throw Errors.forbidden("You are not the respondent in this case");
  }

  const updated = await prisma.case.update({
    where: { id: caseId },
    data: {
      respondentResponse: responseText,
      respondentResponseAt: new Date(),
    },
  });

  // Complete the respondent response deadline
  const deadline = await prisma.deadline.findFirst({
    where: { caseId, type: "RESPONDENT_RESPONSE", status: { in: ["ACTIVE", "APPROACHING"] } },
  });
  if (deadline) {
    await prisma.deadline.update({
      where: { id: deadline.id },
      data: { status: "COMPLETED", completedAt: new Date(), completedBy: userId },
    });
  }

  await createAuditEvent({
    type: "RESPONSE_SUBMITTED",
    caseId,
    actorUserId: userId,
    actorRole: "RESPONDENT",
    summary: `Respondent submitted response for case ${caseEntity.reference}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return { submittedAt: updated.respondentResponseAt!.toISOString() };
}

// ─── Get Case (with role-scoped projection) ──────────────────────────────────

export async function getCaseForUser(caseId: string, userId: string, userRole: string) {
  const caseEntity = await prisma.case.findUnique({
    where: { id: caseId },
    include: {
      participants: true,
      evidence: true,
      deadlines: true,
      hearings: { include: { parties: true, postponements: true } },
      decision: true,
      appeal: true,
      auditEvents: { orderBy: { occurredAt: "desc" }, take: 50 },
      stageTransitions: { orderBy: { transitionedAt: "desc" } },
    },
  });

  if (!caseEntity) throw Errors.notFound("Case");

  // Committee-level roles get full view
  const isCommittee = ["COMMITTEE_MEMBER", "COMMITTEE_CHAIR", "INVESTIGATOR", "SECRETARY", "ADMIN"].includes(userRole);
  if (isCommittee) return caseEntity;

  // Participants get scoped view
  const participation = caseEntity.participants.find(
    (p) => p.userId === userId && p.isActive
  );

  if (!participation) {
    throw Errors.forbidden("You are not authorized to view this case");
  }

  // Respondents must NOT see complainant identity if anonymous
  const redactComplainant = participation.role === "RESPONDENT" && caseEntity.isAnonymous;

  return {
    ...caseEntity,
    // Redact sensitive fields
    ...(redactComplainant
      ? {
          complainantDepartment: null,
          participants: caseEntity.participants.filter(
            (p) => p.role !== "COMPLAINANT"
          ),
        }
      : {}),
    // Remove audit events from participant view
    auditEvents: [],
  };
}

// ─── List Cases ──────────────────────────────────────────────────────────────

export async function listCasesForUser(
  userId: string,
  userRole: string,
  filters: {
    page?: number;
    pageSize?: number;
    stage?: string;
    status?: string;
    assignedToMe?: boolean;
  }
) {
  const page = filters.page || 1;
  const pageSize = Math.min(filters.pageSize || 20, 100);
  const skip = (page - 1) * pageSize;

  const isCommittee = ["COMMITTEE_MEMBER", "COMMITTEE_CHAIR", "INVESTIGATOR", "SECRETARY", "ADMIN"].includes(userRole);

  let where: any = {};

  if (isCommittee) {
    // Committee sees all cases with optional filters
    if (filters.stage) where.stage = filters.stage;
    if (filters.status) where.status = filters.status;
    if (filters.assignedToMe) where.assignedInvestigatorId = userId;
  } else {
    // Participants see only their cases
    where.participants = { some: { userId, isActive: true } };
    if (filters.stage) where.stage = filters.stage;
  }

  const [cases, total] = await Promise.all([
    prisma.case.findMany({
      where,
      include: {
        deadlines: {
          where: { status: { in: ["ACTIVE", "APPROACHING", "BREACHED"] } },
          orderBy: { dueAt: "asc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: pageSize,
    }),
    prisma.case.count({ where }),
  ]);

  return {
    data: cases.map((c) => ({
      id: c.id,
      reference: c.reference,
      misconductType: c.misconductType,
      reportType: c.reportType,
      stage: c.stage,
      status: c.status,
      priority: c.priority,
      submittedAt: c.submittedAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      assignedInvestigatorId: c.assignedInvestigatorId,
      nextDeadline: c.deadlines[0]
        ? {
            label: c.deadlines[0].label,
            dueAt: c.deadlines[0].dueAt.toISOString(),
            workingDaysRemaining: 0, // Computed by deadline service
            isBreached: c.deadlines[0].status === "BREACHED",
          }
        : null,
    })),
    meta: { total, page, pageSize, hasMore: skip + pageSize < total },
  };
}

// ─── Assign Investigator ─────────────────────────────────────────────────────

export async function assignInvestigator(
  caseId: string,
  investigatorUserId: string,
  assignedBy: string,
  meta: { ipAddress: string; userAgent: string }
) {
  const caseEntity = await prisma.case.findUnique({ where: { id: caseId } });
  if (!caseEntity) throw Errors.notFound("Case");

  // Verify investigator exists and has the right role
  const investigator = await prisma.user.findUnique({ where: { id: investigatorUserId } });
  if (!investigator || investigator.systemRole !== "INVESTIGATOR") {
    throw Errors.badRequest("Invalid investigator user ID");
  }

  await prisma.$transaction(async (tx) => {
    await tx.case.update({
      where: { id: caseId },
      data: { assignedInvestigatorId: investigatorUserId },
    });

    // Add as case participant
    await tx.caseParticipant.upsert({
      where: {
        caseId_userId_role: {
          caseId,
          userId: investigatorUserId,
          role: "INVESTIGATOR",
        },
      },
      create: {
        caseId,
        userId: investigatorUserId,
        role: "INVESTIGATOR",
        addedBy: assignedBy,
      },
      update: { isActive: true },
    });
  });

  await createAuditEvent({
    type: "INVESTIGATOR_ASSIGNED",
    caseId,
    actorUserId: assignedBy,
    actorRole: "PANEL_CHAIR",
    summary: `Investigator ${investigator.firstName} ${investigator.lastName} assigned to case ${caseEntity.reference}`,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return { assignedAt: new Date().toISOString() };
}

// ─── Workflow Helpers ─────────────────────────────────────────────────────────

function getValidTransitions(stage: string): string[] {
  const transitions: Record<string, string[]> = {
    INTAKE: ["ACKNOWLEDGMENT"],
    ACKNOWLEDGMENT: ["RESPONDENT_NOTIFICATION"],
    RESPONDENT_NOTIFICATION: ["RESPONSE_WINDOW"],
    RESPONSE_WINDOW: ["INVESTIGATION"],
    INVESTIGATION: ["HEARING_PREPARATION", "DECISION"],
    HEARING_PREPARATION: ["HEARING"],
    HEARING: ["DELIBERATION"],
    DELIBERATION: ["DECISION"],
    DECISION: ["APPEAL_WINDOW", "CLOSED"],
    APPEAL_WINDOW: ["APPEAL_REVIEW", "CLOSED"],
    APPEAL_REVIEW: ["CLOSED"],
    CLOSED: [],
  };
  return transitions[stage] || [];
}

function deriveStatusFromStage(stage: string): string {
  const map: Record<string, string> = {
    INTAKE: "OPEN",
    ACKNOWLEDGMENT: "UNDER_REVIEW",
    RESPONDENT_NOTIFICATION: "AWAITING_RESPONSE",
    RESPONSE_WINDOW: "AWAITING_RESPONSE",
    INVESTIGATION: "IN_INVESTIGATION",
    HEARING_PREPARATION: "HEARING_SCHEDULED",
    HEARING: "HEARING_SCHEDULED",
    DELIBERATION: "PENDING_DECISION",
    DECISION: "DECIDED",
    APPEAL_WINDOW: "DECIDED",
    APPEAL_REVIEW: "APPEALED",
    CLOSED: "CLOSED",
  };
  return map[stage] || "OPEN";
}

function calculateExpectedAcknowledgment(submittedAt: Date): string {
  // Policy requires acknowledgment within 5 working days
  const date = new Date(submittedAt);
  let daysAdded = 0;
  while (daysAdded < 5) {
    date.setDate(date.getDate() + 1);
    const day = date.getDay();
    if (day !== 0 && day !== 6) daysAdded++;
  }
  return date.toISOString();
}

// ─── List Pending Complaints (committee intake queue) ─────────────────────────
// Returns Complaint records in PENDING_REVIEW status shaped to match CaseSummary
// so the committee dashboard can use the same rendering component.

export async function listPendingComplaints(filters: { page?: number; pageSize?: number }) {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(100, filters.pageSize ?? 20);
  const skip = (page - 1) * pageSize;

  const [complaints, total] = await Promise.all([
    prisma.complaint.findMany({
      where: { status: "PENDING_REVIEW" },
      orderBy: { submittedAt: "asc" },
      skip,
      take: pageSize,
    }),
    prisma.complaint.count({ where: { status: "PENDING_REVIEW" } }),
  ]);

  const data = complaints.map((c) => ({
    id: c.id,
    reference: c.reference,
    misconductType: c.misconductType,
    reportType: c.reportType,
    stage: "INTAKE" as const,
    status: "OPEN" as const,
    submittedAt: c.submittedAt.toISOString(),
    updatedAt: c.submittedAt.toISOString(),
    priority: "STANDARD" as const,
    assignedInvestigatorId: null,
    nextDeadline: null,
  }));

  return { data, meta: { total, page, pageSize, hasMore: skip + pageSize < total } };
}

// ─── Track Case by Anonymous Token ────────────────────────────────────────────

export async function trackCaseByToken(trackingToken: string) {
  const complaint = await prisma.complaint.findUnique({
    where: { trackingToken },
    include: { promotedCase: true },
  });

  if (!complaint) throw Errors.notFound("Case");

  // Determine the current stage
  let stage = "INTAKE";
  let caseReference = complaint.reference;
  let stageDescription = "Your complaint has been submitted and is pending committee review.";

  if (complaint.status === "REJECTED") {
    stage = "REJECTED";
    stageDescription = "Your complaint was not accepted. Please contact the committee for details.";
  } else if (complaint.promotedCase) {
    stage = complaint.promotedCase.stage;
    caseReference = complaint.promotedCase.reference;

    const stageDescriptions: Record<string, string> = {
      ACKNOWLEDGMENT: "Your complaint has been acknowledged. The committee is reviewing the details.",
      RESPONDENT_NOTIFICATION: "The respondent has been notified of the complaint.",
      RESPONSE_WINDOW: "The respondent has been given time to submit their response.",
      INVESTIGATION: "An investigator has been assigned and the investigation is underway.",
      HEARING_PREPARATION: "A hearing is being scheduled.",
      HEARING: "The hearing is scheduled or in progress.",
      DELIBERATION: "The committee panel is deliberating on the decision.",
      DECISION: "A decision has been rendered and is being prepared for notification.",
      APPEAL_WINDOW: "The decision has been issued. Either party may file an appeal.",
      APPEAL_REVIEW: "An appeal has been filed and is under review.",
      CLOSED: "This case has been closed.",
    };
    stageDescription = stageDescriptions[stage] || stageDescription;
  }

  const stageLabels: Record<string, string> = {
    INTAKE: "Submitted",
    REJECTED: "Not Accepted",
    ACKNOWLEDGMENT: "Acknowledged",
    RESPONDENT_NOTIFICATION: "Respondent Notified",
    RESPONSE_WINDOW: "Awaiting Response",
    INVESTIGATION: "Under Investigation",
    HEARING_PREPARATION: "Hearing Preparation",
    HEARING: "Hearing Scheduled",
    DELIBERATION: "Under Deliberation",
    DECISION: "Decision Issued",
    APPEAL_WINDOW: "Appeal Window Open",
    APPEAL_REVIEW: "Appeal Under Review",
    CLOSED: "Closed",
  };

  return {
    caseReference,
    stage,
    stageLabel: stageLabels[stage] || stage,
    stageDescription,
    submittedAt: complaint.submittedAt.toISOString(),
    status: complaint.status,
  };
}
