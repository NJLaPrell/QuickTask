#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";

import { validateReleaseIntegrityMetadata } from "./release-integrity-schema.mjs";

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return undefined;
  }
  return process.argv[index + 1];
}

function fail(message) {
  console.error(`release-verify: ${message}`);
  process.exit(1);
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, {
    cwd,
    encoding: "utf8"
  });
  if (result.status !== 0) {
    fail(
      `${command} ${args.join(" ")} failed\n${result.stdout ?? ""}${result.stderr ?? ""}`.trim()
    );
  }
}

function sha256(path) {
  const hash = createHash("sha256");
  hash.update(readFileSync(path));
  return hash.digest("hex");
}

const assetsDir = getArg("--assets-dir") ?? "artifacts";
const version =
  getArg("--version") ?? JSON.parse(readFileSync("packages/core/package.json", "utf8")).version;
const files = readdirSync(assetsDir).filter((entry) => statSync(join(assetsDir, entry)).isFile());

const vsixPattern = new RegExp(
  `^quicktask-vscode-v${version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.vsix$`
);
const openclawPattern = new RegExp(
  `^quicktask-openclaw-v${version.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\.tgz$`
);

const vsix = files.find((entry) => vsixPattern.test(entry));
const openclaw = files.find((entry) => openclawPattern.test(entry));

if (!vsix) {
  fail("missing VSIX artifact with expected naming");
}
if (!openclaw) {
  fail("missing OpenClaw artifact with expected naming");
}

const vsixPath = join(assetsDir, vsix);
const openclawPath = join(assetsDir, openclaw);

if (statSync(vsixPath).size <= 0 || statSync(openclawPath).size <= 0) {
  fail("release artifacts must be non-empty files");
}

const checksumsPath = join(assetsDir, "checksums.txt");
const checksumLines = readFileSync(checksumsPath, "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);
const checksumMap = new Map(
  checksumLines.map((line) => {
    const [digest, file] = line.split(/\s{2,}/);
    return [file, digest];
  })
);

for (const file of [vsix, openclaw]) {
  const expected = checksumMap.get(file);
  if (!expected) {
    fail(`checksums.txt missing entry for ${file}`);
  }
  const actual = sha256(join(assetsDir, file));
  if (actual !== expected) {
    fail(`checksum mismatch for ${file}`);
  }
}

const metadataPath = join(assetsDir, "release-integrity-metadata.json");
const metadata = JSON.parse(readFileSync(metadataPath, "utf8"));
const metadataFindings = validateReleaseIntegrityMetadata(metadata);
if (metadataFindings.length > 0) {
  fail(`release-integrity-metadata.json contract violation:\n- ${metadataFindings.join("\n- ")}`);
}

const metadataByFile = new Map(metadata.artifacts.map((entry) => [entry.file, entry]));
for (const file of [vsix, openclaw]) {
  const entry = metadataByFile.get(file);
  if (!entry) {
    fail(`release-integrity-metadata.json missing entry for ${file}`);
  }
  const expectedSize = statSync(join(assetsDir, file)).size;
  if (entry.sizeBytes !== expectedSize) {
    fail(`release-integrity-metadata.json size mismatch for ${file}`);
  }
  const expectedDigest = sha256(join(assetsDir, file));
  if (entry.sha256 !== expectedDigest) {
    fail(`release-integrity-metadata.json sha256 mismatch for ${file}`);
  }
}

const vsixHeader = readFileSync(vsixPath).subarray(0, 2).toString("utf8");
if (vsixHeader !== "PK") {
  fail(`${vsix} is not a valid ZIP/VSIX container`);
}

const tempProject = mkdtempSync(join(tmpdir(), "quicktask-release-verify-"));
run("tar", ["-xzf", openclawPath, "-C", tempProject], process.cwd());
run(
  "node",
  [
    "--input-type=module",
    "-e",
    `import { registerQuickTask } from ${JSON.stringify(
      join(tempProject, "package", "dist", "index.js")
    )}; if (typeof registerQuickTask !== 'function') { throw new Error('registerQuickTask export missing'); }`
  ],
  process.cwd()
);

console.log(`release-verify: artifacts validated (${vsix}, ${openclaw})`);
