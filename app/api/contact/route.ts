import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "data", "submissions.json");

async function readSubmissions(): Promise<object[]> {
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, service, message } = body as {
      name?: string;
      email?: string;
      service?: string;
      message?: string;
    };

    // Server-side validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Campos requeridos faltantes." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }

    // Save to local JSON file
    const entry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      service: service?.trim() || null,
      message: message.trim(),
    };

    const submissions = await readSubmissions();
    submissions.push(entry);

    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify(submissions, null, 2), "utf-8");

    console.log(`[contact] Nueva solicitud de ${name} <${email}>`);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact/route]", err);
    return NextResponse.json({ error: "Error al guardar." }, { status: 500 });
  }
}
