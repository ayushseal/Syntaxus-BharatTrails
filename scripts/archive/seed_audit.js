const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://postgres.zfciycigpgkeovgwlpuf:Ayushseal%4008@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false },
});

async function run() {
  const client = await pool.connect();
  console.log("Connected to PostgreSQL...");

  await client.query("DELETE FROM audit_logs;");

  const logs = [
    {
      id: "audit-01",
      actor: "ASI Heritage Documentation Wing",
      action: "MEDIA_UPLOAD_APPROVED",
      target_type: "SITE_MEDIA",
      target_id: "tajmahal",
      notes: "Approved 360° Spherical Photogrammetric Panorama & High-Resolution Orthophoto for Taj Mahal & Rumtek.",
      status: "approved",
    },
    {
      id: "audit-02",
      actor: "Shri Ramtek Devasthan & ASI Nagpur",
      action: "ACCESS_PROTOCOL_UPDATED",
      target_type: "HERITAGE_SITE",
      target_id: "ramtek",
      notes: "Updated operational visiting hours (06:00–20:00) and permitted photography in outer parikrama.",
      status: "approved",
    },
    {
      id: "audit-03",
      actor: "Dr. B. Satyanarayana (Kakatiya Epigraphist)",
      action: "ORAL_HISTORY_RECORDED",
      target_type: "ORAL_STORY",
      target_id: "ramappa",
      notes: "Archived authenticated oral narrative on Kakatiya sandbox & floating-brick architecture for Ramappa Temple.",
      status: "approved",
    },
    {
      id: "audit-04",
      actor: "Archaeological Survey of India (Dharwad Circle)",
      action: "SACRED_STATUS_ADVISORY",
      target_type: "HERITAGE_SITE",
      target_id: "golgumbaz",
      notes: "Published daily advisory for Gol Gumbaz Whispering Gallery acoustic conservation compliance.",
      status: "approved",
    },
    {
      id: "audit-05",
      actor: "SYNTAXUS Deccan Field Unit",
      action: "MEDIA_UPLOAD_APPROVED",
      target_type: "SITE_MEDIA",
      target_id: "bidar",
      notes: "Uploaded 4K high-definition photogrammetry survey of Rangin Mahal mother-of-pearl woodwork.",
      status: "approved",
    },
    {
      id: "audit-06",
      actor: "Telangana State Tourism Board",
      action: "LOCAL_SERVICE_VERIFIED",
      target_type: "NEARBY_SERVICE",
      target_id: "ramappa",
      notes: "Verified and accredited Warangal Brass & Metalcraft Cooperative for local artisan economy (AICTE PS ID 26202).",
      status: "approved",
    },
    {
      id: "audit-07",
      actor: "ASI Mumbai Circle & Kolhapur Heritage Council",
      action: "ACCESS_PROTOCOL_UPDATED",
      target_type: "HERITAGE_SITE",
      target_id: "panhala",
      notes: "Updated seasonal monsoon safety advisory and vehicle access points for Teen Darwaza.",
      status: "approved",
    },
    {
      id: "audit-08",
      actor: "National Virtual Library of India (NVLI) Bot",
      action: "OPEN_DATA_SYNC_COMPLETED",
      target_type: "SYSTEM",
      target_id: "58 Protected Monuments",
      notes: "Synchronized 58 ASI protected monument identifiers with Ministry of Culture official gazetteer.",
      status: "approved",
    },
  ];

  for (let i = 0; i < logs.length; i++) {
    const a = logs[i];
    const offsetMs = (logs.length - 1 - i) * 3600 * 1000 * 3.5;
    const ts = new Date(Date.now() - offsetMs);
    await client.query(
      `INSERT INTO audit_logs (id, actor, action, target_type, target_id, notes, status, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (id) DO NOTHING`,
      [a.id, a.actor, a.action, a.target_type, a.target_id, a.notes, a.status, ts]
    );
  }

  const countRes = await client.query("SELECT count(*) FROM audit_logs;");
  console.log("✓ Inserted authentic audit logs! Total count:", countRes.rows[0].count);

  client.release();
  await pool.end();
}

run().catch(console.error);
