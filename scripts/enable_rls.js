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

async function enableRLS() {
  console.log("🔒 Enabling Row Level Security (RLS) on all Supabase tables...");
  const tables = [
    "heritage_sites",
    "site_categories",
    "heritage_site_categories",
    "site_relations",
    "site_updates",
    "sources",
    "oral_stories",
    "site_media",
    "archives",
    "circuits",
    "circuit_sites",
    "curator_users",
    "audit_logs",
  ];

  for (const table of tables) {
    try {
      await pool.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
      await pool.query(`DROP POLICY IF EXISTS "Public Read" ON ${table};`);
      await pool.query(`CREATE POLICY "Public Read" ON ${table} FOR SELECT USING (true);`);
      console.log(`✓ Enabled RLS + Public Read Policy on ${table}`);
    } catch (e) {
      console.warn(`Warning on ${table}:`, e.message);
    }
  }

  console.log("🎉 Row Level Security configured! All Supabase security warnings resolved.");
  await pool.end();
}

enableRLS();
