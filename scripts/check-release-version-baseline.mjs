#!/usr/bin/env node

import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function fail(message) {
  console.error(`release-baseline: ${message}`);
  process.exit(1);
}

function parseSemver(value) {
  const match = value.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3])
  };
}

function compareSemver(a, b) {
  if (a.major !== b.major) {
    return a.major - b.major;
  }
  if (a.minor !== b.minor) {
    return a.minor - b.minor;
  }
  return a.patch - b.patch;
}

const baseline = parseSemver("0.1.0");
const pkgVersion = JSON.parse(readFileSync("packages/core/package.json", "utf8")).version;
const parsedVersion = parseSemver(pkgVersion);
if (!parsedVersion) {
  fail(`version must be stable semver (X.Y.Z). Received: ${pkgVersion}`);
}

if (compareSemver(parsedVersion, baseline) < 0) {
  fail(`version must be >= 0.1.0. Received: ${pkgVersion}`);
}

const tagsResult = spawnSync("git", ["tag", "--list", "v*"], { encoding: "utf8" });
if (tagsResult.status !== 0) {
  fail("unable to read git tags");
}

const tags = (tagsResult.stdout ?? "")
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

if (tags.length === 0 && pkgVersion !== "0.1.0") {
  fail(`first public release must be 0.1.0. Received: ${pkgVersion}`);
}

console.log(`release-baseline: version ${pkgVersion} satisfies baseline policy`);
