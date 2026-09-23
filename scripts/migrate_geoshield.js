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

async function runMigration() {
  console.log("🛡️ Running GeoShield Database Migration...");
  
  const ddlStatements = [
    // 1. Disaster Events
    `CREATE TABLE IF NOT EXISTS disaster_events (
      id VARCHAR(64) PRIMARY KEY,
      slug VARCHAR(128) UNIQUE NOT NULL,
      hazard_type VARCHAR(50) NOT NULL,
      title VARCHAR(500) NOT NULL,
      description TEXT,
      country VARCHAR(100) NOT NULL DEFAULT 'India',
      state VARCHAR(100),
      district VARCHAR(100),
      severity VARCHAR(20) NOT NULL DEFAULT 'YELLOW',
      status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
      source VARCHAR(200) NOT NULL,
      source_url TEXT,
      source_event_id VARCHAR(100),
      is_demo BOOLEAN DEFAULT FALSE,
      started_at TIMESTAMP WITH TIME ZONE NOT NULL,
      ended_at TIMESTAMP WITH TIME ZONE,
      published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      centroid_lat DECIMAL(10, 7),
      centroid_lng DECIMAL(10, 7),
      bbox JSONB,
      geometry JSONB,
      affected_heritage_ids JSONB DEFAULT '[]'::JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // 2. Official Alerts
    `CREATE TABLE IF NOT EXISTS official_alerts (
      id VARCHAR(64) PRIMARY KEY,
      event_id VARCHAR(64) REFERENCES disaster_events(id) ON DELETE SET NULL,
      country VARCHAR(100) NOT NULL DEFAULT 'India',
      source_name VARCHAR(200) NOT NULL,
      alert_identifier VARCHAR(200),
      headline VARCHAR(500) NOT NULL,
      description TEXT,
      severity VARCHAR(20) NOT NULL,
      urgency VARCHAR(20) NOT NULL,
      certainty VARCHAR(20) NOT NULL,
      category VARCHAR(50),
      effective_at TIMESTAMP WITH TIME ZONE,
      expires_at TIMESTAMP WITH TIME ZONE,
      language VARCHAR(10) DEFAULT 'en',
      instruction TEXT,
      area_description TEXT,
      area_polygon JSONB,
      cap_payload JSONB,
      is_official BOOLEAN DEFAULT TRUE,
      fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // 3. Hazard Zones
    `CREATE TABLE IF NOT EXISTS hazard_zones (
      id VARCHAR(64) PRIMARY KEY,
      event_id VARCHAR(64) REFERENCES disaster_events(id) ON DELETE CASCADE,
      zone_type VARCHAR(50) NOT NULL,
      severity VARCHAR(20) NOT NULL,
      geometry JSONB NOT NULL,
      source VARCHAR(200) NOT NULL,
      valid_from TIMESTAMP WITH TIME ZONE,
      valid_until TIMESTAMP WITH TIME ZONE,
      confidence VARCHAR(20) DEFAULT 'MEDIUM',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // 4. Safe Points
    `CREATE TABLE IF NOT EXISTS safe_points (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      point_type VARCHAR(50) NOT NULL,
      country VARCHAR(100) NOT NULL DEFAULT 'India',
      state VARCHAR(100),
      district VARCHAR(100),
      latitude DECIMAL(10, 7) NOT NULL,
      longitude DECIMAL(10, 7) NOT NULL,
      address TEXT,
      contact VARCHAR(200),
      capacity INT,
      verified_by VARCHAR(200),
      is_verified BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // 5. Weather Cache
    `CREATE TABLE IF NOT EXISTS weather_cache (
      id VARCHAR(64) PRIMARY KEY,
      source VARCHAR(50) NOT NULL,
      latitude DECIMAL(10, 7) NOT NULL,
      longitude DECIMAL(10, 7) NOT NULL,
      temperature DECIMAL(5, 2),
      precipitation DECIMAL(8, 2),
      wind_speed DECIMAL(6, 2),
      weather_code INT,
      observed_at TIMESTAMP WITH TIME ZONE NOT NULL,
      raw_payload JSONB,
      fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // 6. Disaster Data Sources Registry
    `CREATE TABLE IF NOT EXISTS disaster_sources (
      id VARCHAR(64) PRIMARY KEY,
      name VARCHAR(200) NOT NULL,
      provider VARCHAR(200),
      country VARCHAR(100) DEFAULT 'India',
      source_type VARCHAR(50) NOT NULL,
      coverage VARCHAR(200),
      is_official BOOLEAN DEFAULT TRUE,
      api_endpoint TEXT,
      refresh_interval_seconds INT DEFAULT 900,
      last_success_at TIMESTAMP WITH TIME ZONE,
      last_failure_at TIMESTAMP WITH TIME ZONE,
      status VARCHAR(20) DEFAULT 'ACTIVE'
    );`,

    // 7. PARTH Chat Sessions & Messages
    `CREATE TABLE IF NOT EXISTS parth_sessions (
      id VARCHAR(64) PRIMARY KEY,
      country VARCHAR(100) DEFAULT 'India',
      user_context JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    `CREATE TABLE IF NOT EXISTS parth_messages (
      id VARCHAR(64) PRIMARY KEY,
      session_id VARCHAR(64) NOT NULL REFERENCES parth_sessions(id) ON DELETE CASCADE,
      role VARCHAR(20) NOT NULL,
      message TEXT NOT NULL,
      tool_calls JSONB,
      source_references JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );`,

    // Indexes
    `CREATE INDEX IF NOT EXISTS idx_disaster_events_geo ON disaster_events(centroid_lat, centroid_lng);`,
    `CREATE INDEX IF NOT EXISTS idx_disaster_events_status ON disaster_events(status);`,
    `CREATE INDEX IF NOT EXISTS idx_disaster_events_country ON disaster_events(country);`,
    `CREATE INDEX IF NOT EXISTS idx_official_alerts_expires ON official_alerts(expires_at);`,
    `CREATE INDEX IF NOT EXISTS idx_official_alerts_event ON official_alerts(event_id);`,
    `CREATE INDEX IF NOT EXISTS idx_hazard_zones_event ON hazard_zones(event_id);`,
    `CREATE INDEX IF NOT EXISTS idx_safe_points_geo ON safe_points(latitude, longitude);`,
    `CREATE INDEX IF NOT EXISTS idx_weather_cache_geo ON weather_cache(latitude, longitude);`,
    `CREATE INDEX IF NOT EXISTS idx_parth_messages_session ON parth_messages(session_id, created_at);`,

    // RLS
    `ALTER TABLE disaster_events ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE official_alerts ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE hazard_zones ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE safe_points ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE weather_cache ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE disaster_sources ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE parth_sessions ENABLE ROW LEVEL SECURITY;`,
    `ALTER TABLE parth_messages ENABLE ROW LEVEL SECURITY;`
  ];

  for (const sql of ddlStatements) {
    try {
      await pool.query(sql);
      const firstLine = sql.trim().split("\n")[0];
      console.log(`  ✓ ${firstLine.substring(0, 60)}...`);
    } catch (err) {
      console.error("  ❌ Error running statement:", err.message);
    }
  }

  // Add RLS Policies
  const policies = [
    `DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Events' AND tablename = 'disaster_events') THEN
          CREATE POLICY "Public Read Events" ON disaster_events FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Alerts' AND tablename = 'official_alerts') THEN
          CREATE POLICY "Public Read Alerts" ON official_alerts FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Zones' AND tablename = 'hazard_zones') THEN
          CREATE POLICY "Public Read Zones" ON hazard_zones FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Safe Points' AND tablename = 'safe_points') THEN
          CREATE POLICY "Public Read Safe Points" ON safe_points FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Weather' AND tablename = 'weather_cache') THEN
          CREATE POLICY "Public Read Weather" ON weather_cache FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Sources' AND tablename = 'disaster_sources') THEN
          CREATE POLICY "Public Read Sources" ON disaster_sources FOR SELECT USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Parth Sessions' AND tablename = 'parth_sessions') THEN
          CREATE POLICY "Public Read Parth Sessions" ON parth_sessions FOR ALL USING (true);
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Read Parth Messages' AND tablename = 'parth_messages') THEN
          CREATE POLICY "Public Read Parth Messages" ON parth_messages FOR ALL USING (true);
      END IF;
    END $$;`
  ];

  for (const pol of policies) {
    try {
      await pool.query(pol);
      console.log("  ✓ RLS Policies configured");
    } catch (err) {
      console.error("  ❌ Policy error:", err.message);
    }
  }

  console.log("🎉 GeoShield migration completed successfully!");
  await pool.end();
}

runMigration().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
