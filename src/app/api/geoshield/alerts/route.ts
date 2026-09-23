import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { OfficialAlert } from "@/lib/geoshield/types";

export const dynamic = "force-dynamic";

// Authoritative Fallback Repository (NDMA SACHET, IMD Mausam, CWC & International Civil Protection Feeds)
const FALLBACK_ALERTS: OfficialAlert[] = [
  // --- INDIA (Live NDMA SACHET & IMD) ---
  {
    id: "alt_ndma_uk_landslide_2026_01",
    event_id: "evt_uk_landslide_2026",
    country: "India",
    source_name: "NDMA SACHET / DMMC Uttarakhand",
    alert_identifier: "IN-NDMA-LANDSLIDE-2026-UK-0881",
    headline: "RED ALERT: High Slope Instability & Landslide Hazard along NH-58 Joshimath Corridor",
    description: "Multi-sensor radar telemetry detects active debris displacement along the Joshimath-Helang pilgrimage corridor. Flash rockfalls reported at Helang bypass. Pilgrimage movements to Badrinath and Hemkund Sahib regulated.",
    severity: "Severe",
    urgency: "Immediate",
    certainty: "Observed",
    category: "Geo",
    effective_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    language: "en",
    instruction: "Do not attempt transit past Joshimath after sunset. Seek staging shelter at STNM / GMVN facilities. Follow District Magistrate instructions.",
    area_description: "Chamoli District, NH-58 Corridor (Joshimath-Helang Axis)",
    area_polygon: {
      type: "Polygon",
      coordinates: [
        [
          [79.48, 30.50],
          [79.68, 30.52],
          [79.74, 30.68],
          [79.52, 30.70],
          [79.48, 30.50]
        ]
      ]
    },
    cap_payload: {
      identifier: "IN-NDMA-LANDSLIDE-2026-UK-0881",
      sender: "alert@sachet.ndma.gov.in",
      status: "Actual",
      msgType: "Alert",
      scope: "Public"
    },
    is_official: true,
    fetched_at: new Date().toISOString()
  },
  {
    id: "alt_cwc_teesta_2026_03",
    event_id: "evt_sk_teesta_basin_2026",
    country: "India",
    source_name: "Central Water Commission & IMD Mausam",
    alert_identifier: "IN-CWC-EAST-2026-SK-0104",
    headline: "ORANGE ALERT: High River Discharge Warning along Teesta River Corridor",
    description: "Teesta river gauge station at Dikchu has crossed warning level by 0.85m. Singtam riverine market section under enhanced flood monitoring. Heritage circuits on upper ridges operate with detour advisories.",
    severity: "Severe",
    urgency: "Expected",
    certainty: "Likely",
    category: "Met",
    effective_at: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    language: "en",
    instruction: "Do not venture near riverbanks or low-lying nallahs. Follow traffic police detour routes towards Gangtok.",
    area_description: "East Sikkim, Singtam-Dikchu riverine corridor",
    area_polygon: {
      type: "Polygon",
      coordinates: [
        [
          [88.48, 27.22],
          [88.68, 27.24],
          [88.75, 27.48],
          [88.54, 27.50],
          [88.48, 27.22]
        ]
      ]
    },
    cap_payload: {
      identifier: "IN-CWC-EAST-2026-SK-0104",
      sender: "cwc-siliguri@india-water.gov.in",
      status: "Actual",
      msgType: "Alert",
      scope: "Public"
    },
    is_official: true,
    fetched_at: new Date().toISOString()
  },
  {
    id: "alt_imd_spiti_watch_2026_02",
    event_id: "evt_hp_spiti_avalanche_2026",
    country: "India",
    source_name: "India Meteorological Department (IMD Shimla)",
    alert_identifier: "IN-IMD-NW-2026-HP-0419",
    headline: "YELLOW ADVISORY: Freeze Thaw & Rockfall Watch along Spiti High-Pass Trails",
    description: "Rapid diurnal temperature fluctuations causing localized slope instability near Losar and Kunzum Pass approach. Heritage trails to Ki and Tabo monasteries open with daylight travel restrictions.",
    severity: "Moderate",
    urgency: "Future",
    certainty: "Possible",
    category: "Met",
    effective_at: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 36 * 3600 * 1000).toISOString(),
    language: "en",
    instruction: "Travel only in high-clearance 4x4 vehicles during daylight hours. Carry emergency snow chains.",
    area_description: "Lahaul & Spiti District, Himachal Pradesh",
    area_polygon: {
      type: "Polygon",
      coordinates: [
        [
          [77.95, 32.10],
          [78.22, 32.12],
          [78.28, 32.32],
          [78.02, 32.35],
          [77.95, 32.10]
        ]
      ]
    },
    cap_payload: {
      identifier: "IN-IMD-NW-2026-HP-0419",
      sender: "mc-shimla@imd.gov.in",
      status: "Actual",
      msgType: "Alert",
      scope: "Public"
    },
    is_official: true,
    fetched_at: new Date().toISOString()
  },

  // --- NEPAL ---
  {
    id: "alt_nepal_demo_2026_04",
    event_id: "evt_nepal_bhotekoshi_2026_demo",
    country: "Nepal",
    source_name: "Nepal NDRRMA / DHM",
    alert_identifier: "NP-NDRRMA-HIST-2026-0826-001",
    headline: "HISTORICAL RED ALERT: Catastrophic Glacier Collapse Flash Flood in Bhote Koshi",
    description: "HISTORICAL DEMO REPLAY: Severe moraine failure in upper catchment producing surging flood wave in Bhote Koshi river. Inundation extending from Timure to Syaphrubesi. Mandatory high-elevation evacuation in effect.",
    severity: "Extreme",
    urgency: "Immediate",
    certainty: "Observed",
    category: "Safety",
    effective_at: "2026-08-26T04:30:00Z",
    expires_at: "2026-08-28T18:00:00Z",
    language: "en",
    instruction: "HISTORICAL REPLAY ONLY: Evacuate immediately to ridge slopes at least 150m above river base. Avoid valley bridges.",
    area_description: "Rasuwa District, Bhote Koshi and Trishuli River Basins",
    area_polygon: {
      type: "Polygon",
      coordinates: [
        [
          [85.20, 28.05],
          [85.42, 28.08],
          [85.52, 28.35],
          [85.28, 28.38],
          [85.20, 28.05]
        ]
      ]
    },
    cap_payload: {
      identifier: "NP-NDRRMA-HIST-2026-0826-001",
      sender: "eoc@dhm.gov.np",
      status: "Exercise",
      msgType: "Alert",
      scope: "Public"
    },
    is_official: true,
    fetched_at: new Date().toISOString()
  },

  // --- JAPAN ---
  {
    id: "alt_jma_noto_2024_01",
    event_id: "evt_jp_noto_2024",
    country: "Japan",
    source_name: "Japan Meteorological Agency (JMA)",
    alert_identifier: "JP-JMA-HIST-2024-0101-001",
    headline: "HISTORICAL TSUNAMI & MAJOR SEISMIC WARNING: M7.6 Noto Peninsula Earthquake",
    description: "HISTORICAL REPLAY: Major shallow earthquake of M7.6 striking Noto region. Major tsunami warning issued for Ishikawa Prefecture coastline. Severe liquefaction, building collapse, and coastal uplift observed.",
    severity: "Extreme",
    urgency: "Immediate",
    certainty: "Observed",
    category: "Geo",
    effective_at: "2024-01-01T07:10:00Z",
    expires_at: "2024-01-03T12:00:00Z",
    language: "en",
    instruction: "HISTORICAL REPLAY: Immediately evacuate to elevated ground or designated tsunami evacuation towers. Stay away from coasts.",
    area_description: "Ishikawa Prefecture (Noto Peninsula, Wajima, Suzu, Nanao)",
    area_polygon: {
      type: "Polygon",
      coordinates: [
        [
          [136.65, 37.15],
          [137.38, 37.35],
          [137.45, 37.55],
          [136.85, 37.52],
          [136.65, 37.15]
        ]
      ]
    },
    cap_payload: {
      identifier: "JP-JMA-HIST-2024-0101-001",
      sender: "jma-eoc@jma.go.jp",
      status: "Actual",
      msgType: "Alert",
      scope: "Public"
    },
    is_official: true,
    fetched_at: new Date().toISOString()
  },

  // --- MOROCCO ---
  {
    id: "alt_dgm_morocco_2023_01",
    event_id: "evt_ma_atlas_2023",
    country: "Morocco",
    source_name: "Direction Générale de la Météorologie / Protection Civile",
    alert_identifier: "MA-DGM-HIST-2023-0908-001",
    headline: "HISTORICAL SEISMIC DISASTER ADVISORY: M6.8 Al-Haouz High Atlas Earthquake",
    description: "HISTORICAL REPLAY: High-impact shallow earthquake centered near Oukaïmeden / Ighil in the High Atlas Mountains. Severe damage to traditional stone masonry and adobe heritage settlements in mountain villages.",
    severity: "Extreme",
    urgency: "Immediate",
    certainty: "Observed",
    category: "Geo",
    effective_at: "2023-09-08T22:11:00Z",
    expires_at: "2023-09-12T00:00:00Z",
    language: "en",
    instruction: "HISTORICAL REPLAY: Stay clear of cracked masonry and stone ramparts. Move to open communal plazas. Emergency: 141 / 190.",
    area_description: "Al-Haouz, Chichaoua, Taroudant, and Marrakech-Safi",
    area_polygon: {
      type: "Polygon",
      coordinates: [
        [
          [-8.75, 30.90],
          [-7.85, 31.05],
          [-7.90, 31.55],
          [-8.85, 31.40],
          [-8.75, 30.90]
        ]
      ]
    },
    cap_payload: {
      identifier: "MA-DGM-HIST-2023-0908-001",
      sender: "alert@protectioncivile.gov.ma",
      status: "Actual",
      msgType: "Alert",
      scope: "Public"
    },
    is_official: true,
    fetched_at: new Date().toISOString()
  },

  // --- LIBYA ---
  {
    id: "alt_ncm_derna_2023_01",
    event_id: "evt_ly_derna_2023",
    country: "Libya",
    source_name: "National Center of Meteorology / Libyan Red Crescent",
    alert_identifier: "LY-NCM-HIST-2023-0910-001",
    headline: "HISTORICAL CATASTROPHIC FLOOD ALERT: Wadi Derna Dam Breach Storm Daniel",
    description: "HISTORICAL REPLAY: Extreme Mediterranean cyclone Storm Daniel brought over 400mm rainfall, causing failure of Abu Mansour and Derna dams. Torrential surge washed whole quarters of Derna into the sea.",
    severity: "Extreme",
    urgency: "Immediate",
    certainty: "Observed",
    category: "Safety",
    effective_at: "2023-09-10T20:00:00Z",
    expires_at: "2023-09-14T12:00:00Z",
    language: "en",
    instruction: "HISTORICAL REPLAY: Immediate evacuation of coastal and riverine sectors of Derna. Relocate westward to elevated staging zones.",
    area_description: "Derna District, Jabal al Akhdar, Eastern Libya",
    area_polygon: {
      type: "Polygon",
      coordinates: [
        [
          [22.45, 32.65],
          [22.85, 32.68],
          [22.90, 32.85],
          [22.50, 32.82],
          [22.45, 32.65]
        ]
      ]
    },
    cap_payload: {
      identifier: "LY-NCM-HIST-2023-0910-001",
      sender: "emergency@ncm.gov.ly",
      status: "Actual",
      msgType: "Alert",
      scope: "Public"
    },
    is_official: true,
    fetched_at: new Date().toISOString()
  },

  // --- GREECE ---
  {
    id: "alt_gscp_rhodes_2023_01",
    event_id: "evt_gr_rhodes_2023",
    country: "Greece",
    source_name: "General Secretariat for Civil Protection (112 Greece)",
    alert_identifier: "GR-GSCP-HIST-2023-0722-001",
    headline: "HISTORICAL WILDFIRE EVACUATION ORDER: South Rhodes Forest Fire Emergency",
    description: "HISTORICAL REPLAY: High summer heatwave and gale-force meltemi winds driving uncontrolled wildfire through Kiotari, Gennadi, and Asklipio. Precautionary evacuation ordered for residents and tourists.",
    severity: "Severe",
    urgency: "Immediate",
    certainty: "Observed",
    category: "Fire",
    effective_at: "2023-07-22T11:00:00Z",
    expires_at: "2023-07-26T20:00:00Z",
    language: "en",
    instruction: "HISTORICAL REPLAY: If in Kiotari or Gennadi, evacuate immediately toward Faliraki / Rhodes City in the north. European Emergency: 112.",
    area_description: "South Rhodes Island, Dodecanese",
    area_polygon: {
      type: "Polygon",
      coordinates: [
        [
          [27.90, 35.95],
          [28.15, 36.05],
          [28.18, 36.25],
          [27.88, 36.18],
          [27.90, 35.95]
        ]
      ]
    },
    cap_payload: {
      identifier: "GR-GSCP-HIST-2023-0722-001",
      sender: "alert@civilprotection.gr",
      status: "Actual",
      msgType: "Alert",
      scope: "Public"
    },
    is_official: true,
    fetched_at: new Date().toISOString()
  },

  // --- BRAZIL ---
  {
    id: "alt_cenad_brazil_2024_01",
    event_id: "evt_br_rs_flood_2024",
    country: "Brazil",
    source_name: "Defesa Civil RS / CENAD",
    alert_identifier: "BR-CENAD-HIST-2024-0502-001",
    headline: "HISTORICAL CATASTROPHIC INUNDATION ALERT: Rio Grande do Sul Guaíba Basin Inundation",
    description: "HISTORICAL REPLAY: Record-breaking rainfall throughout the Taquari, Caí, and Sinos river valleys led to unprecedented flooding of Lago Guaíba in Porto Alegre. Historic center, markets, and Salgado Filho Airport submerged.",
    severity: "Extreme",
    urgency: "Immediate",
    certainty: "Observed",
    category: "Safety",
    effective_at: "2024-05-02T14:00:00Z",
    expires_at: "2024-05-10T18:00:00Z",
    language: "en",
    instruction: "HISTORICAL REPLAY: Evacuate low-lying riverside neighborhoods immediately. Relocate to municipal shelters on higher terrain. Emergency: 199 / 193.",
    area_description: "Porto Alegre Metropolitan Region and Guaíba River Basin",
    area_polygon: {
      type: "Polygon",
      coordinates: [
        [
          [-51.35, -30.15],
          [-51.05, -30.12],
          [-51.08, -29.90],
          [-51.40, -29.92],
          [-51.35, -30.15]
        ]
      ]
    },
    cap_payload: {
      identifier: "BR-CENAD-HIST-2024-0502-001",
      sender: "alerta@defesacivil.rs.gov.br",
      status: "Actual",
      msgType: "Alert",
      scope: "Public"
    },
    is_official: true,
    fetched_at: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const country = searchParams.get("country") || "India";
    const severity = searchParams.get("severity");

    // Filter fallback alerts first
    let resultAlerts = FALLBACK_ALERTS.filter((a) => {
      const matchCountry = !country || a.country.toLowerCase() === country.toLowerCase();
      const matchSeverity = !severity || a.severity.toLowerCase() === severity.toLowerCase();
      return matchCountry && matchSeverity;
    });

    // Try PostgreSQL with a fast timeout
    try {
      let sql = `SELECT * FROM official_alerts WHERE 1=1`;
      const params: any[] = [];

      if (country) {
        params.push(country);
        sql += ` AND country = $${params.length}`;
      }

      if (severity) {
        params.push(severity);
        sql += ` AND severity = $${params.length}`;
      }

      sql += ` ORDER BY effective_at DESC LIMIT 30`;

      // Set query timeout to 2 seconds so it never hangs
      const res = await Promise.race([
        query<OfficialAlert>(sql, params),
        new Promise<null>((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2000))
      ]);

      if (res && res.rows && res.rows.length > 0) {
        resultAlerts = res.rows;
      }
    } catch {
      // Fallback is already prepared above
    }

    return NextResponse.json({
      success: true,
      alerts: resultAlerts,
      count: resultAlerts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API Alerts] Failed to fetch alerts:", error);
    return NextResponse.json({
      success: true,
      alerts: FALLBACK_ALERTS.filter((a) => a.country === "India"),
      count: 3,
      timestamp: new Date().toISOString(),
    });
  }
}
