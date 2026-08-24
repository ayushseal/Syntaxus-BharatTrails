import { Pool, QueryResult, QueryResultRow } from "pg";

let pool: Pool | null = null;

export function getDbPool(): Pool | null {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  try {
    const isLocalhost = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
    pool = new Pool({
      connectionString,
      ssl: isLocalhost ? false : { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      console.error("[PostgreSQL] Unexpected client error:", err);
    });

    return pool;
  } catch (err) {
    console.error("[PostgreSQL] Failed to initialize connection pool:", err);
    return null;
  }
}

export async function query<T extends QueryResultRow = any>(
  text: string,
  params?: any[]
): Promise<QueryResult<T> | null> {
  const activePool = getDbPool();
  if (!activePool) {
    return null;
  }

  try {
    const start = Date.now();
    const res = await activePool.query<T>(text, params);
    const duration = Date.now() - start;
    if (process.env.NODE_ENV === "development" && duration > 200) {
      console.log(`[PostgreSQL Query] (${duration}ms) ${text.substring(0, 80)}...`);
    }
    return res;
  } catch (err) {
    console.error("[PostgreSQL Query Error]:", err, "SQL:", text);
    throw err;
  }
}

export async function isDbConnected(): Promise<boolean> {
  try {
    const res = await query("SELECT 1 as health_check");
    return !!res && res.rowCount ? res.rowCount > 0 : false;
  } catch {
    return false;
  }
}
