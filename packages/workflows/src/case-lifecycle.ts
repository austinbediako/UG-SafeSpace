/**
 * Formal case lifecycle state machine for SafeSpace UG.
 *
 * This is the single source of truth for:
 *   - what stages exist,
 *   - what transitions are permitted,
 *   - what actions each party may take at each stage,
 *   - what deadlines apply,
 *   - what notifications are triggered,
 *   - and what audit events are created.
 *
 * THE RULE: If an action, transition, or permission is not defined here,
 * it does not exist on the platform.
 *
 * Maps directly to the UG 2017 Sexual Harassment and Misconduct Policy.
 */

import {
  CaseStage,
  CaseParticipantRole,
  DeadlineType,
  NotificationType,
  AuditEventType,
  ReportType,
} from "@safespace/types";
import type { CaseAction } from "@safespace/types";

// ─── Stage Definition ─────────────────────────────────────────────────────────

export interface StageDefinition {
  stage: CaseStage;
  label: string;
  description: string;

  // Who can transition INTO this stage
  enteredBy: CaseParticipantRole[];

  // Which stages this stage can transition TO (valid next stages)
  transitions: CaseStage[];

  // What each role is permitted to do while the case is in this stage
  allowedActions: Partial<Record<CaseParticipantRole, CaseAction[]>>;

  // What data each role can VIEW while in this stage
  visibleToRoles: CaseParticipantRole[];

  // Deadlines that START when this stage is entered
  deadlinesActivated: DeadlineType[];

  // Notifications sent when this stage is entered
  notificationsTriggered: NotificationType[];

  // Audit event created when this stage is entered
  auditEvent: AuditEventType;

  // Whether this stage applies only to formal complaints, informal, or both
  appliesTo: "FORMAL" | "INFORMAL" | "BOTH";
}

// ─── Full Lifecycle Machine ───────────────────────────────────────────────────

