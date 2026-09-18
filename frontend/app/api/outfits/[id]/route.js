import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function forward(request, id, suffix = "") {
  const base = (process.env.PINCHER_API_URL || "http://localhost:8000").replace(/\/+$/, "");
  const response = await fetch(new URL(`/api/outfits/${id}${suffix}`, base), {
    method: request.method,
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  const payload = await response.json().catch(() => null);
  return NextResponse.json(payload || { success: false }, { status: response.status });
}

export async function DELETE(request, { params }) {
  try {
    return await forward(request, (await params).id);
  } catch {
    return NextResponse.json({ success: false }, { status: 502 });
  }
}

export async function PATCH(request, { params }) {
  try {
    return await forward(request, (await params).id, "/favorite");
  } catch {
    return NextResponse.json({ success: false }, { status: 502 });
  }
}
