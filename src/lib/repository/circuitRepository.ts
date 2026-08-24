import { query } from "@/lib/db";
import { CircuitItem } from "./types";
import fallbackTrails from "@/data/trails.json";

export async function getAllCircuits(): Promise<CircuitItem[]> {
  try {
    const circuitsRes = await query(`SELECT * FROM circuits ORDER BY name ASC`);
    if (circuitsRes && circuitsRes.rows && circuitsRes.rows.length > 0) {
      const circuits: CircuitItem[] = [];

      for (const row of circuitsRes.rows) {
        const stopsRes = await query(
          `SELECT cs.*, hs.name_en as site_name, hs.hero_image, hs.latitude, hs.longitude
           FROM circuit_sites cs
           JOIN heritage_sites hs ON cs.site_id = hs.id
           WHERE cs.circuit_id = $1
           ORDER BY cs.stop_order ASC`,
          [row.id]
        );

        circuits.push({
          id: row.id,
          slug: row.slug || row.id,
          name: row.name,
          tagline: row.tagline,
          region: row.region,
          duration: row.duration,
          distance: row.distance,
          bestSeason: row.best_season,
          difficulty: row.difficulty,
          description: row.description,
          stops: stopsRes?.rows.map((s) => ({
            siteId: s.site_id,
            siteName: s.site_name,
            stopOrder: s.stop_order,
            distanceFromPrev: s.distance_from_prev,
            travelTimeFromPrev: s.travel_time_from_prev,
            recommendedDuration: s.recommended_duration,
            highlight: s.highlight,
            location: { lat: parseFloat(s.latitude), lng: parseFloat(s.longitude) },
            heroImage: s.hero_image,
          })) || [],
        });
      }

      return circuits;
    }
  } catch (err) {
    console.warn("[circuitRepository] DB query failed for circuits, using fallback:", err);
  }

  // Fallback from trails.json
  return (fallbackTrails as any[]).map((t) => ({
    id: t.id,
    slug: t.id,
    name: t.name,
    tagline: t.tagline || `${t.name} Heritage Circuit`,
    region: t.region || "All India",
    duration: t.duration || "3 Days",
    distance: t.distance || "150 km",
    bestSeason: t.bestSeason || "October to March",
    difficulty: t.difficulty || "Moderate",
    description: t.description || "",
    stops: (t.stops || []).map((s: any, idx: number) => ({
      siteId: s.monasteryId || s.siteId || "",
      siteName: s.monasteryName || s.name || "Heritage Stop",
      stopOrder: idx + 1,
      distanceFromPrev: s.distanceFromPrev || (idx === 0 ? "Start" : "25 km"),
      travelTimeFromPrev: s.travelTimeFromPrev || (idx === 0 ? "0 mins" : "45 mins"),
      recommendedDuration: s.recommendedDuration || "2-3 hours",
      highlight: s.historicalSignificance || s.highlight || "",
    })),
  }));
}
