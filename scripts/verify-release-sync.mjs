import { execFileSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryUrl = "https://github.com/krha/krha-web";
const liveVersionUrls = [
  "https://krha.kr/site-version.json",
  "https://kiryong-ha-capacity.kiryongha.chatgpt.site/site-version.json",
];
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function git(...args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
  }).trim();
}

function fail(message) {
  throw new Error(`Release verification failed: ${message}`);
}

const localCommit = git("rev-parse", "HEAD");
const status = git("status", "--porcelain", "--untracked-files=normal");
if (status) {
  fail("the local working tree is not clean");
}

const remoteLine = git("ls-remote", "origin", "refs/heads/main");
const remoteCommit = remoteLine.split(/\s+/u)[0];
if (!remoteCommit) {
  fail("GitHub main could not be resolved");
}
if (remoteCommit !== localCommit) {
  fail(`local HEAD ${localCommit} does not match GitHub main ${remoteCommit}`);
}

let response;
let verifiedLiveVersionUrl;
const liveErrors = [];
for (const liveVersionUrl of liveVersionUrls) {
  try {
    const candidate = await fetch(
      `${liveVersionUrl}?verify=${encodeURIComponent(localCommit)}`,
      {
        cache: "no-store",
        headers: { accept: "application/json" },
      },
    );
    if (candidate.ok) {
      response = candidate;
      verifiedLiveVersionUrl = liveVersionUrl;
      break;
    }
    liveErrors.push(`${liveVersionUrl}: HTTP ${candidate.status}`);
  } catch (error) {
    liveErrors.push(
      `${liveVersionUrl}: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}
if (!response || !verifiedLiveVersionUrl) {
  fail(`no live version endpoint was reachable (${liveErrors.join("; ")})`);
}

const liveVersion = await response.json();
if (liveVersion.commit !== localCommit) {
  fail(
    `live site commit ${liveVersion.commit ?? "unknown"} does not match GitHub main ${localCommit}`,
  );
}

console.log("Release sync verified.");
console.log(`Commit: ${localCommit}`);
console.log(`GitHub: ${repositoryUrl}/commit/${localCommit}`);
console.log(`Live version: ${verifiedLiveVersionUrl}`);
if (verifiedLiveVersionUrl !== liveVersionUrls[0]) {
  console.warn(
    `Custom-domain verification was unavailable; verified the same Sites deployment at ${verifiedLiveVersionUrl}.`,
  );
}
