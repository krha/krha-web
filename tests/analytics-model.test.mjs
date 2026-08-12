import assert from "node:assert/strict";
import test from "node:test";
import {
  canonicalOutboundDestination,
  categorizeReferrerHostname,
  cleanHostname,
  cleanLanguage,
  cleanPath,
  parseAnalyticsPayload,
  retentionStartDate,
} from "../app/analytics/model.ts";

test("accepts only bounded aggregate pageview fields", () => {
  assert.deepEqual(
    parseAnalyticsPayload({
      type: "pageview",
      path: "/",
      referrer: "Search",
      language: "ko-KR",
      viewport: "wide",
    }),
    {
      type: "pageview",
      path: "/",
      referrer: "Search",
      language: "ko",
      viewport: "wide",
    },
  );

  assert.equal(cleanPath("/privacy?email=person@example.com"), null);
  assert.equal(cleanPath("https://krha.kr/"), null);
  assert.equal(cleanPath("/analytics"), "/analytics");
  assert.equal(cleanHostname("https://example.com/private?q=1"), null);
  assert.equal(cleanHostname("Example.COM."), "example.com");
  assert.equal(cleanHostname("192.168.1.25"), null);
  assert.equal(cleanHostname("intranet"), null);
  assert.equal(cleanLanguage("EN-us"), "en");
  assert.equal(cleanLanguage("xx-Custom"), "Other");
});

test("maps raw referrers into fixed, non-identifying categories", () => {
  assert.equal(categorizeReferrerHostname(""), "Direct");
  assert.equal(categorizeReferrerHostname("www.google.com"), "Search");
  assert.equal(categorizeReferrerHostname("m.linkedin.com"), "LinkedIn");
  assert.equal(categorizeReferrerHostname("scholar.google.com"), "Academic");
  assert.equal(categorizeReferrerHostname("krha.kr"), "Internal");
  assert.equal(
    categorizeReferrerHostname("unique-person-token.example.com"),
    "Other website",
  );
  assert.equal(categorizeReferrerHostname("maliciouslinkedin.com"), "Other website");
});

test("rejects protected paths, raw hostnames, arbitrary events, and identity-like properties", () => {
  assert.equal(
    parseAnalyticsPayload({
      type: "pageview",
      path: "/analytics",
      referrer: "Other website",
      language: "en",
      viewport: "wide",
    }),
    null,
  );
  assert.equal(
    parseAnalyticsPayload({
      type: "pageview",
      path: "/",
      referrer: "unique-person-token.example.com",
      language: "en",
      viewport: "wide",
    }),
    null,
  );
  assert.equal(
    parseAnalyticsPayload({
      type: "event",
      name: "identify",
      value: "person@example.com",
    }),
    null,
  );
  assert.equal(
    parseAnalyticsPayload({
      type: "event",
      name: "outbound_click",
      value: "linkedin.com",
      group: "employer",
    }),
    null,
  );
});

test("allows only fixed engagement events and exact group/destination pairs", () => {
  assert.deepEqual(
    parseAnalyticsPayload({
      type: "event",
      name: "outbound_click",
      value: "www.usenix.org",
      group: "publication",
    }),
    {
      type: "event",
      name: "outbound_click",
      value: "usenix.org",
      group: "publication",
    },
  );
  assert.equal(
    canonicalOutboundDestination("person-token.example.com", "publication"),
    null,
  );
  assert.equal(canonicalOutboundDestination("doi.org", "profile"), null);
  assert.deepEqual(
    parseAnalyticsPayload({
      type: "event",
      name: "section_view",
      value: "career",
    }),
    { type: "event", name: "section_view", value: "career" },
  );
  assert.equal(
    parseAnalyticsPayload({
      type: "event",
      name: "outbound_click",
      value: "https://www.usenix.org/paper?person=123",
      group: "publication",
    }),
    null,
  );
});

test("retention boundary keeps exactly 400 UTC date buckets including today", () => {
  const now = new Date("2026-08-13T23:59:59.000Z");
  const start = retentionStartDate(now);
  assert.equal(start, "2025-07-10");

  const bucketCount =
    Math.round(
      (Date.parse("2026-08-13T00:00:00Z") - Date.parse(`${start}T00:00:00Z`)) /
        86_400_000,
    ) + 1;
  assert.equal(bucketCount, 400);
});
