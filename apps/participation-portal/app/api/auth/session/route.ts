import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3105";
const AUTH_ORIGIN = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3104";
const SESSION_COOKIE = "safespace_pp_session";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": AUTH_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
  };
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders() });
}

export async function POST(req: NextRequest) {
  const { sessionId } = await req.json();

  const res = await fetch(
    `${BACKEND_URL}/api/v1/auth/session/${sessionId}`
  );
  if (!res.ok) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401, headers: corsHeaders() });
  }

  const data = await res.json();
  const response = NextResponse.json(data, { headers: corsHeaders() });
  response.cookies.set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.HTTPS_ENABLED === "true",
    sameSite: "none",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
  return response;
}
