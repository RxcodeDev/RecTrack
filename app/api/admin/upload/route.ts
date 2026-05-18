import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { corsHeaders, handlePreflight } from "@/lib/cors";

// Allowed MIME types
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req);
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "uploads";

    if (!file) {
      return NextResponse.json({ error: "No se recibió ningún archivo." }, { status: 400, headers: cors });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de archivo no permitido." }, { status: 400, headers: cors });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "El archivo supera el límite de 5 MB." }, { status: 400, headers: cors });
    }

    // Sanitize filename — allow only alphanumeric, dots, dashes, underscores, spaces
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_ ]/g, "_");
    const destDir = path.join(process.cwd(), "public", folder);

    // Ensure directory exists
    await fs.mkdir(destDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await fs.writeFile(path.join(destDir, safeName), buffer);

    return NextResponse.json({ url: `/${folder}/${safeName}` }, { headers: cors });
  } catch {
    return NextResponse.json({ error: "Error al subir el archivo." }, { status: 500, headers: cors });
  }
}
