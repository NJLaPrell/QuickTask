#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

function argValue(argv, flag) {
  const index = argv.indexOf(flag);
  if (index === -1 || index + 1 >= argv.length) {
    return undefined;
  }
  return argv[index + 1];
}

function hasFlag(argv, flag) {
  return argv.includes(flag);
}

export function parseReleaseHandoffArgs(argv = process.argv.slice(2)) {
  return {
    readmeStatus: argValue(argv, "--readme-status"),
    docsStatus: argValue(argv, "--docs-status"),
    docsSyncNotes: argValue(argv, "--docs-sync-notes") ?? "",
    rcRunId: argValue(argv, "--rc-run-id"),
    force: hasFlag(argv, "--force")
  };
}

export function isReadinessReportReady(reportContent) {
  return reportContent.includes("- READY:");
}

export function validateReleaseHandoffArgs(args, readinessReportState) {
  const errors = [];
  if (!["updated", "no-change"].includes(args.readmeStatus ?? "")) {
    errors.push("--readme-status must be updated or no-change");
  }

  if (!["updated", "no-change"].includes(args.docsStatus ?? "")) {
    errors.push("--docs-status must be updated or no-change");
  }

  if (
    (args.readmeStatus === "no-change" || args.docsStatus === "no-change") &&
    !args.docsSyncNotes.trim()
  ) {
    errors.push("--docs-sync-notes is required when any docs status is no-change");
  }

  if (!args.rcRunId?.trim()) {
    errors.push("--rc-run-id is required");
  }

  if (!args.force) {
    if (!readinessReportState.exists) {
      errors.push(
        "docs/release-readiness-report.md does not exist. Run pnpm release:prepare first."
      );
    } else if (!isReadinessReportReady(readinessReportState.content)) {
      errors.push(
        "readiness report is not in READY state. Re-run pnpm release:prepare or use --force."
      );
    }
  }

  return {
    ok: errors.length === 0,
    errors
  };
}

export function buildReleaseHandoffDispatchArgs(args) {
  return [
    "workflow",
    "run",
    "Release",
    "--ref",
    "main",
    "-f",
    `readme_status=${args.readmeStatus}`,
    "-f",
    `docs_status=${args.docsStatus}`,
    "-f",
    `docs_sync_notes=${args.docsSyncNotes}`,
    "-f",
    `rc_run_id=${args.rcRunId}`
  ];
}

export function main() {
  const reportPath = "docs/release-readiness-report.md";
  const parsedArgs = parseReleaseHandoffArgs();
  const readinessReportState = {
    exists: existsSync(reportPath),
    content: existsSync(reportPath) ? readFileSync(reportPath, "utf8") : ""
  };
  const validation = validateReleaseHandoffArgs(parsedArgs, readinessReportState);
  if (!validation.ok) {
    for (const error of validation.errors) {
      console.error(`release-handoff: ${error}`);
    }
    process.exit(1);
  }

  const dispatchArgs = buildReleaseHandoffDispatchArgs(parsedArgs);
  const result = spawnSync("gh", dispatchArgs, {
    stdio: "inherit",
    encoding: "utf8"
  });

  if (result.status !== 0) {
    console.error("release-handoff: failed to dispatch Release workflow via gh CLI");
    process.exit(1);
  }

  console.log("release-handoff: Release workflow dispatched successfully");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
