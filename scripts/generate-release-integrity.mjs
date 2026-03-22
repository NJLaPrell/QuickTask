#!/usr/bin/env node

import { createHash } from "node:crypto";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

import { RELEASE_INTEGRITY_SCHEMA_VERSION } from "./release-integrity-schema.mjs";

function sha256(path) {
  const hash = createHash("sha256");
  hash.update(readFileSync(path));
  return hash.digest("hex");
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

mkdirSync("artifacts", { recursive: true });

const ignored = new Set(["checksums.txt", "release-integrity-metadata.json", "sbom.json"]);
const artifactFiles = readdirSync("artifacts")
  .filter((name) => !ignored.has(name))
  .filter((name) => statSync(join("artifacts", name)).isFile())
  .sort();

if (artifactFiles.length === 0) {
  console.error("release-integrity: no artifacts found in artifacts/");
  process.exit(1);
}

const entries = artifactFiles.map((name) => {
  const fullPath = join("artifacts", name);
  return {
    file: name,
    sizeBytes: statSync(fullPath).size,
    sha256: sha256(fullPath)
  };
});

const checksums = entries.map((entry) => `${entry.sha256}  ${entry.file}`).join("\n");
writeFileSync("artifacts/checksums.txt", `${checksums}\n`, "utf8");

const generatedAt = new Date().toISOString();
writeFileSync(
  "artifacts/release-integrity-metadata.json",
  `${JSON.stringify(
    {
      schemaVersion: RELEASE_INTEGRITY_SCHEMA_VERSION,
      generatedAt,
      generatedBy: "scripts/generate-release-integrity.mjs",
      artifacts: entries
    },
    null,
    2
  )}\n`,
  "utf8"
);

const corePkg = readJson("packages/core/package.json");
const vscodePkg = readJson("packages/vscode-extension/package.json");
const openclawPkg = readJson("packages/openclaw-plugin/package.json");
const sbom = {
  bomFormat: "CycloneDX",
  specVersion: "1.5",
  version: 1,
  metadata: {
    timestamp: generatedAt,
    component: {
      type: "application",
      name: "quicktask-release-assets"
    }
  },
  components: [
    { type: "library", name: corePkg.name, version: corePkg.version },
    { type: "application", name: vscodePkg.name, version: vscodePkg.version },
    { type: "application", name: openclawPkg.name, version: openclawPkg.version }
  ]
};
writeFileSync("artifacts/sbom.json", `${JSON.stringify(sbom, null, 2)}\n`, "utf8");

console.log(`release-integrity: wrote checksums and metadata for ${entries.length} file(s)`);
