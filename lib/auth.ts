import type { NextRequest } from "next/server";

const SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 8;

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

async function importKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function uint8ToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function hexToUint8(hex: string): Uint8Array<ArrayBuffer> {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) arr[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return arr;
}

function base64urlEncode(str: string): string {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}

function base64urlDecode(b64url: string): string {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  return atob(b64.padEnd(b64.length + (4 - (b64.length % 4)) % 4, "="));
}

export async function createToken(): Promise<string> {
  const payload = `admin:${Date.now()}`;
  const key = await importKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return base64urlEncode(`${payload}.${uint8ToHex(sig)}`);
}

export async function verifyToken(token: string): Promise<boolean> {
  try {
    const decoded = base64urlDecode(token);
    const lastDot = decoded.lastIndexOf(".");
    if (lastDot === -1) return false;
    const payload = decoded.slice(0, lastDot);
    const sig = decoded.slice(lastDot + 1);
    const key = await importKey();
    return crypto.subtle.verify("HMAC", key, hexToUint8(sig), new TextEncoder().encode(payload));
  } catch {
    return false;
  }
}

export async function checkPassword(submitted: string): Promise<boolean> {
  const pw = getPassword();
  if (submitted.length !== pw.length) return false;
  const a = new TextEncoder().encode(submitted);
  const b = new TextEncoder().encode(pw);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

export function setSessionCookie(res: Response, token: string): Response {
  res.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=${SESSION_MAX_AGE}`
  );
  return res;
}

export function clearSessionCookie(res: Response): Response {
  res.headers.append(
    "Set-Cookie",
    `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=None; Secure; Max-Age=0`
  );
  return res;
}

function extractBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization") ?? req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  return auth.slice(7).trim() || null;
}

export async function isAuthenticatedRequest(req: NextRequest): Promise<boolean> {
  const bearer = extractBearerToken(req);
  if (bearer) return verifyToken(bearer);
  const cookieToken = req.cookies.get(SESSION_COOKIE)?.value;
  if (cookieToken) return verifyToken(cookieToken);
  return false;
}
