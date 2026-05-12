import type { HearingStatus, HearingType } from "./enums";

// ─── Hearing ──────────────────────────────────────────────────────────────────
// A formally constituted hearing in the case lifecycle.
// Hearings require panel constitution, party notification, evidence admission,
// and formal record-keeping — all tracked here.

export interface Hearing {
  id: string;
  caseId: string;
  type: HearingType;
  status: HearingStatus;

  // Scheduling
  scheduledAt: string;       // ISO 8601 — when the hearing is set to occur
  scheduledBy: string;       // userId of committee member who scheduled it
  scheduledOn: string;       // ISO 8601 — when the scheduling action occurred

  // Location
  venue: string;
  isVirtual: boolean;
  virtualLink?: string;      // Only present if isVirtual === true; treat as sensitive

  // Panel
  panelChairId: string;
  panelMemberIds: string[];  // Excludes chair

  // Parties — who has been formally invited and their attendance status
  parties: HearingParty[];

  // Evidence admitted into this hearing's record
  admittedEvidenceIds: string[];

  // Outcome — populated after COMPLETED status
  outcome?: HearingOutcome;

  // Postponement history
  postponements: HearingPostponement[];
}

export interface HearingParty {
  userId: string;
  role: import("./enums").CaseParticipantRole;
  notifiedAt: string | null;
  confirmedAttendance: boolean | null; // null = no response yet
  attended: boolean | null;            // null = hearing not yet completed
}

export interface HearingOutcome {
  completedAt: string;
  summary: string;           // Committee secretary's summary
  recordedBy: string;        // userId of recorder
  proceedToDeliberation: boolean;
  adjournedTo?: string;      // ISO 8601 — if adjourned, when resumed
}

export interface HearingPostponement {
  originalDate: string;
  newDate: string;
  reason: string;
  postponedBy: string;
  postponedAt: string;
}

// ─── Schedule Hearing Request ─────────────────────────────────────────────────

export interface ScheduleHearingRequest {
  caseId: string;
  type: HearingType;
  scheduledAt: string;
  venue: string;
  isVirtual: boolean;
  virtualLink?: string;
  panelChairId: string;
  panelMemberIds: string[];
}
