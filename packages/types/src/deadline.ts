import type { DeadlineType, DeadlineStatus } from "./enums";

// ─── Deadline ─────────────────────────────────────────────────────────────────
// A structured deadline entity. Deadlines are owned by the backend.
// The frontend NEVER computes deadlines — it consumes them.
//
// Working-day arithmetic, Ghanaian public holiday awareness, and extension
// logic are all backend responsibilities. The frontend receives pre-computed
// values: dueAt, workingDaysRemaining, and status.

export interface Deadline {
  id: string;
  caseId: string;
  type: DeadlineType;
  status: DeadlineStatus;

  label: string;               // Human-readable label e.g. "Respondent Response"
  description: string;         // Context for the UI

  // Timing — all server-computed
  startedAt: string;           // ISO 8601 — when the clock started
  dueAt: string;               // ISO 8601 — the absolute deadline
  workingDaysAllowed: number;  // Policy-defined (7 for response, 60 for investigation)
  workingDaysRemaining: number; // Server-computed at time of response
  workingDaysElapsed: number;

  // Extension tracking
  extensionGranted: boolean;
  extensionDays?: number;
  extensionGrantedBy?: string;
  extensionGrantedAt?: string;
  extensionReason?: string;
  originalDueAt?: string;      // Preserved when extension is granted

  // Resolution
  completedAt?: string;
  completedBy?: string;

  // Urgency thresholds (server-defined, not frontend-hardcoded)
  urgencyThresholdDays: number; // e.g., 3 — frontend shows urgent below this
  isBreached: boolean;
  isApproaching: boolean;

  // Who this deadline is relevant to
  affectsRole: import("./enums").CaseParticipantRole[];
}

// ─── Deadline Extension Request ───────────────────────────────────────────────

export interface DeadlineExtensionRequest {
  deadlineId: string;
  extensionDays: number;
  reason: string;
}
