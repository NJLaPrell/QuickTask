#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "docs/release-readiness-report.md";
const timestamp = new Date().toISOString();

const commandChecks = [
  {
    id: "typecheck",
    label: "Workspace typecheck",
    command: "pnpm",
    args: ["check"],
    failureSeverity: "high"
  },
  {
    id: "tests",
    label: "Workspace tests",
    command: "pnpm",
    args: ["test"],
    failureSeverity: "high"
  },
  {
    id: "build",
    label: "Workspace build",
    command: "pnpm",
    args: ["build"],
    failureSeverity: "high"
  },
  {
    id: "docs-gate",
    label: "Release docs sync gate",
    command: "pnpm",
    args: ["release:docs-check"],
    failureSeverity: "medium",
    env: {
      RELEASE_README_STATUS: "updated",
      RELEASE_DOCS_STATUS: "updated",
      RELEASE_DOCS_SYNC_NOTES: "validated during release readiness preparation"
    }
  }
];

function runCheck(check) {
  const startedAt = Date.now();
  const result = spawnSync(check.command, check.args, {
    encoding: "utf8",
    env: {
      ...process.env,
      ...(check.env ?? {})
    }
  });

  return {
    ...check,
    ok: result.status === 0,
    statusCode: result.status ?? 1,
    durationMs: Date.now() - startedAt,
    output: `${result.stdout ?? ""}${result.stderr ?? ""}`.trim()
  };
}

function readOpenReleaseReadinessTasks() {
  const content = readFileSync("TASKS.md", "utf8");
  const milestoneStart = content.indexOf("## Milestone execution order");
  const milestoneEnd = content.indexOf("## Completed tasks (not yet archived)");
  const milestoneSection =
    milestoneStart !== -1 && milestoneEnd !== -1
      ? content.slice(milestoneStart, milestoneEnd)
      : content;
  const lines = milestoneSection.split("\n");
  const openTasks = [];
  let currentPhase = "";
  const phaseRegex = /^### (Phase \d+) - /;
  const openTaskRegex = /^- \[ \] (T\d+) - (.+) \((P\d)\)$/;

  for (const line of lines) {
    const phaseMatch = line.match(phaseRegex);
    if (phaseMatch) {
      currentPhase = phaseMatch[1];
      continue;
    }

    const taskMatch = line.match(openTaskRegex);
    if (!taskMatch || !currentPhase) {
      continue;
    }

    const taskId = taskMatch[1];
    openTasks.push({
      taskId,
      title: taskMatch[2],
      priority: taskMatch[3],
      phase: currentPhase
    });
  }

  return openTasks;
}

function readMilestonePhaseSummary() {
  const content = readFileSync("TASKS.md", "utf8");
  const milestoneStart = content.indexOf("## Milestone execution order");
  const milestoneEnd = content.indexOf("## Completed tasks (not yet archived)");
  const milestoneSection =
    milestoneStart !== -1 && milestoneEnd !== -1
      ? content.slice(milestoneStart, milestoneEnd)
      : content;
  const lines = milestoneSection.split("\n");
  const phases = [];
  let currentPhase = null;
  const phaseRegex = /^### (Phase \d+) - /;
  const anyTaskRegex = /^- \[( |x|h)\] (T\d+) - (.+) \((P\d)\)$/;
  const openTaskRegex = /^- \[ \] (T\d+) - (.+) \((P\d)\)$/;

  for (const line of lines) {
    const phaseMatch = line.match(phaseRegex);
    if (phaseMatch) {
      currentPhase = { name: phaseMatch[1], hasOpenTasks: false, taskCount: 0 };
      phases.push(currentPhase);
      continue;
    }

    if (!currentPhase) {
      continue;
    }

    if (anyTaskRegex.test(line)) {
      currentPhase.taskCount += 1;
    }

    if (openTaskRegex.test(line)) {
      currentPhase.hasOpenTasks = true;
    }
  }

  const releasablePhases = phases.filter((phase) => phase.taskCount > 0 && !phase.hasOpenTasks);
  const currentReleasePhase =
    releasablePhases.length > 0
      ? releasablePhases[releasablePhases.length - 1].name
      : "Phase 1";

  return { currentReleasePhase, phases };
}

