import type { Case, CaseSummary, Notification } from "@safespace/types";
import { CaseStage } from "@safespace/types";

const API_BASE =
  typeof window === "undefined"
    ? `${process.env.NEXT_PUBLIC_COMMITTEE_URL ?? "http://localhost:3102"}/api/backend`
    : "/api/backend";

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface SessionInfo {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  expiresAt: string;
}

export async function fetchSession(sessionId: string): Promise<SessionInfo> {
  return apiFetch<SessionInfo>(`/auth/session/${sessionId}`);
}

// ─── Cases ───────────────────────────────────────────────────────────────────

export async function fetchCases(params?: {
  stage?: string;
  status?: string;
  assignedToMe?: boolean;
  page?: number;
}): Promise<CaseSummary[]> {
  const q = new URLSearchParams();
  if (params?.stage) q.set("stage", params.stage);
  if (params?.status) q.set("status", params.status);
  if (params?.assignedToMe) q.set("assignedToMe", "true");
  if (params?.page) q.set("page", String(params.page));
  const result = await apiFetch<{ data: CaseSummary[] }>(`/cases?${q}`);
  return result.data;
}

export async function fetchCase(id: string): Promise<Case> {
  return apiFetch<Case>(`/cases/${id}`);
}

export async function fetchComplaints(): Promise<CaseSummary[]> {
  const result = await apiFetch<{ data: CaseSummary[] }>("/cases/complaints");
  return result.data;
}

export async function acknowledgeComplaint(id: string): Promise<void> {
  await apiFetch(`/cases/complaints/${id}/acknowledge`, { method: "POST" });
}

export async function rejectComplaint(id: string, reason: string): Promise<void> {
  await apiFetch(`/cases/complaints/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ reason }),
  });
}

export async function advanceStage(id: string, toStage: CaseStage, reason?: string): Promise<void> {
  await apiFetch(`/cases/${id}/transition`, {
    method: "POST",
    body: JSON.stringify({ toStage, reason }),
  });
}

export async function assignInvestigator(caseId: string, investigatorUserId: string): Promise<void> {
  await apiFetch(`/cases/${caseId}/assign-investigator`, {
    method: "POST",
    body: JSON.stringify({ investigatorUserId }),
  });
}

// ─── Hearings ─────────────────────────────────────────────────────────────────

export interface HearingListItem {
  id: string;
  caseId: string;
  type: string;
  status: string;
  scheduledAt: string;
  venue: string;
  isVirtual: boolean;
  virtualLink?: string;
  panelChairId: string;
  panelMemberIds: string[];
  outcome?: string;
  createdAt: string;
}

export async function fetchCaseHearings(caseId: string): Promise<HearingListItem[]> {
  const result = await apiFetch<{ data: HearingListItem[] }>(`/cases/${caseId}/hearings`);
  return result.data;
}

export async function scheduleHearing(caseId: string, data: {
  type: "PRELIMINARY" | "FULL_HEARING" | "APPEAL_HEARING";
  scheduledAt: string;
  venue: string;
  isVirtual: boolean;
  virtualLink?: string;
  panelChairId: string;
  panelMemberIds: string[];
}): Promise<HearingListItem> {
  return apiFetch<HearingListItem>(`/cases/${caseId}/hearings`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ─── Users / Committee Members ───────────────────────────────────────────────

export interface UserSummary {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  systemRole: string;
  department?: string;
  affiliation?: string;
}

export async function fetchCommitteeMembers(): Promise<UserSummary[]> {
  const result = await apiFetch<{ data: UserSummary[] }>("/users/committee");
  return result.data;
}

export async function fetchInvestigators(): Promise<UserSummary[]> {
  const result = await apiFetch<{ data: UserSummary[] }>("/users/investigators");
  return result.data;
}

export async function fetchCurrentUser(): Promise<UserSummary & {
  caseParticipations: Array<{ caseId: string; role: string }>;
}> {
  const result = await apiFetch<{ data: UserSummary & { caseParticipations: Array<{ caseId: string; role: string }> } }>("/users/me");
  return result.data;
}

// ─── Notifications ────────────────────────────────────────────────────────────

export async function fetchNotifications(params?: {
  unreadOnly?: boolean;
  page?: number;
}): Promise<{ data: Notification[]; meta: { total: number; hasMore: boolean } }> {
  const q = new URLSearchParams();
  if (params?.unreadOnly) q.set("unreadOnly", "true");
  if (params?.page) q.set("page", String(params.page));
  return apiFetch<{ data: Notification[]; meta: { total: number; hasMore: boolean } }>(
    `/notifications?${q}`
  );
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch("/notifications/read-all", { method: "PATCH" });
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export interface DashboardStats {
  activeCases: number;
  awaitingAcknowledgment: number;
  inInvestigation: number;
  deadlineAlerts: number;
}

export async function fetchDashboardStats(): Promise<DashboardStats> {
  const [all] = await Promise.all([fetchCases()]);
  return {
    activeCases: all.filter((c) => c.status !== "CLOSED" && c.status !== "WITHDRAWN").length,
    awaitingAcknowledgment: all.filter((c) => c.stage === CaseStage.ACKNOWLEDGMENT).length,
    inInvestigation: all.filter((c) => c.stage === CaseStage.INVESTIGATION).length,
    deadlineAlerts: all.filter((c) => c.nextDeadline && c.nextDeadline.workingDaysRemaining <= 3).length,
  };
}
