import { prisma } from "../config/database.js";
import { logger } from "../config/logger.js";

// ─── Ghana Public Holidays ───────────────────────────────────────────────────
// Fixed and observed public holidays. Easter-based holidays are computed.
// This list is updated per year; for production, pull from a config or DB.

function getGhanaPublicHolidays(year: number): Date[] {
  const fixed = [
    new Date(year, 0, 1),   // New Year's Day
    new Date(year, 0, 7),   // Constitution Day
    new Date(year, 2, 6),   // Independence Day
    new Date(year, 4, 1),   // May Day
    new Date(year, 4, 25),  // Africa Day
    new Date(year, 6, 1),   // Republic Day
    new Date(year, 7, 4),   // Founders' Day
    new Date(year, 8, 21),  // Kwame Nkrumah Memorial Day
    new Date(year, 11, 1),  // Farmers' Day (first Friday of December — approximate)
    new Date(year, 11, 25), // Christmas Day
    new Date(year, 11, 26), // Boxing Day
  ];

  // Easter-based (computed using Anonymous Gregorian algorithm)
  const easter = computeEaster(year);
  const goodFriday = new Date(easter);
  goodFriday.setDate(easter.getDate() - 2);
  const easterMonday = new Date(easter);
  easterMonday.setDate(easter.getDate() + 1);

  fixed.push(goodFriday, easterMonday);

  // Eid al-Fitr and Eid al-Adha are lunar-based and vary.
  // For production, these should be configured per year.
  // Placeholder: not included in static computation.

  return fixed;
}

function computeEaster(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
}

// ─── Working Day Calculation ─────────────────────────────────────────────────

function isWorkingDay(date: Date): boolean {
  const day = date.getDay();
  if (day === 0 || day === 6) return false; // Weekend

  const holidays = getGhanaPublicHolidays(date.getFullYear());
  const dateStr = date.toISOString().split("T")[0];
  return !holidays.some((h) => h.toISOString().split("T")[0] === dateStr);
}

/**
 * Adds N working days to a start date, skipping weekends and Ghana holidays.
 */
export function addWorkingDays(startDate: Date, days: number): Date {
  const result = new Date(startDate);
  let added = 0;

  while (added < days) {
    result.setDate(result.getDate() + 1);
    if (isWorkingDay(result)) {
      added++;
    }
  }

  return result;
}

/**
 * Counts working days between two dates.
 */
export function countWorkingDays(from: Date, to: Date): number {
  let count = 0;
  const current = new Date(from);

  while (current < to) {
    current.setDate(current.getDate() + 1);
    if (isWorkingDay(current)) count++;
  }

  return count;
}

/**
 * Counts working days remaining until a deadline.
 * Returns negative if breached.
 */
export function workingDaysRemaining(dueAt: Date): number {
  const now = new Date();
  if (now >= dueAt) {
    return -countWorkingDays(dueAt, now);
  }
  return countWorkingDays(now, dueAt);
}

// ─── Deadline Configuration by Type ──────────────────────────────────────────

const DEADLINE_CONFIG: Record<string, { workingDays: number; label: string; description: string; urgencyThreshold: number }> = {
  ACKNOWLEDGMENT: {
    workingDays: 5,
    label: "Committee Acknowledgment",
    description: "Committee must acknowledge receipt of complaint within 5 working days",
    urgencyThreshold: 2,
  },
  RESPONDENT_RESPONSE: {
    workingDays: 7,
    label: "Respondent Response",
    description: "Respondent must submit written response within 7 working days of notification",
    urgencyThreshold: 3,
  },
  INVESTIGATION: {
    workingDays: 60,
    label: "Investigation Completion",
    description: "Investigation must be completed within 60 working days",
    urgencyThreshold: 10,
  },
  HEARING_NOTICE: {
    workingDays: 10,
    label: "Hearing Notice Period",
    description: "All parties must receive at least 10 working days notice before hearing",
    urgencyThreshold: 3,
  },
  APPEAL_FILING: {
    workingDays: 14,
    label: "Appeal Filing Window",
    description: "Appeals must be filed within 14 working days of decision notice",
    urgencyThreshold: 5,
  },
};

// ─── Stage → Deadline Mapping ────────────────────────────────────────────────

const STAGE_DEADLINES: Record<string, string[]> = {
  INTAKE: ["ACKNOWLEDGMENT"],
  RESPONDENT_NOTIFICATION: ["RESPONDENT_RESPONSE"],
  INVESTIGATION: ["INVESTIGATION"],
  HEARING_PREPARATION: ["HEARING_NOTICE"],
  DECISION: ["APPEAL_FILING"],
};

// ─── Service Functions ───────────────────────────────────────────────────────

