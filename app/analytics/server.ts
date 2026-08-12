import { ensureAnalyticsSchema, getAnalyticsDb } from "../../db";
import {
  ANALYTICS_EVENTS_PER_MINUTE,
  retentionStartDate,
  type AnalyticsPayload,
} from "./model";

type RequestWithCloudflare = Request & {
  cf?: { country?: string };
};

type Counter = { dimension: string; value: string };

const UPSERT_COUNTER_SQL = `
  INSERT INTO analytics_counts (bucket, dimension, value, count)
  VALUES (?, ?, ?, 1)
  ON CONFLICT (bucket, dimension, value)
  DO UPDATE SET count = count + 1
`;

const CONSUME_INGEST_CAPACITY_SQL = `
  INSERT INTO analytics_ingest_limits (window_start, count)
  VALUES (?, 1)
  ON CONFLICT (window_start)
  DO UPDATE SET count = count + 1
  WHERE analytics_ingest_limits.count < ?
  RETURNING count
`;

const ALLOWED_ANALYTICS_HOSTS = new Set([
  "krha.kr",
  "localhost",
  "127.0.0.1",
  "[::1]",
]);

let localIngestWindow = "";
let localIngestCount = 0;

export function honorsPrivacySignal(request: Request): boolean {
  return (
    request.headers.get("sec-gpc") === "1" ||
    request.headers.get("dnt") === "1"
  );
}

export function isSameOriginAnalyticsRequest(request: Request): boolean {
  const fetchSite = request.headers.get("sec-fetch-site");
  if (fetchSite !== "same-origin" || !isAllowedAnalyticsRequestTarget(request)) {
    return false;
  }

  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

export function isAllowedAnalyticsRequestTarget(request: Request): boolean {
  try {
    return ALLOWED_ANALYTICS_HOSTS.has(new URL(request.url).hostname.toLowerCase());
  } catch {
    return false;
  }
}

export async function recordAnalytics(
  request: Request,
  payload: AnalyticsPayload,
): Promise<boolean> {
  const now = new Date();
  const bucket = now.toISOString().slice(0, 10);
  if (!consumeLocalIngestCapacity(now)) return false;
  const db = getAnalyticsDb();
  await ensureAnalyticsSchema(db);
  if (!(await consumeIngestCapacity(db, now))) return false;

  const counters =
    payload.type === "pageview"
      ? pageviewCounters(request, payload, now)
      : eventCounters(payload);
  const statements = counters.map(({ dimension, value }) =>
    db.prepare(UPSERT_COUNTER_SQL).bind(bucket, dimension, value),
  );

  const limitRetentionBoundary = new Date(now.getTime() - 10 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
  statements.push(
    db
      .prepare("DELETE FROM analytics_counts WHERE bucket < ?")
      .bind(retentionStartDate(now)),
    db
      .prepare("DELETE FROM analytics_ingest_limits WHERE window_start < ?")
      .bind(limitRetentionBoundary),
  );

  await db.batch(statements);
  return true;
}

function consumeLocalIngestCapacity(now: Date): boolean {
  const windowStart = now.toISOString().slice(0, 16);
  if (windowStart !== localIngestWindow) {
    localIngestWindow = windowStart;
    localIngestCount = 0;
  }
  if (localIngestCount >= ANALYTICS_EVENTS_PER_MINUTE) return false;
  localIngestCount += 1;
  return true;
}

async function consumeIngestCapacity(
  db: D1Database,
  now: Date,
): Promise<boolean> {
  const windowStart = now.toISOString().slice(0, 16);
  const result = await db
    .prepare(CONSUME_INGEST_CAPACITY_SQL)
    .bind(windowStart, ANALYTICS_EVENTS_PER_MINUTE)
    .first<{ count: number }>();
  return result !== null;
}

function pageviewCounters(
  request: Request,
  payload: Extract<AnalyticsPayload, { type: "pageview" }>,
  now: Date,
): Counter[] {
  const userAgent = request.headers.get("user-agent") ?? "";
  const audience = classifyUserAgent(userAgent);
  const country = getCountry(request);

  return [
    { dimension: "total", value: "pageview" },
    { dimension: "hour", value: now.toISOString().slice(11, 13) },
    { dimension: "path", value: payload.path },
    { dimension: "referrer", value: payload.referrer },
    { dimension: "country", value: country },
    { dimension: "device", value: audience.device },
    { dimension: "browser", value: audience.browser },
    { dimension: "os", value: audience.os },
    { dimension: "language", value: payload.language },
    { dimension: "viewport", value: payload.viewport },
  ];
}

function eventCounters(
  payload: Extract<AnalyticsPayload, { type: "event" }>,
): Counter[] {
  const counters: Counter[] = [
    { dimension: "event", value: payload.name },
    { dimension: `event:${payload.name}`, value: payload.value },
  ];

  if (payload.name === "outbound_click") {
    counters.push({ dimension: "event:outbound_group", value: payload.group });
  }

  return counters;
}

export function classifyUserAgent(userAgent: string): {
  device: string;
  browser: string;
  os: string;
} {
  const ua = userAgent.toLowerCase();

  const device = /ipad|tablet|kindle|silk/.test(ua)
    ? "Tablet"
    : /mobi|iphone|ipod|android/.test(ua)
      ? "Mobile"
      : "Desktop";

  const browser = /edg\//.test(ua)
    ? "Edge"
    : /samsungbrowser\//.test(ua)
      ? "Samsung Internet"
      : /firefox\//.test(ua)
        ? "Firefox"
        : /(?:chrome|crios)\//.test(ua)
          ? "Chrome"
          : /safari\//.test(ua)
            ? "Safari"
            : "Other";

  const os = /iphone|ipad|ipod/.test(ua)
    ? "iOS / iPadOS"
    : /android/.test(ua)
      ? "Android"
      : /windows/.test(ua)
        ? "Windows"
        : /mac os|macintosh/.test(ua)
          ? "macOS"
          : /linux/.test(ua)
            ? "Linux"
            : "Other";

  return { device, browser, os };
}

function getCountry(request: Request): string {
  const requestWithCloudflare = request as RequestWithCloudflare;
  const candidate = requestWithCloudflare.cf?.country;
  return candidate && /^[A-Z]{2}$/.test(candidate) ? candidate : "Unknown";
}
