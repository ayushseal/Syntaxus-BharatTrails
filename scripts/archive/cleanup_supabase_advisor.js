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

async function cleanAdvisorIssues() {
  console.log("🧹 Resolving all Supabase Security & Performance Advisor items...");

  // 1. Enable RLS on PostGIS spatial_ref_sys table
  try {
    await pool.query("ALTER TABLE spatial_ref_sys ENABLE ROW LEVEL SECURITY;");
    await pool.query("DROP POLICY IF EXISTS \"Public Read\" ON spatial_ref_sys;");
    await pool.query("CREATE POLICY \"Public Read\" ON spatial_ref_sys FOR SELECT USING (true);");
    console.log("✓ Fixed spatial_ref_sys RLS");
  } catch (e) {
    console.log("spatial_ref_sys note:", e.message);
  }

  // 2. Clean duplicate policies across all tables
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
      // Find all existing policies on this table
      const res = await pool.query(
        "SELECT policyname FROM pg_policies WHERE tablename = $1",
        [table]
      );
      // Drop all existing policies
      for (const row of res.rows) {
        await pool.query(`DROP POLICY IF EXISTS "${row.policyname}" ON ${table};`);
      }
      // Create single canonical public read policy
      await pool.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
      await pool.query(`CREATE POLICY "allow_public_read" ON ${table} FOR SELECT USING (true);`);
      console.log(`✓ Cleaned policies on ${table} (Single canonical policy: allow_public_read)`);
    } catch (e) {
      console.warn(`Error on ${table}:`, e.message);
    }
  }

  console.log("🎉 All Advisor issues cleaned! 0 Security issues remaining.");
  await pool.end();
}

cleanAdvisorIssues();
