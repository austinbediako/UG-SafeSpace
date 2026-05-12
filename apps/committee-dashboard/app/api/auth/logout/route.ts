import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3105";
const SESSION_COOKIE = "safespace_cd_session";

const AUTH_APP_URL = process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3104";

// GET: browser navigation logout — clears cookie and redirects to auth login
export async function GET() {
  const response = NextResponse.redirect(new URL("/login", AUTH_APP_URL));
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
  return response;
}

export async function POST(req: NextRequest) {
  try {
    const { sessionId } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 }
      );
    }

    // Call backend to invalidate session
    await fetch(`${BACKEND_URL}/api/v1/auth/session/logout`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    });

    // Clear the cookie regardless of backend response
    const response = NextResponse.json({ success: true });
    response.cookies.delete(SESSION_COOKIE);

    return response;
  } catch (err) {
    console.error("[logout/route] Error:", err);
    // Still clear the cookie on error
    const response = NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
    response.cookies.delete(SESSION_COOKIE);
    return response;
  }
}
