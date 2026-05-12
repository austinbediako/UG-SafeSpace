/**
 * Working-day utilities for the SafeSpace UG platform.
 *
 * IMPORTANT ARCHITECTURE NOTE:
 * Authoritative deadline computation runs on the backend.
 * These utilities serve two frontend purposes only:
 *   1. Displaying pre-computed deadline data in the correct urgency state.
 *   2. Providing client-side estimates for optimistic UI feedback.
 *
 * Never use these to generate final deadline dates shown as binding to users.
 * The backend's computed values are always authoritative.
 */

// ─── Ghana Public Holidays ────────────────────────────────────────────────────
// Fixed annual public holidays in Ghana.
// Variable holidays (e.g. Easter, Eid) must be fetched from backend config.
// This list covers fixed-date holidays only.

const GHANA_FIXED_HOLIDAYS: Array<{ month: number; day: number; name: string }> = [
  { month: 1, day: 1,   name: "New Year's Day" },
  { month: 3, day: 6,   name: "Independence Day" },
  { month: 5, day: 1,   name: "Workers' Day" },
  { month: 7, day: 1,   name: "Republic Day" },
  { month: 8, day: 4,   name: "Founders' Day" },
  { month: 9, day: 21,  name: "Kwame Nkrumah Memorial Day" },
  { month: 12, day: 25, name: "Christmas Day" },
  { month: 12, day: 26, name: "Boxing Day" },
];

/**
 * Returns true if the given date falls on a Ghana public holiday (fixed only).
 * Variable holidays require a backend-provided list.
 */
export function isGhanaPublicHoliday(date: Date): boolean {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return GHANA_FIXED_HOLIDAYS.some((h) => h.month === month && h.day === day);
}

/**
 * Returns true if the date is a weekend (Saturday or Sunday).
 */
export function isWeekend(date: Date): boolean {
  const dow = date.getDay();
  return dow === 0 || dow === 6;
}

/**
 * Returns true if the date is a non-working day.
 * A non-working day is either a weekend or a Ghana public holiday.
 */
export function isNonWorkingDay(date: Date): boolean {
  return isWeekend(date) || isGhanaPublicHoliday(date);
}

/**
 * Counts the number of working days between two dates (inclusive of start,
 * exclusive of end — i.e. the standard "elapsed days" convention).
 * Both dates are treated as local time.
 */
export function countWorkingDaysBetween(start: Date, end: Date): number {
  let count = 0;
  const cursor = new Date(start);
  cursor.setHours(0, 0, 0, 0);
  const target = new Date(end);
  target.setHours(0, 0, 0, 0);

  while (cursor < target) {
    if (!isNonWorkingDay(cursor)) {
      count++;
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return count;
}

/**
 * Adds a given number of working days to a start date.
 * Returns the resulting date (the Nth working day after start).
 */
export function addWorkingDays(start: Date, workingDays: number): Date {
  const result = new Date(start);
  result.setHours(0, 0, 0, 0);
  let remaining = workingDays;

  while (remaining > 0) {
    result.setDate(result.getDate() + 1);
    if (!isNonWorkingDay(result)) {
      remaining--;
    }
  }
  return result;
}

/**
 * Returns how many working days remain until a deadline.
 * Returns a negative number if the deadline has passed.
 * Uses the backend-provided dueAt ISO string.
 */
export function workingDaysUntil(dueAtIso: string): number {
  const now = new Date();
  const due = new Date(dueAtIso);
  now.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  if (due <= now) {
    return -countWorkingDaysBetween(due, now);
  }
  return countWorkingDaysBetween(now, due);
}

// ─── Policy Deadline Constants ────────────────────────────────────────────────
// These are the canonical deadline values from the UG 2017 policy.
// Never hardcode these numbers in components — always import from here.

export const POLICY_DEADLINES = {
  /** Working days the committee has to acknowledge a complaint */
  ACKNOWLEDGMENT_WORKING_DAYS: 5,
  /** Working days the respondent has to submit a response after notification */
  RESPONDENT_RESPONSE_WORKING_DAYS: 7,
  /** Working days the full investigation must complete within */
  INVESTIGATION_WORKING_DAYS: 60,
  /** Working days notice required before a hearing */
  HEARING_NOTICE_WORKING_DAYS: 5,
  /** Working days a party has to file an appeal after decision */
  APPEAL_FILING_WORKING_DAYS: 10,
} as const;

// ─── Urgency Thresholds ───────────────────────────────────────────────────────

export const URGENCY_THRESHOLDS = {
  /** Show "urgent" red state when this many working days remain */
  URGENT_DAYS: 3,
  /** Show "approaching" amber state when this many working days remain */
  APPROACHING_DAYS: 7,
} as const;

/**
 * Determines the urgency level of a deadline given remaining working days.
 */
export function getDeadlineUrgency(
  workingDaysRemaining: number
): "breached" | "urgent" | "approaching" | "normal" {
  if (workingDaysRemaining < 0) return "breached";
  if (workingDaysRemaining <= URGENCY_THRESHOLDS.URGENT_DAYS) return "urgent";
  if (workingDaysRemaining <= URGENCY_THRESHOLDS.APPROACHING_DAYS) return "approaching";
  return "normal";
}