async function activateStageDeadlines(
  caseId: string,
  stage: string,
  _caseSubmittedAt: Date
): Promise<void> {
  const deadlineTypes = STAGE_DEADLINES[stage];
  if (!deadlineTypes || deadlineTypes.length === 0) return;

  const now = new Date();

  for (const type of deadlineTypes) {
    const config = DEADLINE_CONFIG[type];
    if (!config) continue;

    // Check if deadline already exists and is active
    const existing = await prisma.deadline.findFirst({
      where: { caseId, type: type as any, status: { in: ["ACTIVE", "PENDING", "APPROACHING"] } },
    });
    if (existing) continue;

    const dueAt = addWorkingDays(now, config.workingDays);

    await prisma.deadline.create({
      data: {
        caseId,
        type: type as any,
        status: "ACTIVE",
        label: config.label,
        description: config.description,
        startedAt: now,
        dueAt,
        workingDaysAllowed: config.workingDays,
        urgencyThresholdDays: config.urgencyThreshold,
      },
    });

    logger.info(
      { caseId, type, dueAt: dueAt.toISOString() },
      "Deadline activated"
    );
  }
}

/**
 * Extends a deadline. Chair/admin only.
 */
async function extendDeadline(
  deadlineId: string,
  extensionDays: number,
  reason: string,
  grantedBy: string
) {
  const deadline = await prisma.deadline.findUnique({ where: { id: deadlineId } });
  if (!deadline) throw new Error("Deadline not found");

  if (deadline.status === "COMPLETED" || deadline.status === "WAIVED") {
    throw new Error("Cannot extend a completed or waived deadline");
  }

  const newDueAt = addWorkingDays(deadline.dueAt, extensionDays);

  const updated = await prisma.deadline.update({
    where: { id: deadlineId },
    data: {
      extensionGranted: true,
      extensionDays,
      extensionReason: reason,
      extensionGrantedBy: grantedBy,
      extensionGrantedAt: new Date(),
      originalDueAt: deadline.extensionGranted ? deadline.originalDueAt : deadline.dueAt,
      dueAt: newDueAt,
      status: "EXTENDED",
    },
  });

  logger.info(
    { deadlineId, extensionDays, newDueAt: newDueAt.toISOString() },
    "Deadline extended"
  );

  return updated;
}

/**
 * Checks all active deadlines and updates their status.
 * Called by a scheduled job (cron or queue).
 */
async function checkAndUpdateDeadlines(): Promise<void> {
  const activeDeadlines = await prisma.deadline.findMany({
    where: { status: { in: ["ACTIVE", "APPROACHING", "EXTENDED"] } },
    include: { case: { select: { reference: true } } },
  });

  const now = new Date();

  for (const deadline of activeDeadlines) {
    const remaining = workingDaysRemaining(deadline.dueAt);

    let newStatus: string | null = null;

    if (remaining <= 0) {
      newStatus = "BREACHED";
    } else if (remaining <= deadline.urgencyThresholdDays) {
      newStatus = "APPROACHING";
    }

    if (newStatus && newStatus !== deadline.status) {
      await prisma.deadline.update({
        where: { id: deadline.id },
        data: { status: newStatus as any },
      });

      logger.warn(
        {
          deadlineId: deadline.id,
          caseReference: deadline.case?.reference,
          type: deadline.type,
          status: newStatus,
          remaining,
        },
        `Deadline status changed to ${newStatus}`
      );

      // TODO: Trigger notification for APPROACHING and BREACHED states
    }
  }
}

/**
 * Gets all deadlines for a case with computed working days remaining.
 */
async function getCaseDeadlines(caseId: string) {
  const deadlines = await prisma.deadline.findMany({
    where: { caseId },
    orderBy: { dueAt: "asc" },
  });

  return deadlines.map((d) => ({
    ...d,
    workingDaysRemaining: workingDaysRemaining(d.dueAt),
    workingDaysElapsed: countWorkingDays(d.startedAt, new Date()),
    isBreached: d.status === "BREACHED" || workingDaysRemaining(d.dueAt) <= 0,
    isApproaching:
      d.status === "APPROACHING" ||
      (workingDaysRemaining(d.dueAt) > 0 &&
        workingDaysRemaining(d.dueAt) <= d.urgencyThresholdDays),
    startedAt: d.startedAt.toISOString(),
    dueAt: d.dueAt.toISOString(),
    completedAt: d.completedAt?.toISOString() ?? null,
    extensionGrantedAt: d.extensionGrantedAt?.toISOString() ?? null,
    originalDueAt: d.originalDueAt?.toISOString() ?? null,
  }));
}

export const deadlineService = {
  activateStageDeadlines,
  extendDeadline,
  checkAndUpdateDeadlines,
  getCaseDeadlines,
  addWorkingDays,
  countWorkingDays,
  workingDaysRemaining,
};
