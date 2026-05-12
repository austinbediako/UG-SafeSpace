-- CreateEnum
CREATE TYPE "SystemRole" AS ENUM ('COMPLAINANT', 'RESPONDENT', 'COMMITTEE_MEMBER', 'COMMITTEE_CHAIR', 'INVESTIGATOR', 'SECRETARY', 'ADMIN');

-- CreateEnum
CREATE TYPE "Affiliation" AS ENUM ('UNDERGRADUATE', 'POSTGRADUATE', 'FACULTY', 'ADMINISTRATIVE_STAFF', 'TECHNICAL_STAFF', 'EXTERNAL');

-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDING_REVIEW', 'ACKNOWLEDGED', 'REJECTED', 'PROMOTED_TO_CASE');

-- CreateEnum
CREATE TYPE "CaseStage" AS ENUM ('INTAKE', 'ACKNOWLEDGMENT', 'RESPONDENT_NOTIFICATION', 'RESPONSE_WINDOW', 'INVESTIGATION', 'HEARING_PREPARATION', 'HEARING', 'DELIBERATION', 'DECISION', 'APPEAL_WINDOW', 'APPEAL_REVIEW', 'CLOSED');

-- CreateEnum
CREATE TYPE "CaseStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'AWAITING_RESPONSE', 'IN_INVESTIGATION', 'HEARING_SCHEDULED', 'PENDING_DECISION', 'DECIDED', 'APPEALED', 'CLOSED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "ReportType" AS ENUM ('FORMAL', 'INFORMAL');

-- CreateEnum
CREATE TYPE "MisconductType" AS ENUM ('SEXUAL_HARASSMENT', 'SEXUAL_ASSAULT', 'STALKING', 'COERCION', 'DISCRIMINATION', 'INTIMIDATION', 'QUID_PRO_QUO', 'RETALIATION', 'OTHER');

