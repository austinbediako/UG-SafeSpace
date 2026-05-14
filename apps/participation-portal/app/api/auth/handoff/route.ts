import { NextRequest, NextResponse } from "next/server";

const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3104";
const SESSION_COOKIE = "safespace_pp_session";
const IS_PROD = process.env.NODE_ENV === "production";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sid = url.searchParams.get("sid");

  if (!sid) {
    return NextResponse.redirect(new URL("/login", AUTH_APP_URL));
  }

  // Issue the portal session cookie. The sessionId originated from a validated
  // backend login — no need to re-validate here. The backend proxy route at
  // /api/backend/[...path] validates it on every real API call.
  const destination = new URL("/", req.nextUrl.origin);
  const response = NextResponse.redirect(destination);
  response.cookies.set(SESSION_COOKIE, sid, {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
