import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent, SiteContent } from "@/lib/content";
import { corsHeaders, handlePreflight } from "@/lib/cors";
import { requireAuth } from "@/lib/guard";
import { revalidatePath } from "next/cache";

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;
  try {
    const content = await readContent();
    return NextResponse.json(content, { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo leer el contenido." }, { status: 500, headers: cors });
  }
}

export async function PUT(req: NextRequest) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;
  try {
    const body = await req.json() as SiteContent;
    await writeContent(body);
    revalidatePath("/");
    return NextResponse.json({ ok: true }, { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar el contenido." }, { status: 500, headers: cors });
  }
}

export async function PATCH(req: NextRequest) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;
  try {
    const { section, data } = await req.json() as { section: keyof SiteContent; data: unknown };
    const content = await readContent();
    const merged = {
      ...content,
      [section]: { ...(content[section] as object), ...(data as object) },
    } as SiteContent;
    await writeContent(merged);
    revalidatePath("/");
    return NextResponse.json({ ok: true }, { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar la sección." }, { status: 500, headers: cors });
  }
}
