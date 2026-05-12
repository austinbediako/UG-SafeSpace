import { NextRequest, NextResponse } from "next/server";
import { apiResetPassword } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Token and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    await apiResetPassword(token, newPassword);
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Reset failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
