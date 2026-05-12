/**
 * Typed API client stub for SafeSpace UG.
 *
 * This is NOT an implementation — it is a typed interface that all apps
 * must program against. The concrete implementation (fetch, axios, or
 * React Query integration) lives in each app's lib/api/ directory.
 *
 * When the backend is ready, replace the stub implementations with real
 * HTTP calls. The type contracts here ensure nothing breaks at compile time.
 */

import type {
  ApiResponse,
  SubmitCaseRequest,
  SubmitCaseResponse,
  ListCasesRequest,
  ListCasesResponse,
  GetCaseResponse,
  TransitionStageRequest,
  TransitionStageResponse,
  AssignInvestigatorRequest,
  SubmitResponseRequest,
  RequestEvidenceUploadRequest,
  RequestEvidenceUploadResponse,
  ConfirmEvidenceUploadResponse,
  ListEvidenceResponse,
  GetEvidenceDownloadUrlResponse,
  ListDeadlinesResponse,
  ExtendDeadlineRequest,
  ExtendDeadlineResponse,
  ScheduleHearingRequestBody,
  ScheduleHearingResponseBody,
  ListHearingsResponse,
  RenderDecisionRequest,
  RenderDecisionResponse,
  GetDecisionResponse,
  FileAppealRequest,
  FileAppealResponse,
  GetAppealResponse,
  ListNotificationsRequest,
  ListNotificationsResponse,
  ListActivityResponse,
  ListFormalNoticesResponse,
  GetCurrentUserResponse,
  AnonymousTrackRequest,
  AnonymousTrackResponse,
  LoginRequest,
  LoginResponse,
  RequestRepresentationRequest,
  RequestRepresentationResponse,
} from "./contracts";

// ─── Client Interface ─────────────────────────────────────────────────────────

export interface SafeSpaceApiClient {
  // Auth
  login(req: LoginRequest): Promise<LoginResponse>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<GetCurrentUserResponse>;

  // Anonymous tracking (no auth)
  trackAnonymousCase(req: AnonymousTrackRequest): Promise<AnonymousTrackResponse>;

  // Case submission (no auth)
  submitCase(req: SubmitCaseRequest): Promise<SubmitCaseResponse>;

  // Cases
  listCases(req?: ListCasesRequest): Promise<ListCasesResponse>;
  getCase(caseId: string): Promise<GetCaseResponse>;
  transitionStage(caseId: string, req: TransitionStageRequest): Promise<TransitionStageResponse>;
  assignInvestigator(caseId: string, req: AssignInvestigatorRequest): Promise<ApiResponse<{ assignedAt: string }>>;
  submitResponse(caseId: string, req: SubmitResponseRequest): Promise<ApiResponse<{ submittedAt: string }>>;

  // Evidence
  requestEvidenceUploadUrl(caseId: string, req: RequestEvidenceUploadRequest): Promise<RequestEvidenceUploadResponse>;
  confirmEvidenceUpload(caseId: string, evidenceId: string): Promise<ConfirmEvidenceUploadResponse>;
  listEvidence(caseId: string): Promise<ListEvidenceResponse>;
  getEvidenceDownloadUrl(caseId: string, evidenceId: string): Promise<GetEvidenceDownloadUrlResponse>;

  // Deadlines
  listDeadlines(caseId: string): Promise<ListDeadlinesResponse>;
  extendDeadline(caseId: string, req: ExtendDeadlineRequest): Promise<ExtendDeadlineResponse>;

  // Hearings
  scheduleHearing(caseId: string, req: ScheduleHearingRequestBody): Promise<ScheduleHearingResponseBody>;
  listHearings(caseId: string): Promise<ListHearingsResponse>;

  // Decisions & Appeals
  renderDecision(caseId: string, req: RenderDecisionRequest): Promise<RenderDecisionResponse>;
  getDecision(caseId: string): Promise<GetDecisionResponse>;
  fileAppeal(caseId: string, req: FileAppealRequest): Promise<FileAppealResponse>;
  getAppeal(caseId: string): Promise<GetAppealResponse>;

  // Notifications
  listNotifications(req?: ListNotificationsRequest): Promise<ListNotificationsResponse>;
  markNotificationRead(notificationId: string): Promise<ApiResponse<{ readAt: string }>>;
  markAllNotificationsRead(): Promise<ApiResponse<{ count: number }>>;

  // Activity & Notices
  listActivity(caseId: string): Promise<ListActivityResponse>;
  listFormalNotices(caseId: string): Promise<ListFormalNoticesResponse>;

  // Representation
  requestRepresentation(caseId: string, req: RequestRepresentationRequest): Promise<RequestRepresentationResponse>;
}

// ─── Base URL Resolution ──────────────────────────────────────────────────────
// Each app reads its own API base URL from environment variables.
// Never hardcode these. Never use relative paths for cross-app calls.

export function getApiBaseUrl(): string {
  if (typeof process !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";
  }
  return "http://localhost:4000/api/v1";
}

// ─── Common Headers ───────────────────────────────────────────────────────────

export function buildAuthHeaders(accessToken: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${accessToken}`,
  };
}

export function buildPublicHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json",
  };
}
