import assert from "node:assert/strict";
import test from "node:test";

import { validateWorkflowContract } from "../validate-workflow-contract.mjs";

const VALID_CONTRACT = {
  schemaVersion: 1,
  phases: [
    {
      id: "phase1",
      order: 1,
      title: "Phase one",
      requiredChecks: ["check-a"],
      allowedTransitions: ["phase2"]
    },
    {
      id: "phase2",
      order: 2,
      title: "Phase two",
      requiredChecks: ["check-b"],
      allowedTransitions: []
    }
  ],
  checks: [
    { id: "check-a", label: "Check A", command: "pnpm check:a" },
    { id: "check-b", label: "Check B", command: "pnpm check:b" }
  ],
  gates: [
    {
      id: "phase1-gate",
      phaseId: "phase1",
      requiredCheckIds: ["check-a"],
      onFailure: "block"
    }
  ]
};

test("validateWorkflowContract passes for valid contract", () => {
  const result = validateWorkflowContract(VALID_CONTRACT);
  assert.equal(result.ok, true);
  assert.equal(result.findings.length, 0);
});

test("validateWorkflowContract fails for unknown transition/check references", () => {
  const result = validateWorkflowContract({
    ...VALID_CONTRACT,
    phases: [
      {
        id: "phase1",
        order: 1,
        title: "Phase one",
        requiredChecks: ["missing-check"],
        allowedTransitions: ["missing-phase"]
      }
    ]
  });

  assert.equal(result.ok, false);
  assert.match(result.findings.join("\n"), /missing-check/);
  assert.match(result.findings.join("\n"), /missing-phase/);
});

test("validateWorkflowContract fails for non-forward transitions", () => {
  const result = validateWorkflowContract({
    ...VALID_CONTRACT,
    phases: [
      {
        id: "phase1",
        order: 1,
        title: "Phase one",
        requiredChecks: ["check-a"],
        allowedTransitions: ["phase2"]
      },
      {
        id: "phase2",
        order: 2,
        title: "Phase two",
        requiredChecks: ["check-b"],
        allowedTransitions: ["phase1"]
      }
    ]
  });

  assert.equal(result.ok, false);
  assert.match(result.findings.join("\n"), /non-forward transition/);
});
