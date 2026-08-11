import { execFileSync } from "node:child_process";
import { resolve4 } from "node:dns/promises";
import { request as httpsRequest } from "node:https";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryUrl = "https://github.com/krha/krha-web";
const liveVersionUrl = "https://krha.kr/site-version.json";
const requestTimeoutMs = 10_000;
const maximumResponseBytes = 64 * 1024;
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

function parseAndValidateVersion(body, source, expectedCommit) {
  let version;
  try {
    version = JSON.parse(body);
  } catch (error) {
    fail(
      `${source} did not return valid JSON (${error instanceof Error ? error.message : String(error)})`,
    );
  }

  if (!version || typeof version !== "object" || Array.isArray(version)) {
    fail(`${source} did not return a version object`);
  }
  if (version.repository !== repositoryUrl) {
    fail(`${source} identifies an unexpected repository`);
  }
  if (version.branch !== "main") {
    fail(`${source} identifies an unexpected branch`);
  }
  if (!/^[0-9a-f]{40}$/u.test(version.commit ?? "")) {
    fail(`${source} does not contain a valid full Git commit SHA`);
  }
  if (version.commit !== expectedCommit) {
    fail(
      `live site commit ${version.commit} does not match GitHub main ${expectedCommit}`,
    );
  }

  return version;
}

function requestUsingAddress(url, address) {
  return new Promise((resolveRequest, rejectRequest) => {
    const request = httpsRequest(
      url,
      {
        headers: { accept: "application/json" },
        lookup: (_hostname, options, callback) => {
          if (options?.all) {
            callback(null, [{ address, family: 4 }]);
            return;
          }
          callback(null, address, 4);
        },
      },
      (response) => {
        let body = "";
        response.setEncoding("utf8");
        response.on("data", (chunk) => {
          body += chunk;
          if (Buffer.byteLength(body) > maximumResponseBytes) {
            response.destroy(new Error("response exceeded the size limit"));
          }
        });
        response.on("error", rejectRequest);
        response.on("end", () => {
          resolveRequest({
            body,
            status: response.statusCode ?? 0,
          });
        });
      },
    );

    request.setTimeout(requestTimeoutMs, () => {
      request.destroy(new Error(`request timed out after ${requestTimeoutMs}ms`));
    });
    request.on("error", rejectRequest);
    request.end();
  });
}

async function fetchLiveVersion(expectedCommit) {
  const cacheBustedUrl = `${liveVersionUrl}?verify=${encodeURIComponent(expectedCommit)}`;

  try {
    const response = await fetch(cacheBustedUrl, {
      cache: "no-store",
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(requestTimeoutMs),
    });
    if (!response.ok) {
      fail(`${liveVersionUrl} returned HTTP ${response.status}`);
    }
    parseAndValidateVersion(
      await response.text(),
      liveVersionUrl,
      expectedCommit,
    );
    return "system DNS";
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith("Release verification failed:")
    ) {
      throw error;
    }

    let addresses;
    try {
      addresses = await resolve4(new URL(liveVersionUrl).hostname);
    } catch (dnsError) {
      fail(
        `${liveVersionUrl} DNS lookup failed (${dnsError instanceof Error ? dnsError.message : String(dnsError)})`,
      );
    }
    const transportErrors = [];
    for (const address of addresses) {
      try {
        const response = await requestUsingAddress(cacheBustedUrl, address);
        if (response.status < 200 || response.status >= 300) {
          fail(`${liveVersionUrl} returned HTTP ${response.status} via ${address}`);
        }
        parseAndValidateVersion(
          response.body,
          `${liveVersionUrl} via ${address}`,
          expectedCommit,
        );
        return `DNS A record ${address}`;
      } catch (directError) {
        if (
          directError instanceof Error &&
          directError.message.startsWith("Release verification failed:")
        ) {
          throw directError;
        }
        transportErrors.push(
          `${address}: ${directError instanceof Error ? directError.message : String(directError)}`,
        );
      }
    }

    fail(
      `${liveVersionUrl} could not be reached through its DNS A records (${transportErrors.join("; ")})`,
    );
  }
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

const verificationPath = await fetchLiveVersion(localCommit);

console.log("Release sync verified.");
console.log(`Commit: ${localCommit}`);
console.log(`GitHub: ${repositoryUrl}/commit/${localCommit}`);
console.log(`Live version: ${liveVersionUrl}`);
console.log(`Network path: ${verificationPath}`);
