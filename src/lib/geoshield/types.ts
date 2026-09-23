// GeoShield Core TypeScript Interfaces & Types

export type HazardType =
  | "FLOOD"
  | "FLASH_FLOOD"
  | "LANDSLIDE"
  | "CYCLONE"
  | "EARTHQUAKE"
  | "WILDFIRE"
  | "HEAVY_RAIN"
  | "AVALANCHE"
  | "TSUNAMI"
  | "OTHER";

export type RiskSeverity = "GREEN" | "YELLOW" | "ORANGE" | "RED";

export type EventStatus = "ACTIVE" | "MONITORING" | "RESOLVED" | "HISTORICAL";

export type AlertSeverity = "Extreme" | "Severe" | "Moderate" | "Minor" | "Unknown";
export type AlertUrgency = "Immediate" | "Expected" | "Future" | "Past" | "Unknown";
export type AlertCertainty = "Observed" | "Likely" | "Possible" | "Unlikely" | "Unknown";

export interface GeoBoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface DisasterEvent {
  id: string;
  slug: string;
  hazard_type: HazardType;
  title: string;
  description: string;
  country: string;
  state?: string;
  district?: string;
  severity: RiskSeverity;
  status: EventStatus;
  source: string;
  source_url?: string;
  source_event_id?: string;
  is_demo: boolean;
  started_at: string;
  ended_at?: string;
  published_at?: string;
  updated_at: string;
  centroid_lat: number;
  centroid_lng: number;
  bbox?: GeoBoundingBox;
  geometry?: any; // GeoJSON
  affected_heritage_ids?: string[];
  distance_km?: number;
}

export interface OfficialAlert {
  id: string;
  event_id?: string;
  country: string;
  source_name: string;
  alert_identifier?: string;
  headline: string;
  description: string;
  severity: AlertSeverity;
  urgency: AlertUrgency;
  certainty: AlertCertainty;
  category?: string;
  effective_at?: string;
  expires_at?: string;
  language?: string;
  instruction?: string;
  area_description?: string;
  area_polygon?: any; // GeoJSON
  cap_payload?: any;
  is_official: boolean;
  fetched_at: string;
}

export interface HazardZone {
  id: string;
  event_id: string;
  zone_type: "flood_inundation" | "landslide_susceptibility" | "extreme_rainfall" | "wildfire_front" | "road_closure";
  severity: RiskSeverity;
  geometry: any; // GeoJSON
  source: string;
  valid_from?: string;
  valid_until?: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  created_at: string;
}

export interface SafePoint {
  id: string;
  name: string;
  point_type: "shelter" | "hospital" | "police_station" | "relief_camp" | "evacuation_centre";
  country: string;
  state?: string;
  district?: string;
  latitude: number;
  longitude: number;
  address?: string;
  contact?: string;
  capacity?: number;
  verified_by?: string;
  is_verified: boolean;
  distance_km?: number;
}

export interface WeatherObservation {
  source: string;
  latitude: number;
  longitude: number;
  temperature: number;
  precipitation: number;
  wind_speed: number;
  weather_code: number;
  weather_description?: string;
  observed_at: string;
  is_forecast?: boolean;
}

export interface DataSourceHealth {
  id: string;
  name: string;
  provider: string;
  country: string;
  source_type: string;
  coverage: string;
  is_official: boolean;
  last_success_at?: string;
  status: "ACTIVE" | "DEGRADED" | "DOWN";
  refresh_interval_seconds: number;
}

// Heritage Exposure & Impact Analysis
export interface HeritageSiteRiskProfile {
  site_id: string;
  site_name: string;
  site_type: string;
  latitude: number;
  longitude: number;
  state: string;
  district: string;
  risk_level: RiskSeverity;
  status_label: "Normal / Monitored" | "Advisory" | "Warning" | "Restricted Zone";
  intersecting_hazards: {
    event_id: string;
    hazard_title: string;
    hazard_type: HazardType;
    distance_km: number;
    severity: RiskSeverity;
    source: string;
  }[];
  nearest_safe_point?: SafePoint;
  last_updated: string;
}

export interface HeritageExposureSummary {
  total_sites_analyzed: number;
  exposed_sites_count: number;
  breakdown_by_category: {
    category: string;
    count: number;
    sites: { id: string; name: string; severity: RiskSeverity }[];
  }[];
  highest_severity: RiskSeverity;
  active_hazard_count: number;
  generated_at: string;
}

// Route Scoring Interfaces
export interface RouteWaypoint {
  lat: number;
  lng: number;
}

export interface ScoredRouteSegment {
  distance_meters: number;
  duration_seconds: number;
  geometry: any; // GeoJSON LineString
  risk_score: number; // 0 (safest) to 100 (highest risk)
  hazard_intersections: string[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  warnings: string[];
}

export interface RouteEvaluationResult {
  origin: RouteWaypoint;
  destination: RouteWaypoint;
  recommended_route?: ScoredRouteSegment;
  alternative_routes: ScoredRouteSegment[];
  road_closure_detected: boolean;
  safety_advisory: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  disclaimer: string;
}