-- CreateEnum
CREATE TYPE "CasePriority" AS ENUM ('STANDARD', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "ParticipantRole" AS ENUM ('COMPLAINANT', 'RESPONDENT', 'WITNESS', 'REPRESENTATIVE', 'INVESTIGATOR', 'PANEL_MEMBER', 'PANEL_CHAIR', 'OBSERVER');

-- CreateEnum
CREATE TYPE "RepresentativeType" AS ENUM ('LEGAL_COUNSEL', 'SUPPORT_PERSON', 'UNION_REPRESENTATIVE', 'ACADEMIC_ADVISOR');

-- CreateEnum
CREATE TYPE "EvidenceStatus" AS ENUM ('PENDING_UPLOAD', 'UPLOADED', 'UNDER_REVIEW', 'ACCEPTED', 'REJECTED', 'REDACTED');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('DOCUMENT', 'IMAGE', 'AUDIO', 'VIDEO', 'SCREENSHOT', 'CORRESPONDENCE', 'STATEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "DeadlineType" AS ENUM ('ACKNOWLEDGMENT', 'RESPONDENT_RESPONSE', 'INVESTIGATION', 'HEARING_NOTICE', 'APPEAL_FILING', 'CUSTOM');

-- CreateEnum
CREATE TYPE "DeadlineStatus" AS ENUM ('PENDING', 'ACTIVE', 'APPROACHING', 'BREACHED', 'EXTENDED', 'COMPLETED', 'WAIVED');

-- CreateEnum
CREATE TYPE "HearingStatus" AS ENUM ('SCHEDULED', 'POSTPONED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "HearingType" AS ENUM ('PRELIMINARY', 'FULL_HEARING', 'APPEAL_HEARING');

-- CreateEnum
CREATE TYPE "DecisionOutcome" AS ENUM ('UPHELD', 'PARTIALLY_UPHELD', 'DISMISSED', 'WITHDRAWN', 'REFERRED');

-- CreateEnum
CREATE TYPE "AppealStatus" AS ENUM ('FILED', 'UNDER_REVIEW', 'UPHELD', 'DISMISSED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('CASE_SUBMITTED', 'CASE_ACKNOWLEDGED', 'RESPONDENT_NOTIFIED', 'RESPONSE_RECEIVED', 'DEADLINE_APPROACHING', 'DEADLINE_BREACHED', 'HEARING_SCHEDULED', 'HEARING_REMINDER', 'DECISION_ISSUED', 'APPEAL_FILED', 'APPEAL_RESOLVED', 'CASE_CLOSED', 'EVIDENCE_SUBMITTED', 'INVESTIGATOR_ASSIGNED', 'REPRESENTATIVE_APPROVED', 'GENERAL');

-- CreateEnum
CREATE TYPE "FormalNoticeType" AS ENUM ('COMPLAINT_ACKNOWLEDGMENT', 'RESPONDENT_NOTIFICATION', 'HEARING_NOTICE', 'DECISION_NOTICE', 'APPEAL_ACKNOWLEDGMENT', 'APPEAL_OUTCOME');

-- CreateEnum
CREATE TYPE "DeliveryMethod" AS ENUM ('EMAIL', 'IN_PLATFORM', 'PHYSICAL', 'BOTH');

-- CreateEnum
CREATE TYPE "AuditEventType" AS ENUM ('CASE_CREATED', 'STAGE_TRANSITIONED', 'EVIDENCE_UPLOADED', 'EVIDENCE_ACCESSED', 'RESPONSE_SUBMITTED', 'HEARING_SCHEDULED', 'DECISION_RENDERED', 'APPEAL_FILED', 'USER_ACCESSED_CASE', 'DOCUMENT_DOWNLOADED', 'INVESTIGATOR_ASSIGNED', 'DEADLINE_EXTENDED', 'CASE_CLOSED', 'LOGIN_SUCCESS', 'LOGIN_FAILURE', 'PASSWORD_RESET', 'USER_CREATED', 'PERMISSION_DENIED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "systemRole" "SystemRole" NOT NULL DEFAULT 'COMPLAINANT',
    "affiliation" "Affiliation" NOT NULL,
    "department" TEXT,
    "staffId" TEXT,
    "studentId" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "reportType" "ReportType" NOT NULL,
    "misconductType" "MisconductType" NOT NULL,
    "misconductDescription" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "complainantUserId" TEXT,
    "complainantAffiliation" "Affiliation" NOT NULL,
    "complainantDepartment" TEXT,
    "complainantStudentStaffId" TEXT,
    "trackingToken" TEXT,
    "incidentDate" TIMESTAMP(3),
    "incidentLocation" TEXT,
    "incidentDescription" TEXT NOT NULL,
    "respondentName" TEXT NOT NULL,
    "respondentStudentStaffId" TEXT,
    "respondentDepartment" TEXT NOT NULL,
    "respondentAffiliation" TEXT NOT NULL,
    "respondentRelationship" TEXT,
    "witnessInformation" TEXT,
    "priorReportMade" BOOLEAN NOT NULL DEFAULT false,
    "priorReportDetails" TEXT,
    "evidenceDescription" TEXT,
    "consentToProcess" BOOLEAN NOT NULL DEFAULT true,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "promotedToCaseId" TEXT,

    CONSTRAINT "Complaint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Case" (
    "id" TEXT NOT NULL,
    "reference" TEXT NOT NULL,
    "stage" "CaseStage" NOT NULL DEFAULT 'INTAKE',
    "status" "CaseStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "CasePriority" NOT NULL DEFAULT 'STANDARD',
    "reportType" "ReportType" NOT NULL,
    "misconductType" "MisconductType" NOT NULL,
    "misconductDescription" TEXT NOT NULL,
    "isAnonymous" BOOLEAN NOT NULL DEFAULT false,
    "complainantAffiliation" "Affiliation" NOT NULL,
    "complainantDepartment" TEXT,
    "respondentName" TEXT NOT NULL,
    "respondentDepartment" TEXT NOT NULL,
    "respondentRole" TEXT,
    "incidentDate" TIMESTAMP(3),
    "incidentLocation" TEXT,
    "incidentDescription" TEXT NOT NULL,
    "witnessInformation" TEXT,
    "priorReportMade" BOOLEAN NOT NULL DEFAULT false,
    "priorReportDetails" TEXT,
    "respondentResponse" TEXT,
    "respondentResponseAt" TIMESTAMP(3),
    "assignedInvestigatorId" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "acknowledgedAt" TIMESTAMP(3),
    "respondentNotifiedAt" TIMESTAMP(3),
    "investigationStartedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "complaintId" TEXT,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseParticipant" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL,
    "representativeType" "RepresentativeType",
    "representsUserId" TEXT,
    "approvedByCommittee" BOOLEAN NOT NULL DEFAULT false,
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "addedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "addedBy" TEXT,
    "removedAt" TIMESTAMP(3),

    CONSTRAINT "CaseParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StageTransition" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "fromStage" "CaseStage" NOT NULL,
    "toStage" "CaseStage" NOT NULL,
    "transitionedBy" TEXT NOT NULL,
    "reason" TEXT,
    "transitionedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StageTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evidence" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "submittedByUserId" TEXT NOT NULL,
    "submittedByRole" "ParticipantRole" NOT NULL,
    "type" "EvidenceType" NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "evidenceDate" TIMESTAMP(3),
    "source" TEXT,
    "status" "EvidenceStatus" NOT NULL DEFAULT 'PENDING_UPLOAD',
    "reviewedByUserId" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "enteredIntoHearingRecord" BOOLEAN NOT NULL DEFAULT false,
    "hearingId" TEXT,
    "checksumSha256" TEXT,
    "uploadConfirmedAt" TIMESTAMP(3),
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Deadline" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" "DeadlineType" NOT NULL,
    "status" "DeadlineStatus" NOT NULL DEFAULT 'ACTIVE',
    "label" TEXT NOT NULL,
    "description" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "workingDaysAllowed" INTEGER NOT NULL,
    "urgencyThresholdDays" INTEGER NOT NULL DEFAULT 3,
    "extensionGranted" BOOLEAN NOT NULL DEFAULT false,
    "extensionDays" INTEGER,
    "extensionGrantedBy" TEXT,
    "extensionGrantedAt" TIMESTAMP(3),
    "extensionReason" TEXT,
    "originalDueAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "completedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hearing" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "type" "HearingType" NOT NULL,
    "status" "HearingStatus" NOT NULL DEFAULT 'SCHEDULED',
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "scheduledBy" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "isVirtual" BOOLEAN NOT NULL DEFAULT false,
    "virtualLink" TEXT,
    "panelChairId" TEXT NOT NULL,
    "panelMemberIds" TEXT[],
    "admittedEvidenceIds" TEXT[],
    "completedAt" TIMESTAMP(3),
    "outcomeSummary" TEXT,
    "recordedBy" TEXT,
    "proceedToDeliberation" BOOLEAN,
    "adjournedTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hearing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingParty" (
    "id" TEXT NOT NULL,
    "hearingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "ParticipantRole" NOT NULL,
    "notifiedAt" TIMESTAMP(3),
    "confirmedAttendance" BOOLEAN,
    "attended" BOOLEAN,

    CONSTRAINT "HearingParty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HearingPostponement" (
    "id" TEXT NOT NULL,
    "hearingId" TEXT NOT NULL,
    "originalDate" TIMESTAMP(3) NOT NULL,
    "newDate" TIMESTAMP(3) NOT NULL,
    "reason" TEXT NOT NULL,
    "postponedBy" TEXT NOT NULL,
    "postponedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HearingPostponement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decision" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "outcome" "DecisionOutcome" NOT NULL,
    "summary" TEXT NOT NULL,
    "fullText" TEXT NOT NULL,
    "sanctionsOrdered" BOOLEAN NOT NULL DEFAULT false,
    "sanctionDetails" TEXT,
    "panelMemberIds" TEXT[],
    "issuedBy" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Decision_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appeal" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "filedByUserId" TEXT NOT NULL,
    "groundsForAppeal" TEXT NOT NULL,
    "supportingEvidenceIds" TEXT[],
    "status" "AppealStatus" NOT NULL DEFAULT 'FILED',
    "reviewedByUserId" TEXT,
    "outcome" TEXT,
    "outcomeIssuedAt" TIMESTAMP(3),
    "filedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Appeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "recipientUserId" TEXT NOT NULL,
    "caseId" TEXT,
    "caseReference" TEXT,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "actionUrl" TEXT,
    "actionLabel" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormalNotice" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "noticeType" "FormalNoticeType" NOT NULL,
    "recipientUserIds" TEXT[],
    "subject" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuedBy" TEXT NOT NULL,
    "deliveryMethod" "DeliveryMethod" NOT NULL DEFAULT 'IN_PLATFORM',
    "deliveredAt" TIMESTAMP(3),
    "acknowledgedAt" TIMESTAMP(3),
    "acknowledgedBy" TEXT,
    "documentStorageKey" TEXT,

    CONSTRAINT "FormalNotice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "caseId" TEXT,
    "type" "AuditEventType" NOT NULL,
    "actorUserId" TEXT,
    "actorRole" TEXT,
    "summary" TEXT NOT NULL,
    "detail" TEXT,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_systemRole_idx" ON "User"("systemRole");

-- CreateIndex
CREATE UNIQUE INDEX "Session_refreshToken_key" ON "Session"("refreshToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Session_refreshToken_idx" ON "Session"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_reference_key" ON "Complaint"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_trackingToken_key" ON "Complaint"("trackingToken");

-- CreateIndex
CREATE UNIQUE INDEX "Complaint_promotedToCaseId_key" ON "Complaint"("promotedToCaseId");

-- CreateIndex
CREATE INDEX "Complaint_reference_idx" ON "Complaint"("reference");

-- CreateIndex
CREATE INDEX "Complaint_complainantUserId_idx" ON "Complaint"("complainantUserId");

-- CreateIndex
CREATE INDEX "Complaint_trackingToken_idx" ON "Complaint"("trackingToken");

-- CreateIndex
CREATE INDEX "Complaint_status_idx" ON "Complaint"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Case_reference_key" ON "Case"("reference");

-- CreateIndex
CREATE UNIQUE INDEX "Case_complaintId_key" ON "Case"("complaintId");

-- CreateIndex
CREATE INDEX "Case_reference_idx" ON "Case"("reference");

-- CreateIndex
CREATE INDEX "Case_stage_idx" ON "Case"("stage");

-- CreateIndex
CREATE INDEX "Case_status_idx" ON "Case"("status");

-- CreateIndex
CREATE INDEX "Case_assignedInvestigatorId_idx" ON "Case"("assignedInvestigatorId");

-- CreateIndex
CREATE INDEX "Case_submittedAt_idx" ON "Case"("submittedAt");

-- CreateIndex
CREATE INDEX "CaseParticipant_caseId_idx" ON "CaseParticipant"("caseId");

-- CreateIndex
CREATE INDEX "CaseParticipant_userId_idx" ON "CaseParticipant"("userId");

-- CreateIndex
CREATE INDEX "CaseParticipant_role_idx" ON "CaseParticipant"("role");

-- CreateIndex
CREATE UNIQUE INDEX "CaseParticipant_caseId_userId_role_key" ON "CaseParticipant"("caseId", "userId", "role");

-- CreateIndex
CREATE INDEX "StageTransition_caseId_idx" ON "StageTransition"("caseId");

-- CreateIndex
CREATE INDEX "StageTransition_transitionedAt_idx" ON "StageTransition"("transitionedAt");

-- CreateIndex
CREATE INDEX "Evidence_caseId_idx" ON "Evidence"("caseId");

-- CreateIndex
CREATE INDEX "Evidence_submittedByUserId_idx" ON "Evidence"("submittedByUserId");

-- CreateIndex
CREATE INDEX "Evidence_status_idx" ON "Evidence"("status");

-- CreateIndex
CREATE INDEX "Deadline_caseId_idx" ON "Deadline"("caseId");

-- CreateIndex
CREATE INDEX "Deadline_dueAt_idx" ON "Deadline"("dueAt");

-- CreateIndex
CREATE INDEX "Deadline_status_idx" ON "Deadline"("status");

-- CreateIndex
CREATE INDEX "Deadline_type_idx" ON "Deadline"("type");

-- CreateIndex
CREATE INDEX "Hearing_caseId_idx" ON "Hearing"("caseId");

-- CreateIndex
CREATE INDEX "Hearing_scheduledAt_idx" ON "Hearing"("scheduledAt");

-- CreateIndex
CREATE INDEX "Hearing_status_idx" ON "Hearing"("status");

-- CreateIndex
CREATE INDEX "HearingParty_hearingId_idx" ON "HearingParty"("hearingId");

-- CreateIndex
CREATE UNIQUE INDEX "HearingParty_hearingId_userId_key" ON "HearingParty"("hearingId", "userId");

-- CreateIndex
CREATE INDEX "HearingPostponement_hearingId_idx" ON "HearingPostponement"("hearingId");

-- CreateIndex
CREATE UNIQUE INDEX "Decision_caseId_key" ON "Decision"("caseId");

-- CreateIndex
CREATE INDEX "Decision_caseId_idx" ON "Decision"("caseId");

-- CreateIndex
CREATE UNIQUE INDEX "Appeal_caseId_key" ON "Appeal"("caseId");

-- CreateIndex
CREATE INDEX "Appeal_caseId_idx" ON "Appeal"("caseId");

-- CreateIndex
CREATE INDEX "Appeal_filedByUserId_idx" ON "Appeal"("filedByUserId");

-- CreateIndex
CREATE INDEX "Notification_recipientUserId_isRead_idx" ON "Notification"("recipientUserId", "isRead");

-- CreateIndex
CREATE INDEX "Notification_caseId_idx" ON "Notification"("caseId");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "FormalNotice_caseId_idx" ON "FormalNotice"("caseId");

-- CreateIndex
CREATE INDEX "FormalNotice_noticeType_idx" ON "FormalNotice"("noticeType");

-- CreateIndex
CREATE INDEX "AuditEvent_caseId_idx" ON "AuditEvent"("caseId");

-- CreateIndex
CREATE INDEX "AuditEvent_actorUserId_idx" ON "AuditEvent"("actorUserId");

-- CreateIndex
CREATE INDEX "AuditEvent_type_idx" ON "AuditEvent"("type");

-- CreateIndex
CREATE INDEX "AuditEvent_occurredAt_idx" ON "AuditEvent"("occurredAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Case" ADD CONSTRAINT "Case_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseParticipant" ADD CONSTRAINT "CaseParticipant_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CaseParticipant" ADD CONSTRAINT "CaseParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StageTransition" ADD CONSTRAINT "StageTransition_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evidence" ADD CONSTRAINT "Evidence_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deadline" ADD CONSTRAINT "Deadline_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Hearing" ADD CONSTRAINT "Hearing_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingParty" ADD CONSTRAINT "HearingParty_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "Hearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HearingPostponement" ADD CONSTRAINT "HearingPostponement_hearingId_fkey" FOREIGN KEY ("hearingId") REFERENCES "Hearing"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Decision" ADD CONSTRAINT "Decision_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appeal" ADD CONSTRAINT "Appeal_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_recipientUserId_fkey" FOREIGN KEY ("recipientUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormalNotice" ADD CONSTRAINT "FormalNotice_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
