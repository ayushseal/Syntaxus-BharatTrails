import { query } from "@/lib/db";
import { HazardZone, RouteEvaluationResult, RouteWaypoint, ScoredRouteSegment } from "./types";
import * as turf from "@turf/turf";

const OSRM_API_URL = process.env.OSRM_API_URL || "https://router.project-osrm.org";

export async function calculateRiskAwareRoute(
  origin: RouteWaypoint,
  destination: RouteWaypoint
): Promise<RouteEvaluationResult> {
  const result: RouteEvaluationResult = {
    origin,
    destination,
    alternative_routes: [],
    road_closure_detected: false,
    safety_advisory: "Route evaluation complete.",
    confidence: "MEDIUM",
    disclaimer:
      "GeoShield decision support notice: Live route safety cannot be guaranteed due to localized road conditions or dynamic slope movement. Always follow instructions from police and disaster management authorities.",
  };

  try {
    // 1. Fetch active hazard zones from DB
    const zonesRes = await query<HazardZone>(
      `SELECT * FROM hazard_zones WHERE valid_until > NOW() OR valid_until IS NULL`
    );
    const activeZones = zonesRes?.rows || [];

    // 2. Fetch route from OSRM
    const osrmUrl = `${OSRM_API_URL}/route/v1/driving/${origin.lng},${origin.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson&alternatives=true`;
    
    let osrmData: any = null;
    try {
      const resp = await fetch(osrmUrl, {
        headers: { "User-Agent": "GeoShield-BharatTrails/1.0" },
        signal: AbortSignal.timeout(800),
        next: { revalidate: 300 },
      });
      if (resp.ok) {
        osrmData = await resp.json();
      }
    } catch (fetchErr) {
      console.warn("[RouteScorer] OSRM fetch failed, generating direct fallback corridor:", fetchErr);
    }

    // If OSRM returned routes, evaluate each one
    if (osrmData && Array.isArray(osrmData.routes) && osrmData.routes.length > 0) {
      const scoredRoutes: ScoredRouteSegment[] = [];

      for (let i = 0; i < osrmData.routes.length; i++) {
        const r = osrmData.routes[i];
        const routeLine = turf.lineString(r.geometry.coordinates);
        
        let riskScore = 10; // Base score
        const warnings: string[] = [];
        const intersectingHazards: string[] = [];

        for (const zone of activeZones) {
          try {
            if (zone.geometry.type === "Polygon" || zone.geometry.type === "MultiPolygon") {
              const poly = turf.polygon(zone.geometry.coordinates);
              const intersects = turf.booleanIntersects(routeLine, poly);
              if (intersects) {
                if (zone.severity === "RED") {
                  riskScore += 50;
                  result.road_closure_detected = true;
                  warnings.push(`Intersects High-Risk Zone: ${zone.zone_type.replace(/_/g, " ")}`);
                } else if (zone.severity === "ORANGE") {
                  riskScore += 25;
                  warnings.push(`Passes near Advisory Corridor: ${zone.zone_type.replace(/_/g, " ")}`);
                } else {
                  riskScore += 10;
                }
                intersectingHazards.push(zone.id);
              }
            } else if (zone.geometry.type === "LineString") {
              // Road closure line
              const closureLine = turf.lineString(zone.geometry.coordinates);
              const dist = turf.pointToLineDistance(turf.point([origin.lng, origin.lat]), closureLine);
              if (dist < 5) {
                riskScore += 60;
                result.road_closure_detected = true;
                warnings.push(`Nearby Verified Road Closure (${zone.source})`);
              }
            }
          } catch {
            // Ignore individual geometry failure
          }
        }

        const confidence: "HIGH" | "MEDIUM" | "LOW" =
          activeZones.length > 0 && r.geometry.coordinates.length > 10
            ? "HIGH"
            : "MEDIUM";

        scoredRoutes.push({
          distance_meters: r.distance,
          duration_seconds: r.duration,
          geometry: r.geometry,
          risk_score: Math.min(100, riskScore),
          hazard_intersections: intersectingHazards,
          confidence,
          warnings,
        });
      }

      // Sort by risk score ascending (safest first)
      scoredRoutes.sort((a, b) => a.risk_score - b.risk_score);
      result.recommended_route = scoredRoutes[0];
      result.alternative_routes = scoredRoutes.slice(1);

      if (result.recommended_route.risk_score > 60) {
        result.safety_advisory =
          "CAUTION: High risk detected on direct roads. Transit is NOT advised until weather clears and emergency crews declare routes open.";
        result.confidence = "LOW";
      } else if (result.recommended_route.risk_score > 30) {
        result.safety_advisory =
          "ADVISORY: Route traverses mountainous terrain under weather caution. Maintain vigilance and check in at checkpoints.";
      } else {
        result.safety_advisory =
          "NORMAL: Recommended corridor shows no recorded major blockages. Proceed with standard travel precautions.";
      }

      return result;
    }

    // Direct line fallback if OSRM unavailable
    const fallbackLine = {
      type: "LineString",
      coordinates: [
        [origin.lng, origin.lat],
        [(origin.lng + destination.lng) / 2 + 0.01, (origin.lat + destination.lat) / 2 + 0.01],
        [destination.lng, destination.lat],
      ],
    };

    result.recommended_route = {
      distance_meters: Math.round(
        turf.distance(turf.point([origin.lng, origin.lat]), turf.point([destination.lng, destination.lat]), {
          units: "meters",
        }) * 1.3
      ),
      duration_seconds: 3600,
      geometry: fallbackLine,
      risk_score: 25,
      hazard_intersections: [],
      confidence: "LOW",
      warnings: ["Live routing server unreachable; showing approximate direct terrain trajectory."],
    };
    result.confidence = "LOW";
    result.safety_advisory = "Live route calculation offline. Adhere strictly to local road signages.";

    return result;
  } catch (err) {
    console.error("[RouteScorer] Route scoring error:", err);
    return result;
  }
}
