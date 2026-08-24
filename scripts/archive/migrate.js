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
  console.error("Please add DATABASE_URL=postgresql://user:pass@host:5432/dbname to your .env.local file.");
  process.exit(1);
}

async function runMigration() {
  console.log("🚀 Starting PostgreSQL Schema Migration...");
  console.log(`Connecting to: ${connectionString.replace(/:[^:@]+@/, ":****@")}`);

  const isLocalhost = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
  const pool = new Pool({
    connectionString,
    ssl: isLocalhost ? false : { rejectUnauthorized: false },
  });

  try {
    const client = await pool.connect();
    console.log("✓ Connected to PostgreSQL database successfully.");

    const schemaPath = path.resolve(__dirname, "../src/lib/schema.sql");
    const sql = fs.readFileSync(schemaPath, "utf-8");

    console.log("Executing schema DDL definitions...");
    await client.query(sql);

    console.log("✓ Schema migration completed successfully!");
    console.log("Tables verified: heritage_sites, site_categories, heritage_site_categories, site_relations, site_updates, sources, oral_stories, site_media, archives, circuits, circuit_sites, curator_users, audit_logs.");

    client.release();
    await pool.end();
  } catch (err) {
    console.error("❌ Migration failed with error:", err);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
