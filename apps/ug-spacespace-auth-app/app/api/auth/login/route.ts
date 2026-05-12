import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { apiLogin } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { identifier, pin } = await req.json();

    if (!identifier || !pin) {
      return NextResponse.json(
        { error: "ID and PIN are required" },
        { status: 400 }
      );
    }

    const result = await apiLogin(identifier, pin);

    const session = await getSession();
    session.isLoggedIn = true;
    session.userId = result.session.userId;
    session.email = result.session.email;
    session.role = result.session.role;
    session.firstName = result.session.firstName;
    session.lastName = result.session.lastName;
    session.sessionId = result.sessionId;
    await session.save();

    return NextResponse.json({
      role: result.session.role,
      firstName: result.session.firstName,
      sessionId: result.sessionId,
    });
  } catch (err: unknown) {
    console.error("Login API route error:", err);
    const message = err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
