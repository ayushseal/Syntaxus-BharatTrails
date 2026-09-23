import { NextResponse } from "next/server";
import { calculateHeritageExposure, getHeritageSiteRisk } from "@/lib/geoshield/heritageExposureEngine";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get("siteId");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    if (siteId && lat && lng) {
      const siteRisk = await getHeritageSiteRisk(siteId, parseFloat(lat), parseFloat(lng));
      return NextResponse.json({ success: true, site_risk: siteRisk });
    }

    const summary = await calculateHeritageExposure();
    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    console.error("[API Heritage Exposure] Error calculating exposure:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
