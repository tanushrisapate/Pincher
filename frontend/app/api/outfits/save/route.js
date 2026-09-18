import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const backendUrl = () => {
  const base = (process.env.PINCHER_API_URL || "http://localhost:8000").replace(/\/+$/, "");
  return new URL("/api/outfits/save", base);
};

export async function POST(request) {
  try {
    const body = await request.json();
    const response = await fetch(backendUrl(), {
      method: "POST",
      headers: { Accept: "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const payload = await response.json().catch(() => null);
    return NextResponse.json(payload || { detail: "The saved outfit service returned an invalid response." }, {
      status: response.status,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { detail: "The saved outfit service could not be reached." },
      { status: 502, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}
