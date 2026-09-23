import { query } from "@/lib/db";
import {
  DisasterEvent,
  HeritageExposureSummary,
  HeritageSiteRiskProfile,
  RiskSeverity,
} from "./types";
import * as turf from "@turf/turf";

// Helper: Haversine distance in KM if turf is used
function computeDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const from = turf.point([lon1, lat1]);
  const to = turf.point([lon2, lat2]);
  return turf.distance(from, to, { units: "kilometers" });
}

// Check if a point falls inside a GeoJSON polygon or within hazard buffer
function isPointInHazard(lat: number, lng: number, geometry: any, bufferKm: number = 10): boolean {
  if (!geometry) return false;
  try {
    const pt = turf.point([lng, lat]);
    if (geometry.type === "Polygon" || geometry.type === "MultiPolygon") {
      // 1. Direct point-in-polygon
      const isInside = turf.booleanPointInPolygon(pt, geometry);
      if (isInside) return true;

      // 2. Buffer proximity check
      const buffered = turf.buffer(geometry, bufferKm, { units: "kilometers" }) as any;
      if (buffered) {
        if (buffered.type === "FeatureCollection" && Array.isArray(buffered.features)) {
          for (const feat of buffered.features) {
            if (turf.booleanPointInPolygon(pt, feat)) return true;
          }
        } else if (turf.booleanPointInPolygon(pt, buffered)) {
          return true;
        }
      }
    } else if (geometry.type === "Point") {
      const dist = computeDistanceKm(lat, lng, geometry.coordinates[1], geometry.coordinates[0]);
      return dist <= bufferKm;
    }
  } catch (err) {
    console.error("[HeritageExposureEngine] Spatial check failed:", err);
  }
  return false;
}

export async function calculateHeritageExposure(): Promise<HeritageExposureSummary> {
  const summary: HeritageExposureSummary = {
    total_sites_analyzed: 0,
    exposed_sites_count: 0,
    breakdown_by_category: [],
    highest_severity: "GREEN",
    active_hazard_count: 0,
    generated_at: new Date().toISOString(),
  };

  try {
    // 1. Fetch active events and hazard zones
    const eventsRes = await query<DisasterEvent>(
      `SELECT * FROM disaster_events WHERE status IN ('ACTIVE', 'MONITORING') ORDER BY started_at DESC`
    );
    const activeEvents = eventsRes?.rows || [];
    summary.active_hazard_count = activeEvents.length;

    // 2. Fetch heritage sites
    const sitesRes = await query<{
      id: string;
      name_en: string;
      site_type: string;
      latitude: string;
      longitude: string;
      state: string;
      district: string;
    }>(
      `SELECT id, name_en, site_type, latitude, longitude, state, district FROM heritage_sites LIMIT 200`
    );
    const sites = sitesRes?.rows || [];
    summary.total_sites_analyzed = sites.length;

    if (sites.length === 0 || activeEvents.length === 0) {
      return summary;
    }

    const categoryMap: Record<string, { id: string; name: string; severity: RiskSeverity }[]> = {
      MONASTERY: [],
      TEMPLE: [],
      FORT: [],
      STUPA: [],
      CAVE: [],
      ARCHAEOLOGICAL_SITE: [],
      NATURAL_SITE: [],
      OTHER: [],
    };

    let highestSeverityScore = 0;
    const severityScores: Record<RiskSeverity, number> = {
      GREEN: 0,
      YELLOW: 1,
      ORANGE: 2,
      RED: 3,
    };

    for (const site of sites) {
      const siteLat = parseFloat(site.latitude);
      const siteLng = parseFloat(site.longitude);
      if (isNaN(siteLat) || isNaN(siteLng)) continue;

      let matchedEvent: DisasterEvent | null = null;
      let matchedSeverity: RiskSeverity = "GREEN";

      // Check against explicit affected_heritage_ids or spatial proximity
      for (const ev of activeEvents) {
        let isMatch = false;

        if (Array.isArray(ev.affected_heritage_ids) && ev.affected_heritage_ids.includes(site.id)) {
          isMatch = true;
        } else if (ev.centroid_lat && ev.centroid_lng) {
          const dist = computeDistanceKm(siteLat, siteLng, ev.centroid_lat, ev.centroid_lng);
          if (dist <= 35) {
            isMatch = true;
          }
        }

        if (!isMatch && ev.geometry) {
          isMatch = isPointInHazard(siteLat, siteLng, ev.geometry, 15);
        }

        if (isMatch) {
          const evScore = severityScores[ev.severity] || 1;
          if (evScore > severityScores[matchedSeverity]) {
            matchedSeverity = ev.severity;
            matchedEvent = ev;
          }
        }
      }

      if (matchedEvent) {
        summary.exposed_sites_count++;
        const currentScore = severityScores[matchedSeverity];
        if (currentScore > highestSeverityScore) {
          highestSeverityScore = currentScore;
          summary.highest_severity = matchedSeverity;
        }

        const catKey = categoryMap[site.site_type] ? site.site_type : "OTHER";
        categoryMap[catKey].push({
          id: site.id,
          name: site.name_en,
          severity: matchedSeverity,
        });
      }
    }

    summary.breakdown_by_category = Object.entries(categoryMap)
      .filter((entry) => entry[1].length > 0)
      .map(([cat, list]) => ({
        category: cat,
        count: list.length,
        sites: list,
      }));

    return summary;
  } catch (err) {
    console.error("[HeritageExposureEngine] Failed to compute exposure:", err);
    return summary;
  }
}

