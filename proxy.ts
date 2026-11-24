import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Lightweight request guard for a static portfolio (Next.js 16+ `proxy` convention):
 * - No admin/API routes exist today; this blocks accidental exposure of
 *   common sensitive path probes and strips debug query flags in production.
 */
const BLOCKED_PATH_PREFIXES = [
  "/.env",
  "/.git",
  "/node_modules",
  "/server-only",
  "/api/admin",
  "/admin",
  "/_internal",
];

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  if (
    BLOCKED_PATH_PREFIXES.some(
      (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
    )
  ) {
    return new NextResponse(null, { status: 404 });
  }

  // Ignore client-supplied debug toggles in production builds
  if (process.env.NODE_ENV === "production") {
    const debugKeys = ["debug", "dev", "__nextDev"];
    if (debugKeys.some((key) => searchParams.has(key))) {
      const cleanUrl = request.nextUrl.clone();
      debugKeys.forEach((key) => cleanUrl.searchParams.delete(key));
      return NextResponse.redirect(cleanUrl, 308);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all paths except static assets Next serves efficiently.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
