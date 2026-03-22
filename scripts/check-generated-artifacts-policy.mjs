#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const DISALLOWED_PATTERNS = [
  /^packages\/core\/src\/.+\.d\.ts$/,
  /^packages\/vscode-extension\/src\/.+\.d\.ts$/,
  /^packages\/openclaw-plugin\/src\/.+\.d\.ts$/
];

const REQUIRED_POLICY_REFERENCES = [
  { file: "CONTRIBUTORS.md", needle: "generated artifact" },
  { file: "RELEASE_STRATEGY.md", needle: "release assets" }
];

function listTrackedFiles() {
  const result = spawnSync("git", ["ls-files"], { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr || "Failed to list tracked files.");
  }
  return result.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export function validateGeneratedArtifactPolicy(trackedFiles, options = {}) {
  const includeMissingFiles = options.includeMissingFiles ?? false;
  const errors = [];
  for (const trackedFile of trackedFiles) {
    if (!includeMissingFiles && !existsSync(trackedFile)) {
      continue;
    }
    if (DISALLOWED_PATTERNS.some((pattern) => pattern.test(trackedFile))) {
      errors.push(`Generated declaration file must not be tracked in source tree: ${trackedFile}`);
    }
  }

  for (const reference of REQUIRED_POLICY_REFERENCES) {
    if (!existsSync(reference.file)) {
      errors.push(`Missing policy file: ${reference.file}`);
      continue;
    }
    const content = readFileSync(reference.file, "utf8").toLowerCase();
    if (!content.includes(reference.needle)) {
      errors.push(
        `Policy file ${reference.file} must reference "${reference.needle}" for artifact governance.`
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors
  };
}

export function main() {
  const result = validateGeneratedArtifactPolicy(listTrackedFiles());
  if (!result.ok) {
    console.error("generated-artifacts policy check failed");
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }
  console.log("generated-artifacts policy check passed");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
