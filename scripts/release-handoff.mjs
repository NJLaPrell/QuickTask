#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function argValue(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return undefined;
  }
  return process.argv[index + 1];
}

function hasFlag(flag) {
  return process.argv.includes(flag);
}

function fail(message) {
  console.error(`release-handoff: ${message}`);
  process.exit(1);
}

const readmeStatus = argValue("--readme-status");
const docsStatus = argValue("--docs-status");
const docsSyncNotes = argValue("--docs-sync-notes") ?? "";
const rcRunId = argValue("--rc-run-id");
const force = hasFlag("--force");

if (!["updated", "no-change"].includes(readmeStatus ?? "")) {
  fail("--readme-status must be updated or no-change");
}

if (!["updated", "no-change"].includes(docsStatus ?? "")) {
  fail("--docs-status must be updated or no-change");
}

if ((readmeStatus === "no-change" || docsStatus === "no-change") && !docsSyncNotes.trim()) {
  fail("--docs-sync-notes is required when any docs status is no-change");
}

if (!rcRunId?.trim()) {
  fail("--rc-run-id is required");
}

if (!force) {
  const reportPath = "docs/release-readiness-report.md";
  if (!existsSync(reportPath)) {
    fail("docs/release-readiness-report.md does not exist. Run pnpm release:prepare first.");
  }

  const report = readFileSync(reportPath, "utf8");
  if (!report.includes("- READY:")) {
    fail("readiness report is not in READY state. Re-run pnpm release:prepare or use --force.");
  }
}

const args = [
  "workflow",
  "run",
  "Release",
  "--ref",
  "main",
  "-f",
  `readme_status=${readmeStatus}`,
  "-f",
  `docs_status=${docsStatus}`,
  "-f",
  `docs_sync_notes=${docsSyncNotes}`,
  "-f",
  `rc_run_id=${rcRunId}`
];

const result = spawnSync("gh", args, {
  stdio: "inherit",
  encoding: "utf8"
});

if (result.status !== 0) {
  fail("failed to dispatch Release workflow via gh CLI");
}

console.log("release-handoff: Release workflow dispatched successfully");
