/**
 * Formal enumeration layer for the SafeSpace UG platform.
 *
 * These enums are the single source of truth for all categorical values
 * used across the case management system. The backend must mirror these
 * exactly. Any change here constitutes a breaking change to the data model.
 */

// ─── Case Lifecycle Stages ────────────────────────────────────────────────────
// Maps directly to the procedural stages defined in the UG 2017 Sexual
// Harassment and Misconduct Policy. Order is significant — stages are
// traversed linearly with one valid branch (APPEAL).

export enum CaseStage {
  INTAKE = "INTAKE",
  ACKNOWLEDGMENT = "ACKNOWLEDGMENT",
  RESPONDENT_NOTIFICATION = "RESPONDENT_NOTIFICATION",
  RESPONSE_WINDOW = "RESPONSE_WINDOW",
  INVESTIGATION = "INVESTIGATION",
  HEARING_PREPARATION = "HEARING_PREPARATION",
  HEARING = "HEARING",
  DELIBERATION = "DELIBERATION",
  DECISION = "DECISION",
  APPEAL_WINDOW = "APPEAL_WINDOW",
  APPEAL_REVIEW = "APPEAL_REVIEW",
  CLOSED = "CLOSED",
}

// ─── Case Status ──────────────────────────────────────────────────────────────
// Operational status that overlaps with but is distinct from stage.
// Status is surface-level; stage is procedural.

export enum CaseStatus {
  OPEN = "OPEN",
  UNDER_REVIEW = "UNDER_REVIEW",
  AWAITING_RESPONSE = "AWAITING_RESPONSE",
  IN_INVESTIGATION = "IN_INVESTIGATION",
  HEARING_SCHEDULED = "HEARING_SCHEDULED",
  PENDING_DECISION = "PENDING_DECISION",
  DECIDED = "DECIDED",
  APPEALED = "APPEALED",
  CLOSED = "CLOSED",
  WITHDRAWN = "WITHDRAWN",
}

// ─── Report Type ──────────────────────────────────────────────────────────────
// Formal vs informal determines the procedural path. Informal aims for
// resolution; formal triggers the full investigation pipeline.

export enum ReportType {
  FORMAL = "FORMAL",
  INFORMAL = "INFORMAL",
}

// ─── Misconduct Type ──────────────────────────────────────────────────────────
// Categories derived directly from the UG policy definitions.

export enum MisconductType {
  SEXUAL_HARASSMENT = "SEXUAL_HARASSMENT",
  SEXUAL_ASSAULT = "SEXUAL_ASSAULT",
  STALKING = "STALKING",
  COERCION = "COERCION",
  DISCRIMINATION = "DISCRIMINATION",
  INTIMIDATION = "INTIMIDATION",
  QUID_PRO_QUO = "QUID_PRO_QUO",
  RETALIATION = "RETALIATION",
  OTHER = "OTHER",
}

// ─── User Roles ───────────────────────────────────────────────────────────────
// System-level roles. A user has one system role. Their case-level role
// is represented separately via CaseParticipantRole.

export enum UserRole {
  COMPLAINANT = "COMPLAINANT",
  RESPONDENT = "RESPONDENT",
  COMMITTEE_MEMBER = "COMMITTEE_MEMBER",
  COMMITTEE_CHAIR = "COMMITTEE_CHAIR",
  INVESTIGATOR = "INVESTIGATOR",
  SECRETARY = "SECRETARY",
  ADMIN = "ADMIN",
}

// ─── Case Participant Role ────────────────────────────────────────────────────
// A user's role within a specific case. A user can have different roles
// across different cases (e.g., respondent in one, witness in another).

export enum CaseParticipantRole {
  COMPLAINANT = "COMPLAINANT",
  RESPONDENT = "RESPONDENT",
  WITNESS = "WITNESS",
  REPRESENTATIVE = "REPRESENTATIVE",
  INVESTIGATOR = "INVESTIGATOR",
  PANEL_MEMBER = "PANEL_MEMBER",
  PANEL_CHAIR = "PANEL_CHAIR",
  OBSERVER = "OBSERVER",
}

// ─── Complainant Affiliation ──────────────────────────────────────────────────

export enum ComplainantAffiliation {
  UNDERGRADUATE = "UNDERGRADUATE",
  POSTGRADUATE = "POSTGRADUATE",
  FACULTY = "FACULTY",
  ADMINISTRATIVE_STAFF = "ADMINISTRATIVE_STAFF",
  TECHNICAL_STAFF = "TECHNICAL_STAFF",
  EXTERNAL = "EXTERNAL",
}

// ─── Evidence State ───────────────────────────────────────────────────────────

export enum EvidenceStatus {
  PENDING_UPLOAD = "PENDING_UPLOAD",
  UPLOADED = "UPLOADED",
  UNDER_REVIEW = "UNDER_REVIEW",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  REDACTED = "REDACTED",
}

