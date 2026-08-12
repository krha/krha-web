import { env } from "cloudflare:workers";

const CREATE_ANALYTICS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS analytics_counts (
    bucket TEXT NOT NULL,
    dimension TEXT NOT NULL,
    value TEXT NOT NULL,
    count INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (bucket, dimension, value)
  )
`;

const CREATE_ANALYTICS_INGEST_LIMITS_SQL = `
  CREATE TABLE IF NOT EXISTS analytics_ingest_limits (
    window_start TEXT PRIMARY KEY NOT NULL,
    count INTEGER NOT NULL DEFAULT 0
  )
`;

let schemaReady = false;

export function getAnalyticsDb(): D1Database {
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set `d1` to `DB` in .openai/hosting.json and deploy the generated migration.",
    );
  }

  return env.DB;
}

export async function ensureAnalyticsSchema(
  db = getAnalyticsDb(),
): Promise<void> {
  if (schemaReady) return;
  await db.batch([
    db.prepare(CREATE_ANALYTICS_TABLE_SQL),
    db.prepare(CREATE_ANALYTICS_INGEST_LIMITS_SQL),
  ]);
  schemaReady = true;
}
