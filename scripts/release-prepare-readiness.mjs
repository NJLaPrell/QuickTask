#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "docs/release-readiness-report.md";
const TIMESTAMP_MARKER = "- Generated at:";

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

function getMilestoneSection(content) {
  const milestoneStart = content.indexOf("## Milestone execution order");
  const milestoneEnd = content.indexOf("## Completed tasks (not yet archived)");
  if (milestoneStart === -1 || milestoneEnd === -1) {
    return content;
  }

  return content.slice(milestoneStart, milestoneEnd);
}

export function parseOpenReleaseReadinessTasks(content) {
  const lines = getMilestoneSection(content).split("\n");
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

    openTasks.push({
      taskId: taskMatch[1],
      title: taskMatch[2],
      priority: taskMatch[3],
      phase: currentPhase
    });
  }

  return openTasks;
}

export function readOpenReleaseReadinessTasks() {
  const content = readFileSync("TASKS.md", "utf8");
  return parseOpenReleaseReadinessTasks(content);
}

export function parseMilestonePhaseSummary(content) {
  const lines = getMilestoneSection(content).split("\n");
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
    releasablePhases.length > 0 ? releasablePhases[releasablePhases.length - 1].name : "Phase 1";

  return { currentReleasePhase, phases };
}

export function readMilestonePhaseSummary() {
  const content = readFileSync("TASKS.md", "utf8");
  return parseMilestonePhaseSummary(content);
}

export function listPendingChangesetFiles(entries) {
  return entries.filter((entry) => entry.endsWith(".md") && entry !== "README.md");
}

export function readPendingChangesets() {
  const changesetDir = ".changeset";
  if (!existsSync(changesetDir)) {
    return [];
  }

  return listPendingChangesetFiles(readdirSync(changesetDir));
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

export function buildFindings(results, openReadinessTasks, currentReleasePhase, pendingChangesets) {
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

  if (pendingChangesets.length === 0) {
    findings.push({
      severity: "medium",
      source: "changeset-preflight",
      summary: "No pending releaseable changeset entries were found",
      details:
        "Add a .changeset/*.md file with user-visible release notes before handoff so release:version has explicit input.",
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

export function isBlockingFinding(finding, currentReleasePhase) {
  const isNewFinding = !finding.existingTaskId;
  const isBlockingSeverity = finding.severity === "high" || finding.severity === "medium";
  const isCurrentPhaseFinding = finding.phase === currentReleasePhase;
  return isNewFinding && isBlockingSeverity && isCurrentPhaseFinding;
}

export function renderReport(results, findings, currentReleasePhase, timestamp, pendingChangesets) {
  const blockers = findings.filter((finding) => isBlockingFinding(finding, currentReleasePhase));
  const lines = [
    "# Release Readiness Report",
    "",
    `- Generated at: ${timestamp}`,
    "- Scope target: all phases (fixed)",
    `- Current release phase: ${currentReleasePhase}`,
    "- Scope: pre-release readiness checks before `Release` workflow handoff",
    "- Blocking policy: only new medium/high findings for the current release phase block handoff",
    `- Pending changesets: ${pendingChangesets.length}`,
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
  lines.push(
    "- For findings without an existing task, add new tasks in `TASKS.md` and assign phase/priority manually."
  );
  lines.push(
    "- For findings mapped to existing tasks, update those task sections with latest validation evidence."
  );
  lines.push("- Do not use GitHub issues for this flow.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

export function normalizeVolatileReportFields(report) {
  return report
    .split("\n")
    .map((line) => {
      if (line.startsWith(TIMESTAMP_MARKER)) {
        return `${TIMESTAMP_MARKER} <normalized>`;
      }

      if (line.startsWith("| ") && line.endsWith("ms |")) {
        return line.replace(/\| \d+ms \|$/, "| <normalized> |");
      }

      return line;
    })
    .join("\n");
}

export function shouldWriteReport(existingReport, nextReport) {
  if (!existingReport) {
    return true;
  }
  return (
    normalizeVolatileReportFields(existingReport) !== normalizeVolatileReportFields(nextReport)
  );
}

export function main() {
  const timestamp = new Date().toISOString();
  const checkResults = commandChecks.map(runCheck);
  const { currentReleasePhase } = readMilestonePhaseSummary();
  const openReadinessTasks = readOpenReleaseReadinessTasks();
  const pendingChangesets = readPendingChangesets();
  const findings = buildFindings(
    checkResults,
    openReadinessTasks,
    currentReleasePhase,
    pendingChangesets
  );
  const report = renderReport(
    checkResults,
    findings,
    currentReleasePhase,
    timestamp,
    pendingChangesets
  );

  const existingReport = existsSync(reportPath) ? readFileSync(reportPath, "utf8") : "";
  if (shouldWriteReport(existingReport, report)) {
    writeFileSync(reportPath, report, "utf8");
    console.log(`release-prepare: wrote ${reportPath}`);
  } else {
    console.log("release-prepare: report unchanged (timestamp-only delta ignored)");
  }

  const hasBlockingFindings = findings.some((finding) =>
    isBlockingFinding(finding, currentReleasePhase)
  );
  process.exit(hasBlockingFindings ? 2 : 0);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
