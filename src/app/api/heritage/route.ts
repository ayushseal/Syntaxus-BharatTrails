import { NextResponse } from "next/server";
import { getAllHeritageSites } from "@/lib/repository/heritageRepository";
import { verifyUserToken } from "@/lib/repository/authRepository";
import { query } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || undefined;
    const state = searchParams.get("state") || undefined;
    const region = searchParams.get("region") || undefined;
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;

    const sites = await getAllHeritageSites({ type, state, region, search, category });
    return NextResponse.json({ success: true, count: sites.length, data: sites });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch heritage sites" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Authenticate curator
    const authHeader = request.headers.get("authorization");
    const cookieHeader = request.headers.get("cookie") || "";
    let token = "";
    if (authHeader && authHeader.startsWith("Bearer ")) token = authHeader.substring(7);
    else {
      const match = cookieHeader.match(/syntaxus_curator_token=([^;]+)/);
      if (match) token = match[1];
    }

    const user = token ? verifyUserToken(token) : null;
    if (!user || (user.role !== "ADMIN" && user.role !== "CURATOR")) {
      return NextResponse.json({ error: "Unauthorized. Curator privileges required." }, { status: 403 });
    }

    const body = await request.json();
    const siteId = body.id || `site-${Date.now()}`;
    const slug = body.slug || siteId;

    await query(
      `INSERT INTO heritage_sites (
        id, slug, name_en, name_hi, tagline, site_type, content_status,
        state, district, region, latitude, longitude, altitude, address,
        sect_or_tradition, founded_year, period, steward, asi_code,
        virtual_tour_enabled, hero_image, description_en, description_hi,
        visiting_hours, contact, sacred_access_protocol, nearby_services
      ) VALUES (
        $1, $2, $3, $4, $5, $6, 'PUBLISHED',
        $7, $8, $9, $10, $11, $12, $13,
        $14, $15, $16, $17, $18,
        $19, $20, $21, $22,
        $23, $24, $25, $26
      )
      ON CONFLICT (id) DO UPDATE SET
        name_en = EXCLUDED.name_en,
        description_en = EXCLUDED.description_en,
        hero_image = EXCLUDED.hero_image,
        updated_at = NOW()`,
      [
        siteId,
        slug,
        body.name?.en || body.nameEn || "Heritage Landmark",
        body.name?.hi || body.nameHi || null,
        body.tagline || "",
        body.siteType || "MONASTERY",
        body.state || "India",
        body.district || "District",
        body.region || "Northern Frontiers",
        body.location?.lat || body.latitude || 28.6139,
        body.location?.lng || body.longitude || 77.209,
        body.altitude || "500m",
        body.address || "",
        body.sect || "Ancient Indian Heritage",
        body.founded || "Historical Antiquity",
        body.period || "Ancient / Medieval",
        body.steward || "Archaeological Survey of India",
        body.asiCode || `ASI-${siteId.toUpperCase()}`,
        body.virtualTourEnabled !== false,
        body.heroImage || "/images/monasteries/rumtek.png",
        body.description?.en || body.description || "",
        body.description?.hi || "",
        JSON.stringify(body.visitingHours || { open: "06:00", close: "18:00" }),
        JSON.stringify(body.contact || {}),
        JSON.stringify(body.sacredAccessProtocol || { photographyAllowed: "permitted", interiorAccess: "open", currentStatus: "open" }),
        JSON.stringify(body.nearbyServices || []),
      ]
    );

    // Record audit log
    await query(
      `INSERT INTO audit_logs (id, user_id, actor, action, target_type, target_id, notes)
       VALUES ($1, $2, $3, 'CREATE_HERITAGE_SITE', 'HERITAGE_SITE', $4, $5)`,
      [
        `audit-${Date.now()}`,
        user.id,
        user.fullName,
        siteId,
        `Created/Imported new heritage site: ${body.name?.en || siteId}`,
      ]
    );

    return NextResponse.json({ success: true, message: "Site imported and saved to PostgreSQL", siteId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create site" }, { status: 500 });
  }
}
