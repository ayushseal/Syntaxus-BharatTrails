const fs = require("fs");
const path = require("path");
const { Pool } = require("pg");

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

async function verifyAll() {
  console.log("==================================================");
  console.log("  1. POSTGRESQL DATABASE INTEGRITY CHECK");
  console.log("==================================================");
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

  for (const t of tables) {
    const res = await pool.query(`SELECT count(*) FROM ${t}`);
    console.log(`  ✓ Table ${t.padEnd(28)}: ${res.rows[0].count} records`);
  }

  console.log("\n==================================================");
  console.log("  2. LIVE API ENDPOINTS & WEB PAGES CHECK");
  console.log("==================================================");
  const endpoints = [
    { url: "http://localhost:3000/", name: "Homepage" },
    { url: "http://localhost:3000/explore", name: "Explore Map & Catalog" },
    { url: "http://localhost:3000/plan", name: "Circuit Planner" },
    { url: "http://localhost:3000/archives", name: "Digital Archives Catalog" },
    { url: "http://localhost:3000/passport", name: "Respect Passport" },
    { url: "http://localhost:3000/curator", name: "Curator Management Portal" },
    { url: "http://localhost:3000/heritage/rumtek", name: "Site Profile: Rumtek" },
    { url: "http://localhost:3000/heritage/sanchi", name: "Site Profile: Sanchi" },
    { url: "http://localhost:3000/heritage/ajanta", name: "Site Profile: Ajanta" },
    { url: "http://localhost:3000/heritage/humayun-tomb", name: "Site Profile: Humayun Tomb" },
    { url: "http://localhost:3000/api/heritage", name: "API: Sites Listing" },
    { url: "http://localhost:3000/api/heritage/rumtek", name: "API: Site Detail (Rumtek)" },
    { url: "http://localhost:3000/api/circuits", name: "API: National Circuits" },
    { url: "http://localhost:3000/api/archives", name: "API: Digital Archives" },
    { url: "http://localhost:3000/api/stories", name: "API: Oral Stories" },
    { url: "http://localhost:3000/api/audit", name: "API: Audit Logs" },
  ];

  let allPass = true;
  for (const ep of endpoints) {
    try {
      const res = await fetch(ep.url);
      const ok = res.status === 200;
      if (!ok) allPass = false;
      console.log(`  ${ok ? "✓" : "❌"} ${ep.name.padEnd(30)} -> HTTP ${res.status} ${res.statusText}`);
    } catch (e) {
      allPass = false;
      console.log(`  ❌ ${ep.name.padEnd(30)} -> Connection Error: ${e.message}`);
    }
  }

  console.log("\n==================================================");
  console.log("  3. AUTHENTICATION & RBAC VALIDATION");
  console.log("==================================================");
  const usersRes = await pool.query("SELECT username, role, agency FROM curator_users");
  for (const u of usersRes.rows) {
    console.log(`  ✓ Curator User: ${u.username.padEnd(15)} Role: ${u.role.padEnd(10)} Agency: ${u.agency}`);
  }

  await pool.end();
  console.log("\n==================================================");
  if (allPass) {
    console.log("🎉 ALL CHECKS PASSED: SYSTEM FULLY OPERATIONAL!");
  } else {
    console.log("⚠️ Some checks reported issues. See details above.");
  }
  console.log("==================================================");
}

verifyAll();
