import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

/**
 * Privacy-preserving analytics are stored only as aggregate counters. There is
 * intentionally no event table, visitor id, session id, IP address, or raw
 * user-agent column.
 */
export const analyticsCounts = sqliteTable(
  "analytics_counts",
  {
    bucket: text("bucket").notNull(),
    dimension: text("dimension").notNull(),
    value: text("value").notNull(),
    count: integer("count").notNull().default(0),
  },
  (table) => [
    primaryKey({
      name: "analytics_counts_bucket_dimension_value_pk",
      columns: [table.bucket, table.dimension, table.value],
    }),
  ],
);

/**
 * A short-lived, site-wide request counter caps ingestion without creating a
 * per-person or per-device rate-limit identifier.
 */
export const analyticsIngestLimits = sqliteTable("analytics_ingest_limits", {
  windowStart: text("window_start").primaryKey(),
  count: integer("count").notNull().default(0),
});
