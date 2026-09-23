import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { SafePoint } from "@/lib/geoshield/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const lat = searchParams.get("lat");
    const lng = searchParams.get("lng");

    let sql = `SELECT * FROM safe_points WHERE 1=1`;
    const params: any[] = [];

    if (country) {
      params.push(country);
      sql += ` AND country = $${params.length}`;
    }

    if (lat && lng) {
      const pLat = parseFloat(lat);
      const pLng = parseFloat(lng);
      sql += ` ORDER BY (latitude - ${pLat})^2 + (longitude - ${pLng})^2 ASC LIMIT 10`;
    } else {
      sql += ` ORDER BY name ASC LIMIT 30`;
    }

    const res = await query<SafePoint>(sql, params);
    const safePoints = (res?.rows || []).map((sp) => ({
      ...sp,
      latitude: parseFloat(sp.latitude as any),
      longitude: parseFloat(sp.longitude as any),
    }));

    return NextResponse.json({
      success: true,
      safe_points: safePoints,
      count: safePoints.length,
    });
  } catch (error: any) {
    console.error("[API Safe Points] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
