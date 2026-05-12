import { NextRequest, NextResponse } from "next/server";
import { apiForgotPassword } from "@/lib/api";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    await apiForgotPassword(email);
    // Always return success to prevent email enumeration
    return NextResponse.json({ success: true });
  } catch {
    // Return success even on error to prevent email enumeration
    return NextResponse.json({ success: true });
  }
}
