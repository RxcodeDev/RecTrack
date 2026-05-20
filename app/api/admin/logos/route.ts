import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { corsHeaders, handlePreflight } from "@/lib/cors";

const LOGOS_PATH = path.join(process.cwd(), "data", "site-logos.json");

async function readLogos() {
  const raw = await fs.readFile(LOGOS_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeLogos(data: Record<string, string>) {
  await fs.writeFile(LOGOS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req);
  try {
    return NextResponse.json(await readLogos(), { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo leer los logos." }, { status: 500, headers: cors });
  }
}

export async function PUT(req: NextRequest) {
  const cors = corsHeaders(req);
  try {
    const body = await req.json();
    await writeLogos(body);
    return NextResponse.json({ ok: true }, { headers: cors });
  } catch {
    return NextResponse.json({ error: "No se pudo guardar los logos." }, { status: 500, headers: cors });
  }
}
