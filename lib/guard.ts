import { NextRequest, NextResponse } from "next/server";
import { isAuthenticatedRequest } from "@/lib/auth";
import { corsHeaders } from "@/lib/cors";

/**
 * Devuelve una respuesta 401 si la petición no está autenticada
 * (Bearer del panel o cookie de sesión), o `null` si puede continuar.
 */
export function requireAuth(req: NextRequest): NextResponse | null {
  if (isAuthenticatedRequest(req)) return null;
  return NextResponse.json(
    { error: "No autorizado." },
    { status: 401, headers: corsHeaders(req) },
  );
}
