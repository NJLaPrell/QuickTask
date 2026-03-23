#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { validateWorkspaceKitImprovementLog } from "./validate-workspace-kit-improvement-log.mjs";

const LOG_PATH = ".workspace-kit/improvement-log.json";
const SUMMARY_PATH = ".workspace-kit/generated/improvement-summary.json";

function sortCounts(counts) {
  return Object.fromEntries(
    Object.entries(counts).sort(([left], [right]) => left.localeCompare(right))
  );
}

function toStableJson(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function buildWorkspaceKitImprovementSummary(log) {
  const statusCounts = {
    open: 0,
    in_progress: 0,
    resolved: 0,
    accepted_risk: 0,
    archived: 0
  };
  const severityCounts = {
    low: 0,
    medium: 0,
    high: 0
  };
  const categoryCounts = {};
  const sourceKindCounts = {};
  const releaseSignals = {
    requiresChangeCount: 0,
    noteOnlyCount: 0,
    noneCount: 0
  };
  const openRecordIds = [];
  const recordsSorted = [...log.records].sort((left, right) => left.id.localeCompare(right.id));

  for (const record of recordsSorted) {
    statusCounts[record.status] += 1;
    severityCounts[record.severity] += 1;
    categoryCounts[record.category] = (categoryCounts[record.category] ?? 0) + 1;
    sourceKindCounts[record.source.kind] = (sourceKindCounts[record.source.kind] ?? 0) + 1;

    if (record.releaseImpact === "requires_change") {
      releaseSignals.requiresChangeCount += 1;
    } else if (record.releaseImpact === "note_only") {
      releaseSignals.noteOnlyCount += 1;
    } else {
      releaseSignals.noneCount += 1;
    }

    if (record.status === "open" || record.status === "in_progress") {
      openRecordIds.push(record.id);
    }
  }

  return {
    schemaVersion: 1,
    generatedAt: "deterministic-improvement-summary",
    reviewCadence: log.policy.reviewCadence,
    recordCount: recordsSorted.length,
    statusCounts,
    severityCounts,
    categoryCounts: sortCounts(categoryCounts),
    sourceKindCounts: sortCounts(sourceKindCounts),
    releaseSignals,
    openRecordIds
  };
}

export function generateWorkspaceKitImprovementSummary(cwd = process.cwd()) {
  const log = JSON.parse(readFileSync(path.join(cwd, LOG_PATH), "utf8"));
  const validationResult = validateWorkspaceKitImprovementLog(log);
  if (!validationResult.ok) {
    throw new Error(
      `cannot generate improvement summary from invalid log: ${validationResult.findings.join("; ")}`
    );
  }

  const summaryPath = path.join(cwd, SUMMARY_PATH);
  const summary = buildWorkspaceKitImprovementSummary(log);
  mkdirSync(path.dirname(summaryPath), { recursive: true });
  writeFileSync(summaryPath, toStableJson(summary), "utf8");

  const prettierResult = spawnSync(
    "pnpm",
    ["prettier", "--parser", "json", "--write", SUMMARY_PATH],
    {
      cwd,
      encoding: "utf8"
    }
  );
  if (prettierResult.status !== 0) {
    throw new Error(prettierResult.stderr || "failed to format generated improvement summary");
  }

  return {
    summaryPath
  };
}

export function main() {
  const { summaryPath } = generateWorkspaceKitImprovementSummary();
  console.log("workspace-kit-improvement-log: summary generated");
  console.log(`- ${summaryPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
