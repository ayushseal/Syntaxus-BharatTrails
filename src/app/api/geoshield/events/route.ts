import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { DisasterEvent } from "@/lib/geoshield/types";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country");
    const status = searchParams.get("status");
    const severity = searchParams.get("severity");

    let sql = `SELECT * FROM disaster_events WHERE 1=1`;
    const params: any[] = [];

    if (country) {
      params.push(country);
      sql += ` AND country = $${params.length}`;
    }

    if (status) {
      params.push(status);
      sql += ` AND status = $${params.length}`;
    }

    if (severity) {
      params.push(severity);
      sql += ` AND severity = $${params.length}`;
    }

    sql += ` ORDER BY started_at DESC LIMIT 50`;

    const res = await query<DisasterEvent>(sql, params);
    return NextResponse.json({
      success: true,
      events: res?.rows || [],
      count: res?.rowCount || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API Events] Failed to fetch events:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
