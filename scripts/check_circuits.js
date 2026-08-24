import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  connectionString: 'postgresql://postgres.zfciycigpgkeovgwlpuf:Ayushseal%4008@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres',
  ssl: { rejectUnauthorized: false }
});

async function check() {
  const cRes = await pool.query('SELECT id, name FROM circuits ORDER BY name ASC');
  console.log('Total circuits in DB:', cRes.rows.length);
  for (const c of cRes.rows) {
    const sRes = await pool.query('SELECT cs.site_id, hs.name_en FROM circuit_sites cs LEFT JOIN heritage_sites hs ON cs.site_id = hs.id WHERE cs.circuit_id = $1 ORDER BY cs.stop_order ASC', [c.id]);
    console.log(`[${c.id}] -> "${c.name}" -> ${sRes.rows.length} stops: ${sRes.rows.map(r => r.site_id).join(', ')}`);
  }
  await pool.end();
}

check();
