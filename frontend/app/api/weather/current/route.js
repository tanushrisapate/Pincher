import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request) {
  const searchParams = new URL(request.url).searchParams;
  const latitudeText = searchParams.get("lat");
  const longitudeText = searchParams.get("lon");
  const latitude = Number(latitudeText);
  const longitude = Number(longitudeText);

  if (
    latitudeText === null ||
    longitudeText === null ||
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    return NextResponse.json(
      { success: false, error: "Valid latitude and longitude are required." },
      { status: 400, headers: { "Cache-Control": "private, no-store" } }
    );
  }

  const backendBaseUrl = (process.env.PINCHER_API_URL || "http://localhost:8000").replace(/\/+$/, "");
  const backendUrl = new URL("/api/weather/current", backendBaseUrl);
  backendUrl.searchParams.set("lat", String(latitude));
  backendUrl.searchParams.set("lon", String(longitude));

  try {
    const response = await fetch(backendUrl, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    });
    const payload = await response.json().catch(() => null);

    if (response.status === 502) {
      return NextResponse.json(
        { success: false, code: "WEATHER_UNAVAILABLE", error: "Weather service unavailable. Please try again shortly." },
        { status: 502,
          headers: { "Cache-Control": "private, no-store" } }
      );
    }

    if (!response.ok || !payload?.success || !payload?.data) {
      return NextResponse.json(
        { success: false, code: "BACKEND_UNAVAILABLE", error: "Pincher backend unavailable. Check its address and port." },
        { status: 502, headers: { "Cache-Control": "private, no-store" } }
      );
    }

    return NextResponse.json(payload, {
      status: response.status,
      headers: { "Cache-Control": "private, no-store" },
    });
  } catch {
    return NextResponse.json(
      { success: false, code: "BACKEND_UNAVAILABLE", error: "Pincher backend unavailable. Check its address and port." },
      { status: 502, headers: { "Cache-Control": "private, no-store" } }
    );
  }
}
