#!/usr/bin/env node

import { readFileSync } from "node:fs";

const OPEN_MARKERS = new Set(["p", " ", "~", "!"]);

function parseTaskStatuses(content) {
  const map = new Map();
  const regex = /^- \[([ pxh~!])\] (T\d+) - /gm;
  for (const match of content.matchAll(regex)) {
    map.set(match[2], match[1]);
  }
  const headerRegex = /^### \[([ pxh~!])\] (T\d+) - /gm;
  for (const match of content.matchAll(headerRegex)) {
    map.set(match[2], match[1]);
  }
  return map;
}

function parsePhaseTaskIds(content, phaseNumber) {
  const phaseHeader = `### Phase ${phaseNumber} - `;
  const start = content.indexOf(phaseHeader);
  if (start === -1) {
    throw new Error(`Phase ${phaseNumber} was not found in TASKS.md.`);
  }
  const next = content.indexOf("\n### Phase ", start + phaseHeader.length);
  const phaseBlock = next === -1 ? content.slice(start) : content.slice(start, next);
  const plannedLine = phaseBlock
    .split("\n")
    .find((line) => line.includes("Planned task IDs") || line.includes("Active/near-term IDs"));
  if (!plannedLine) {
    return [];
  }
  return [...new Set(plannedLine.match(/\bT\d+\b/g) ?? [])];
}

export function evaluatePhaseExit(content, phaseNumber) {
  const taskIds = parsePhaseTaskIds(content, phaseNumber);
  const statusByTask = parseTaskStatuses(content);
  const blockers = taskIds
    .map((taskId) => ({ taskId, status: statusByTask.get(taskId) ?? "?" }))
    .filter((entry) => OPEN_MARKERS.has(entry.status));
  return {
    phaseNumber,
    taskCount: taskIds.length,
    blockers,
    ready: blockers.length === 0
  };
}

export function main() {
  const phaseFlagIndex = process.argv.indexOf("--phase");
  if (phaseFlagIndex === -1 || !process.argv[phaseFlagIndex + 1]) {
    console.error("Usage: pnpm phase:check -- --phase <number>");
    process.exit(1);
  }
  const phaseNumber = Number(process.argv[phaseFlagIndex + 1]);
  if (!Number.isInteger(phaseNumber) || phaseNumber <= 0) {
    console.error(`Invalid phase number: ${process.argv[phaseFlagIndex + 1]}`);
    process.exit(1);
  }

  const content = readFileSync("TASKS.md", "utf8");
  const result = evaluatePhaseExit(content, phaseNumber);
  if (!result.ready) {
    console.error(`phase-check: Phase ${phaseNumber} is NOT exit-ready`);
    for (const blocker of result.blockers) {
      console.error(`- ${blocker.taskId} remains open with status [${blocker.status}]`);
    }
    process.exit(1);
  }

  console.log(
    `phase-check: Phase ${phaseNumber} is exit-ready (${result.taskCount} planned task(s) complete)`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
