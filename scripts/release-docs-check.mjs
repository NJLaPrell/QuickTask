#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const allowedStatuses = new Set(["updated", "no-change"]);

export function evaluateReleaseDocsGate(options) {
  const {
    readmeStatus,
    docsStatus,
    docsSyncNotes,
    readmeExists,
    releaseStrategyExists,
    readmeContent
  } = options;
  const errors = [];

  if (!allowedStatuses.has(readmeStatus ?? "")) {
    errors.push("RELEASE_README_STATUS must be one of: updated, no-change");
  }

  if (!allowedStatuses.has(docsStatus ?? "")) {
    errors.push("RELEASE_DOCS_STATUS must be one of: updated, no-change");
  }

  if ((readmeStatus === "no-change" || docsStatus === "no-change") && !docsSyncNotes.trim()) {
    errors.push("docs_sync_notes is required when README or docs are marked no-change");
  }

  if (!readmeExists) {
    errors.push("README.md is missing");
  }

  if (!releaseStrategyExists) {
    errors.push("RELEASE_STRATEGY.md is missing");
  }

  if (readmeExists && !readmeContent.includes("RELEASE_STRATEGY.md")) {
    errors.push("README.md must reference RELEASE_STRATEGY.md");
  }

  return {
    ok: errors.length === 0,
    errors
  };
}

export function main() {
  const readmeStatus = process.env.RELEASE_README_STATUS;
  const docsStatus = process.env.RELEASE_DOCS_STATUS;
  const docsSyncNotes = (process.env.RELEASE_DOCS_SYNC_NOTES ?? "").trim();
  const result = evaluateReleaseDocsGate({
    readmeStatus,
    docsStatus,
    docsSyncNotes,
    readmeExists: existsSync("README.md"),
    releaseStrategyExists: existsSync("RELEASE_STRATEGY.md"),
    readmeContent: existsSync("README.md") ? readFileSync("README.md", "utf8") : ""
  });

  if (!result.ok) {
    for (const error of result.errors) {
      console.error(`release-docs-check: ${error}`);
    }
    process.exit(1);
  }

  console.log("release-docs-check: docs sync gate passed");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
