import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3105";
const SESSION_COOKIE = "safespace_pp_session";
const IS_PROD = process.env.NODE_ENV === "production";

/** Fetch the current access token stored in Redis for this session. */
async function getAccessToken(sessionId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/auth/session/${sessionId}/token`,
      { cache: "no-store" }
    );
    if (!res.ok) return null;
    const { accessToken } = await res.json();
    return accessToken ?? null;
  } catch {
    return null;
  }
}

/**
 * Ask the backend to rotate tokens for this session (using the stored refresh
 * token). Returns a fresh access token, or null if the session has truly
 * expired (refresh token gone / revoked).
 */
async function refreshSession(sessionId: string): Promise<string | null> {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/auth/session/refresh`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
        cache: "no-store",
      }
    );
    if (!res.ok) return null;
    // New tokens are stored back under the same sessionId in Redis.
    // Re-fetch the updated access token.
    return await getAccessToken(sessionId);
  } catch {
    return null;
  }
}

/** Returns true when the JSON body signals a token-expired error. */
function isTokenExpiredBody(body: string): boolean {
  try {
    const json = JSON.parse(body);
    const code = json?.error?.code ?? json?.code ?? "";
    return code === "TOKEN_EXPIRED";
  } catch {
    return false;
  }
}

async function forwardRequest(req: NextRequest, path: string): Promise<NextResponse> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    const r = NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "No session" } },
      { status: 401 }
    );
    r.headers.set("X-Auth-Expired", "true");
    return r;
  }

  let accessToken = await getAccessToken(sessionId);
  if (!accessToken) {
    const r = NextResponse.json(
      { error: { code: "UNAUTHORIZED", message: "Session expired or invalid" } },
      { status: 401 }
    );
    r.headers.set("X-Auth-Expired", "true");
    r.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
    return r;
  }

  const url = new URL(`/api/v1/${path}`, BACKEND_URL);
  req.nextUrl.searchParams.forEach((value, key) => url.searchParams.set(key, value));

  // Read body once — streams cannot be consumed twice
  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();

  async function callBackend(token: string): Promise<Response> {
    return fetch(url.toString(), {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body,
      cache: "no-store",
    });
  }

  let backendRes = await callBackend(accessToken);
  let responseBody = await backendRes.text();

  // If the JWT is expired, transparently refresh and retry once.
  if (backendRes.status === 401 && isTokenExpiredBody(responseBody)) {
    const freshToken = await refreshSession(sessionId);
    if (!freshToken) {
      // Refresh token also gone — real expiry, force logout
      const r = NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Session expired" } },
        { status: 401 }
      );
      r.headers.set("X-Auth-Expired", "true");
      r.cookies.set(SESSION_COOKIE, "", {
        maxAge: 0,
        path: "/",
        httpOnly: true,
        secure: IS_PROD,
        sameSite: IS_PROD ? "none" : "lax",
      });
      return r;
    }
    // Retry with fresh token
    backendRes = await callBackend(freshToken);
    responseBody = await backendRes.text();
  }

  return new NextResponse(responseBody, {
    status: backendRes.status,
    headers: {
      "Content-Type": backendRes.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forwardRequest(req, path.join("/"));
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forwardRequest(req, path.join("/"));
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forwardRequest(req, path.join("/"));
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forwardRequest(req, path.join("/"));
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  return forwardRequest(req, path.join("/"));
}
