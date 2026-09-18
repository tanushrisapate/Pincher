import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request) {
  let requestBody;
  try {
    requestBody = await request.json();
  } catch {
    return NextResponse.json(
      { detail: "A valid JSON recommendation request is required." },
      { status: 400, headers: { "Cache-Control": "private, no-store" } }
    );
  }

  const backendBaseUrl = (process.env.PINCHER_API_URL || "http://localhost:8000").replace(/\/+$/, "");
  const backendUrl = new URL("/api/outfits/recommend", backendBaseUrl);

  try {
    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      cache: "no-store",
      signal: AbortSignal.timeout(20_000),
    });
    const payload = await response.json().catch(() => null);

    return NextResponse.json(payload || { detail: "The recommendation service returned an invalid response." }, {
      status: response.status,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { detail: "The recommendation service could not be reached." },
      { status: 502, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}
