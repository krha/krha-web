import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(new URL(pathname, "http://localhost/"), {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Kiryong Ha's professional profile", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Kiryong Ha/);
  assert.match(
    html,
    /<title>Kiryong Ha \| Meta Principal Engineer · Capacity (?:&amp;|&) AI Infrastructure<\/title>/i,
  );
  assert.doesNotMatch(html, /<title>Kiryong Ha - Analytics<\/title>/i);
  assert.match(html, /Principal Engineer/);
  assert.match(
    html,
    /Principal Engineer \(E8\) at Meta currently working on\s+hyperscale capacity management and capacity fulfillment for\s+Meta(?:&#x27;|&apos;|')s private cloud/i,
  );
  assert.match(html, /capacity fulfillment/i);
  assert.match(html, /class="lead about-highlight"/i);
  assert.match(html, /class="about-details"/i);
  assert.match(html, /hyper-scale products like Facebook and Instagram/i);
  assert.match(html, /Hyperscale capacity infrastructure/);
  assert.match(
    html,
    /Building private-cloud capacity management and fulfillment\s+systems for Meta products such as Facebook and Instagram/i,
  );
  assert.match(html, /Global Capacity Management with Flux/i);
  assert.match(
    html,
    /https:\/\/research\.facebook\.com\/fellows\/ha-kiryong\//,
  );
  assert.match(
    html,
    /https:\/\/www\.etri\.re\.kr\/eng\/main\/main\.etri/,
  );
  assert.match(html, /https:\/\/kaist\.ac\.kr\/en\//);
  assert.doesNotMatch(html, /What(?:&#x27;|&apos;|')s New/i);
  assert.match(html, /Private Cloud Capacity (?:&amp;|&) Fulfillment Infrastructure/);
  assert.match(html, /2017-Present/);
  assert.doesNotMatch(html, />Scholar</);
  assert.ok(html.indexOf(">Career<") < html.indexOf(">Research<"));
  assert.ok(html.indexOf(">Research<") < html.indexOf(">Publications<"));
  assert.ok(html.indexOf('id="career"') < html.indexOf('id="work"'));
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /https:\/\/schema\.org/);
  assert.match(html, /rel="canonical"/);
  assert.match(html, /<html[^>]+class="__variable_manrope_[^"]+"/i);
  assert.doesNotMatch(html, /<body[^>]+class="__variable_manrope_/i);
  assert.doesNotMatch(html, /concept-page|concept-(?:0[1-9]|10)/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
  assert.match(html, /data-analytics-outbound="profile"/i);
  assert.match(html, /data-analytics-outbound="publication"/i);
  assert.match(html, /data-analytics-section="career"/i);
  assert.match(html, /href="\/privacy"/i);
});

test("publishes a precise analytics privacy notice and browser opt-out", async () => {
  const response = await render("/privacy");
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Privacy at krha\.kr/);
  assert.match(html, /aggregate audience trends/i);
  assert.match(html, /does not store names, email addresses/i);
  assert.match(html, /exact IP addresses/i);
  assert.match(html, /visitor or session identifier/i);
  assert.match(html, /raw referring hostname is not sent or stored/i);
  assert.match(html, /fixed outbound-link list/i);
  assert.match(html, /Global Privacy Control/i);
  assert.match(html, /Do Not Track/i);
  assert.match(html, /Turn analytics off/i);
  assert.match(html, /__cf_bm/);
  assert.match(html, /rolling window of up to 400 days/i);
  assert.match(html, /every dashboard breakdown/i);
  assert.doesNotMatch(html, /Google Analytics|session replay provider|advertising pixel/i);
});

test("keeps every retired design preview URL removed", async () => {
  const conceptPaths = Array.from(
    { length: 10 },
    (_, index) => `/concept-${String(index + 1).padStart(2, "0")}`,
  );
  const retiredPaths = [
    "/design-10",
    "/design-15",
    "/design-lab",
    ...conceptPaths,
  ];
  const responses = await Promise.all(retiredPaths.map((path) => render(path)));

  for (const response of responses) {
    assert.equal(response.status, 404);
  }
});

test("ships crawler, privacy, migration, review, and original-site palette artifacts", async () => {
  const [robots, sitemap, llms, notes, packageJson, css, hosting, migration, rateLimitMigration] = await Promise.all([
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
    readFile(new URL("../REVIEW_NOTES.md", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../.openai/hosting.json", import.meta.url), "utf8"),
    readFile(
      new URL("../drizzle/0000_steep_lady_mastermind.sql", import.meta.url),
      "utf8",
    ),
    readFile(
      new URL("../drizzle/0001_motionless_warbound.sql", import.meta.url),
      "utf8",
    ),
  ]);

  assert.match(robots, /Sitemap: https:\/\/krha\.kr\/sitemap\.xml/);
  assert.match(robots, /Disallow: \/analytics/);
  assert.match(robots, /Disallow: \/api\/analytics/);
  assert.match(sitemap, /<loc>https:\/\/krha\.kr\/<\/loc>/);
  assert.match(sitemap, /<loc>https:\/\/krha\.kr\/privacy<\/loc>/);
  assert.match(llms, /Disambiguation/);
  assert.match(notes, /Top 1%/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(css, /--heading: #333333/);
  assert.match(css, /--link: #337ab7/);
  assert.match(css, /--page-background: #e5e9e1/);
  assert.match(css, /--panel: #f4f4f4/);
  assert.match(css, /--navbar: #303030/);
  assert.match(css, /--surface: #ffffff/);
  assert.match(
    css,
    /\.about-highlight\s*{\s*color: var\(--heading\);\s*font-weight: 600;\s*margin-bottom: 0;\s*}/,
  );
  assert.match(css, /\.about-details\s*{\s*margin-top: 26px;/);
  assert.match(css, /border-radius: 32px/);
  assert.match(css, /--footer: #313131/);
  assert.equal(JSON.parse(hosting).d1, "DB");
  assert.match(migration, /CREATE TABLE `analytics_counts`/);
  assert.match(migration, /PRIMARY KEY\(`bucket`, `dimension`, `value`\)/);
  assert.doesNotMatch(migration, /visitor_id|session_id|ip_address|user_agent/i);
  assert.match(rateLimitMigration, /CREATE TABLE `analytics_ingest_limits`/);
  assert.doesNotMatch(rateLimitMigration, /visitor_id|session_id|ip_address|user_agent/i);
});

test("packages the analytics migration with the production site", async () => {
  const [packagedCounts, packagedRateLimit] = await Promise.all([
    readFile(
      new URL(
        "../dist/.openai/drizzle/0000_steep_lady_mastermind.sql",
        import.meta.url,
      ),
      "utf8",
    ),
    readFile(
      new URL(
        "../dist/.openai/drizzle/0001_motionless_warbound.sql",
        import.meta.url,
      ),
      "utf8",
    ),
  ]);
  assert.match(packagedCounts, /CREATE TABLE `analytics_counts`/);
  assert.match(packagedRateLimit, /CREATE TABLE `analytics_ingest_limits`/);
});

test("embeds the exact Git commit in the production build", async () => {
  const [publicVersion, builtVersion] = await Promise.all([
    readFile(new URL("../public/site-version.json", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/site-version.json", import.meta.url), "utf8"),
  ]);
  const expectedCommit = execFileSync("git", ["rev-parse", "HEAD"], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  }).trim();
  const expectedRepository = "https://github.com/krha/krha-web";

  assert.deepEqual(JSON.parse(builtVersion), JSON.parse(publicVersion));
  assert.equal(JSON.parse(builtVersion).commit, expectedCommit);
  assert.equal(JSON.parse(builtVersion).repository, expectedRepository);
  assert.equal(
    JSON.parse(builtVersion).commitUrl,
    `${expectedRepository}/commit/${expectedCommit}`,
  );
});
