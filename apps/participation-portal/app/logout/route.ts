import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3104";
const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3105";
const SESSION_COOKIE = "safespace_pp_session";

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  // Tell the backend to invalidate the session server-side
  if (sessionId) {
    try {
      await fetch(`${BACKEND_URL}/api/v1/auth/session/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
    } catch {
      // Continue regardless
    }
  }

  // Destroy the auth app iron-session cookie so the login page doesn't auto-redirect back
  try {
    await fetch(`${AUTH_APP_URL}/api/auth/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    // Continue regardless
  }

  // Clear the portal session cookie and redirect to auth app login
  const response = NextResponse.redirect(new URL("/login", AUTH_APP_URL), { status: 302 });
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.HTTPS_ENABLED === "true",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}
