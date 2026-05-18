import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent, SiteContent } from "@/lib/content";
import { corsHeaders, handlePreflight } from "@/lib/cors";
import { revalidatePath } from "next/cache";

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req);
  try {
    const content = await readContent();
    return NextResponse.json(content, { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo leer el contenido." }, { status: 500, headers: cors });
  }
}

export async function PUT(req: NextRequest) {
  const cors = corsHeaders(req);
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
  try {
    const { section, data } = await req.json() as { section: keyof SiteContent; data: unknown };
    const content = await readContent();
    (content as Record<string, unknown>)[section] = {
      ...(content as Record<string, unknown>)[section] as object,
      ...(data as object),
    };
    await writeContent(content);
    revalidatePath("/");
    return NextResponse.json({ ok: true }, { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo actualizar la sección." }, { status: 500, headers: cors });
  }
}
