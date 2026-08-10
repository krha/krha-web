import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
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
  assert.match(html, /capacity fulfillment/i);
  assert.match(html, /AI infrastructure/i);
  assert.match(html, /Global Capacity Management with Flux/i);
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /https:\/\/schema\.org/);
  assert.match(html, /rel="canonical"/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Starter Project/);
});

test("ships crawler and claim-review artifacts", async () => {
  const [robots, sitemap, llms, notes, packageJson] = await Promise.all([
    readFile(new URL("../public/robots.txt", import.meta.url), "utf8"),
    readFile(new URL("../public/sitemap.xml", import.meta.url), "utf8"),
    readFile(new URL("../public/llms.txt", import.meta.url), "utf8"),
    readFile(new URL("../REVIEW_NOTES.md", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(robots, /Sitemap: https:\/\/krha\.kr\/sitemap\.xml/);
  assert.match(sitemap, /<loc>https:\/\/krha\.kr\/<\/loc>/);
  assert.match(llms, /Disambiguation/);
  assert.match(notes, /Top 1%/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
});
