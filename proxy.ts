import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAuthenticatedRequest } from "./lib/auth";

export default async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (req.method === "OPTIONS") return NextResponse.next();

  if (pathname.startsWith("/api/admin/") && pathname !== "/api/admin/auth") {
    if (!await isAuthenticatedRequest(req)) {
      return NextResponse.json({ error: "No autorizado." }, { status: 401 });
    }
  }

  if (pathname.startsWith("/admin/")) {
    if (!await isAuthenticatedRequest(req)) {
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
