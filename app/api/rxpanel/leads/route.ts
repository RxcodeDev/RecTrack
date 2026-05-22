import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { corsHeaders, handlePreflight } from "@/lib/cors";

const DB_PATH = path.join(process.cwd(), "data", "submissions.json");

export async function OPTIONS(req: NextRequest) {
  return handlePreflight(req);
}

export async function GET(req: NextRequest) {
  const cors = corsHeaders(req);
  try {
    const raw = await fs.readFile(DB_PATH, "utf-8");
    const submissions = JSON.parse(raw) as unknown[];
    // Return newest first
    return NextResponse.json([...submissions].reverse(), { headers: cors });
  } catch {
    return NextResponse.json([], { headers: cors });
  }
}
