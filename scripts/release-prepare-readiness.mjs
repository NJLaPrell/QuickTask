#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "docs/release-readiness-report.md";
const timestamp = new Date().toISOString();
const releasePrepScope = (process.env.RELEASE_PREP_SCOPE ?? "phase-2").trim().toLowerCase();

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

const scopeToPhases = {
  "phase-2": new Set(["Phase 1", "Phase 2"]),
  "all-phases": new Set(["Phase 1", "Phase 2", "Phase 3", "Phase 4", "Phase 5", "Phase 6"])
};

function resolveTargetPhases() {
  const phases = scopeToPhases[releasePrepScope];
  if (!phases) {
    throw new Error(
      `Unsupported RELEASE_PREP_SCOPE "${releasePrepScope}". Use one of: ${Object.keys(scopeToPhases).join(", ")}`
    );
  }
  return phases;
}

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
  const targetPhases = resolveTargetPhases();
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
    if (!taskMatch || !targetPhases.has(currentPhase)) {
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

function buildFindings(results, openReadinessTasks) {
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
      existingTaskId: null
    });
  }

  for (const task of openReadinessTasks) {
    findings.push({
      severity: "medium",
      source: "tasks-backlog",
      summary: `Open release-readiness task remains: ${task.taskId}`,
      details: `${task.phase} | ${task.taskId} (${task.priority}) - ${task.title}`,
      existingTaskId: task.taskId
    });
  }

  return findings;
}

function renderReport(results, findings) {
  const blockers = findings.filter((f) => f.severity === "high" || f.severity === "medium");
  const lines = [
    "# Release Readiness Report",
    "",
    `- Generated at: ${timestamp}`,
    `- Scope target: ${releasePrepScope}`,
    "- Scope: pre-release readiness checks before `Release` workflow handoff",
    "- Blocking policy: medium/high findings block handoff",
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
const openReadinessTasks = readOpenReleaseReadinessTasks();
const findings = buildFindings(checkResults, openReadinessTasks);
const report = renderReport(checkResults, findings);

writeFileSync(reportPath, report, "utf8");
console.log(`release-prepare: wrote ${reportPath}`);

const hasBlockingFindings = findings.some((finding) => finding.severity === "high" || finding.severity === "medium");
process.exit(hasBlockingFindings ? 2 : 0);
