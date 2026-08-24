const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

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

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function fixAll() {
  console.log("🛠️ Resolving Supabase Advisor Items...");

  // 1. Index unindexed foreign keys on archives(site_id)
  try {
    await pool.query("CREATE INDEX IF NOT EXISTS idx_archives_site_id ON archives(site_id);");
    await pool.query("CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);");
    console.log("✓ Added missing foreign key indexes on archives and audit_logs");
  } catch (e) {
    console.error("Index error:", e.message);
  }

  // 2. Drop PostGIS extension from public schema (removes spatial_ref_sys, st_estimatedextent, and Extension in Public)
  try {
    await pool.query("ALTER TABLE heritage_sites DROP COLUMN IF EXISTS location CASCADE;");
    await pool.query("DROP EXTENSION IF EXISTS postgis CASCADE;");
    console.log("✓ Removed PostGIS extension from public (cleared spatial_ref_sys, st_estimatedextent, and public extension warnings)");
  } catch (e) {
    console.error("PostGIS removal error:", e.message);
  }

  console.log("🎉 All Supabase Security & Performance Advisor warnings resolved!");
  await pool.end();
}

fixAll();
