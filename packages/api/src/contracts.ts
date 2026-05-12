/**
 * API contract definitions for SafeSpace UG.
 *
 * This file defines the request and response shapes for every planned
 * backend endpoint. No actual HTTP calls are made here.
 *
 * PURPOSE: Force frontend/backend alignment before implementation begins.
 * The backend MUST honour these contracts. Any deviation is a breaking change.
 *
 * Versioning: All endpoints are prefixed /api/v1/ on the backend.
 */

import type {
  Case,
  CaseSummary,
  CaseParticipantView,
  IntakeFormData,
  SubmissionResult,
  Evidence,
  EvidenceUploadRequest,
  EvidenceUploadResponse,
  Deadline,
  DeadlineExtensionRequest,
  Hearing,
  ScheduleHearingRequest,
  Decision,
  Appeal,
  Notification,
  FormalNotice,
  AuditEvent,
  ActivityFeedItem,
  User,
  Session,
  AuthTokens,
  CaseStage,
  CaseReference,
} from "@safespace/types";

// ─── Envelope ─────────────────────────────────────────────────────────────────
// All API responses are wrapped in this envelope.

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total?: number;
    page?: number;
    pageSize?: number;
    hasMore?: boolean;
  };
}

export interface ApiError {
  code: string;           // Machine-readable error code e.g. "DEADLINE_BREACHED"
  message: string;        // Human-readable message
  field?: string;         // For validation errors — which field failed
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse;

// ─── Auth Endpoints ───────────────────────────────────────────────────────────

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  session: Session;
  tokens: AuthTokens;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  tokens: AuthTokens;
}

// ─── Anonymous Tracking ───────────────────────────────────────────────────────

export interface AnonymousTrackRequest {
  trackingToken: string;
}

export interface AnonymousTrackResponse {
  caseReference: CaseReference;
  stage: CaseStage;
  stageLabel: string;
  stageDescription: string;
  // What the anonymous user can do from this point
  availableActions: Array<{
    label: string;
    url: string;
  }>;
}

// ─── Case Endpoints ───────────────────────────────────────────────────────────

// POST /api/v1/cases — Submit a new complaint (public, no auth required)
export type SubmitCaseRequest = IntakeFormData;
export type SubmitCaseResponse = SubmissionResult;

// GET /api/v1/cases — List cases (role-scoped by auth)
export interface ListCasesRequest {
  page?: number;
  pageSize?: number;
  stage?: CaseStage;
  status?: string;
  assignedToMe?: boolean;  // Committee: filter to investigator's assigned cases
  search?: string;
}
export type ListCasesResponse = ApiResponse<CaseSummary[]>;

// GET /api/v1/cases/:id — Full case detail (role-scoped projection)
// Returns CaseParticipantView for party users, Case for committee
export type GetCaseResponse = ApiResponse<Case | CaseParticipantView>;

// PATCH /api/v1/cases/:id/stage — Transition case to next stage (committee only)
export interface TransitionStageRequest {
  toStage: CaseStage;
  reason?: string;
}
export type TransitionStageResponse = ApiResponse<{ stage: CaseStage; transitionedAt: string }>;

// PATCH /api/v1/cases/:id/assign — Assign investigator (chair only)
export interface AssignInvestigatorRequest {
  investigatorUserId: string;
}
export type AssignInvestigatorResponse = ApiResponse<{ assignedAt: string }>;

// POST /api/v1/cases/:id/response — Respondent submits written response
export interface SubmitResponseRequest {
  responseText: string;
  evidenceIds?: string[];  // Already-uploaded evidence to attach
}
export type SubmitResponseResponse = ApiResponse<{ submittedAt: string }>;

// ─── Evidence Endpoints ───────────────────────────────────────────────────────

// POST /api/v1/cases/:id/evidence/upload-url — Request signed upload URL
export type RequestEvidenceUploadResponse = ApiResponse<EvidenceUploadResponse>;
export type RequestEvidenceUploadRequest = EvidenceUploadRequest;

// POST /api/v1/cases/:id/evidence/:evidenceId/confirm — Confirm upload complete
export interface ConfirmEvidenceUploadRequest {
  evidenceId: string;
}
export type ConfirmEvidenceUploadResponse = ApiResponse<Evidence>;

// GET /api/v1/cases/:id/evidence — List evidence for a case (role-scoped)
export type ListEvidenceResponse = ApiResponse<Evidence[]>;

// GET /api/v1/cases/:id/evidence/:evidenceId/download-url — Get signed download URL
export interface GetEvidenceDownloadUrlResponse {
  signedUrl: string;
  expiresAt: string;
}

// ─── Deadline Endpoints ───────────────────────────────────────────────────────

