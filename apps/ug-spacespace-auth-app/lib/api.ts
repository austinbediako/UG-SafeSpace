const API_BASE = process.env.BACKEND_URL ?? "http://localhost:3105";

interface ApiResponse<T = unknown> {
  data?: T;
  error?: { code: string; message: string };
}

async function backendFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}/api/v1${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? {}),
    },
  });

  const body = (await res.json()) as ApiResponse<T>;

  if (!res.ok) {
    console.error(`backendFetch error for ${path}: ${res.status} ${res.statusText}`, body);
    const msg = body.error?.message ?? `Request failed: ${res.status}`;
    throw new Error(msg);
  }

  return body as T;
}

// ─── Auth API Calls ───────────────────────────────────────────────────────────

export interface LoginResult {
  sessionId: string;
  session: {
    userId: string;
    role: string;
    email: string;
    firstName: string;
    lastName: string;
    expiresAt: string;
  };
}

export interface RegisterResult {
  sessionId: string;
  session: {
    userId: string;
    role: string;
    email: string;
    firstName: string;
    lastName: string;
    expiresAt: string;
  };
  user: { id: string; email: string };
}

export async function apiLogin(identifier: string, pin: string): Promise<LoginResult> {
  return backendFetch<LoginResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ identifier, pin }),
  });
}

export async function apiRegister(payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  affiliation: string;
  studentId?: string;
  staffId?: string;
}): Promise<RegisterResult> {
  return backendFetch<RegisterResult>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/** Token-less logout via server-side sessionId */
export async function apiLogout(sessionId: string): Promise<void> {
  await backendFetch("/auth/session/logout", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}

/** Rotate session server-side, returns new sessionId */
export async function apiRefreshSession(sessionId: string): Promise<LoginResult> {
  return backendFetch<LoginResult>("/auth/session/refresh", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });
}

export async function apiForgotPassword(email: string): Promise<void> {
  await backendFetch("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}

export async function apiResetPassword(token: string, newPassword: string): Promise<void> {
  await backendFetch("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ token, newPassword }),
  });
}
