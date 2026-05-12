import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3105";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/api/v1/cases/complaints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (err) {
    console.error("[complaints/route] Backend unreachable:", err);
    return NextResponse.json(
      { error: "Unable to reach the submission service. Please try again." },
      { status: 502 }
    );
  }

  const data = await res.json().catch(() => ({ error: "Empty response from server" }));

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  return NextResponse.json(data, { status: 201 });
}
