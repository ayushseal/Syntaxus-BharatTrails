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
  console.error("❌ ERROR: DATABASE_URL is not set");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function seedInternationalCalamities() {
  console.log("🌐 Seeding Recent International Calamities...");

  // 1. International Sources
  const sources = [
    {
      id: "src_jma_japan",
      name: "Japan Meteorological Agency (JMA / FDMA)",
      provider: "Ministry of Land, Infrastructure, Transport and Tourism, Japan",
      country: "Japan",
      source_type: "official_govt",
      coverage: "Japan & Coastal Tsunami Corridors",
      is_official: true,
      api_endpoint: "https://www.data.jma.go.jp",
      refresh_interval_seconds: 300,
      status: "ACTIVE"
    },
    {
      id: "src_morocco_protection_civile",
      name: "Direction Générale de la Protection Civile (Morocco)",
      provider: "Ministry of Interior, Kingdom of Morocco",
      country: "Morocco",
      source_type: "official_govt",
      coverage: "Morocco Atlas Mountains & Marrakech Heritage Basin",
      is_official: true,
      api_endpoint: "https://protectioncivile.gov.ma",
      refresh_interval_seconds: 600,
      status: "ACTIVE"
    },
    {
      id: "src_libya_ncm",
      name: "National Center of Meteorology (NCM Libya)",
      provider: "Libyan Meteorological Authority & Red Crescent",
      country: "Libya",
      source_type: "official_govt",
      coverage: "Eastern Mediterranean & Cyrenaica Coastal Basin",
      is_official: true,
      api_endpoint: "https://met.gov.ly",
      refresh_interval_seconds: 900,
      status: "ACTIVE"
    },
    {
      id: "src_greece_civil_protection",
      name: "Hellenic Ministry of Climate Crisis and Civil Protection",
      provider: "Hellenic Republic (Civil Protection / 112)",
      country: "Greece",
      source_type: "official_govt",
      coverage: "Aegean Islands & Mediterranean Heritage Perimeters",
      is_official: true,
      api_endpoint: "https://civilprotection.gov.gr",
      refresh_interval_seconds: 300,
      status: "ACTIVE"
    },
    {
      id: "src_brazil_defesa_civil",
      name: "Defesa Civil do Rio Grande do Sul (CENAD)",
      provider: "Governo do Estado do Rio Grande do Sul / Ministério da Integração",
      country: "Brazil",
      source_type: "official_govt",
      coverage: "Guaíba Basin & Historic Southern Cultural Centers",
      is_official: true,
      api_endpoint: "https://defesacivil.rs.gov.br",
      refresh_interval_seconds: 600,
      status: "ACTIVE"
    }
  ];

  for (const s of sources) {
    await pool.query(
      `INSERT INTO disaster_sources (id, name, provider, country, source_type, coverage, is_official, api_endpoint, refresh_interval_seconds, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         provider = EXCLUDED.provider,
         country = EXCLUDED.country,
         api_endpoint = EXCLUDED.api_endpoint;`,
      [s.id, s.name, s.provider, s.country, s.source_type, s.coverage, s.is_official, s.api_endpoint, s.refresh_interval_seconds, s.status]
    );
  }
  console.log("  ✓ Inserted 5 International Disaster Sources");

  // 2. International Calamity Events
  const events = [
    {
      id: "evt_japan_noto_2024_demo",
      slug: "2024-japan-noto-peninsula-earthquake-replay",
      hazard_type: "EARTHQUAKE",
      title: "January 2024 Japan Noto Peninsula M7.6 Earthquake & Tsunami Replay",
      description: "HISTORICAL DEMO REPLAY: On January 1, 2024, a major Mw 7.6 earthquake struck Ishikawa Prefecture on the Noto Peninsula, triggering major coastal tsunami warnings (up to 4.2m) and severe structural destruction in historic Wajima, destroying the 1,000-year-old Wajima Morning Market (Asaichi) and severing coastal roads.",
      country: "Japan",
      state: "Ishikawa Prefecture",
      district: "Wajima & Suzu",
      severity: "RED",
      status: "HISTORICAL",
      source: "Japan Meteorological Agency (JMA) / FDMA",
      source_url: "https://www.jma.go.jp",
      source_event_id: "HIST-JMA-2024-0101",
      is_demo: true,
      started_at: "2024-01-01T07:10:00.000Z",
      ended_at: "2024-01-10T12:00:00.000Z",
      centroid_lat: 37.3916,
      centroid_lng: 136.9066,
      bbox: { west: 136.6, south: 37.1, east: 137.4, north: 37.6 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [136.65, 37.15],
            [137.35, 37.2],
            [137.45, 37.55],
            [136.85, 37.58],
            [136.65, 37.15]
          ]
        ]
      },
      affected_heritage_ids: ["wajima_asaichi", "sojiji_soin_temple", "shiroyone_senmaida"]
    },
    {
      id: "evt_morocco_alhaouz_2023_demo",
      slug: "2023-morocco-al-haouz-high-atlas-earthquake-replay",
      hazard_type: "EARTHQUAKE",
      title: "September 2023 Morocco Al-Haouz High Atlas Earthquake Replay",
      description: "HISTORICAL DEMO REPLAY: On September 8, 2023, an Mw 6.8 earthquake struck the High Atlas mountain range southwest of Marrakech. The earthquake caused catastrophic destruction across traditional Berber mountain adobe villages, damaged the UNESCO World Heritage Medina of Marrakech, and destroyed the 12th-century Tinmal Mosque.",
      country: "Morocco",
      state: "Marrakech-Safi",
      district: "Al-Haouz & High Atlas",
      severity: "RED",
      status: "HISTORICAL",
      source: "Direction Générale de la Protection Civile (Morocco)",
      source_url: "https://protectioncivile.gov.ma",
      source_event_id: "HIST-MAR-2023-0908",
      is_demo: true,
      started_at: "2023-09-08T22:11:00.000Z",
      ended_at: "2023-09-18T18:00:00.000Z",
      centroid_lat: 31.1107,
      centroid_lng: -8.4116,
      bbox: { west: -8.8, south: 30.8, east: -7.9, north: 31.7 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-8.75, 30.9],
            [-8.05, 30.95],
            [-7.95, 31.65],
            [-8.65, 31.68],
            [-8.75, 30.9]
          ]
        ]
      },
      affected_heritage_ids: ["marrakech_medina", "tinmal_mosque", "kasbah_telouet"]
    },
    {
      id: "evt_libya_derna_2023_demo",
      slug: "2023-libya-derna-cyclone-daniel-dam-collapse-replay",
      hazard_type: "FLOOD",
      title: "September 2023 Libya Derna Cyclone Daniel & Dam Failure Replay",
      description: "HISTORICAL DEMO REPLAY: On September 10, 2023, Mediterranean tropical-like cyclone 'Daniel' dumped over 400 mm of torrential rain on eastern Libya within 24 hours, triggering the catastrophic sequential failure of the Abu Mansur and Derna dams. A 7-meter flash flood wave swept away entire quarters of ancient Derna and threatened Cyrenaica archaeological sites.",
      country: "Libya",
      state: "Derna District",
      district: "Jabal al Akhdar / Derna",
      severity: "RED",
      status: "HISTORICAL",
      source: "National Center of Meteorology (Libya) / Red Crescent",
      source_url: "https://met.gov.ly",
      source_event_id: "HIST-LBY-2023-0910",
      is_demo: true,
      started_at: "2023-09-10T18:00:00.000Z",
      ended_at: "2023-09-16T12:00:00.000Z",
      centroid_lat: 32.7634,
      centroid_lng: 22.6367,
      bbox: { west: 22.3, south: 32.5, east: 23.0, north: 32.95 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [22.35, 32.55],
            [22.95, 32.58],
            [22.98, 32.92],
            [22.42, 32.9],
            [22.35, 32.55]
          ]
        ]
      },
      affected_heritage_ids: ["ancient_cyrene", "apollonia_port", "derna_old_medina"]
    },
    {
      id: "evt_greece_rhodes_2023_demo",
      slug: "2023-greece-rhodes-mediterranean-wildfires-replay",
      hazard_type: "WILDFIRE",
      title: "July 2023 Greece Rhodes Island Wildfire Evacuation Replay",
      description: "HISTORICAL DEMO REPLAY: During an unprecedented Mediterranean heatwave in July 2023, uncontrollable wildfires raged for 11 days across Rhodes island, prompting Greece's largest recorded tourist evacuation of over 19,000 visitors. Fire fronts burned towards historic mountain villages, threatening approaches to the Lindos Acropolis and medieval fortifications.",
      country: "Greece",
      state: "South Aegean",
      district: "Rhodes Island",
      severity: "ORANGE",
      status: "HISTORICAL",
      source: "Hellenic Civil Protection / 112 Emergency Feed",
      source_url: "https://civilprotection.gov.gr",
      source_event_id: "HIST-GRC-2023-0722",
      is_demo: true,
      started_at: "2023-07-18T10:00:00.000Z",
      ended_at: "2023-07-29T20:00:00.000Z",
      centroid_lat: 36.1428,
      centroid_lng: 28.0269,
      bbox: { west: 27.75, south: 35.85, east: 28.25, north: 36.45 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [27.8, 35.95],
            [28.2, 36.0],
            [28.22, 36.35],
            [27.85, 36.38],
            [27.8, 35.95]
          ]
        ]
      },
      affected_heritage_ids: ["rhodes_medieval_city", "lindos_acropolis", "asklipio_castle"]
    },
    {
      id: "evt_brazil_flood_2024_demo",
      slug: "2024-brazil-rio-grande-do-sul-catastrophic-inundation-replay",
      hazard_type: "FLOOD",
      title: "May 2024 Brazil Rio Grande do Sul Catastrophic Inundation Replay",
      description: "HISTORICAL DEMO REPLAY: In May 2024, catastrophic rainfall over Rio Grande do Sul caused the Guaíba River to reach a record 5.35 meters, submerging Porto Alegre's historic center, the Salgado Filho International Airport, and regional colonial heritage buildings across 478 municipalities.",
      country: "Brazil",
      state: "Rio Grande do Sul",
      district: "Porto Alegre / Guaíba Basin",
      severity: "RED",
      status: "HISTORICAL",
      source: "Defesa Civil do Rio Grande do Sul (CENAD)",
      source_url: "https://defesacivil.rs.gov.br",
      source_event_id: "HIST-BRA-2024-0503",
      is_demo: true,
      started_at: "2024-05-02T06:00:00.000Z",
      ended_at: "2024-05-20T18:00:00.000Z",
      centroid_lat: -30.0346,
      centroid_lng: -51.2177,
      bbox: { west: -51.5, south: -30.3, east: -50.9, north: -29.8 },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-51.45, -30.25],
            [-50.95, -30.2],
            [-50.92, -29.85],
            [-51.42, -29.88],
            [-51.45, -30.25]
          ]
        ]
      },
      affected_heritage_ids: ["usina_do_gasometro", "theatro_sao_pedro", "mercado_publico_poa"]
    }
  ];

  for (const e of events) {
    await pool.query(
      `INSERT INTO disaster_events (id, slug, hazard_type, title, description, country, state, district, severity, status, source, source_url, source_event_id, is_demo, started_at, ended_at, centroid_lat, centroid_lng, bbox, geometry, affected_heritage_ids)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         description = EXCLUDED.description,
         country = EXCLUDED.country,
         state = EXCLUDED.state,
         district = EXCLUDED.district,
         severity = EXCLUDED.severity,
         status = EXCLUDED.status,
         source = EXCLUDED.source,
         centroid_lat = EXCLUDED.centroid_lat,
         centroid_lng = EXCLUDED.centroid_lng,
         bbox = EXCLUDED.bbox,
         geometry = EXCLUDED.geometry;`,
      [
        e.id, e.slug, e.hazard_type, e.title, e.description, e.country, e.state, e.district,
        e.severity, e.status, e.source, e.source_url, e.source_event_id, e.is_demo, e.started_at,
        e.ended_at, e.centroid_lat, e.centroid_lng, JSON.stringify(e.bbox), JSON.stringify(e.geometry),
        JSON.stringify(e.affected_heritage_ids)
      ]
    );
  }
  console.log("  ✓ Inserted 5 International Calamity Events");

  // 3. Official CAP 1.2 Alerts for each scenario
  const alerts = [
    {
      id: "alt_japan_noto_2024",
      alert_identifier: "CAP-JMA-2024-TSUNAMI-0101",
      sender: "Japan Meteorological Agency / Cabinet Office",
      sent: "2024-01-01T07:15:00Z",
      status: "Exercise",
      msg_type: "Alert",
      scope: "Public",
      event: "M7.6 Earthquake & Major Tsunami Warning",
      urgency: "Immediate",
      severity: "Extreme",
      certainty: "Observed",
      headline: "JMA MAJOR TSUNAMI WARNING: Ishikawa Prefecture Coastal Zone",
      description: "Severe seismic shaking recorded intensity 7. Tsunami waves exceeding 4 meters observed along Noto Peninsula coast. Wajima Morning Market fire spreading. Highway 249 severed.",
      instruction: "Evacuate coastal and low-lying areas immediately to high ground or tsunami evacuation buildings. Dial 119 for emergency fire/rescue. Stay away from collapsed structures.",
      area_description: "Noto Peninsula, Wajima, Suzu, Nanao, Ishikawa Prefecture, Japan",
      country: "Japan",
      is_official: true,
      source_name: "JMA / FDMA Japan"
    },
    {
      id: "alt_morocco_alhaouz_2023",
      alert_identifier: "CAP-MAR-2023-QUAKE-0908",
      sender: "Direction Générale de la Protection Civile",
      sent: "2023-09-08T22:20:00Z",
      status: "Exercise",
      msg_type: "Alert",
      scope: "Public",
      event: "M6.8 High Atlas Destructive Earthquake",
      urgency: "Immediate",
      severity: "Extreme",
      certainty: "Observed",
      headline: "CIVIL PROTECTION URGENT ALERT: Al-Haouz & High Atlas Seismic Zone",
      description: "Destructive magnitude 6.8 seismic shock centered in Ighil, Al-Haouz province. Extensive masonry failure in mountain villages and historical structures. Mountain roads R203 and N7 blocked by boulder rockfalls.",
      instruction: "Avoid staying inside cracked masonry buildings. Remain in designated open squares and football fields. Call 141 for emergency medical rescue.",
      area_description: "Al-Haouz, Chichaoua, Taroudant, Marrakech-Safi, Morocco",
      country: "Morocco",
      is_official: true,
      source_name: "Protection Civile Maroc"
    },
    {
      id: "alt_libya_derna_2023",
      alert_identifier: "CAP-LBY-2023-FLOOD-0910",
      sender: "National Center of Meteorology / Red Crescent",
      sent: "2023-09-10T19:00:00Z",
      status: "Exercise",
      msg_type: "Alert",
      scope: "Public",
      event: "Catastrophic Dam Collapse Flash Flood",
      urgency: "Immediate",
      severity: "Extreme",
      certainty: "Observed",
      headline: "EXTREME EMERGENCY: Wadi Derna Dam Breach & Flash Flood Surge",
      description: "Sequential failure of Abu Mansur and Derna dams following record precipitation from Mediterranean Storm Daniel. Massive wall of water surging through central Derna basin into the sea.",
      instruction: "All citizens and visitors must immediately evacuate to high mountain plateaus surrounding Derna. Do not enter valley roads or bridges under any circumstances.",
      area_description: "Derna River Valley, Jabal al Akhdar, Cyrenaica, Libya",
      country: "Libya",
      is_official: true,
      source_name: "NCM / Libyan Red Crescent"
    },
    {
      id: "alt_greece_rhodes_2023",
      alert_identifier: "CAP-GRC-2023-FIRE-0722",
      sender: "Hellenic Ministry of Climate Crisis and Civil Protection",
      sent: "2023-07-22T11:00:00Z",
      status: "Exercise",
      msg_type: "Alert",
      scope: "Public",
      event: "Extreme Wildfire Front & Tourist Island Evacuation",
      urgency: "Immediate",
      severity: "Severe",
      certainty: "Observed",
      headline: "112 GREECE EMERGENCY ALERT: South & Central Rhodes Island Wildfire",
      description: "Severe uncontrolled wildfire front driven by gale-force winds threatening coastal resorts from Kiotari to Gennadi and Lindos perimeter. Emergency maritime and coach evacuation active.",
      instruction: "Follow Civil Protection marshals towards northern coastal rally points. Evacuate immediately if in Kiotari, Gennadi, or Pefkos. European Emergency Number: 112.",
      area_description: "Kiotari, Gennadi, Asklipio, Lindos, Rhodes Island, Greece",
      country: "Greece",
      is_official: true,
      source_name: "Hellenic 112 / Civil Protection"
    },
    {
      id: "alt_brazil_flood_2024",
      alert_identifier: "CAP-BRA-2024-INUNDACAO-0503",
      sender: "Defesa Civil do Estado do Rio Grande do Sul",
      sent: "2024-05-03T08:00:00Z",
      status: "Exercise",
      msg_type: "Alert",
      scope: "Public",
      event: "Catastrophic Basin Inundation & Levee Failure",
      urgency: "Immediate",
      severity: "Extreme",
      certainty: "Observed",
      headline: "DEFESA CIVIL ALERTA VERMELHO: Inundação Histórica do Rio Guaíba",
      description: "Guaíba water level projected above 5.3 meters, breaching flood containment dykes. Historic Downtown Porto Alegre, 4th District, and islands under deep inundation. Electricity and potable water suspended in flooded sectors.",
      instruction: "Leave flooded lowlands immediately. Seek registered municipal shelters or upper stories of sturdy concrete structures. Dial 193 (Bombeiros) or 199 (Defesa Civil).",
      area_description: "Porto Alegre, Região Metropolitana, Rio Grande do Sul, Brazil",
      country: "Brazil",
      is_official: true,
      source_name: "Defesa Civil RS / CENAD"
    }
  ];

  for (const a of alerts) {
    await pool.query(
      `INSERT INTO official_alerts (
        id, event_id, country, source_name, alert_identifier, headline, description,
        severity, urgency, certainty, category, effective_at, expires_at, language,
        instruction, area_description, is_official, fetched_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW() + INTERVAL '30 days', 'en', $12, $13, $14, NOW())
      ON CONFLICT (id) DO UPDATE SET
        headline = EXCLUDED.headline,
        description = EXCLUDED.description,
        instruction = EXCLUDED.instruction,
        severity = EXCLUDED.severity,
        country = EXCLUDED.country,
        expires_at = EXCLUDED.expires_at;`,
      [
        a.id, a.event_id || null, a.country, a.source_name, a.alert_identifier, a.headline, a.description,
        a.severity, a.urgency, a.certainty, a.category || "Safety",
        a.instruction, a.area_description, a.is_official
      ]
    );
  }
  console.log("  ✓ Inserted 5 International CAP 1.2 Alerts");

  // 4. International Verified Safe Points (Shelters / Emergency Operations)
  const safePoints = [
    // Japan
    {
      id: "sp_japan_wajima_high",
      name: "Wajima High School Evacuation Shelter",
      point_type: "SHELTER",
      country: "Japan",
      state: "Ishikawa Prefecture",
      district: "Wajima",
      latitude: 37.3820,
      longitude: 136.9140,
      address: "Kawaimachi, Wajima, Ishikawa 928-0001",
      contact: "Emergency: 119 / Disaster Center: +81 768-23-1111",
      capacity: 850,
      verified_by: "Ishikawa Prefectural Disaster HQ",
      is_verified: true
    },
    {
      id: "sp_japan_kanazawa_base",
      name: "Kanazawa Relief Staging & Trauma Center",
      point_type: "HOSPITAL",
      country: "Japan",
      state: "Ishikawa Prefecture",
      district: "Kanazawa",
      latitude: 36.5613,
      longitude: 136.6562,
      address: "Kodatsuno, Kanazawa, Ishikawa 920-8641",
      contact: "Emergency: 119 / Kanazawa Med: +81 76-265-2000",
      capacity: 1200,
      verified_by: "Japan Ministry of Health",
      is_verified: true
    },
    // Morocco
    {
      id: "sp_morocco_asni_camp",
      name: "Asni High Atlas Emergency Field Hospital",
      point_type: "RELIEF_CAMP",
      country: "Morocco",
      state: "Marrakech-Safi",
      district: "Al-Haouz",
      latitude: 31.2505,
      longitude: -7.9822,
      address: "Centre Asni, Route R203, Al-Haouz",
      contact: "Protection Civile: 141 / FAR Medical Unit",
      capacity: 900,
      verified_by: "Morocco Royal Armed Forces & Red Crescent",
      is_verified: true
    },
    {
      id: "sp_morocco_marrakech_stadium",
      name: "Grand Stade de Marrakech Relief Assembly",
      point_type: "SHELTER",
      country: "Morocco",
      state: "Marrakech-Safi",
      district: "Marrakech",
      latitude: 31.7061,
      longitude: -7.9806,
      address: "Route de Casablanca, Marrakech",
      contact: "Protection Civile: 141 / Wilaya Marrakech",
      capacity: 3500,
      verified_by: "Wilaya de Marrakech-Safi",
      is_verified: true
    },
    // Libya
    {
      id: "sp_libya_derna_high_camp",
      name: "Derna West Ridge Elevated Relief Center",
      point_type: "SHELTER",
      country: "Libya",
      state: "Derna District",
      district: "Derna West Ridge",
      latitude: 32.7520,
      longitude: 22.6150,
      address: "Western Heights, Derna Coastal Road",
      contact: "Libyan Red Crescent: 191 / +218 61 909 3012",
      capacity: 1500,
      verified_by: "Libyan Red Crescent & UN OCHA",
      is_verified: true
    },
    // Greece
    {
      id: "sp_greece_rhodes_colossus",
      name: "Rhodes North Arena Evacuation Haven",
      point_type: "SHELTER",
      country: "Greece",
      state: "South Aegean",
      district: "Rhodes Town",
      latitude: 36.4350,
      longitude: 28.2200,
      address: "Venetokleio Indoor Hall, Rhodes Town",
      contact: "European Emergency: 112 / Fire: 199",
      capacity: 2000,
      verified_by: "South Aegean Regional Administration",
      is_verified: true
    },
    // Brazil
    {
      id: "sp_brazil_pucrs_shelter",
      name: "PUCRS High-Ground Humanitarian Shelter",
      point_type: "SHELTER",
      country: "Brazil",
      state: "Rio Grande do Sul",
      district: "Porto Alegre East",
      latitude: -30.0583,
      longitude: -51.1736,
      address: "Av. Ipiranga 6681, Porto Alegre, RS",
      contact: "Defesa Civil: 199 / Bombeiros: 193",
      capacity: 2800,
      verified_by: "Defesa Civil RS & Cruz Vermelha",
      is_verified: true
    }
  ];

  for (const sp of safePoints) {
    await pool.query(
      `INSERT INTO safe_points (id, name, point_type, country, state, district, latitude, longitude, address, contact, capacity, verified_by, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       ON CONFLICT (id) DO UPDATE SET
         name = EXCLUDED.name,
         point_type = EXCLUDED.point_type,
         latitude = EXCLUDED.latitude,
         longitude = EXCLUDED.longitude,
         contact = EXCLUDED.contact,
         capacity = EXCLUDED.capacity;`,
      [
        sp.id, sp.name, sp.point_type, sp.country, sp.state, sp.district,
        sp.latitude, sp.longitude, sp.address, sp.contact, sp.capacity,
        sp.verified_by, sp.is_verified
      ]
    );
  }
  console.log("  ✓ Inserted 7 International Safe Shelters & Hospital Bases");

  console.log("🎉 Successfully seeded all recent international calamities into GeoShield!");
  await pool.end();
}

seedInternationalCalamities().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
