import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { request as httpRequest } from "node:http";
import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  ANALYTICS_EVENTS_PER_MINUTE,
  retentionStartDate,
} from "../app/analytics/model.ts";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const wrangler = join(projectRoot, "node_modules", ".bin", "wrangler");
const config = join(projectRoot, "dist", "server", "wrangler.json");

test("Cloudflare runtime enforces analytics privacy, authorization, and limits", { timeout: 45_000 }, async () => {
  const stateDirectory = await mkdtemp(join(tmpdir(), "krha-analytics-runtime-"));
  const port = 31_000 + Math.floor(Math.random() * 2_000);
  const origin = `http://localhost:${port}`;
  let worker;

  try {
    worker = await startWorker({ port, stateDirectory, origin });

    const homepage = await fetch(origin);
    assert.equal(homepage.status, 200);
    await homepage.arrayBuffer();

    const signedOut = await fetch(`${origin}/analytics`, { redirect: "manual" });
    assert.equal(signedOut.status, 307);
    assert.match(
      signedOut.headers.get("location") ?? "",
      /\/signin-with-chatgpt\?return_to=%2Fanalytics$/,
    );
    await signedOut.arrayBuffer();

    const owner = await fetch(`${origin}/analytics`, {
      headers: authenticatedHeaders("test-owner", "owner@example.com"),
      redirect: "manual",
    });
    assert.equal(owner.status, 200);
    assert.match(owner.headers.get("cache-control") ?? "", /no-store/i);
    const ownerHtml = await owner.text();
    assert.match(ownerHtml, /<title>Kiryong Ha - Analytics<\/title>/i);
    assert.match(ownerHtml, /krha\.kr analytics/i);

    const nonOwner = await fetch(`${origin}/analytics`, {
      headers: authenticatedHeaders("different-user", "other@example.com"),
      redirect: "manual",
    });
    assert.equal(nonOwner.status, 404);
    assert.match(nonOwner.headers.get("cache-control") ?? "", /no-store/i);
    await nonOwner.arrayBuffer();

    // Avoid spanning two minute buckets during the rate-limit exercise.
    const seconds = new Date().getUTCSeconds();
    if (seconds > 55) await delay((61 - seconds) * 1_000);

    assert.equal((await postPageview(origin)).status, 204);
    assert.equal(
      (
        await postPageview(origin, {
          "Sec-GPC": "1",
        })
      ).status,
      204,
    );
    assert.equal(
      (
        await postPageview(origin, {
          DNT: "1",
        })
      ).status,
      204,
    );

    const rawHostname = await postJson(origin, {
      type: "pageview",
      path: "/",
      referrer: "person-token.example.com",
      language: "en",
      viewport: "wide",
    });
    assert.equal(rawHostname.status, 400);

    const crossOrigin = await postPageview(origin, {
      Origin: "https://evil.example",
      "Sec-Fetch-Site": "cross-site",
    });
    assert.equal(crossOrigin.status, 403);

    const limitedBreakdown = await fetch(`${origin}/analytics`, {
      headers: authenticatedHeaders("test-owner", "owner@example.com"),
    });
    const limitedHtml = await limitedBreakdown.text();
    assert.equal(limitedBreakdown.status, 200, worker.runtimeOutput());
    assert.match(limitedHtml, /Other \/ limited data/);
    assert.doesNotMatch(limitedHtml, />Homepage</);

    const remainingCapacity = ANALYTICS_EVENTS_PER_MINUTE - 1;
    const results = [];
    for (let index = 0; index < remainingCapacity + 1; index += 1) {
      results.push(
        await postJson(origin, {
          type: "event",
          name: "outbound_click",
          value: "github.com",
          group: "profile",
        }),
      );
    }
    assert.equal(results.filter((response) => response.status === 204).length, remainingCapacity);
    assert.equal(results.filter((response) => response.status === 429).length, 1);
    assert.ok(results.every((response) => response.status === 204 || response.status === 429));

    // Wrangler's local proxy may recycle its upstream after a forged Host,
    // so exercise this as the final request before shutdown.
    assert.equal(await postWithForgedHost(port), 403);

    await stopWorker(worker);
    worker = undefined;

    const databasePath = await findD1Database(stateDirectory);
    let database = new DatabaseSync(databasePath);
    assert.equal(
      database
        .prepare("SELECT count FROM analytics_counts WHERE dimension = 'total' AND value = 'pageview'")
        .get().count,
      1,
    );
    assert.equal(
      database.prepare("SELECT SUM(count) AS count FROM analytics_ingest_limits").get().count,
      ANALYTICS_EVENTS_PER_MINUTE,
    );
    assert.equal(
      database
        .prepare("SELECT COUNT(*) AS count FROM analytics_counts WHERE value LIKE '%person-token%'")
        .get().count,
      0,
    );

    const today = new Date();
    const retainedBoundary = retentionStartDate(today);
    const expiredBoundary = new Date(`${retainedBoundary}T00:00:00Z`);
    expiredBoundary.setUTCDate(expiredBoundary.getUTCDate() - 1);
    database
      .prepare("INSERT INTO analytics_counts VALUES (?, 'test', 'expired', 1)")
      .run(expiredBoundary.toISOString().slice(0, 10));
    database
      .prepare("INSERT INTO analytics_counts VALUES (?, 'test', 'retained', 1)")
      .run(retainedBoundary);
    database.prepare("DELETE FROM analytics_ingest_limits").run();
    database.close();

    worker = await startWorker({ port, stateDirectory, origin });
    assert.equal(
      (
        await postJson(origin, {
          type: "event",
          name: "outbound_click",
          value: "github.com",
          group: "profile",
        })
      ).status,
      204,
    );
    await stopWorker(worker);
    worker = undefined;

    database = new DatabaseSync(databasePath);
    assert.equal(
      database.prepare("SELECT COUNT(*) AS count FROM analytics_counts WHERE value = 'expired'").get().count,
      0,
    );
    assert.equal(
      database.prepare("SELECT COUNT(*) AS count FROM analytics_counts WHERE value = 'retained'").get().count,
      1,
    );
    database.close();
  } finally {
    if (worker) await stopWorker(worker);
    await rm(stateDirectory, { recursive: true, force: true });
  }
});

