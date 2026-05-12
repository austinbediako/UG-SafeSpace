import { NextRequest, NextResponse } from "next/server";

const AUTH_APP_URL =
  process.env.NEXT_PUBLIC_AUTH_URL ?? "http://localhost:3104";
const SESSION_COOKIE = "safespace_pp_session";

const PUBLIC_PREFIXES = ["/api/", "/_next/", "/favicon"];

function isPublic(pathname: string): boolean {
  return PUBLIC_PREFIXES.some((p) => pathname.startsWith(p));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE);
  if (!session?.value) {
    // RSC prefetch requests can't follow cross-origin redirects
    if (request.headers.get("rsc") || request.nextUrl.searchParams.has("_rsc")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const loginUrl = new URL("/login", AUTH_APP_URL);
    loginUrl.searchParams.set("next", request.nextUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
