import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticatedRequest } from "./lib/auth";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow preflight requests through so CORS headers can be set by route handlers
  if (req.method === "OPTIONS") return NextResponse.next();

  // ── Protect /api/admin/* (except the auth endpoint itself) ─────────────────
  if (pathname.startsWith("/api/admin/") && pathname !== "/api/admin/auth") {
    if (!isAuthenticatedRequest(req)) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
  }

  // ── Protect /admin/* pages (if any) — redirect to login ───────────────────
  if (pathname.startsWith("/admin/")) {
    if (!isAuthenticatedRequest(req)) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/admin";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
