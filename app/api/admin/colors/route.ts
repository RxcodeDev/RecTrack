import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { corsHeaders, handlePreflight } from "@/lib/cors";

const COLORS_PATH = path.join(process.cwd(), "data", "site-colors.json");

async function readColors() {
  const raw = await fs.readFile(COLORS_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeColors(data: Record<string, string>) {
  await fs.writeFile(COLORS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req);
  try {
    return NextResponse.json(await readColors(), { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo leer los colores." }, { status: 500, headers: cors });
  }
}

export async function PUT(req: NextRequest) {
  const cors = corsHeaders(req);
  try {
    const body = await req.json();
    await writeColors(body);
    return NextResponse.json({ ok: true }, { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar los colores." }, { status: 500, headers: cors });
  }
}
