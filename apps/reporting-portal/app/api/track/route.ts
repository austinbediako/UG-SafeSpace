import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:3105";

export async function POST(req: NextRequest) {
  let body: { trackingToken?: string };
  
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  if (!body.trackingToken) {
    return NextResponse.json(
      { error: "Tracking token is required" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/cases/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ trackingToken: body.trackingToken }),
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { error: "Invalid or expired tracking token" },
          { status: 404 }
        );
      }
      const error = await res.text();
      return NextResponse.json(
        { error: error || "Failed to track case" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[track/route] Backend error:", err);
    return NextResponse.json(
      { error: "Unable to reach the tracking service. Please try again later." },
      { status: 502 }
    );
  }
}
