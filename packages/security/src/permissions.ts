/**
 * Permission and access-control definitions for SafeSpace UG.
 *
 * Architecture principle: permissions are case-scoped, not global.
 * A user's system-level role (UserRole) grants access to apps and
 * administrative functions. Their case-level role (CaseParticipantRole)
 * governs what they can see and do within a specific case.
 *
 * Never collapse these into a single permission check.
 */

import {
  UserRole,
  CaseParticipantRole,
  CaseStage,
} from "@safespace/types";
import { getAllowedActions, canViewCase } from "@safespace/workflows";
import type { CaseAction } from "@safespace/types";

// ─── App Access ───────────────────────────────────────────────────────────────
// Which system roles are permitted to access which applications.

export const APP_ACCESS: Record<string, UserRole[]> = {
  "reporting-portal": [
    // Open to all — no auth required to file a report
    // This is enforced by the absence of an auth gate, not by role check
  ],
  "participation-portal": [
    UserRole.COMPLAINANT,
    UserRole.RESPONDENT,
  ],
  "committee-dashboard": [
    UserRole.COMMITTEE_MEMBER,
    UserRole.COMMITTEE_CHAIR,
    UserRole.INVESTIGATOR,
    UserRole.SECRETARY,
    UserRole.ADMIN,
  ],
};

/**
 * Returns true if the given system role may access the given application.
 * The reporting portal is always accessible (anonymous submission).
 */
export function canAccessApp(appName: string, role: UserRole | null): boolean {
  if (appName === "reporting-portal") return true;
  if (!role) return false;
  return APP_ACCESS[appName]?.includes(role) ?? false;
}

// ─── Case-Scoped Permissions ──────────────────────────────────────────────────

export interface CaseScopedPermission {
  canView: boolean;
  allowedActions: CaseAction[];
}

/**
 * Returns the full permission set for a user within a specific case at its
 * current stage. This is the primary permission check used in all
 * case-related components.
 *
 * @param stage - Current stage of the case
 * @param participantRole - The user's role within THIS case (not their system role)
 */
export function getCaseScopedPermissions(
  stage: CaseStage,
  participantRole: CaseParticipantRole
): CaseScopedPermission {
  return {
    canView: canViewCase(stage, participantRole),
    allowedActions: getAllowedActions(stage, participantRole),
  };
}

/**
 * Quick helper to check if a specific action is permitted.
 */
export function canPerformAction(
  stage: CaseStage,
  participantRole: CaseParticipantRole,
  action: CaseAction
): boolean {
  return getAllowedActions(stage, participantRole).includes(action);
}

// ─── Committee-Level Permissions ─────────────────────────────────────────────
// Permissions that apply globally to committee members, independent of a
// specific case's stage.

export const COMMITTEE_PERMISSIONS: Record<UserRole, string[]> = {
  [UserRole.COMMITTEE_CHAIR]: [
    "TRANSITION_STAGE",
    "ASSIGN_INVESTIGATOR",
    "SCHEDULE_HEARING",
    "CONSTITUTE_PANEL",
    "RENDER_DECISION",
    "GRANT_DEADLINE_EXTENSION",
    "MANAGE_MEMBERS",
    "VIEW_ALL_CASES",
    "VIEW_AUDIT_LOG",
    "CLOSE_CASE",
  ],
  [UserRole.COMMITTEE_MEMBER]: [
    "VIEW_ASSIGNED_CASES",
    "UPLOAD_EVIDENCE",
    "VIEW_HEARINGS",
    "PARTICIPATE_IN_DELIBERATION",
  ],
  [UserRole.INVESTIGATOR]: [
    "VIEW_ASSIGNED_CASES",
    "UPLOAD_EVIDENCE",
    "SUBMIT_INVESTIGATION_REPORT",
    "VIEW_ALL_CASE_EVIDENCE",
  ],
  [UserRole.SECRETARY]: [
    "VIEW_ALL_CASES",
    "SEND_FORMAL_NOTICES",
    "RECORD_HEARING",
    "MANAGE_SCHEDULING",
  ],
  [UserRole.ADMIN]: [
    "VIEW_ALL_CASES",
    "VIEW_AUDIT_LOG",
    "MANAGE_USERS",
    "MANAGE_SETTINGS",
    "EXPORT_REPORTS",
  ],
  // Non-committee roles have no committee-level permissions
  [UserRole.COMPLAINANT]: [],
  [UserRole.RESPONDENT]: [],
};

export function hasCommitteePermission(
  role: UserRole,
  permission: string
): boolean {
  return COMMITTEE_PERMISSIONS[role]?.includes(permission) ?? false;
}

// ─── Evidence Access Rules ────────────────────────────────────────────────────
// Governs who can see which evidence. Critical for confidentiality.

export interface EvidenceAccessRules {
  // Can the role see this evidence item at all?
  canView: boolean;
  // Can the role download the file?
  canDownload: boolean;
  // Can the role see who submitted the evidence?
  canSeeSubmitter: boolean;
}

/**
 * Returns evidence access rules for a given case participant role.
 *
 * Key rules:
 * - Complainant-submitted evidence is NOT visible to the respondent unless
 *   admitted to the hearing record.
 * - Respondent-submitted evidence is NOT visible to the complainant unless
 *   admitted to the hearing record.
 * - Committee and investigators can see all evidence.
 * - Witnesses can only see evidence they submitted.
 */
export function getEvidenceAccessRules(
  viewerRole: CaseParticipantRole,
  evidenceSubmittedByRole: CaseParticipantRole,
  isAdmittedToHearingRecord: boolean
): EvidenceAccessRules {
  // Committee and investigators always have full access
  const isCommittee = [
    CaseParticipantRole.PANEL_CHAIR,
    CaseParticipantRole.PANEL_MEMBER,
    CaseParticipantRole.INVESTIGATOR,
  ].includes(viewerRole);

  if (isCommittee) {
    return { canView: true, canDownload: true, canSeeSubmitter: true };
  }

  // Parties can always see their own submissions
  if (viewerRole === evidenceSubmittedByRole) {
    return { canView: true, canDownload: true, canSeeSubmitter: true };
  }

  // Cross-party evidence: only visible if admitted to hearing record
  if (isAdmittedToHearingRecord) {
    return { canView: true, canDownload: true, canSeeSubmitter: false };
  }

  return { canView: false, canDownload: false, canSeeSubmitter: false };
}

// ─── Identity Protection Rules ────────────────────────────────────────────────
// The complainant's identity is protected throughout the process.

/**
 * Returns true if the complainant's identity should be redacted for the viewer.
 * Identity is protected from the respondent and all non-committee parties.
 */
export function shouldRedactComplainantIdentity(
  viewerRole: CaseParticipantRole
): boolean {
  const privilegedRoles = [
    CaseParticipantRole.PANEL_CHAIR,
    CaseParticipantRole.PANEL_MEMBER,
    CaseParticipantRole.INVESTIGATOR,
    CaseParticipantRole.COMPLAINANT, // Can see their own identity
  ];
  return !privilegedRoles.includes(viewerRole);
}
