import { NextResponse } from "next/server";
import { calculateRiskAwareRoute } from "@/lib/geoshield/routeScorer";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { origin, destination } = body;

    if (!origin || !destination || origin.lat == null || origin.lng == null || destination.lat == null || destination.lng == null) {
      return NextResponse.json(
        { success: false, error: "Origin and destination coordinates (lat, lng) are required." },
        { status: 400 }
      );
    }

    const evaluation = await calculateRiskAwareRoute(
      { lat: parseFloat(origin.lat), lng: parseFloat(origin.lng) },
      { lat: parseFloat(destination.lat), lng: parseFloat(destination.lng) }
    );

    return NextResponse.json({
      success: true,
      route: evaluation,
    });
  } catch (error: any) {
    console.error("[API Route] Route evaluation failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
