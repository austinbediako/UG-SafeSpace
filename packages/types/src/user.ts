import type { UserRole, ComplainantAffiliation, RepresentativeType } from "./enums";

// ─── Base User ────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  affiliation: ComplainantAffiliation;
  department?: string;
  staffId?: string;
  studentId?: string;
  isAnonymous: false;
  createdAt: string; // ISO 8601
  updatedAt: string;
}

// ─── Anonymous Identity ───────────────────────────────────────────────────────
// Anonymous reporters have no persistent identity. They are tracked only
// by a one-time token issued at submission. The token is the sole means
// of case reference for an anonymous user.

export interface AnonymousIdentity {
  isAnonymous: true;
  trackingToken: string; // cryptographically secure random token
  tokenExpiresAt: string | null; // null = never expires
}

// ─── Case Participant ─────────────────────────────────────────────────────────
// Represents a user's association with a specific case and their role within it.
// A user may be a respondent in Case A and a witness in Case B — both are
// separate CaseParticipant records with different role assignments.

export interface CaseParticipant {
  id: string;
  caseId: string;
  userId: string;
  role: import("./enums").CaseParticipantRole;
  addedAt: string;
  addedBy: string; // userId of who added this participant
  isActive: boolean;
  // Representative-specific fields
  representativeType?: RepresentativeType;
  approvedByCommittee?: boolean;
  approvedAt?: string;
}

// ─── Session ──────────────────────────────────────────────────────────────────
// Frontend session shape. The backend returns this after authentication.
// The frontend stores this in a session context and never re-derives it
// from JWT claims directly on the client.

export interface Session {
  userId: string;
  role: UserRole;
  email: string;
  firstName: string;
  lastName: string;
  // Which cases this user is involved in and in what capacity.
  // This is pre-computed by the backend for fast permission checks.
  caseParticipations: Array<{
    caseId: string;
    role: import("./enums").CaseParticipantRole;
  }>;
  expiresAt: string;
}

// ─── Auth Tokens ──────────────────────────────────────────────────────────────

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number; // seconds
}
