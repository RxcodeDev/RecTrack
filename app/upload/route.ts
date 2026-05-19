import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { corsHeaders, handlePreflight } from "@/lib/cors";
import { requireAuth } from "@/lib/guard";

// Contrato estándar Rxpanel: POST /upload (multipart, campo "file").
// Guarda en public/uploads y devuelve { path } servible por el sitio.

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/ogg"];
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req);
  const unauth = requireAuth(req);
  if (unauth) return unauth;

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No se recibió archivo." }, { status: 400, headers: cors });
    }
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

    if (!isImage && !isVideo) {
      return NextResponse.json({ error: "Tipo de archivo no permitido." }, { status: 400, headers: cors });
    }

    const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
    if (file.size > maxBytes) {
      return NextResponse.json(
        { error: isVideo ? "El video supera 100 MB." : "La imagen supera 10 MB." },
        { status: 400, headers: cors }
      );
    }

    const base = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const safeName = `${Date.now()}-${base}`;
    const destDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(destDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(path.join(destDir, safeName), buffer);

    return NextResponse.json({ path: `/uploads/${safeName}` }, { headers: cors });
  } catch {
    return NextResponse.json({ error: "Error al subir el archivo." }, { status: 500, headers: cors });
  }
}
