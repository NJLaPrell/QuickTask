#!/usr/bin/env node

import { readFileSync } from "node:fs";

const DISTRIBUTABLE_PACKAGES = [
  "packages/core/package.json",
  "packages/vscode-extension/package.json",
  "packages/openclaw-plugin/package.json"
];

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

export function checkPackageCompliance(packagesByPath) {
  const findings = [];
  for (const [path, pkg] of Object.entries(packagesByPath)) {
    if (!isNonEmptyString(pkg.name)) {
      findings.push(`${path}: missing non-empty name`);
    }
    if (!isNonEmptyString(pkg.version)) {
      findings.push(`${path}: missing non-empty version`);
    }
    if (!isNonEmptyString(pkg.license)) {
      findings.push(`${path}: missing non-empty license`);
    }
    if (
      !(
        isNonEmptyString(pkg.repository) ||
        (pkg.repository && isNonEmptyString(pkg.repository.url))
      )
    ) {
      findings.push(`${path}: missing repository metadata`);
    }
  }

  const corePkg = packagesByPath["packages/core/package.json"];
  if (!Array.isArray(corePkg.files) || !corePkg.files.includes("dist")) {
    findings.push("packages/core/package.json: files must include dist");
  }

  const openclawPkg = packagesByPath["packages/openclaw-plugin/package.json"];
  if (!Array.isArray(openclawPkg.files) || !openclawPkg.files.includes("dist")) {
    findings.push("packages/openclaw-plugin/package.json: files must include dist");
  }

  const vscodePkg = packagesByPath["packages/vscode-extension/package.json"];
  if (!isNonEmptyString(vscodePkg.publisher)) {
    findings.push("packages/vscode-extension/package.json: missing publisher metadata");
  }
  if (!isNonEmptyString(vscodePkg.engines?.vscode)) {
    findings.push("packages/vscode-extension/package.json: missing engines.vscode");
  }

  return findings;
}

export function main() {
  const packagesByPath = Object.fromEntries(
    DISTRIBUTABLE_PACKAGES.map((path) => [path, readJson(path)])
  );
  const findings = checkPackageCompliance(packagesByPath);
  if (findings.length > 0) {
    console.error("package-compliance-check: found package metadata drift:");
    for (const finding of findings) {
      console.error(`- ${finding}`);
    }
    process.exit(1);
  }
  console.log("package-compliance-check: distributable package metadata is compliant");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
