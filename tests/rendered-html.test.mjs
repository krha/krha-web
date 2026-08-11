import assert from "node:assert/strict";
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
});

test("removes the rejected URLs and renders ten isolated design concepts", async () => {
  const removedResponses = await Promise.all([
    render("/design-10"),
    render("/design-15"),
  ]);

  for (const response of removedResponses) {
    assert.equal(response.status, 404);
  }

  const conceptPaths = Array.from(
    { length: 10 },
    (_, index) => `/concept-${String(index + 1).padStart(2, "0")}`,
  );
  const responses = await Promise.all(conceptPaths.map((path) => render(path)));

  for (const [index, response] of responses.entries()) {
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /Principal Engineer \(E8\)/);
    assert.match(html, /Hyperscale capacity infrastructure/);
    assert.match(html, /Global Capacity Management with Flux/);
    assert.match(html, /name="robots" content="noindex, nofollow"/i);
    const conceptId = String(index + 1).padStart(2, "0");
    assert.match(html, new RegExp(`concept-page concept-${conceptId}`));
    assert.match(html, new RegExp(`data-concept="${conceptId}"`));
  }
});

test("renders a noindex comparison lab linking all ten concepts", async () => {
  const response = await render("/design-lab");
  assert.equal(response.status, 200);
  const html = await response.text();

  assert.match(html, /Design Lab/);
  assert.match(html, /name="robots" content="noindex, nofollow"/i);
  for (let index = 1; index <= 10; index += 1) {
    const conceptId = String(index).padStart(2, "0");
    assert.match(html, new RegExp(`href="/concept-${conceptId}"`));
    assert.match(html, new RegExp(`src="/concept-${conceptId}"`));
  }
});

test("ships crawler, review, and original-site palette artifacts", async () => {
  const [robots, sitemap, llms, notes, packageJson, css] = await Promise.all([
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
    readFile(new URL("../REVIEW_NOTES.md", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(robots, /Sitemap: https:\/\/krha\.kr\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/krha\.kr\/<\/loc>/);
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
});
