import { NextRequest, NextResponse } from "next/server";
import { readContent, writeContent, SiteContent } from "@/lib/content";
import { corsHeaders, handlePreflight } from "@/lib/cors";
import { requireAuth } from "@/lib/guard";
import { revalidatePath } from "next/cache";

// Contrato estándar consumido por el proxy de Rxpanel:
//   GET    /content/:section
//   PUT    /content/:section   (body = nuevo valor de la sección)
//   DELETE /content/:section

const VALID_SECTIONS: (keyof SiteContent)[] = [
  "meta",
  "navbar",
  "hero",
  "clients",
  "services",
  "stats",
  "portfolio",
  "testimonials",
  "contact",
  "footer",
];

function isValid(section: string): section is keyof SiteContent {
  return (VALID_SECTIONS as string[]).includes(section);
}

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ section: string }> },
) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  const { section } = await ctx.params;
  if (!isValid(section)) {
    return NextResponse.json({ error: "Sección desconocida." }, { status: 404, headers: cors });
  }

  try {
    const content = await readContent();
    return NextResponse.json(content[section], { headers: cors });
  } catch {
    return NextResponse.json(
      { error: "No se pudo leer el contenido." },
      { status: 500, headers: cors },
    );
  }
}

export async function PUT(
  req: NextRequest,
  ctx: { params: Promise<{ section: string }> },
) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  const { section } = await ctx.params;
  if (!isValid(section)) {
    return NextResponse.json({ error: "Sección desconocida." }, { status: 404, headers: cors });
  }

  try {
    const body = (await req.json()) as SiteContent[keyof SiteContent];
    const content = await readContent();
    const next = { ...content, [section]: body } as SiteContent;
    await writeContent(next);
    revalidatePath("/");
    return NextResponse.json(next[section], { headers: cors });
  } catch {
    return NextResponse.json(
      { error: "No se pudo guardar la sección." },
      { status: 500, headers: cors },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ section: string }> },
) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  const { section } = await ctx.params;
  if (!isValid(section)) {
    return NextResponse.json({ error: "Sección desconocida." }, { status: 404, headers: cors });
  }

  try {
    const content = await readContent();
    const { [section]: _omit, ...rest } = content;
    void _omit;
    await writeContent(rest as SiteContent);
    revalidatePath("/");
    return new NextResponse(null, { status: 204, headers: cors });
  } catch {
    return NextResponse.json(
      { error: "No se pudo eliminar la sección." },
      { status: 500, headers: cors },
    );
  }
}
