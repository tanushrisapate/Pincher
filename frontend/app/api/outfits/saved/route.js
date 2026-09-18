import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const base = (process.env.PINCHER_API_URL || "http://localhost:8000").replace(/\/+$/, "");
    const response = await fetch(new URL("/api/outfits/saved", base), {
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload || { success: false, outfits: [] }, {
      status: response.status,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json({ success: false, outfits: [] }, { status: 502 });
  }
}
