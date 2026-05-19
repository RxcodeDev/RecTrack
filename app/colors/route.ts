import { NextRequest, NextResponse } from "next/server";
import { readTheme, patchColors, SiteColors } from "@/lib/theme";
import { corsHeaders, handlePreflight } from "@/lib/cors";
import { requireAuth } from "@/lib/guard";

// Contrato estándar Rxpanel: GET/PUT /colors

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  try {
    const { colors } = await readTheme();
    return NextResponse.json(colors, { headers: cors });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron leer los colores." },
      { status: 500, headers: cors },
    );
  }
}

export async function PUT(req: NextRequest) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  try {
    const body = (await req.json()) as Partial<SiteColors>;
    const colors = await patchColors(body);
    return NextResponse.json(colors, { headers: cors });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron guardar los colores." },
      { status: 500, headers: cors },
    );
  }
}
