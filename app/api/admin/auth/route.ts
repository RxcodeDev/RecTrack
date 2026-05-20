import { NextRequest, NextResponse } from "next/server";
import { checkPassword, createToken, setSessionCookie, clearSessionCookie } from "@/lib/auth";
import { corsHeaders, handlePreflight } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function POST(req: NextRequest) {
  const cors = corsHeaders(req);

  try {
    const { password, action } = await req.json() as { password?: string; action?: string };

    if (action === "logout") {
      const res = NextResponse.json({ ok: true }, { headers: cors });
      clearSessionCookie(res);
      return res;
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json({ error: "Contraseña requerida." }, { status: 400, headers: cors });
    }

    if (!await checkPassword(password)) {
      await new Promise((r) => setTimeout(r, 400));
      return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401, headers: cors });
    }

    const token = await createToken();

    const res = NextResponse.json({ ok: true, token }, { headers: cors });
    setSessionCookie(res, token);
    return res;
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400, headers: cors });
  }
}