// GET /api/v1/cases/:id/deadlines
export type ListDeadlinesResponse = ApiResponse<Deadline[]>;

// POST /api/v1/cases/:id/deadlines/:deadlineId/extend (chair only)
export type ExtendDeadlineRequest = DeadlineExtensionRequest;
export type ExtendDeadlineResponse = ApiResponse<Deadline>;

// ─── Hearing Endpoints ────────────────────────────────────────────────────────

// POST /api/v1/cases/:id/hearings — Schedule a hearing (chair only)
export type ScheduleHearingRequestBody = ScheduleHearingRequest;
export type ScheduleHearingResponseBody = ApiResponse<Hearing>;

// GET /api/v1/cases/:id/hearings
export type ListHearingsResponse = ApiResponse<Hearing[]>;

// GET /api/v1/hearings — All hearings across cases (committee only)
export interface ListAllHearingsRequest {
  page?: number;
  pageSize?: number;
  status?: string;
  from?: string;  // ISO date
  to?: string;    // ISO date
}
export type ListAllHearingsResponse = ApiResponse<Hearing[]>;

// ─── Decision Endpoints ───────────────────────────────────────────────────────

// POST /api/v1/cases/:id/decision — Render a decision (chair only)
export interface RenderDecisionRequest {
  outcome: import("@safespace/types").DecisionOutcome;
  summary: string;
  fullText: string;
  sanctionsOrdered: boolean;
  sanctionDetails?: string;
  panelMemberIds: string[];
}
export type RenderDecisionResponse = ApiResponse<Decision>;

// GET /api/v1/cases/:id/decision
export type GetDecisionResponse = ApiResponse<Decision>;

// ─── Appeal Endpoints ─────────────────────────────────────────────────────────

// POST /api/v1/cases/:id/appeal — File an appeal
export interface FileAppealRequest {
  groundsForAppeal: string;
  supportingEvidenceIds?: string[];
}
export type FileAppealResponse = ApiResponse<Appeal>;

// GET /api/v1/cases/:id/appeal
export type GetAppealResponse = ApiResponse<Appeal | null>;

// ─── Notification Endpoints ───────────────────────────────────────────────────

// GET /api/v1/notifications — Current user's notifications
export interface ListNotificationsRequest {
  unreadOnly?: boolean;
  page?: number;
  pageSize?: number;
}
export type ListNotificationsResponse = ApiResponse<Notification[]>;

// PATCH /api/v1/notifications/:id/read
export type MarkNotificationReadResponse = ApiResponse<{ readAt: string }>;

// PATCH /api/v1/notifications/read-all
export type MarkAllNotificationsReadResponse = ApiResponse<{ count: number }>;

// ─── Activity Feed Endpoints ──────────────────────────────────────────────────

// GET /api/v1/cases/:id/activity
export interface ListActivityRequest {
  page?: number;
  pageSize?: number;
}
export type ListActivityResponse = ApiResponse<ActivityFeedItem[]>;

// ─── Formal Notices Endpoints ─────────────────────────────────────────────────

// GET /api/v1/cases/:id/notices
export type ListFormalNoticesResponse = ApiResponse<FormalNotice[]>;

// ─── Audit Endpoints (admin/chair only) ──────────────────────────────────────

// GET /api/v1/cases/:id/audit
export type ListAuditEventsResponse = ApiResponse<AuditEvent[]>;

// ─── User Endpoints ───────────────────────────────────────────────────────────

// GET /api/v1/users/me
export type GetCurrentUserResponse = ApiResponse<User>;

// GET /api/v1/users — Committee member list (committee only)
export type ListUsersResponse = ApiResponse<User[]>;

// ─── Committee Member Endpoints ───────────────────────────────────────────────

// POST /api/v1/committee/members — Add committee member (chair/admin only)
export interface AddCommitteeMemberRequest {
  email: string;
  role: import("@safespace/types").UserRole;
  firstName: string;
  lastName: string;
  department?: string;
}
export type AddCommitteeMemberResponse = ApiResponse<User>;

// ─── Representation Endpoints ─────────────────────────────────────────────────

// POST /api/v1/cases/:id/representation — Request a representative
export interface RequestRepresentationRequest {
  representativeType: import("@safespace/types").RepresentativeType;
  representativeName: string;
  representativeEmail: string;
  representativeAffiliation?: string;
}
export type RequestRepresentationResponse = ApiResponse<
  import("@safespace/types").CaseParticipant
>;

// PATCH /api/v1/cases/:id/representation/:participantId/approve (committee only)
export type ApproveRepresentationResponse = ApiResponse<{ approvedAt: string }>;
