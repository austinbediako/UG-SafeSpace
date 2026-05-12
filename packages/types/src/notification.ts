import type { NotificationType } from "./enums";

// ─── Notification ─────────────────────────────────────────────────────────────
// In-platform notifications delivered to users. Distinct from formal legal
// notices (which are tracked in communications). Notifications are UI events;
// formal notices are procedural records with legal standing.

export interface Notification {
  id: string;
  recipientUserId: string;
  caseId: string;
  caseReference: string;

  type: NotificationType;
  title: string;
  body: string;

  isRead: boolean;
  readAt: string | null;

  createdAt: string;    // ISO 8601

  // Optional deep-link so the frontend can route to the relevant page
  actionUrl?: string;
  actionLabel?: string;
}

// ─── Formal Notice ────────────────────────────────────────────────────────────
// A formal institutional communication with legal standing.
// These are records of official communications mandated by the policy,
// e.g. the notification letter sent to the respondent, the decision letter.

export interface FormalNotice {
  id: string;
  caseId: string;

  noticeType:
    | "COMPLAINT_ACKNOWLEDGMENT"
    | "RESPONDENT_NOTIFICATION"
    | "HEARING_NOTICE"
    | "DECISION_NOTICE"
    | "APPEAL_ACKNOWLEDGMENT"
    | "APPEAL_OUTCOME";

  // Recipients — references to case participants
  recipientUserIds: string[];

  // Content
  subject: string;
  body: string;           // Full formal text of the notice

  // Delivery
  issuedAt: string;       // ISO 8601
  issuedBy: string;       // userId
  deliveryMethod: "EMAIL" | "IN_PLATFORM" | "PHYSICAL" | "BOTH";

  // Receipt confirmation
  deliveredAt: string | null;
  acknowledgedAt: string | null;
  acknowledgedBy: string | null;

  // Signed URL for downloadable PDF version
  documentUrl?: string;
}
