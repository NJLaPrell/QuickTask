#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const readmeStatus = process.env.RELEASE_README_STATUS;
const docsStatus = process.env.RELEASE_DOCS_STATUS;
const docsSyncNotes = (process.env.RELEASE_DOCS_SYNC_NOTES ?? "").trim();

const allowedStatuses = new Set(["updated", "no-change"]);

function fail(message) {
  console.error(`release-docs-check: ${message}`);
  process.exit(1);
}

if (!allowedStatuses.has(readmeStatus ?? "")) {
  fail("RELEASE_README_STATUS must be one of: updated, no-change");
}

if (!allowedStatuses.has(docsStatus ?? "")) {
  fail("RELEASE_DOCS_STATUS must be one of: updated, no-change");
}

if ((readmeStatus === "no-change" || docsStatus === "no-change") && !docsSyncNotes) {
  fail("docs_sync_notes is required when README or docs are marked no-change");
}

if (!existsSync("README.md")) {
  fail("README.md is missing");
}

if (!existsSync("RELEASE_STRATEGY.md")) {
  fail("RELEASE_STRATEGY.md is missing");
}

const readme = readFileSync("README.md", "utf8");
if (!readme.includes("RELEASE_STRATEGY.md")) {
  fail("README.md must reference RELEASE_STRATEGY.md");
}

console.log("release-docs-check: docs sync gate passed");
