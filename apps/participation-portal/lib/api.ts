import type { Case, CaseSummary, Notification } from "@safespace/types";
export type { Case, CaseSummary, Notification };

// All authenticated requests go through the portal's own proxy route
// so the Next.js server-side handler can attach the Bearer token from the session cookie.
const API_BASE =
  typeof window === "undefined"
    ? (process.env.BACKEND_URL ?? "http://localhost:3105") + "/api/v1"
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

// ─── Session API ─────────────────────────────────────────────────────────────

export interface SessionData {
  userId: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  expiresAt: string;
}

export async function fetchSession(sessionId: string): Promise<SessionData> {
  return apiFetch<SessionData>(`/auth/session/${sessionId}`);
}

// ─── Cases API ───────────────────────────────────────────────────────────────

export async function fetchMyCases(): Promise<CaseSummary[]> {
  const result = await apiFetch<{ data: CaseSummary[] }>("/users/me/cases");
  return result.data;
}

export async function fetchCase(id: string): Promise<Case> {
  return apiFetch<Case>(`/cases/${id}`);
}

// ─── Notifications API ─────────────────────────────────────────────────────

export async function fetchNotifications(params?: {
  unreadOnly?: boolean;
  page?: number;
}): Promise<{ data: Notification[]; meta: { total: number; hasMore: boolean } }> {
  const searchParams = new URLSearchParams();
  if (params?.unreadOnly) searchParams.set("unreadOnly", "true");
  if (params?.page) searchParams.set("page", params.page.toString());
  
  return apiFetch<{ data: Notification[]; meta: { total: number; hasMore: boolean } }>(
    `/notifications?${searchParams.toString()}`
  );
}

export async function markNotificationRead(id: string): Promise<void> {
  await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
}

export async function markAllNotificationsRead(): Promise<void> {
  await apiFetch("/notifications/read-all", { method: "PATCH" });
}

// ─── Hearings API ────────────────────────────────────────────────────────────

export interface HearingItem {
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

export async function fetchCaseHearings(caseId: string): Promise<HearingItem[]> {
  const result = await apiFetch<{ data: HearingItem[] }>(`/cases/${caseId}/hearings`);
  return result.data;
}

// ─── Respondent Response ─────────────────────────────────────────────────────

export async function submitRespondentResponse(caseId: string, responseText: string): Promise<void> {
  await apiFetch(`/cases/${caseId}/respond`, {
    method: "POST",
    body: JSON.stringify({ responseText }),
  });
}

// ─── Evidence API ────────────────────────────────────────────────────────────

export async function requestUploadUrl(params: {
  caseId: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  type: string;
  description: string;
  evidenceDate?: string;
}): Promise<{ uploadUrl: string; storageKey: string }> {
  const { caseId, ...body } = params;
  return apiFetch(`/cases/${caseId}/evidence/upload-url`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function confirmUpload(
  caseId: string,
  evidenceId: string,
): Promise<void> {
  await apiFetch(`/cases/${caseId}/evidence/${evidenceId}/confirm`, {
    method: "POST",
  });
}

export async function fetchCaseEvidence(caseId: string): Promise<unknown[]> {
  const result = await apiFetch<{ data: unknown[] }>(`/cases/${caseId}/evidence`);
  return result.data;
}