// Single Site Risk Evaluation
export async function getHeritageSiteRisk(
  siteId: string,
  latitude: number,
  longitude: number
): Promise<HeritageSiteRiskProfile> {
  const profile: HeritageSiteRiskProfile = {
    site_id: siteId,
    site_name: "",
    site_type: "HERITAGE",
    latitude,
    longitude,
    state: "",
    district: "",
    risk_level: "GREEN",
    status_label: "Normal / Monitored",
    intersecting_hazards: [],
    last_updated: new Date().toISOString(),
  };

  try {
    const eventsRes = await query<DisasterEvent>(
      `SELECT * FROM disaster_events WHERE status IN ('ACTIVE', 'MONITORING')`
    );
    const events = eventsRes?.rows || [];

    for (const ev of events) {
      let isExposed = false;
      let dist = 999;

      if (ev.centroid_lat && ev.centroid_lng) {
        dist = computeDistanceKm(latitude, longitude, ev.centroid_lat, ev.centroid_lng);
        if (dist <= 40) isExposed = true;
      }

      if (Array.isArray(ev.affected_heritage_ids) && ev.affected_heritage_ids.includes(siteId)) {
        isExposed = true;
      }

      if (isExposed) {
        profile.intersecting_hazards.push({
          event_id: ev.id,
          hazard_title: ev.title,
          hazard_type: ev.hazard_type,
          distance_km: Math.round(dist * 10) / 10,
          severity: ev.severity,
          source: ev.source,
        });

        if (ev.severity === "RED") {
          profile.risk_level = "RED";
          profile.status_label = "Restricted Zone";
        } else if (ev.severity === "ORANGE" && profile.risk_level !== "RED") {
          profile.risk_level = "ORANGE";
          profile.status_label = "Warning";
        } else if (ev.severity === "YELLOW" && profile.risk_level === "GREEN") {
          profile.risk_level = "YELLOW";
          profile.status_label = "Advisory";
        }
      }
    }

    // Fetch nearest verified safe point
    const safeRes = await query(
      `SELECT id, name, point_type, country, state, district, latitude, longitude, address, contact, capacity, verified_by, is_verified
       FROM safe_points
       ORDER BY (latitude - $1)^2 + (longitude - $2)^2 ASC
       LIMIT 1`,
      [latitude, longitude]
    );

    if (safeRes && safeRes.rows.length > 0) {
      const sp = safeRes.rows[0];
      const dist = computeDistanceKm(latitude, longitude, parseFloat(sp.latitude), parseFloat(sp.longitude));
      profile.nearest_safe_point = {
        ...sp,
        latitude: parseFloat(sp.latitude),
        longitude: parseFloat(sp.longitude),
        distance_km: Math.round(dist * 10) / 10,
      };
    }
  } catch (err) {
    console.error(`[HeritageExposureEngine] Error for site ${siteId}:`, err);
  }

  return profile;
}
