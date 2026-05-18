import { createHmac, timingSafeEqual } from "crypto";
import { NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

function getSecret(): string {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error("ADMIN_SECRET env var is not set.");
  return s;
}

function getPassword(): string {
  const p = process.env.ADMIN_PASSWORD;
  if (!p) throw new Error("ADMIN_PASSWORD env var is not set.");
  return p;
}

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("hex");
}

/** Creates a signed token. Returns the raw token string. */
export function createToken(): string {
  const payload = `admin:${Date.now()}`;
  const sig = sign(payload);
  return Buffer.from(`${payload}.${sig}`).toString("base64url");
}

/** Verifies a token signature. Returns true if valid. */
export function verifyToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = decoded.slice(0, lastDot);
    const sig = decoded.slice(lastDot + 1);
    const expected = sign(payload);
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Compare submitted password against the env var (constant-time). */
export function checkPassword(submitted: string): boolean {
  const pw = getPassword();
  try {
    if (submitted.length !== pw.length) return false;
    const a = Buffer.from(submitted);
    const b = Buffer.from(pw);
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

// ── Cookie helpers (for same-origin / SSR use) ───────────────────────────────

/** Appends a Set-Cookie header with the session token. */
export function setSessionCookie(res: Response, token: string): Response {
  res.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=${SESSION_MAX_AGE}`
  );
  return res;
}

/** Clears the session cookie. */
export function clearSessionCookie(res: Response): Response {
  res.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=0`
  );
  return res;
}

// ── Token extraction ─────────────────────────────────────────────────────────

/** Extracts the Bearer token from the Authorization header. */
function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

/**
 * Checks authentication from a request.
 * Accepts either:
 *   - Cookie: admin_session=<token>   (same-origin / server-rendered)
 *   - Authorization: Bearer <token>  (external panel / cross-origin)
 */
export function isAuthenticatedRequest(req: NextRequest): boolean {
  // 1. Try Bearer token (external panel)
  const bearer = extractBearerToken(req);
  if (bearer) return verifyToken(bearer);

  // 2. Fall back to cookie (same-origin)
  const cookieToken = req.cookies.get(SESSION_COOKIE)?.value;
  if (cookieToken) return verifyToken(cookieToken);

  return false;
}
