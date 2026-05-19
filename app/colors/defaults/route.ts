import { NextRequest, NextResponse } from "next/server";
import { DEFAULT_COLORS } from "@/lib/theme";
import { corsHeaders, handlePreflight } from "@/lib/cors";
import { requireAuth } from "@/lib/guard";

// Contrato Rxpanel: GET /colors/defaults → paleta base (identidad original).
// Útil para "revertir al tema base" sin duplicar valores en el panel.

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;
  return NextResponse.json(DEFAULT_COLORS, { headers: cors });
}
