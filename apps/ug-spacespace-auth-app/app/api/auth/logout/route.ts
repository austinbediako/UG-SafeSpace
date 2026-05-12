import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { apiLogout } from "@/lib/api";

export async function POST() {
  try {
    const session = await getSession();

    if (session.isLoggedIn && session.sessionId) {
      try {
        await apiLogout(session.sessionId);
      } catch {
        // Backend logout is best-effort — destroy session regardless
      }
    }

    session.destroy();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
