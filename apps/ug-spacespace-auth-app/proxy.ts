import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "safespace_sess";

// Routes accessible without authentication
const PUBLIC_PATHS = new Set([
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/api/")) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/favicon")) return true;
  if (/\.(png|jpg|jpeg|svg|ico|webp|woff2?)$/.test(pathname)) return true;
  return false;
}

export function proxy(req: NextRequest) {
  // Let CORS preflights pass — handled by individual route handlers
  if (req.method === "OPTIONS") {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  // Check cookie presence only — decryption happens in API routes, not Edge middleware
  const authed = !!req.cookies.get(SESSION_COOKIE)?.value;

  // Not logged in + accessing protected route
  if (!authed && !isPublic(pathname)) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    if (pathname !== "/") loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
