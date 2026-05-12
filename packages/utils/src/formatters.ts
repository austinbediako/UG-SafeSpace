/**
 * Display formatting utilities for SafeSpace UG.
 * All formatting is locale-aware (en-GH by default).
 */

const LOCALE = "en-GH";
const TIMEZONE = "Africa/Accra";

// ─── Date Formatting ──────────────────────────────────────────────────────────

/**
 * Formats an ISO date string for display in the Ghana locale.
 * e.g. "2026-05-14T10:00:00Z" → "14 May 2026"
 */
export function formatDate(isoString: string): string {
  if (!isoString) return "—";
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TIMEZONE,
  }).format(new Date(isoString));
}

/**
 * Short date format.
 * e.g. "2026-05-14T10:00:00Z" → "14 May 2026"
 */
export function formatDateShort(isoString: string): string {
  if (!isoString) return "—";
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: TIMEZONE,
  }).format(new Date(isoString));
}

/**
 * Date and time format.
 * e.g. "14 May 2026, 10:00 AM"
 */
export function formatDateTime(isoString: string): string {
  if (!isoString) return "—";
  return new Intl.DateTimeFormat(LOCALE, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TIMEZONE,
  }).format(new Date(isoString));
}

/**
 * Relative time display (for recent activity feeds).
 * Falls back to absolute date for events older than 7 days.
 */
export function formatRelativeTime(isoString: string): string {
  if (!isoString) return "—";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60_000);
  const diffHours = Math.floor(diffMs / 3_600_000);
  const diffDays = Math.floor(diffMs / 86_400_000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDateShort(isoString);
}

// ─── Case Reference ───────────────────────────────────────────────────────────

/**
 * Formats a case reference for display.
 * Passes through as-is — format is already human-readable.
 */
export function formatCaseReference(reference: string): string {
  return reference;
}

// ─── Deadline Display ─────────────────────────────────────────────────────────

/**
 * Formats working days remaining into a human-readable string.
 * e.g. 5 → "5 working days", 1 → "1 working day", -2 → "2 days overdue"
 */
export function formatWorkingDaysRemaining(days: number): string {
  if (days < 0) {
    const overdue = Math.abs(days);
    return `${overdue} working ${overdue === 1 ? "day" : "days"} overdue`;
  }
  if (days === 0) return "Due today";
  return `${days} working ${days === 1 ? "day" : "days"} remaining`;
}

// ─── Name Formatting ──────────────────────────────────────────────────────────

export function formatFullName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`.trim();
}

export function formatInitials(firstName: string, lastName: string): string {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

// ─── Enum Label Mapping ───────────────────────────────────────────────────────
// Human-readable labels for enum values. Keep in sync with enums.ts.

export const MISCONDUCT_TYPE_LABELS: Record<string, string> = {
  SEXUAL_HARASSMENT: "Sexual Harassment",
  SEXUAL_ASSAULT: "Sexual Assault",
  STALKING: "Stalking",
  COERCION: "Coercion",
  DISCRIMINATION: "Discrimination",
  INTIMIDATION: "Intimidation",
  QUID_PRO_QUO: "Quid Pro Quo",
  RETALIATION: "Retaliation",
  OTHER: "Other",
};

export const CASE_STAGE_LABELS: Record<string, string> = {
  INTAKE: "Intake",
  ACKNOWLEDGMENT: "Acknowledgment",
  RESPONDENT_NOTIFICATION: "Respondent Notification",
  RESPONSE_WINDOW: "Response Window",
  INVESTIGATION: "Under Investigation",
  HEARING_PREPARATION: "Hearing Preparation",
  HEARING: "Hearing",
  DELIBERATION: "Deliberation",
  DECISION: "Decision",
  APPEAL_WINDOW: "Appeal Window",
  APPEAL_REVIEW: "Appeal Under Review",
  CLOSED: "Closed",
};

export const CASE_STATUS_LABELS: Record<string, string> = {
  OPEN: "Open",
  UNDER_REVIEW: "Under Review",
  AWAITING_RESPONSE: "Awaiting Response",
  IN_INVESTIGATION: "In Investigation",
  HEARING_SCHEDULED: "Hearing Scheduled",
  PENDING_DECISION: "Pending Decision",
  DECIDED: "Decided",
  APPEALED: "Appealed",
  CLOSED: "Closed",
  WITHDRAWN: "Withdrawn",
};

export const REPORT_TYPE_LABELS: Record<string, string> = {
  FORMAL: "Formal Complaint",
  INFORMAL: "Informal Report",
};

export const USER_ROLE_LABELS: Record<string, string> = {
  COMPLAINANT: "Complainant",
  RESPONDENT: "Respondent",
  COMMITTEE_MEMBER: "Committee Member",
  COMMITTEE_CHAIR: "Committee Chair",
  INVESTIGATOR: "Investigator",
  SECRETARY: "Secretary",
  ADMIN: "Administrator",
};
