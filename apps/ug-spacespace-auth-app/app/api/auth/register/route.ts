import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { apiRegister } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { email, password, firstName, lastName, affiliation, studentId, staffId } = body;

    if (!email || !password || !firstName || !lastName || !affiliation) {
      return NextResponse.json(
        { error: "All required fields must be provided" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const result = await apiRegister({ email, password, firstName, lastName, affiliation, studentId, staffId });

    const session = await getSession();
    session.isLoggedIn = true;
    session.userId = result.session.userId;
    session.email = result.session.email;
    session.role = result.session.role;
    session.firstName = result.session.firstName;
    session.lastName = result.session.lastName;
    session.sessionId = result.sessionId;
    await session.save();

    return NextResponse.json({ role: result.session.role, firstName: result.session.firstName }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
