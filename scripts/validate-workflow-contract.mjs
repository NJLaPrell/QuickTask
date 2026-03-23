#!/usr/bin/env node

import { readFileSync } from "node:fs";

export function validateWorkflowContract(contract) {
  const findings = [];
  if (!contract || typeof contract !== "object" || Array.isArray(contract)) {
    return { ok: false, findings: ["workflow-contract root must be an object"] };
  }

  const schemaVersion = contract.schemaVersion;
  const phases = Array.isArray(contract.phases) ? contract.phases : [];
  const checks = Array.isArray(contract.checks) ? contract.checks : [];
  const gates = Array.isArray(contract.gates) ? contract.gates : [];

  if (!Number.isInteger(schemaVersion) || schemaVersion < 1) {
    findings.push("schemaVersion must be an integer >= 1");
  }

  if (phases.length === 0) {
    findings.push("phases must be a non-empty array");
  }
  if (checks.length === 0) {
    findings.push("checks must be a non-empty array");
  }
  if (gates.length === 0) {
    findings.push("gates must be a non-empty array");
  }

  const phaseIdToOrder = new Map();
  for (const phase of phases) {
    if (!phase || typeof phase !== "object" || Array.isArray(phase)) {
      findings.push("each phase must be an object");
      continue;
    }

    const { id, order, title, requiredChecks, allowedTransitions } = phase;
    if (typeof id !== "string" || id.length === 0) {
      findings.push("phase.id must be a non-empty string");
      continue;
    }
    if (phaseIdToOrder.has(id)) {
      findings.push(`duplicate phase.id: ${id}`);
    }
    if (!Number.isInteger(order) || order < 0) {
      findings.push(`phase '${id}' must have non-negative integer order`);
    } else {
      phaseIdToOrder.set(id, order);
    }
    if (typeof title !== "string" || title.length === 0) {
      findings.push(`phase '${id}' must have a non-empty title`);
    }
    if (
      !Array.isArray(requiredChecks) ||
      requiredChecks.some((value) => typeof value !== "string")
    ) {
      findings.push(`phase '${id}' must define requiredChecks as string array`);
    }
    if (
      !Array.isArray(allowedTransitions) ||
      allowedTransitions.some((value) => typeof value !== "string")
    ) {
      findings.push(`phase '${id}' must define allowedTransitions as string array`);
    }
  }

  const checkIds = new Set();
  for (const check of checks) {
    if (!check || typeof check !== "object" || Array.isArray(check)) {
      findings.push("each check must be an object");
      continue;
    }

    const { id, label, command } = check;
    if (typeof id !== "string" || id.length === 0) {
      findings.push("check.id must be a non-empty string");
      continue;
    }
    if (checkIds.has(id)) {
      findings.push(`duplicate check.id: ${id}`);
    } else {
      checkIds.add(id);
    }

    if (typeof label !== "string" || label.length === 0) {
      findings.push(`check '${id}' must include non-empty label`);
    }
    if (typeof command !== "string" || command.length === 0) {
      findings.push(`check '${id}' must include non-empty command`);
    }
  }

  for (const phase of phases) {
    if (
      !phase ||
      typeof phase !== "object" ||
      Array.isArray(phase) ||
      typeof phase.id !== "string"
    ) {
      continue;
    }
    const { id, requiredChecks = [], allowedTransitions = [] } = phase;
    for (const checkId of requiredChecks) {
      if (!checkIds.has(checkId)) {
        findings.push(`phase '${id}' references unknown check '${checkId}'`);
      }
    }
    for (const transition of allowedTransitions) {
      if (!phaseIdToOrder.has(transition)) {
        findings.push(`phase '${id}' references unknown transition phase '${transition}'`);
        continue;
      }
      const sourceOrder = phaseIdToOrder.get(id);
      const destinationOrder = phaseIdToOrder.get(transition);
      if (typeof sourceOrder === "number" && typeof destinationOrder === "number") {
        if (destinationOrder <= sourceOrder) {
          findings.push(
            `phase '${id}' has non-forward transition to '${transition}' (order ${destinationOrder} <= ${sourceOrder})`
          );
        }
      }
    }
  }

  const gateIds = new Set();
  for (const gate of gates) {
    if (!gate || typeof gate !== "object" || Array.isArray(gate)) {
      findings.push("each gate must be an object");
      continue;
    }
    const { id, phaseId, requiredCheckIds, onFailure } = gate;
    if (typeof id !== "string" || id.length === 0) {
      findings.push("gate.id must be a non-empty string");
      continue;
    }
    if (gateIds.has(id)) {
      findings.push(`duplicate gate.id: ${id}`);
    } else {
      gateIds.add(id);
    }

    if (typeof phaseId !== "string" || !phaseIdToOrder.has(phaseId)) {
      findings.push(`gate '${id}' references unknown phaseId '${String(phaseId)}'`);
    }

    if (!Array.isArray(requiredCheckIds) || requiredCheckIds.length === 0) {
      findings.push(`gate '${id}' must define non-empty requiredCheckIds`);
    } else {
      for (const checkId of requiredCheckIds) {
        if (typeof checkId !== "string" || !checkIds.has(checkId)) {
          findings.push(`gate '${id}' references unknown check '${String(checkId)}'`);
        }
      }
    }

    if (onFailure !== "block" && onFailure !== "warn") {
      findings.push(`gate '${id}' onFailure must be 'block' or 'warn'`);
    }
  }

  return {
    ok: findings.length === 0,
    findings
  };
}

export function main() {
  const contractRaw = readFileSync(".workspace-kit/workflow-contract.json", "utf8");
  const contract = JSON.parse(contractRaw);
  const result = validateWorkflowContract(contract);

  if (!result.ok) {
    console.error("workspace-kit-workflow-contract: validation failed");
    for (const finding of result.findings) {
      console.error(`- ${finding}`);
    }
    process.exit(1);
  }

  console.log("workspace-kit-workflow-contract: validation passed");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
