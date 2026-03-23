#!/usr/bin/env node

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const CONTRACT_PATH = ".workspace-kit/workflow-contract.json";
const PROFILE_PATH = "workspace-kit.profile.json";
const GENERATED_JSON_PATH = ".workspace-kit/generated/workflow-contract-summary.json";
const GENERATED_RULE_PATH = ".cursor/rules/workspace-kit-workflow-contract.mdc";

function toJsonWithTrailingNewline(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function byPhaseOrder(left, right) {
  if (left.order !== right.order) {
    return left.order - right.order;
  }
  return left.id.localeCompare(right.id);
}

function createPhaseSummary(phase, gate) {
  return {
    id: phase.id,
    order: phase.order,
    title: phase.title,
    requiredChecks: [...phase.requiredChecks].sort((a, b) => a.localeCompare(b)),
    allowedTransitions: [...phase.allowedTransitions].sort((a, b) => a.localeCompare(b)),
    gate: gate
      ? {
          id: gate.id,
          onFailure: gate.onFailure,
          requiredCheckIds: [...gate.requiredCheckIds].sort((a, b) => a.localeCompare(b))
        }
      : undefined
  };
}

export function renderWorkflowContractSnippets(contract, profile) {
  const projectName =
    profile &&
    typeof profile === "object" &&
    profile.project &&
    typeof profile.project === "object" &&
    typeof profile.project.name === "string"
      ? profile.project.name
      : "unknown-project";

  const checksById = new Map(
    contract.checks.map((check) => [
      check.id,
      { id: check.id, label: check.label, command: check.command }
    ])
  );
  const gatesByPhaseId = new Map(contract.gates.map((gate) => [gate.phaseId, gate]));
  const phases = [...contract.phases].sort(byPhaseOrder);

  const summary = {
    schemaVersion: contract.schemaVersion,
    projectName,
    generatedAt: "deterministic-contract-render",
    phaseCount: phases.length,
    phases: phases.map((phase) => createPhaseSummary(phase, gatesByPhaseId.get(phase.id))),
    checks: [...checksById.values()].sort((left, right) => left.id.localeCompare(right.id))
  };

  const ruleLines = [
    "# Workspace Kit Workflow Contract",
    "",
    `Project: \`${projectName}\``,
    "",
    "This rule is generated from `.workspace-kit/workflow-contract.json` plus `workspace-kit.profile.json`.",
    "Do not manually edit this file; run `pnpm workspace-kit:generate-workflow-contract-snippets`.",
    "",
    "## Phase gates"
  ];

  for (const phase of phases) {
    const gate = gatesByPhaseId.get(phase.id);
    ruleLines.push("");
    ruleLines.push(`### ${phase.id} (${phase.title})`);
    ruleLines.push(`- Required checks: ${phase.requiredChecks.join(", ") || "none"}`);
    ruleLines.push(`- Allowed transitions: ${phase.allowedTransitions.join(", ") || "none"}`);
    if (gate) {
      ruleLines.push(`- Gate policy: ${gate.onFailure}`);
      ruleLines.push(`- Gate checks: ${gate.requiredCheckIds.join(", ")}`);
    }
  }

  ruleLines.push("");
  ruleLines.push("## Check commands");
  for (const check of [...checksById.values()].sort((left, right) =>
    left.id.localeCompare(right.id)
  )) {
    ruleLines.push(`- ${check.id}: ${check.command}`);
  }
  ruleLines.push("");

  return {
    summaryJson: toJsonWithTrailingNewline(summary),
    ruleText: `${ruleLines.join("\n")}\n`
  };
}

export function generateWorkflowContractSnippets(cwd = process.cwd()) {
  const contract = JSON.parse(readFileSync(path.join(cwd, CONTRACT_PATH), "utf8"));
  const profile = JSON.parse(readFileSync(path.join(cwd, PROFILE_PATH), "utf8"));
  const rendered = renderWorkflowContractSnippets(contract, profile);

  const summaryPath = path.join(cwd, GENERATED_JSON_PATH);
  const rulePath = path.join(cwd, GENERATED_RULE_PATH);
  mkdirSync(path.dirname(summaryPath), { recursive: true });
  mkdirSync(path.dirname(rulePath), { recursive: true });
  writeFileSync(summaryPath, rendered.summaryJson, "utf8");
  writeFileSync(rulePath, rendered.ruleText, "utf8");
  const prettierResult = spawnSync(
    "pnpm",
    ["prettier", "--parser", "json", "--write", GENERATED_JSON_PATH],
    { cwd, encoding: "utf8" }
  );
  if (prettierResult.status !== 0) {
    throw new Error(prettierResult.stderr || "failed to format generated workflow summary JSON");
  }

  return {
    summaryPath,
    rulePath
  };
}

export function main() {
  const { summaryPath, rulePath } = generateWorkflowContractSnippets();
  console.log("workspace-kit-workflow-contract: generated snippets");
  console.log(`- ${summaryPath}`);
  console.log(`- ${rulePath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