async function startWorker({ port, stateDirectory, origin }) {
  const child = spawn(
    wrangler,
    [
      "dev",
      "--config",
      config,
      "--port",
      String(port),
      "--persist-to",
      stateDirectory,
      "--var",
      "ANALYTICS_OWNER_IDS:test-owner",
      "--log-level",
      "error",
      "--show-interactive-dev-session=false",
    ],
    {
      cwd: projectRoot,
      env: { ...process.env, CI: "1" },
      stdio: ["ignore", "pipe", "pipe"],
    },
  );

  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk;
  });
  child.stderr.on("data", (chunk) => {
    output += chunk;
  });
  child.runtimeOutput = () => output;

  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`Wrangler exited before startup (${child.exitCode}): ${output}`);
    }
    try {
      const response = await fetch(origin);
      if (response.status === 200) {
        await response.arrayBuffer();
        await delay(300);
        const stableResponse = await fetch(origin);
        await stableResponse.arrayBuffer();
        if (stableResponse.status === 200) return child;
      }
    } catch {
      // The local runtime is still starting.
    }
    await delay(100);
  }

  child.kill("SIGKILL");
  throw new Error(`Timed out waiting for Wrangler: ${output}`);
}

async function stopWorker(child) {
  if (child.exitCode !== null) return;
  child.kill("SIGTERM");
  let timeoutId;
  const timeout = new Promise((resolve) => {
    timeoutId = setTimeout(() => resolve("timeout"), 5_000);
  });
  const result = await Promise.race([
    once(child, "exit").then(() => "exited"),
    timeout,
  ]);
  clearTimeout(timeoutId);
  if (result === "timeout") {
    child.kill("SIGKILL");
    await once(child, "exit");
  }
}

function authenticatedHeaders(userId, email) {
  return {
    "oai-authenticated-user-id": userId,
    "oai-authenticated-user-email": email,
  };
}

function postPageview(origin, headers = {}) {
  return postJson(
    origin,
    {
      type: "pageview",
      path: "/",
      referrer: "Direct",
      language: "en",
      viewport: "wide",
    },
    headers,
  );
}

async function postJson(origin, body, headers = {}) {
  const response = await fetch(`${origin}/api/analytics`, {
    method: "POST",
    headers: {
      Origin: origin,
      "Sec-Fetch-Site": "same-origin",
      "Content-Type": "text/plain;charset=UTF-8",
      ...headers,
    },
    body: JSON.stringify(body),
  });
  await response.arrayBuffer();
  return response;
}

function postWithForgedHost(port) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      type: "pageview",
      path: "/",
      referrer: "Direct",
      language: "en",
      viewport: "wide",
    });
    const request = httpRequest(
      {
        host: "localhost",
        port,
        path: "/api/analytics",
        method: "POST",
        headers: {
          Host: "attacker.example",
          Origin: "http://attacker.example",
          "Sec-Fetch-Site": "same-origin",
          "Content-Type": "text/plain;charset=UTF-8",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (response) => {
        response.resume();
        response.on("end", () => resolve(response.statusCode));
      },
    );
    request.on("error", reject);
    request.end(body);
  });
}

async function findD1Database(stateDirectory) {
  const files = await readdir(stateDirectory, { recursive: true });
  const database = files.find(
    (file) =>
      file.includes("d1/") &&
      file.endsWith(".sqlite") &&
      !file.endsWith("metadata.sqlite"),
  );
  assert.ok(database, "the runtime should create a local D1 database");
  return join(stateDirectory, database);
}

function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}
