import { NextResponse } from "next/server";
import { providerRegistry } from "@/lib/geoshield/providerRegistry";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = parseFloat(searchParams.get("lat") || "30.5564");
    const lng = parseFloat(searchParams.get("lng") || "79.5632");
    const country = searchParams.get("country") || "India";

    const weatherProvider = providerRegistry.getWeatherProvider(country);
    const weather = await weatherProvider.getWeather(lat, lng);

    return NextResponse.json({
      success: true,
      weather,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API Weather] Failed to fetch weather:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
