import { NextRequest, NextResponse } from "next/server";
import { readTheme, patchLogos, SiteLogos } from "@/lib/theme";
import { corsHeaders, handlePreflight } from "@/lib/cors";
import { requireAuth } from "@/lib/guard";

// Contrato estándar Rxpanel: GET/PUT /logos

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  try {
    const { logos } = await readTheme();
    return NextResponse.json(logos, { headers: cors });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron leer los logos." },
      { status: 500, headers: cors },
    );
  }
}

export async function PUT(req: NextRequest) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  try {
    const body = (await req.json()) as Partial<SiteLogos>;
    const logos = await patchLogos(body);
    return NextResponse.json(logos, { headers: cors });
  } catch {
    return NextResponse.json(
      { error: "No se pudieron guardar los logos." },
      { status: 500, headers: cors },
    );
  }
}