export enum EvidenceType {
  DOCUMENT = "DOCUMENT",
  IMAGE = "IMAGE",
  AUDIO = "AUDIO",
  VIDEO = "VIDEO",
  SCREENSHOT = "SCREENSHOT",
  CORRESPONDENCE = "CORRESPONDENCE",
  STATEMENT = "STATEMENT",
  OTHER = "OTHER",
}

// ─── Hearing State ────────────────────────────────────────────────────────────

export enum HearingStatus {
  SCHEDULED = "SCHEDULED",
  POSTPONED = "POSTPONED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum HearingType {
  PRELIMINARY = "PRELIMINARY",
  FULL_HEARING = "FULL_HEARING",
  APPEAL_HEARING = "APPEAL_HEARING",
}

// ─── Decision Outcome ─────────────────────────────────────────────────────────

export enum DecisionOutcome {
  UPHELD = "UPHELD",
  PARTIALLY_UPHELD = "PARTIALLY_UPHELD",
  DISMISSED = "DISMISSED",
  WITHDRAWN = "WITHDRAWN",
  REFERRED = "REFERRED",
}

// ─── Notification Type ────────────────────────────────────────────────────────

export enum NotificationType {
  CASE_SUBMITTED = "CASE_SUBMITTED",
  CASE_ACKNOWLEDGED = "CASE_ACKNOWLEDGED",
  RESPONDENT_NOTIFIED = "RESPONDENT_NOTIFIED",
  RESPONSE_RECEIVED = "RESPONSE_RECEIVED",
  DEADLINE_APPROACHING = "DEADLINE_APPROACHING",
  DEADLINE_BREACHED = "DEADLINE_BREACHED",
  HEARING_SCHEDULED = "HEARING_SCHEDULED",
  HEARING_REMINDER = "HEARING_REMINDER",
  DECISION_ISSUED = "DECISION_ISSUED",
  APPEAL_FILED = "APPEAL_FILED",
  APPEAL_RESOLVED = "APPEAL_RESOLVED",
  CASE_CLOSED = "CASE_CLOSED",
  EVIDENCE_SUBMITTED = "EVIDENCE_SUBMITTED",
  INVESTIGATOR_ASSIGNED = "INVESTIGATOR_ASSIGNED",
  REPRESENTATIVE_APPROVED = "REPRESENTATIVE_APPROVED",
  GENERAL = "GENERAL",
}

// ─── Deadline Type ────────────────────────────────────────────────────────────

export enum DeadlineType {
  ACKNOWLEDGMENT = "ACKNOWLEDGMENT",          // Committee must acknowledge within policy window
  RESPONDENT_RESPONSE = "RESPONDENT_RESPONSE", // 7 working days for respondent to respond
  INVESTIGATION = "INVESTIGATION",            // 60 working days for investigation completion
  HEARING_NOTICE = "HEARING_NOTICE",          // Notice period before hearing
  APPEAL_FILING = "APPEAL_FILING",            // Window to file an appeal after decision
  CUSTOM = "CUSTOM",
}

// ─── Deadline Status ──────────────────────────────────────────────────────────

export enum DeadlineStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  APPROACHING = "APPROACHING",  // Within warning threshold (e.g., 3 days)
  BREACHED = "BREACHED",
  EXTENDED = "EXTENDED",
  COMPLETED = "COMPLETED",
  WAIVED = "WAIVED",
}

// ─── Appeal Status ────────────────────────────────────────────────────────────

export enum AppealStatus {
  FILED = "FILED",
  UNDER_REVIEW = "UNDER_REVIEW",
  UPHELD = "UPHELD",
  DISMISSED = "DISMISSED",
  WITHDRAWN = "WITHDRAWN",
}

// ─── Representative Type ──────────────────────────────────────────────────────

export enum RepresentativeType {
  LEGAL_COUNSEL = "LEGAL_COUNSEL",
  SUPPORT_PERSON = "SUPPORT_PERSON",
  UNION_REPRESENTATIVE = "UNION_REPRESENTATIVE",
  ACADEMIC_ADVISOR = "ACADEMIC_ADVISOR",
}

// ─── Audit Event Type ─────────────────────────────────────────────────────────

export enum AuditEventType {
  CASE_CREATED = "CASE_CREATED",
  STAGE_TRANSITIONED = "STAGE_TRANSITIONED",
  EVIDENCE_UPLOADED = "EVIDENCE_UPLOADED",
  EVIDENCE_ACCESSED = "EVIDENCE_ACCESSED",
  RESPONSE_SUBMITTED = "RESPONSE_SUBMITTED",
  HEARING_SCHEDULED = "HEARING_SCHEDULED",
  DECISION_RENDERED = "DECISION_RENDERED",
  APPEAL_FILED = "APPEAL_FILED",
  USER_ACCESSED_CASE = "USER_ACCESSED_CASE",
  DOCUMENT_DOWNLOADED = "DOCUMENT_DOWNLOADED",
  INVESTIGATOR_ASSIGNED = "INVESTIGATOR_ASSIGNED",
  DEADLINE_EXTENDED = "DEADLINE_EXTENDED",
  CASE_CLOSED = "CASE_CLOSED",
}
