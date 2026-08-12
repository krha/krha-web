import { ensureAnalyticsSchema, getAnalyticsDb } from "../../db";
import { SMALL_GROUP_THRESHOLD } from "./model";

type AnalyticsRow = {
  bucket: string;
  dimension: string;
  value: string;
  count: number;
};

export type BreakdownItem = { value: string; count: number };

export type AnalyticsReport = {
  days: number;
  startDate: string;
  endDate: string;
  totalPageviews: number;
  previousPageviews: number;
  pageviewChange: number | null;
  totalInteractions: number;
  daily: Array<{ date: string; count: number }>;
  hours: BreakdownItem[];
  pages: BreakdownItem[];
  referrers: BreakdownItem[];
  countries: BreakdownItem[];
  devices: BreakdownItem[];
  browsers: BreakdownItem[];
  operatingSystems: BreakdownItem[];
  languages: BreakdownItem[];
  viewports: BreakdownItem[];
  outboundDestinations: BreakdownItem[];
  outboundGroups: BreakdownItem[];
  sectionViews: BreakdownItem[];
  sectionNavigation: BreakdownItem[];
};

export async function getAnalyticsReport(
  days: number,
  now = new Date(),
): Promise<AnalyticsReport> {
  const endExclusive = startOfUtcDay(now);
  endExclusive.setUTCDate(endExclusive.getUTCDate() + 1);
  const currentStart = new Date(endExclusive);
  currentStart.setUTCDate(currentStart.getUTCDate() - days);
  const previousStart = new Date(currentStart);
  previousStart.setUTCDate(previousStart.getUTCDate() - days);

  const db = getAnalyticsDb();
  await ensureAnalyticsSchema(db);
  const result = await readAnalyticsRows(
    db,
    dayString(previousStart),
    dayString(endExclusive),
  );

  const rows = result.results ?? [];
  const currentRows = rows.filter((row) => row.bucket >= dayString(currentStart));
  const previousRows = rows.filter((row) => row.bucket < dayString(currentStart));
  const totalPageviews = totalFor(currentRows, "total", "pageview");
  const previousPageviews = totalFor(previousRows, "total", "pageview");

  return {
    days,
    startDate: dayString(currentStart),
    endDate: dayString(new Date(endExclusive.getTime() - 1)),
    totalPageviews,
    previousPageviews,
    pageviewChange:
      previousPageviews === 0
        ? null
        : ((totalPageviews - previousPageviews) / previousPageviews) * 100,
    totalInteractions: sumDimension(currentRows, "event"),
    daily: dailySeries(currentRows, currentStart, days),
    hours: breakdown(currentRows, "hour", { limit: 24 }),
    pages: breakdown(currentRows, "path"),
    referrers: breakdown(currentRows, "referrer"),
    countries: breakdown(currentRows, "country"),
    devices: breakdown(currentRows, "device"),
    browsers: breakdown(currentRows, "browser"),
    operatingSystems: breakdown(currentRows, "os"),
    languages: breakdown(currentRows, "language"),
    viewports: breakdown(currentRows, "viewport"),
    outboundDestinations: breakdown(currentRows, "event:outbound_click"),
    outboundGroups: breakdown(currentRows, "event:outbound_group"),
    sectionViews: breakdown(currentRows, "event:section_view"),
    sectionNavigation: breakdown(currentRows, "event:section_navigation"),
  };
}

async function readAnalyticsRows(
  db: D1Database,
  startDate: string,
  endDate: string,
) {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await db
        .prepare(
          `SELECT bucket, dimension, value, count
           FROM analytics_counts
           WHERE bucket >= ? AND bucket < ?
           ORDER BY bucket ASC`,
        )
        .bind(startDate, endDate)
        .all<AnalyticsRow>();
    } catch (error) {
      lastError = error;
      if (attempt < 2) await new Promise((resolve) => setTimeout(resolve, 20));
    }
  }
  throw lastError;
}

function breakdown(
  rows: AnalyticsRow[],
  dimension: string,
  options: { limit?: number } = {},
): BreakdownItem[] {
  const { limit = 8 } = options;
  const totals = new Map<string, number>();

  for (const row of rows) {
    if (row.dimension !== dimension) continue;
    totals.set(row.value, (totals.get(row.value) ?? 0) + Number(row.count));
  }

  let items = Array.from(totals, ([value, count]) => ({ value, count }));
  const smallCount = items
    .filter((item) => item.count < SMALL_GROUP_THRESHOLD)
    .reduce((sum, item) => sum + item.count, 0);
  items = items.filter((item) => item.count >= SMALL_GROUP_THRESHOLD);
  if (smallCount > 0) {
    items.push({ value: "Other / limited data", count: smallCount });
  }

  return items.sort((a, b) => b.count - a.count || a.value.localeCompare(b.value)).slice(0, limit);
}

function dailySeries(
  rows: AnalyticsRow[],
  start: Date,
  days: number,
): Array<{ date: string; count: number }> {
  const totals = new Map<string, number>();
  for (const row of rows) {
    if (row.dimension !== "total" || row.value !== "pageview") continue;
    totals.set(row.bucket, (totals.get(row.bucket) ?? 0) + Number(row.count));
  }

  return Array.from({ length: days }, (_, index) => {
    const date = new Date(start);
    date.setUTCDate(date.getUTCDate() + index);
    const key = dayString(date);
    return { date: key, count: totals.get(key) ?? 0 };
  });
}

function totalFor(rows: AnalyticsRow[], dimension: string, value: string): number {
  return rows
    .filter((row) => row.dimension === dimension && row.value === value)
    .reduce((sum, row) => sum + Number(row.count), 0);
}

function sumDimension(rows: AnalyticsRow[], dimension: string): number {
  return rows
    .filter((row) => row.dimension === dimension)
    .reduce((sum, row) => sum + Number(row.count), 0);
}

function startOfUtcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function dayString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