export const CASE_LIFECYCLE: Record<CaseStage, StageDefinition> = {

  [CaseStage.INTAKE]: {
    stage: CaseStage.INTAKE,
    label: "Intake",
    description:
      "A complaint has been submitted and is pending committee review. " +
      "No parties have been formally notified at this stage.",
    enteredBy: [], // System-created on submission
    transitions: [CaseStage.ACKNOWLEDGMENT],
    allowedActions: {
      [CaseParticipantRole.INVESTIGATOR]: [],
      [CaseParticipantRole.PANEL_CHAIR]: ["WITHDRAW_COMPLAINT"],
    },
    visibleToRoles: [
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.INVESTIGATOR,
    ],
    deadlinesActivated: [DeadlineType.ACKNOWLEDGMENT],
    notificationsTriggered: [NotificationType.CASE_SUBMITTED],
    auditEvent: AuditEventType.CASE_CREATED,
    appliesTo: "BOTH",
  },

  [CaseStage.ACKNOWLEDGMENT]: {
    stage: CaseStage.ACKNOWLEDGMENT,
    label: "Acknowledgment",
    description:
      "The committee has formally acknowledged receipt of the complaint. " +
      "The complainant has been notified that their report is being processed.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR, CaseParticipantRole.INVESTIGATOR],
    transitions: [CaseStage.RESPONDENT_NOTIFICATION],
    allowedActions: {
      [CaseParticipantRole.PANEL_CHAIR]: [],
      [CaseParticipantRole.INVESTIGATOR]: ["UPLOAD_EVIDENCE"],
    },
    visibleToRoles: [
      CaseParticipantRole.COMPLAINANT,
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.INVESTIGATOR,
    ],
    deadlinesActivated: [],
    notificationsTriggered: [NotificationType.CASE_ACKNOWLEDGED],
    auditEvent: AuditEventType.STAGE_TRANSITIONED,
    appliesTo: "BOTH",
  },

  [CaseStage.RESPONDENT_NOTIFICATION]: {
    stage: CaseStage.RESPONDENT_NOTIFICATION,
    label: "Respondent Notification",
    description:
      "The respondent has been formally notified of the complaint against them. " +
      "The 7-working-day response window has been activated.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR, CaseParticipantRole.INVESTIGATOR],
    transitions: [CaseStage.RESPONSE_WINDOW],
    allowedActions: {
      [CaseParticipantRole.RESPONDENT]: ["ADD_REPRESENTATIVE", "ACKNOWLEDGE_NOTIFICATION"],
      [CaseParticipantRole.PANEL_CHAIR]: [],
      [CaseParticipantRole.INVESTIGATOR]: ["UPLOAD_EVIDENCE"],
    },
    visibleToRoles: [
      CaseParticipantRole.COMPLAINANT,
      CaseParticipantRole.RESPONDENT,
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.INVESTIGATOR,
    ],
    deadlinesActivated: [DeadlineType.RESPONDENT_RESPONSE],
    notificationsTriggered: [NotificationType.RESPONDENT_NOTIFIED],
    auditEvent: AuditEventType.STAGE_TRANSITIONED,
    appliesTo: "BOTH",
  },

  [CaseStage.RESPONSE_WINDOW]: {
    stage: CaseStage.RESPONSE_WINDOW,
    label: "Response Window",
    description:
      "The respondent has 7 working days to submit a written response. " +
      "Evidence may be submitted by both parties during this period.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR, CaseParticipantRole.INVESTIGATOR],
    transitions: [CaseStage.INVESTIGATION],
    allowedActions: {
      [CaseParticipantRole.RESPONDENT]: [
        "SUBMIT_RESPONSE",
        "UPLOAD_EVIDENCE",
        "ADD_REPRESENTATIVE",
      ],
      [CaseParticipantRole.COMPLAINANT]: ["UPLOAD_EVIDENCE"],
      [CaseParticipantRole.PANEL_CHAIR]: [],
      [CaseParticipantRole.INVESTIGATOR]: ["UPLOAD_EVIDENCE"],
    },
    visibleToRoles: [
      CaseParticipantRole.COMPLAINANT,
      CaseParticipantRole.RESPONDENT,
      CaseParticipantRole.REPRESENTATIVE,
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.INVESTIGATOR,
    ],
    deadlinesActivated: [],
    notificationsTriggered: [],
    auditEvent: AuditEventType.STAGE_TRANSITIONED,
    appliesTo: "BOTH",
  },

  [CaseStage.INVESTIGATION]: {
    stage: CaseStage.INVESTIGATION,
    label: "Under Investigation",
    description:
      "An investigator has been assigned and the formal investigation is underway. " +
      "The 60-working-day investigation window is now active.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR],
    transitions: [CaseStage.HEARING_PREPARATION, CaseStage.DECISION],
    allowedActions: {
      [CaseParticipantRole.INVESTIGATOR]: ["UPLOAD_EVIDENCE"],
      [CaseParticipantRole.COMPLAINANT]: ["UPLOAD_EVIDENCE"],
      [CaseParticipantRole.RESPONDENT]: ["UPLOAD_EVIDENCE", "ADD_REPRESENTATIVE"],
      [CaseParticipantRole.WITNESS]: ["UPLOAD_EVIDENCE"],
      [CaseParticipantRole.PANEL_CHAIR]: [],
    },
    visibleToRoles: [
      CaseParticipantRole.COMPLAINANT,
      CaseParticipantRole.RESPONDENT,
      CaseParticipantRole.REPRESENTATIVE,
      CaseParticipantRole.WITNESS,
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.PANEL_MEMBER,
      CaseParticipantRole.INVESTIGATOR,
    ],
    deadlinesActivated: [DeadlineType.INVESTIGATION],
    notificationsTriggered: [NotificationType.INVESTIGATOR_ASSIGNED],
    auditEvent: AuditEventType.INVESTIGATOR_ASSIGNED,
    appliesTo: "FORMAL",
  },

  [CaseStage.HEARING_PREPARATION]: {
    stage: CaseStage.HEARING_PREPARATION,
    label: "Hearing Preparation",
    description:
      "A hearing has been scheduled. All parties have been notified and " +
      "must confirm attendance. Evidence is being admitted to the hearing record.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR],
    transitions: [CaseStage.HEARING],
    allowedActions: {
      [CaseParticipantRole.COMPLAINANT]: ["UPLOAD_EVIDENCE", "VIEW_HEARING_DETAILS"],
      [CaseParticipantRole.RESPONDENT]: [
        "UPLOAD_EVIDENCE",
        "VIEW_HEARING_DETAILS",
        "ADD_REPRESENTATIVE",
      ],
      [CaseParticipantRole.REPRESENTATIVE]: ["VIEW_HEARING_DETAILS"],
      [CaseParticipantRole.WITNESS]: ["VIEW_HEARING_DETAILS"],
      [CaseParticipantRole.PANEL_CHAIR]: ["VIEW_HEARING_DETAILS"],
      [CaseParticipantRole.PANEL_MEMBER]: ["VIEW_HEARING_DETAILS"],
      [CaseParticipantRole.INVESTIGATOR]: ["VIEW_HEARING_DETAILS", "UPLOAD_EVIDENCE"],
    },
    visibleToRoles: [
      CaseParticipantRole.COMPLAINANT,
      CaseParticipantRole.RESPONDENT,
      CaseParticipantRole.REPRESENTATIVE,
      CaseParticipantRole.WITNESS,
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.PANEL_MEMBER,
      CaseParticipantRole.INVESTIGATOR,
    ],
    deadlinesActivated: [DeadlineType.HEARING_NOTICE],
    notificationsTriggered: [
      NotificationType.HEARING_SCHEDULED,
      NotificationType.HEARING_REMINDER,
    ],
    auditEvent: AuditEventType.HEARING_SCHEDULED,
    appliesTo: "FORMAL",
  },

  [CaseStage.HEARING]: {
    stage: CaseStage.HEARING,
    label: "Hearing in Progress",
    description:
      "The formal hearing is currently taking place. " +
      "No new evidence or submissions may be filed during this stage.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR],
    transitions: [CaseStage.DELIBERATION],
    allowedActions: {
      [CaseParticipantRole.COMPLAINANT]: ["VIEW_HEARING_DETAILS"],
      [CaseParticipantRole.RESPONDENT]: ["VIEW_HEARING_DETAILS"],
      [CaseParticipantRole.PANEL_CHAIR]: [],
      [CaseParticipantRole.PANEL_MEMBER]: [],
    },
    visibleToRoles: [
      CaseParticipantRole.COMPLAINANT,
      CaseParticipantRole.RESPONDENT,
      CaseParticipantRole.REPRESENTATIVE,
      CaseParticipantRole.WITNESS,
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.PANEL_MEMBER,
    ],
    deadlinesActivated: [],
    notificationsTriggered: [],
    auditEvent: AuditEventType.STAGE_TRANSITIONED,
    appliesTo: "FORMAL",
  },

  [CaseStage.DELIBERATION]: {
    stage: CaseStage.DELIBERATION,
    label: "Deliberation",
    description:
      "The hearing panel is deliberating. All external parties are suspended " +
      "from action. The committee will issue a decision at the end of this stage.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR],
    transitions: [CaseStage.DECISION],
    allowedActions: {
      [CaseParticipantRole.PANEL_CHAIR]: [],
      [CaseParticipantRole.PANEL_MEMBER]: [],
    },
    visibleToRoles: [
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.PANEL_MEMBER,
      CaseParticipantRole.INVESTIGATOR,
    ],
    deadlinesActivated: [],
    notificationsTriggered: [],
    auditEvent: AuditEventType.STAGE_TRANSITIONED,
    appliesTo: "FORMAL",
  },

  [CaseStage.DECISION]: {
    stage: CaseStage.DECISION,
    label: "Decision Issued",
    description:
      "The committee has rendered a formal decision. Both parties have been " +
      "notified. The appeal window is now active.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR],
    transitions: [CaseStage.APPEAL_WINDOW, CaseStage.CLOSED],
    allowedActions: {
      [CaseParticipantRole.COMPLAINANT]: ["VIEW_DECISION"],
      [CaseParticipantRole.RESPONDENT]: ["VIEW_DECISION"],
      [CaseParticipantRole.PANEL_CHAIR]: [],
    },
    visibleToRoles: [
      CaseParticipantRole.COMPLAINANT,
      CaseParticipantRole.RESPONDENT,
      CaseParticipantRole.REPRESENTATIVE,
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.PANEL_MEMBER,
      CaseParticipantRole.INVESTIGATOR,
    ],
    deadlinesActivated: [DeadlineType.APPEAL_FILING],
    notificationsTriggered: [NotificationType.DECISION_ISSUED],
    auditEvent: AuditEventType.DECISION_RENDERED,
    appliesTo: "FORMAL",
  },

  [CaseStage.APPEAL_WINDOW]: {
    stage: CaseStage.APPEAL_WINDOW,
    label: "Appeal Window",
    description:
      "Either party may file an appeal within the defined working-day window. " +
      "If no appeal is filed, the case will close at the end of this period.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR],
    transitions: [CaseStage.APPEAL_REVIEW, CaseStage.CLOSED],
    allowedActions: {
      [CaseParticipantRole.COMPLAINANT]: ["FILE_APPEAL", "VIEW_DECISION"],
      [CaseParticipantRole.RESPONDENT]: ["FILE_APPEAL", "VIEW_DECISION"],
      [CaseParticipantRole.PANEL_CHAIR]: [],
    },
    visibleToRoles: [
      CaseParticipantRole.COMPLAINANT,
      CaseParticipantRole.RESPONDENT,
      CaseParticipantRole.REPRESENTATIVE,
      CaseParticipantRole.PANEL_CHAIR,
    ],
    deadlinesActivated: [],
    notificationsTriggered: [],
    auditEvent: AuditEventType.STAGE_TRANSITIONED,
    appliesTo: "FORMAL",
  },

  [CaseStage.APPEAL_REVIEW]: {
    stage: CaseStage.APPEAL_REVIEW,
    label: "Appeal Under Review",
    description:
      "An appeal has been filed and is being reviewed by a separate panel. " +
      "The case remains open. The original decision is stayed pending outcome.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR],
    transitions: [CaseStage.CLOSED],
    allowedActions: {
      [CaseParticipantRole.COMPLAINANT]: ["UPLOAD_EVIDENCE", "VIEW_DECISION"],
      [CaseParticipantRole.RESPONDENT]: ["UPLOAD_EVIDENCE", "VIEW_DECISION"],
      [CaseParticipantRole.PANEL_CHAIR]: [],
      [CaseParticipantRole.PANEL_MEMBER]: [],
    },
    visibleToRoles: [
      CaseParticipantRole.COMPLAINANT,
      CaseParticipantRole.RESPONDENT,
      CaseParticipantRole.REPRESENTATIVE,
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.PANEL_MEMBER,
    ],
    deadlinesActivated: [],
    notificationsTriggered: [NotificationType.APPEAL_FILED],
    auditEvent: AuditEventType.APPEAL_FILED,
    appliesTo: "FORMAL",
  },

  [CaseStage.CLOSED]: {
    stage: CaseStage.CLOSED,
    label: "Closed",
    description:
      "This case has been formally closed. No further actions are permitted. " +
      "Records are retained per institutional policy.",
    enteredBy: [CaseParticipantRole.PANEL_CHAIR],
    transitions: [], // Terminal state
    allowedActions: {
      [CaseParticipantRole.COMPLAINANT]: ["VIEW_DECISION"],
      [CaseParticipantRole.RESPONDENT]: ["VIEW_DECISION"],
      [CaseParticipantRole.PANEL_CHAIR]: [],
    },
    visibleToRoles: [
      CaseParticipantRole.COMPLAINANT,
      CaseParticipantRole.RESPONDENT,
      CaseParticipantRole.PANEL_CHAIR,
      CaseParticipantRole.PANEL_MEMBER,
      CaseParticipantRole.INVESTIGATOR,
    ],
    deadlinesActivated: [],
    notificationsTriggered: [NotificationType.CASE_CLOSED],
    auditEvent: AuditEventType.CASE_CLOSED,
    appliesTo: "BOTH",
  },
};