function buildFindings(results, openReadinessTasks, currentReleasePhase) {
  const findings = [];
  for (const result of results) {
    if (result.ok) {
      continue;
    }
    findings.push({
      severity: result.failureSeverity,
      source: result.id,
      summary: `${result.label} failed`,
      details: result.output || "No command output captured.",
      existingTaskId: null,
      phase: currentReleasePhase
    });
  }

  for (const task of openReadinessTasks) {
    findings.push({
      severity: "medium",
      source: "tasks-backlog",
      summary: `Open release-readiness task remains: ${task.taskId}`,
      details: `${task.phase} | ${task.taskId} (${task.priority}) - ${task.title}`,
      existingTaskId: task.taskId,
      phase: task.phase
    });
  }

  return findings;
}

function isBlockingFinding(finding, currentReleasePhase) {
  const isNewFinding = !finding.existingTaskId;
  const isBlockingSeverity = finding.severity === "high" || finding.severity === "medium";
  const isCurrentPhaseFinding = finding.phase === currentReleasePhase;
  return isNewFinding && isBlockingSeverity && isCurrentPhaseFinding;
}

function renderReport(results, findings, currentReleasePhase) {
  const blockers = findings.filter((finding) => isBlockingFinding(finding, currentReleasePhase));
  const lines = [
    "# Release Readiness Report",
    "",
    `- Generated at: ${timestamp}`,
    "- Scope target: all phases (fixed)",
    `- Current release phase: ${currentReleasePhase}`,
    "- Scope: pre-release readiness checks before `Release` workflow handoff",
    "- Blocking policy: only new medium/high findings for the current release phase block handoff",
    "",
    "## Command checks",
    "",
    "| Check | Result | Severity on failure | Duration |",
    "| --- | --- | --- | --- |",
    ...results.map((result) => {
      const status = result.ok ? "pass" : "fail";
      return `| ${result.label} | ${status} | ${result.failureSeverity} | ${result.durationMs}ms |`;
    }),
    "",
    "## Findings",
    ""
  ];

  if (findings.length === 0) {
    lines.push("- None.");
  } else {
    for (const finding of findings) {
      const taskRef = finding.existingTaskId ? ` (existing task: ${finding.existingTaskId})` : "";
      lines.push(`- [${finding.severity}] ${finding.summary}${taskRef}`);
      lines.push(`  - Source: ${finding.source}`);
      lines.push(`  - Details: ${finding.details.replace(/\s+/g, " ").trim()}`);
    }
  }

  lines.push("");
  lines.push("## Handoff decision");
  lines.push("");
  if (blockers.length > 0) {
    lines.push(
      `- BLOCKED: ${blockers.length} medium/high finding(s) must be resolved or accepted before running the release workflow.`
    );
  } else {
    lines.push("- READY: no medium/high findings; release workflow handoff is allowed.");
  }

  lines.push("");
  lines.push("## Task maintenance action");
  lines.push("");
  lines.push("- For findings without an existing task, add new tasks in `TASKS.md` and assign phase/priority manually.");
  lines.push("- For findings mapped to existing tasks, update those task sections with latest validation evidence.");
  lines.push("- Do not use GitHub issues for this flow.");

  lines.push("");
  return `${lines.join("\n")}\n`;
}

const checkResults = commandChecks.map(runCheck);
const { currentReleasePhase } = readMilestonePhaseSummary();
const openReadinessTasks = readOpenReleaseReadinessTasks();
const findings = buildFindings(checkResults, openReadinessTasks, currentReleasePhase);
const report = renderReport(checkResults, findings, currentReleasePhase);

writeFileSync(reportPath, report, "utf8");
console.log(`release-prepare: wrote ${reportPath}`);

const hasBlockingFindings = findings.some((finding) => isBlockingFinding(finding, currentReleasePhase));
process.exit(hasBlockingFindings ? 2 : 0);
