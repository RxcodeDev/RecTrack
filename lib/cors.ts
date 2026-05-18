import { NextRequest, NextResponse } from "next/server";

/**
 * Reads ADMIN_PANEL_ORIGIN env var (comma-separated list of allowed origins).
 * Falls back to "*" if not set — restrict this in production.
 *
 * Example .env.local:
 *   ADMIN_PANEL_ORIGIN=https://panel.tu-dominio.com,https://localhost:3001
 */
function getAllowedOrigins(): string[] {
  const raw = process.env.ADMIN_PANEL_ORIGIN ?? "*";
  if (raw === "*") return ["*"];
  return raw.split(",").map((o) => o.trim()).filter(Boolean);
}

function resolveOrigin(requestOrigin: string | null): string {
  const allowed = getAllowedOrigins();
  if (allowed.includes("*")) return "*";
  if (requestOrigin && allowed.includes(requestOrigin)) return requestOrigin;
  // Return the first allowed origin as fallback (browser will reject mismatched origins anyway)
  return allowed[0] ?? "*";
}

export function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = req.headers.get("origin");
  const resolved = resolveOrigin(origin);

  return {
    "Access-Control-Allow-Origin": resolved,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    // Only set Allow-Credentials when not using wildcard origin
    ...(resolved !== "*" && { "Access-Control-Allow-Credentials": "true" }),
    "Access-Control-Max-Age": "86400",
  };
}

/** Returns a 204 preflight response with CORS headers. */
export function handlePreflight(req: NextRequest): NextResponse {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(req),
  });
}

/** Wraps an existing NextResponse to add CORS headers. */
export function withCors(res: NextResponse, req: NextRequest): NextResponse {
  const headers = corsHeaders(req);
  Object.entries(headers).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}
