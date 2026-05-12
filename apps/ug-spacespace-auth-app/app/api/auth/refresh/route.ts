import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { apiRefreshSession } from "@/lib/api";

export async function POST() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.sessionId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const result = await apiRefreshSession(session.sessionId);

    session.sessionId = result.sessionId;
    session.role = result.session.role;
    session.firstName = result.session.firstName;
    session.lastName = result.session.lastName;
    session.email = result.session.email;
    session.userId = result.session.userId;
    await session.save();

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Session refresh failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
