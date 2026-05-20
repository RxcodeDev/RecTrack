import { NextRequest, NextResponse } from "next/server";
import { readContent, patchSection, SiteContent } from "@/lib/content";
import { corsHeaders, handlePreflight } from "@/lib/cors";

type Params = { params: Promise<{ section: string }> };

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest, { params }: Params) {
  const cors = corsHeaders(req);
  const { section } = await params;
  try {
    const content = await readContent();
    const key = section as keyof SiteContent;
    if (!(key in content)) {
      return NextResponse.json({ error: `Sección '${section}' no existe.` }, { status: 404, headers: cors });
    }
    return NextResponse.json(content[key], { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo leer el contenido." }, { status: 500, headers: cors });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const cors = corsHeaders(req);
  const { section } = await params;
  try {
    const body = await req.json();
    const key = section as keyof SiteContent;
    const content = await readContent();
    if (!(key in content)) {
      return NextResponse.json({ error: `Sección '${section}' no existe.` }, { status: 404, headers: cors });
    }
    await patchSection(key, body);
    return NextResponse.json({ ok: true }, { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la sección." }, { status: 500, headers: cors });
  }
}
