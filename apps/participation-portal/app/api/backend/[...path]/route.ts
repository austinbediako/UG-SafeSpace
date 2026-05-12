import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3105";
const SESSION_COOKIE = "safespace_pp_session";

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

  const accessToken = await getAccessToken(sessionId);
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

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  const body = ["GET", "HEAD"].includes(req.method) ? undefined : await req.text();

  const backendRes = await fetch(url.toString(), {
    method: req.method,
    headers,
    body,
    cache: "no-store",
  });

  const responseBody = await backendRes.text();

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
