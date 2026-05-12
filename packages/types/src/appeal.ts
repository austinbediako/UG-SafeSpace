import type { AppealStatus, DecisionOutcome } from "./enums";

// ─── Decision ─────────────────────────────────────────────────────────────────
// The formal outcome rendered by the committee after deliberation.
// A decision is immutable once issued. An appeal creates a parallel track;
// it does not modify the original decision.

export interface Decision {
  id: string;
  caseId: string;
  outcome: DecisionOutcome;

  // The formal written determination
  summary: string;
  fullText: string;         // The complete decision document text

  // Sanctions (if applicable)
  sanctionsOrdered: boolean;
  sanctionDetails?: string;

  // Authorship
  renderedBy: string;       // userId of committee chair
  panelMemberIds: string[];
  renderedAt: string;       // ISO 8601

  // Notification
  complainantNotifiedAt: string | null;
  respondentNotifiedAt: string | null;

  // Appeal window — computed by backend
  appealWindowClosesAt: string;
  appealWindowWorkingDays: number;
}

// ─── Appeal ───────────────────────────────────────────────────────────────────
// An appeal is filed against a Decision. It creates a new procedural track
// within the same case. The case remains OPEN until the appeal is resolved.
// A case can only have one active appeal at a time.

export interface Appeal {
  id: string;
  caseId: string;
  decisionId: string;

  status: AppealStatus;

  // Who filed the appeal
  filedByUserId: string;
  filedByRole: import("./enums").CaseParticipantRole;
  filedAt: string;         // ISO 8601 — must be within appeal window

  // Grounds for appeal — must cite specific procedural or factual grounds
  groundsForAppeal: string;
  supportingEvidenceIds: string[];

  // Review body — separate from the original panel
  reviewPanelChairId: string | null;
  reviewPanelMemberIds: string[];

  // Outcome
  reviewOutcome?: DecisionOutcome;
  reviewSummary?: string;
  reviewRenderedBy?: string;
  reviewRenderedAt?: string;

  // Notifications
  filingAcknowledgedAt: string | null;
  outcomeNotifiedAt: string | null;
}
