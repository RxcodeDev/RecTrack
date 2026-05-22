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
    const { name, email, lada, phone, state, budget, budgetOther, services } = body as {
      name?: string;
      email?: string;
      lada?: string;
      phone?: string;
      state?: string;
      budget?: string;
      budgetOther?: string;
      services?: string[];
    };

    // Server-side validation
    if (!name?.trim() || !email?.trim() || !phone?.trim()) {
      return NextResponse.json({ error: "Campos requeridos faltantes." }, { status: 400 });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (phoneDigits.length !== 10) {
      return NextResponse.json({ error: "Teléfono inválido." }, { status: 400 });
    }

    // Save to local JSON file
    const entry = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      name: name.trim(),
      email: email.trim(),
      phone: `${lada ?? "+52"} ${phone.trim()}`,
      state: state?.trim() || null,
      budget: budget?.trim() || null,
      budgetOther: budgetOther?.trim() || null,
      services: services ?? [],
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
