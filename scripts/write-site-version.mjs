import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryUrl = "https://github.com/krha/krha-web";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

function git(...args) {
  return execFileSync("git", args, {
    cwd: root,
    encoding: "utf8",
  }).trim();
}

const commit = git("rev-parse", "HEAD");
const committedAt = git("show", "-s", "--format=%cI", "HEAD");
const outputPath = resolve(root, "public/site-version.json");
const version = {
  repository: repositoryUrl,
  branch: "main",
  commit,
  commitUrl: `${repositoryUrl}/commit/${commit}`,
  committedAt,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(outputPath, `${JSON.stringify(version, null, 2)}\n`, "utf8");
