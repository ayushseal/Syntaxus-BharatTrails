const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

// Load .env.local if present
const envLocalPath = path.resolve(__dirname, "../.env.local");
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
      const idx = trimmed.indexOf("=");
      const key = trimmed.substring(0, idx).trim();
      const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, "");
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  });
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL is not set in environment or .env.local");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function runSeed() {
  console.log("🌱 Seeding GeoShield Disaster Intelligence Data...");

  // 1. Data Sources Registry
  const sources = [
    {
      id: "src_ndma_sachet",
      name: "NDMA SACHET",
      provider: "National Disaster Management Authority (C-DOT / GoI)",
      country: "India",
      source_type: "official_govt",
      coverage: "Pan-India (State & District EOCs)",
      is_official: true,
      api_endpoint: "https://sachet.ndma.gov.in/cap_feed",
      refresh_interval_seconds: 300,
      status: "ACTIVE"
    },
    {
      id: "src_isro_nrsc",
      name: "ISRO / NRSC / Bhuvan",
      provider: "National Remote Sensing Centre (ISRO / DoS)",
      country: "India",
      source_type: "satellite",
      coverage: "India & Himalayan Pilgrimage Corridors",
      is_official: true,
      api_endpoint: "https://bhuvan-app1.nrsc.gov.in/disaster",
      refresh_interval_seconds: 1800,
      status: "ACTIVE"
    },
    {
      id: "src_imd",
      name: "India Meteorological Department (IMD)",
      provider: "Ministry of Earth Sciences, Govt. of India",
      country: "India",
      source_type: "official_govt",
      coverage: "Pan-India Severe Weather & Rainfall",
      is_official: true,
      api_endpoint: "https://mausam.imd.gov.in/api",
      refresh_interval_seconds: 900,
      status: "ACTIVE"
    },
    {
      id: "src_cwc",
      name: "Central Water Commission (CWC)",
      provider: "Ministry of Jal Shakti, Govt. of India",
      country: "India",
      source_type: "official_govt",
      coverage: "Major River Basins & Reservoirs",
      is_official: true,
      api_endpoint: "https://ffs.india-water.gov.in",
      refresh_interval_seconds: 1800,
      status: "ACTIVE"
    },
    {
      id: "src_fsi_vanagni",
      name: "Forest Survey of India (Van Agni)",
      provider: "MoEFCC / Forest Survey of India",
      country: "India",
      source_type: "satellite",
      coverage: "India Forest & Eco-Heritage Zones",
      is_official: true,
      api_endpoint: "https://vanagni.fsi.gov.in",
      refresh_interval_seconds: 3600,
      status: "ACTIVE"
    },
    {
      id: "src_open_meteo",
      name: "Open-Meteo Weather Gateway",
      provider: "Open-Meteo Global Model Ensemble",
      country: "Global",
      source_type: "weather_model",
      coverage: "Global High-Resolution (1km)",
      is_official: false,
      api_endpoint: "https://api.open-meteo.com/v1/forecast",
      refresh_interval_seconds: 900,
      status: "ACTIVE"
    },
    {
      id: "src_nasa_gpm",
      name: "NASA GPM IMERG",
      provider: "NASA Earth Science Data Systems",
      country: "Global",
      source_type: "satellite",
      coverage: "Global Satellite Precipitation (0.1°)",
      is_official: true,
      api_endpoint: "https://gpm.nasa.gov/data/imerg",
      refresh_interval_seconds: 1800,
      status: "ACTIVE"
    },
    {
      id: "src_nepal_bipad",
      name: "Nepal BIPAD / NDRRMA",
      provider: "National Disaster Risk Reduction & Management Authority, Nepal",
      country: "Nepal",
      source_type: "official_govt",
      coverage: "Nepal & Trans-Himalayan Border Valleys",
      is_official: true,
      api_endpoint: "https://bipadportal.gov.np",
      refresh_interval_seconds: 3600,
      status: "ACTIVE"
    }
  ];

  for (const s of sources) {
    await pool.query(
      `INSERT INTO disaster_sources (id, name, provider, country, source_type, coverage, is_official, api_endpoint, refresh_interval_seconds, last_success_at, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), $10)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         provider = EXCLUDED.provider,
         status = EXCLUDED.status,
         last_success_at = NOW();`,
      [s.id, s.name, s.provider, s.country, s.source_type, s.coverage, s.is_official, s.api_endpoint, s.refresh_interval_seconds, s.status]
    );
  }
  console.log(`  ✓ Seeded ${sources.length} disaster data sources`);

  // 2. Disaster Events (India-First + Nepal Replay)
  const events = [
    {
      id: "evt_uk_landslide_2026",
      slug: "uttarakhand-chamoli-landslide-advisory",
      hazard_type: "LANDSLIDE",
      title: "Uttarakhand Himalayan Pilgrimage Corridor: Landslide Susceptibility Alert",
      description: "ISRO/NRSC and NDMA have issued an Orange level advisory for active debris flow and landslide slope instability along NH-58 and Char Dham pilgrimage routes following 48 hours of intense monsoon precipitation. Tourists and pilgrims are advised to restrict travel past Joshimath.",
      country: "India",
      state: "Uttarakhand",
      district: "Chamoli",
      severity: "ORANGE",
      status: "ACTIVE",
      source: "NDMA SACHET / ISRO NRSC",
      source_url: "https://sachet.ndma.gov.in",
      source_event_id: "NDMA-UK-2026-0814",
      is_demo: false,
      started_at: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      centroid_lat: 30.5564,
      centroid_lng: 79.5632,
      bbox: { north: 30.85, south: 30.25, east: 79.95, west: 79.25 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [79.35, 30.35],
            [79.75, 30.32],
            [79.88, 30.65],
            [79.65, 30.82],
            [79.38, 30.70],
            [79.35, 30.35]
          ]
        ]
      },
      affected_heritage_ids: ["badrinath_temple", "hemkund_sahib", "kedarnath_valley"]
    },
    {
      id: "evt_hp_spiti_flashflood_2026",
      slug: "himachal-spiti-valley-flash-flood-watch",
      hazard_type: "FLASH_FLOOD",
      title: "Himachal Spiti Valley: High Altitude Stream Surge & Route Caution",
      description: "IMD and CWC flash flood advisory for Spiti river tributaries near Kaza and Tabo. Glacial melt combined with local convective cloudburst has caused temporary road cutting near Chicham and Atargoo bridge. Monasteries remain safe on elevated terraces.",
      country: "India",
      state: "Himachal Pradesh",
      district: "Lahaul and Spiti",
      severity: "YELLOW",
      status: "MONITORING",
      source: "IMD / CWC / NDMA",
      source_url: "https://mausam.imd.gov.in",
      source_event_id: "IMD-HP-2026-0902",
      is_demo: false,
      started_at: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      centroid_lat: 32.2276,
      centroid_lng: 78.0710,
      bbox: { north: 32.45, south: 31.95, east: 78.35, west: 77.85 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [77.92, 32.05],
            [78.25, 32.08],
            [78.32, 32.35],
            [78.05, 32.40],
            [77.92, 32.05]
          ]
        ]
      },
      affected_heritage_ids: ["tabo", "ki", "dhankar"]
    },
    {
      id: "evt_sk_teesta_basin_2026",
      slug: "sikkim-teesta-river-basin-surge-advisory",
      hazard_type: "FLOOD",
      title: "Sikkim Teesta River Basin: Downstream Inundation & Silt Discharge Caution",
      description: "Central Water Commission (CWC) water level warning along Upper Teesta basin in North and East Sikkim. River velocity elevated by 2.4 m/s. Singtam-Dikchu corridor restricted for tourist vehicles; Rumtek and Gangtok ridge heritage sites report normal operation.",
      country: "India",
      state: "Sikkim",
      district: "East Sikkim",
      severity: "ORANGE",
      status: "ACTIVE",
      source: "CWC / Sikkim SDMA",
      source_url: "https://ffs.india-water.gov.in",
      source_event_id: "CWC-SK-2026-1108",
      is_demo: false,
      started_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      centroid_lat: 27.3389,
      centroid_lng: 88.6065,
      bbox: { north: 27.65, south: 27.15, east: 88.85, west: 88.35 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [88.45, 27.20],
            [88.75, 27.22],
            [88.80, 27.55],
            [88.52, 27.58],
            [88.45, 27.20]
          ]
        ]
      },
      affected_heritage_ids: ["rumtek", "enchey", "pemayangtse"]
    },
    {
      id: "evt_ka_bandipur_fire_2026",
      slug: "karnataka-nilgiri-biosphere-forest-fire-watch",
      hazard_type: "WILDFIRE",
      title: "Karnataka-Tamil Nadu Border: Forest Fire Early Warning",
      description: "Forest Survey of India (Van Agni) VIIRS satellite detection indicates 3 active fire spots near Bandipur-Mudumalai buffer zone. Heritage trails and wildlife safari circuits restricted temporarily as precautionary measure.",
      country: "India",
      state: "Karnataka",
      district: "Chamarajanagar",
      severity: "YELLOW",
      status: "MONITORING",
      source: "Forest Survey of India (Van Agni)",
      source_url: "https://vanagni.fsi.gov.in",
      source_event_id: "FSI-VA-2026-0319",
      is_demo: false,
      started_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      centroid_lat: 11.6664,
      centroid_lng: 76.6291,
      bbox: { north: 11.85, south: 11.50, east: 76.85, west: 76.45 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [76.50, 11.55],
            [76.78, 11.58],
            [76.82, 11.78],
            [76.55, 11.80],
            [76.50, 11.55]
          ]
        ]
      },
      affected_heritage_ids: []
    },
    // Historical Replay Event: 2026 Nepal Bhote Koshi / Rasuwa Glacier Collapse
    {
      id: "evt_nepal_bhotekoshi_2026_demo",
      slug: "2026-nepal-bhote-koshi-rasuwa-flood-replay",
      hazard_type: "FLOOD",
      title: "August 2026 Nepal Bhote Koshi / Rasuwa Glacier Collapse Flood (Historical Replay)",
      description: "HISTORICAL DEMO REPLAY: On August 26, 2026, catastrophic glacial lake outburst and moraine dam collapse in upper Bhote Koshi catchment triggered devastating flash flood waves through Rasuwa, Nuwakot, and Trishuli valleys. Betrawati-Rasuwagadhi highway severed.",
      country: "Nepal",
      state: "Bagmati Province",
      district: "Rasuwa",
      severity: "RED",
      status: "HISTORICAL",
      source: "Nepal NDRRMA / DHM / ICIMOD Replay Dataset",
      source_url: "https://bipadportal.gov.np",
      source_event_id: "HIST-NEPAL-2026-0826",
      is_demo: true,
      started_at: "2026-08-26T04:15:00Z",
      ended_at: "2026-08-28T18:00:00Z",
      centroid_lat: 28.1824,
      centroid_lng: 85.3521,
      bbox: { north: 28.45, south: 27.95, east: 85.60, west: 85.10 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [85.18, 28.02],
            [85.45, 28.05],
            [85.55, 28.38],
            [85.25, 28.42],
            [85.18, 28.02]
          ]
        ]
      },
      affected_heritage_ids: ["langtang_gompa", "rasuwagadhi_fort", "syaphrubesi_stupa"]
    }
  ];

  for (const ev of events) {
    await pool.query(
      `INSERT INTO disaster_events (
        id, slug, hazard_type, title, description, country, state, district,
        severity, status, source, source_url, source_event_id, is_demo,
        started_at, ended_at, centroid_lat, centroid_lng, bbox, geometry,
        affected_heritage_ids, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, NOW())
      ON CONFLICT (id) DO UPDATE SET
        title = EXCLUDED.title,
        description = EXCLUDED.description,
        severity = EXCLUDED.severity,
        status = EXCLUDED.status,
        affected_heritage_ids = EXCLUDED.affected_heritage_ids,
        geometry = EXCLUDED.geometry,
        updated_at = NOW();`,
      [
        ev.id, ev.slug, ev.hazard_type, ev.title, ev.description, ev.country, ev.state, ev.district,
        ev.severity, ev.status, ev.source, ev.source_url, ev.source_event_id, ev.is_demo,
        ev.started_at, ev.ended_at || null, ev.centroid_lat, ev.centroid_lng, JSON.stringify(ev.bbox),
        JSON.stringify(ev.geometry), JSON.stringify(ev.affected_heritage_ids)
      ]
    );
  }
  console.log(`  ✓ Seeded ${events.length} disaster events (4 India active/monitored + 1 Nepal replay)`);

  // 3. Official Alerts (CAP 1.2 Normalised)
  const alerts = [
    {
      id: "alt_ndma_uk_2026_01",
      event_id: "evt_uk_landslide_2026",
      country: "India",
      source_name: "NDMA SACHET",
      alert_identifier: "IN-NDMA-SACHET-2026-UK-0881",
      headline: "ORANGE ALERT: Slope Failure & Debris Flow along NH-58 Joshimath-Badrinath Axis",
      description: "Severe rainfall induced slope movements detected between Helang and Pandukeshwar. Travel on upper arterial roads is restricted between 19:00 and 06:00. Pilgrims and tourists must check in at nearest verified relief shelter.",
      severity: "Severe",
      urgency: "Immediate",
      certainty: "Likely",
      category: "Geo",
      effective_at: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      language: "en",
      instruction: "Stay away from steep natural slopes and riverbeds. Follow District Magistrate Chamoli directives. Call emergency helpline 1070 or 112.",
      area_description: "Chamoli District, Joshimath Sub-division, NH-58 Corridor",
      area_polygon: {
        type: "Polygon",
        coordinates: [
          [
            [79.45, 30.45],
            [79.72, 30.46],
            [79.80, 30.72],
            [79.50, 30.75],
            [79.45, 30.45]
          ]
        ]
      },
      cap_payload: {
        identifier: "IN-NDMA-SACHET-2026-UK-0881",
        sender: "cap-authority@ndma.gov.in",
        sent: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
        status: "Actual",
        msgType: "Alert",
        scope: "Public",
        info: {
          category: "Geo",
          event: "Landslide and Rockfall",
          urgency: "Immediate",
          severity: "Severe",
          certainty: "Likely",
          headline: "ORANGE ALERT: Slope Failure along NH-58 Joshimath-Badrinath Axis",
          description: "Severe rainfall induced slope movements detected between Helang and Pandukeshwar.",
          instruction: "Follow local police directives. Use verified safe shelters."
        }
      },
      is_official: true
    },
    {
      id: "alt_imd_spiti_2026_02",
      event_id: "evt_hp_spiti_flashflood_2026",
      country: "India",
      source_name: "IMD (India Met Dept)",
      alert_identifier: "IN-IMD-NW-2026-HP-0419",
      headline: "YELLOW ADVISORY: Flash Flood Risk in Spiti River Basin and Tributaries",
      description: "Isolated convective rainfall in upper catchment may cause ephemeral nallah surges. Bridge crossings at Atargoo and Rangrik require caution. Elevated monastery precincts remain secure.",
      severity: "Moderate",
      urgency: "Expected",
      certainty: "Possible",
      category: "Met",
      effective_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
      language: "en",
      instruction: "Avoid pitching tents near river gravel beds. Seek shelter in solid traditional stone masonry structures or monasteries.",
      area_description: "Lahaul & Spiti District, Spiti Valley",
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
      is_official: true
    },
    {
      id: "alt_cwc_teesta_2026_03",
      event_id: "evt_sk_teesta_basin_2026",
      country: "India",
      source_name: "Central Water Commission (CWC)",
      alert_identifier: "IN-CWC-EAST-2026-SK-0104",
      headline: "ORANGE ALERT: High River Discharge Warning along Teesta-V Dam Corridor",
      description: "Teesta river gauge station at Dikchu has crossed warning level by 0.85m. Low-lying market sections in Singtam under flood monitoring. Heritage circuits on higher ridges are operating with detour advisories.",
      severity: "Severe",
      urgency: "Expected",
      certainty: "Likely",
      category: "Met",
      effective_at: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      expires_at: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
      language: "en",
      instruction: "Do not venture to river banks. Follow traffic police detour routes towards Gangtok.",
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
      is_official: true
    },
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
      is_official: true
    }
  ];

  for (const a of alerts) {
    await pool.query(
      `INSERT INTO official_alerts (
        id, event_id, country, source_name, alert_identifier, headline, description,
        severity, urgency, certainty, category, effective_at, expires_at, language,
        instruction, area_description, area_polygon, cap_payload, is_official, fetched_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, NOW())
      ON CONFLICT (id) DO UPDATE SET
        headline = EXCLUDED.headline,
        description = EXCLUDED.description,
        severity = EXCLUDED.severity,
        area_polygon = EXCLUDED.area_polygon,
        cap_payload = EXCLUDED.cap_payload;`,
      [
        a.id, a.event_id, a.country, a.source_name, a.alert_identifier, a.headline, a.description,
        a.severity, a.urgency, a.certainty, a.category, a.effective_at, a.expires_at, a.language,
        a.instruction, a.area_description, JSON.stringify(a.area_polygon), JSON.stringify(a.cap_payload),
        a.is_official
      ]
    );
  }
  console.log(`  ✓ Seeded ${alerts.length} CAP 1.2 official alerts`);

  // 4. Hazard Zones
  const zones = [
    {
      id: "hz_uk_landslide_corridor",
      event_id: "evt_uk_landslide_2026",
      zone_type: "landslide_susceptibility",
      severity: "ORANGE",
      source: "ISRO / NRSC Landslide Portal",
      confidence: "HIGH",
      geometry: {
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
      }
    },
    {
      id: "hz_uk_nh58_closure",
      event_id: "evt_uk_landslide_2026",
      zone_type: "road_closure",
      severity: "RED",
      source: "Uttarakhand Police & Border Roads Organisation (BRO)",
      confidence: "HIGH",
      geometry: {
        type: "LineString",
        coordinates: [
          [79.54, 30.54],
          [79.58, 30.58],
          [79.62, 30.63]
        ]
      }
    },
    {
      id: "hz_sk_teesta_inundation",
      event_id: "evt_sk_teesta_basin_2026",
      zone_type: "flood_inundation",
      severity: "ORANGE",
      source: "CWC / Sikkim Disaster Management Authority",
      confidence: "HIGH",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [88.50, 27.23],
            [88.62, 27.25],
            [88.70, 27.42],
            [88.58, 27.44],
            [88.50, 27.23]
          ]
        ]
      }
    },
    {
      id: "hz_hp_spiti_stream_surge",
      event_id: "evt_hp_spiti_flashflood_2026",
      zone_type: "extreme_rainfall",
      severity: "YELLOW",
      source: "IMD Weather Radar & CWC Stations",
      confidence: "MEDIUM",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [78.00, 32.15],
            [78.18, 32.18],
            [78.22, 32.28],
            [78.05, 32.30],
            [78.00, 32.15]
          ]
        ]
      }
    },
    {
      id: "hz_nepal_demo_inundation",
      event_id: "evt_nepal_bhotekoshi_2026_demo",
      zone_type: "flood_inundation",
      severity: "RED",
      source: "Nepal NDRRMA / ReliefWeb Historical Dataset",
      confidence: "HIGH",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [85.22, 28.10],
            [85.38, 28.12],
            [85.45, 28.30],
            [85.30, 28.32],
            [85.22, 28.10]
          ]
        ]
      }
    }
  ];

  for (const z of zones) {
    await pool.query(
      `INSERT INTO hazard_zones (
        id, event_id, zone_type, severity, geometry, source, confidence, valid_from, valid_until, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW() + INTERVAL '48 hours', NOW())
      ON CONFLICT (id) DO UPDATE SET
        geometry = EXCLUDED.geometry,
        severity = EXCLUDED.severity,
        confidence = EXCLUDED.confidence;`,
      [z.id, z.event_id, z.zone_type, z.severity, JSON.stringify(z.geometry), z.source, z.confidence]
    );
  }
  console.log(`  ✓ Seeded ${zones.length} hazard zones & road closure lines`);

  // 5. Safe Points
  const safePoints = [
    // Uttarakhand Safe Points
    {
      id: "sp_joshimath_shelter",
      name: "Joshimath Municipal Disaster Relief Camp & Auditorium",
      point_type: "shelter",
      country: "India",
      state: "Uttarakhand",
      district: "Chamoli",
      latitude: 30.5564,
      longitude: 79.5632,
      address: "Upper Bazaar, Near Tehsil Office, Joshimath, Uttarakhand 246443",
      contact: "State EOC: 1070 | Dist EOC: 01372-251437",
      capacity: 800,
      verified_by: "District Disaster Management Authority Chamoli"
    },
    {
      id: "sp_joshimath_hospital",
      name: "Community Health Centre & Trauma Care Joshimath",
      point_type: "hospital",
      country: "India",
      state: "Uttarakhand",
      district: "Chamoli",
      latitude: 30.5591,
      longitude: 79.5684,
      address: "Badrinath Marg, Joshimath, Uttarakhand",
      contact: "Emergency: 108 / 01372-251222",
      capacity: 120,
      verified_by: "Uttarakhand Health Directorate"
    },
    {
      id: "sp_guptkashi_camp",
      name: "Guptkashi Stadium Evacuation Base Camp",
      point_type: "evacuation_centre",
      country: "India",
      state: "Uttarakhand",
      district: "Rudraprayag",
      latitude: 30.5228,
      longitude: 79.0768,
      address: "Kedarnath Route, Guptkashi, Rudraprayag, Uttarakhand",
      contact: "112 / 01364-233727",
      capacity: 1500,
      verified_by: "NDRF 8th Battalion & District Administration"
    },
    // Himachal Safe Points
    {
      id: "sp_kaza_chc",
      name: "Kaza Community Health Centre & Safe Shelter",
      point_type: "hospital",
      country: "India",
      state: "Himachal Pradesh",
      district: "Lahaul and Spiti",
      latitude: 32.2276,
      longitude: 78.0710,
      address: "Sub-Divisional Administrative Complex, Kaza, HP 172114",
      contact: "Dist EOC: 01900-222560 | Police: 112",
      capacity: 250,
      verified_by: "SDMA Himachal Pradesh"
    },
    {
      id: "sp_tabo_community_hall",
      name: "Tabo Community Hall & High Ground Evacuation Base",
      point_type: "shelter",
      country: "India",
      state: "Himachal Pradesh",
      district: "Lahaul and Spiti",
      latitude: 32.0926,
      longitude: 78.3822,
      address: "Near Tabo Helipad, Upper Village Terrace, Tabo, HP",
      contact: "Sub-Divisional Magistrate Kaza: 01900-222223",
      capacity: 400,
      verified_by: "Spiti Administration"
    },
    // Sikkim Safe Points
    {
      id: "sp_singtam_school",
      name: "Singtam Senior Secondary School Emergency Shelter",
      point_type: "shelter",
      country: "India",
      state: "Sikkim",
      district: "East Sikkim",
      latitude: 27.2346,
      longitude: 88.5012,
      address: "31A National Highway Ridge, Singtam, Sikkim",
      contact: "State Control Room: 1070 | Police: 112",
      capacity: 650,
      verified_by: "Sikkim State Disaster Management Authority (SSDMA)"
    },
    {
      id: "sp_gangtok_hospital",
      name: "STNM Multi-Speciality Hospital & Emergency Response Base",
      point_type: "hospital",
      country: "India",
      state: "Sikkim",
      district: "East Sikkim",
      latitude: 27.3224,
      longitude: 88.6014,
      address: "Sochyagang, Gangtok, Sikkim 737102",
      contact: "Emergency: 03592-202944 / 108",
      capacity: 1000,
      verified_by: "Health Dept Govt of Sikkim"
    },
    // Nepal Replay Safe Points
    {
      id: "sp_dhunche_hospital",
      name: "Dhunche District Hospital & Emergency Staging Post",
      point_type: "hospital",
      country: "Nepal",
      state: "Bagmati Province",
      district: "Rasuwa",
      latitude: 28.1124,
      longitude: 85.3012,
      address: "Dhunche Ridge, Rasuwa District, Nepal",
      contact: "Rasuwa District EOC: +977-10-540199",
      capacity: 200,
      verified_by: "Nepal Red Cross Society / NDRRMA"
    },
    {
      id: "sp_timure_high_ground",
      name: "Timure High Ground Community Evacuation Terrace",
      point_type: "shelter",
      country: "Nepal",
      state: "Bagmati Province",
      district: "Rasuwa",
      latitude: 28.2789,
      longitude: 85.3789,
      address: "Upper Slope above Custom Office, Timure, Nepal",
      contact: "Local Administration: +977-10-540111",
      capacity: 450,
      verified_by: "Nepal Police & Border Security Force"
    }
  ];

  for (const sp of safePoints) {
    await pool.query(
      `INSERT INTO safe_points (
        id, name, point_type, country, state, district, latitude, longitude,
        address, contact, capacity, verified_by, is_verified, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, true, NOW())
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        contact = EXCLUDED.contact,
        capacity = EXCLUDED.capacity,
        verified_by = EXCLUDED.verified_by;`,
      [
        sp.id, sp.name, sp.point_type, sp.country, sp.state, sp.district,
        sp.latitude, sp.longitude, sp.address, sp.contact, sp.capacity, sp.verified_by
      ]
    );
  }
  console.log(`  ✓ Seeded ${safePoints.length} verified safe points (shelters, hospitals, relief camps)`);

  console.log("🎉 GeoShield database seeding completed successfully!");
  await pool.end();
}

runSeed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
