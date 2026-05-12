import type {
  CaseStage,
  CaseStatus,
  ReportType,
  MisconductType,
  ComplainantAffiliation,
} from "./enums";
import type { CaseParticipant } from "./user";
import type { Evidence } from "./evidence";
import type { Deadline } from "./deadline";
import type { Hearing } from "./hearing";
import type { Appeal } from "./appeal";
import type { AuditEvent } from "./audit";
import type { Notification } from "./notification";

// ─── Case Reference ───────────────────────────────────────────────────────────
// Format: UG-YYYY-XXXX. Generated server-side. Never client-generated.

export type CaseReference = `UG-${number}-${string}`;

// ─── Case (Full) ──────────────────────────────────────────────────────────────
// The complete case entity as returned by the backend for authorized viewers.
// Different roles receive different subsets via the API projection layer —
// this type represents the superset. Frontend components should use
// role-scoped projections (see packages/api) rather than this full type.

export interface Case {
  id: string;
  reference: CaseReference;

  // Classification
  reportType: ReportType;
  misconductType: MisconductType;
  misconductDescription: string;

  // Lifecycle
  stage: CaseStage;
  status: CaseStatus;

  // Dates — all ISO 8601, all server-authoritative
  submittedAt: string;
  acknowledgedAt: string | null;
  respondentNotifiedAt: string | null;
  investigationStartedAt: string | null;
  closedAt: string | null;
  updatedAt: string;

  // Incident details
  incidentDate: string | null;     // When the incident occurred
  incidentLocation: string | null;
  incidentDescription: string;

  // Complainant identity (conditionally redacted for respondents)
  isAnonymous: boolean;
  complainantAffiliation: ComplainantAffiliation;
  complainantDepartment?: string;

  // Respondent basic details (as submitted by complainant)
  respondentName: string;
  respondentId?: string;
  respondentDepartment: string;
  respondentRole: string;

  // Participants — full party list (committee only)
  participants: CaseParticipant[];

  // Assigned investigator (committee only)
  assignedInvestigatorId: string | null;

  // Sub-entities
  evidence: Evidence[];
  deadlines: Deadline[];
  hearings: Hearing[];
  appeal: Appeal | null;
  auditEvents: AuditEvent[];
  notifications: Notification[];

  // Witness information (as submitted in report)
  witnessInformation?: string;
  priorReportMade: boolean;
  priorReportDetails?: string;

  // Priority (committee-assigned, not static)
  priority: "STANDARD" | "HIGH" | "URGENT";

  // Response
  respondentResponse?: string;
  respondentResponseSubmittedAt?: string;
}

// ─── Case (Summary) ───────────────────────────────────────────────────────────
// Lightweight case record for list views. Does not include sub-entities.
// Used in case lists, dashboards, and selector dropdowns.

export interface CaseSummary {
  id: string;
  reference: CaseReference;
  misconductType: MisconductType;
  reportType: ReportType;
  stage: CaseStage;
  status: CaseStatus;
  submittedAt: string;
  updatedAt: string;
  priority: "STANDARD" | "HIGH" | "URGENT";
  assignedInvestigatorId: string | null;
  // The next approaching deadline — pre-computed by the backend
  nextDeadline: {
    label: string;
    dueAt: string;       // ISO 8601
    workingDaysRemaining: number;
    isBreached: boolean;
  } | null;
}

// ─── Case (Participant View) ──────────────────────────────────────────────────
// Scoped view of a case for a participation portal user.
// Sensitive fields omitted. Complainant identity never exposed.

export interface CaseParticipantView {
  id: string;
  reference: CaseReference;
  misconductType: MisconductType;
  reportType: ReportType;
  stage: CaseStage;
  status: CaseStatus;
  submittedAt: string;
  // What the participant is allowed to do at the current stage
  allowedActions: CaseAction[];
  // Their specific deadlines
  myDeadlines: import("./deadline").Deadline[];
  // Public-facing stage description
  stageDescription: string;
  // Their response (if they are the respondent)
  myResponse?: string;
  myResponseSubmittedAt?: string;
}

// ─── Case Action ──────────────────────────────────────────────────────────────
// Typed enumeration of actions a participant can take on a case.
// Derived from the stage + participant role. Never hardcoded in components.

export type CaseAction =
  | "SUBMIT_RESPONSE"
  | "UPLOAD_EVIDENCE"
  | "ADD_REPRESENTATIVE"
  | "VIEW_HEARING_DETAILS"
  | "FILE_APPEAL"
  | "VIEW_DECISION"
  | "ACKNOWLEDGE_NOTIFICATION"
  | "WITHDRAW_COMPLAINT";

// ─── Intake Form Data ─────────────────────────────────────────────────────────
// The data shape submitted from the reporting portal.
// This is the only place where raw user input is typed.

export interface IntakeFormData {
  // Step 1 — Identity
  complainantAffiliation: ComplainantAffiliation;
  complainantStudentStaffId?: string;
  reportType: ReportType;
  isAnonymous: boolean;

  // Step 2 — Incident
  misconductType: MisconductType;
  incidentDate: string;
  incidentLocation: string;
  incidentDescription: string;

  // Step 3 — Respondent
  respondentName: string;
  respondentStudentStaffId?: string;
  respondentDepartment: string;
  respondentAffiliation: string;
  respondentRelationship: string;

  // Step 4 — Supporting Information
  witnessInformation?: string;
  priorReportMade: boolean;
  priorReportDetails?: string;
  evidenceDescription?: string;

  // Step 5 — Consent
  consentToProcess: boolean;
}

// ─── Submission Result ────────────────────────────────────────────────────────
// What the backend returns after a successful intake submission.

export interface SubmissionResult {
  caseId: string;
  reference: CaseReference;
  submittedAt: string;
  // For anonymous reports: one-time tracking token
  trackingToken?: string;
  // For identified reports: confirmation that notification will be sent
  confirmationEmailSent?: boolean;
  // Estimated acknowledgment date
  expectedAcknowledgmentBy: string;
}
