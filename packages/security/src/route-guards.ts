/**
 * Route guard definitions for SafeSpace UG.
 *
 * These are not implemented auth middleware — they are typed contracts
 * that define which routes require which access conditions.
 * The actual middleware implementation lives in each app's middleware.ts.
 *
 * This package defines WHAT to protect. Apps define HOW to enforce it.
 */

import { UserRole } from "@safespace/types";

// ─── Route Protection Level ───────────────────────────────────────────────────

export type ProtectionLevel =
  | "PUBLIC"           // No auth required (reporting portal, awareness platform)
  | "AUTHENTICATED"    // Any authenticated user
  | "ROLE_REQUIRED"    // Specific system roles only
  | "CASE_PARTICIPANT" // Must be a participant in the specific case being accessed
  | "COMMITTEE_ONLY";  // Committee roles only

export interface RouteGuard {
  pattern: string;           // Route pattern (supports * wildcard)
  protection: ProtectionLevel;
  allowedRoles?: UserRole[]; // Only for ROLE_REQUIRED and COMMITTEE_ONLY
  redirectTo: string;        // Where to send unauthorized users
}

// ─── Participation Portal Route Guards ───────────────────────────────────────

export const PARTICIPATION_PORTAL_GUARDS: RouteGuard[] = [
  {
    pattern: "/",
    protection: "AUTHENTICATED",
    allowedRoles: [UserRole.COMPLAINANT, UserRole.RESPONDENT],
    redirectTo: "/auth/login",
  },
  {
    pattern: "/cases",
    protection: "AUTHENTICATED",
    allowedRoles: [UserRole.COMPLAINANT, UserRole.RESPONDENT],
    redirectTo: "/auth/login",
  },
  {
    pattern: "/cases/*",
    protection: "CASE_PARTICIPANT",
    allowedRoles: [UserRole.COMPLAINANT, UserRole.RESPONDENT],
    redirectTo: "/cases",
  },
  {
    pattern: "/participation/*",
    protection: "CASE_PARTICIPANT",
    allowedRoles: [UserRole.COMPLAINANT, UserRole.RESPONDENT],
    redirectTo: "/",
  },
  {
    pattern: "/hearings",
    protection: "AUTHENTICATED",
    allowedRoles: [UserRole.COMPLAINANT, UserRole.RESPONDENT],
    redirectTo: "/auth/login",
  },
  {
    pattern: "/appeals",
    protection: "CASE_PARTICIPANT",
    allowedRoles: [UserRole.COMPLAINANT, UserRole.RESPONDENT],
    redirectTo: "/",
  },
  {
    pattern: "/communications/*",
    protection: "CASE_PARTICIPANT",
    allowedRoles: [UserRole.COMPLAINANT, UserRole.RESPONDENT],
    redirectTo: "/",
  },
];

// ─── Committee Dashboard Route Guards ─────────────────────────────────────────

export const COMMITTEE_DASHBOARD_GUARDS: RouteGuard[] = [
  {
    pattern: "/*",
    protection: "COMMITTEE_ONLY",
    allowedRoles: [
      UserRole.COMMITTEE_CHAIR,
      UserRole.COMMITTEE_MEMBER,
      UserRole.INVESTIGATOR,
      UserRole.SECRETARY,
      UserRole.ADMIN,
    ],
    redirectTo: "/auth/login",
  },
  {
    pattern: "/members/*",
    protection: "ROLE_REQUIRED",
    allowedRoles: [UserRole.COMMITTEE_CHAIR, UserRole.ADMIN],
    redirectTo: "/",
  },
  {
    pattern: "/decisions/deliberate/*",
    protection: "ROLE_REQUIRED",
    allowedRoles: [UserRole.COMMITTEE_CHAIR, UserRole.COMMITTEE_MEMBER],
    redirectTo: "/decisions",
  },
  {
    pattern: "/analytics",
    protection: "ROLE_REQUIRED",
    allowedRoles: [UserRole.COMMITTEE_CHAIR, UserRole.ADMIN],
    redirectTo: "/",
  },
];

// ─── Reporting Portal Route Guards ────────────────────────────────────────────
// The submission form itself is fully public.
// The /submitted and /track routes require a valid tracking token.

export const REPORTING_PORTAL_GUARDS: RouteGuard[] = [
  {
    pattern: "/",
    protection: "PUBLIC",
    redirectTo: "/",
  },
  {
    pattern: "/submitted/*",
    protection: "PUBLIC", // Token-validated at component level, not middleware
    redirectTo: "/",
  },
  {
    pattern: "/track/*",
    protection: "PUBLIC", // Token-validated at component level
    redirectTo: "/",
  },
];

// ─── Auth Boundary Helper ─────────────────────────────────────────────────────

/**
 * Returns the login URL for a given application.
 * Used by middleware to construct redirects.
 */
export function getLoginUrl(app: "participation-portal" | "committee-dashboard"): string {
  return "/auth/login";
}

/**
 * Returns true if the given pathname matches the route pattern.
 * Supports single-level wildcard (*).
 */
export function matchesRoutePattern(pathname: string, pattern: string): boolean {
  if (pattern === "/*") return true;
  if (!pattern.includes("*")) return pathname === pattern;

  const prefix = pattern.replace("/*", "");
  return pathname === prefix || pathname.startsWith(prefix + "/");
}
