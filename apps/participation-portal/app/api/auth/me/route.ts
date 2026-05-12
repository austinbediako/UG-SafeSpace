import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3105";
const SESSION_COOKIE = "safespace_pp_session";

export async function GET(_req: NextRequest) {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionId) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/auth/session/${sessionId}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const session = await res.json();
    return NextResponse.json({ authenticated: true, ...session });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