// ─── Helper Functions ─────────────────────────────────────────────────────────

/**
 * Returns the stage definition for a given stage.
 */
export function getStageDefinition(stage: CaseStage): StageDefinition {
  return CASE_LIFECYCLE[stage];
}

/**
 * Returns the actions available to a participant at the current case stage.
 * Returns empty array if the role has no allowed actions at this stage.
 */
export function getAllowedActions(
  stage: CaseStage,
  role: CaseParticipantRole
): CaseAction[] {
  const def = CASE_LIFECYCLE[stage];
  return def.allowedActions[role] ?? [];
}

/**
 * Returns true if the participant role can see the case at this stage.
 */
export function canViewCase(stage: CaseStage, role: CaseParticipantRole): boolean {
  return CASE_LIFECYCLE[stage].visibleToRoles.includes(role);
}

/**
 * Returns true if the given stage transition is valid.
 */
export function isValidTransition(from: CaseStage, to: CaseStage): boolean {
  return CASE_LIFECYCLE[from].transitions.includes(to);
}

/**
 * Returns the ordered list of stages for display in a timeline.
 * For FORMAL complaints the full path is used; INFORMAL skips the
 * formal investigation and hearing stages.
 */
export function getStageTimeline(reportType: ReportType): CaseStage[] {
  if (reportType === ReportType.FORMAL) {
    return [
      CaseStage.INTAKE,
      CaseStage.ACKNOWLEDGMENT,
      CaseStage.RESPONDENT_NOTIFICATION,
      CaseStage.RESPONSE_WINDOW,
      CaseStage.INVESTIGATION,
      CaseStage.HEARING_PREPARATION,
      CaseStage.HEARING,
      CaseStage.DELIBERATION,
      CaseStage.DECISION,
      CaseStage.APPEAL_WINDOW,
      CaseStage.CLOSED,
    ];
  }
  // Informal resolution path — no investigation or hearing
  return [
    CaseStage.INTAKE,
    CaseStage.ACKNOWLEDGMENT,
    CaseStage.RESPONDENT_NOTIFICATION,
    CaseStage.RESPONSE_WINDOW,
    CaseStage.DECISION,
    CaseStage.CLOSED,
  ];
}

/**
 * Returns a 0-based index of how far through the timeline the case is.
 * Useful for progress bars and timeline visualisations.
 */
export function getStageProgress(
  currentStage: CaseStage,
  reportType: ReportType
): { current: number; total: number; percent: number } {
  const timeline = getStageTimeline(reportType);
  const current = timeline.indexOf(currentStage);
  const total = timeline.length - 1;
  return {
    current: Math.max(current, 0),
    total,
    percent: total > 0 ? Math.round((Math.max(current, 0) / total) * 100) : 0,
  };
}
