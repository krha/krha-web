import { parseAnalyticsPayload } from "../../analytics/model";
import {
  honorsPrivacySignal,
  isSameOriginAnalyticsRequest,
  recordAnalytics,
} from "../../analytics/server";

const MAX_BODY_BYTES = 1_500;

export async function POST(request: Request) {
  if (honorsPrivacySignal(request)) {
    return new Response(null, { status: 204 });
  }

  if (!isSameOriginAnalyticsRequest(request)) {
    return Response.json({ error: "Same-origin request required" }, { status: 403 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  let raw: string;
  try {
    raw = await request.text();
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Payload too large" }, { status: 413 });
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const payload = parseAnalyticsPayload(parsed);
  if (!payload) {
    return Response.json({ error: "Invalid analytics event" }, { status: 400 });
  }

  try {
    const recorded = await recordAnalytics(request, payload);
    if (!recorded) {
      return new Response(null, {
        status: 429,
        headers: { "Retry-After": "60" },
      });
    }
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Aggregate analytics write failed", error);
    return Response.json({ error: "Analytics unavailable" }, { status: 503 });
  }
}

export function GET() {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST" },
  });
}
