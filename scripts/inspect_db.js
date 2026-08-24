const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const envContent = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf-8');
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
    const idx = trimmed.indexOf('=');
    const key = trimmed.substring(0, idx).trim();
    const val = trimmed.substring(idx + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function main() {
  console.log('=== Tables and RLS Status ===');
  const tables = await pool.query(`
    SELECT tablename, rowsecurity 
    FROM pg_tables 
    WHERE schemaname = 'public'
    ORDER BY tablename;
  `);
  tables.rows.forEach(r => {
    console.log(`Table: ${r.tablename.padEnd(28)} | RLS Enabled: ${r.rowsecurity}`);
  });

  console.log('\n=== Foreign Keys in Public ===');
  const fks = await pool.query(`
    SELECT
      c.conrelid::regclass AS table_name,
      a.attname AS column_name,
      c.conname AS foreign_key_name
    FROM pg_constraint c
    JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
    WHERE c.contype = 'f' AND c.connamespace = 'public'::regnamespace
    ORDER BY table_name, column_name;
  `);
  fks.rows.forEach(r => {
    console.log(`FK on Table: ${r.table_name.padEnd(26)} | Column: ${r.column_name.padEnd(20)} | Name: ${r.foreign_key_name}`);
  });

  console.log('\n=== All Indexes in Public ===');
  const idxs = await pool.query(`
    SELECT tablename, indexname, indexdef
    FROM pg_indexes
    WHERE schemaname = 'public'
    ORDER BY tablename, indexname;
  `);
  idxs.rows.forEach(r => {
    console.log(`Table: ${r.tablename.padEnd(26)} | Index: ${r.indexname}`);
  });

  await pool.end();
}
main();
