import assert from "node:assert/strict";
import test from "node:test";

import { renderWorkflowContractSnippets } from "../generate-workflow-contract-snippets.mjs";

const CONTRACT = {
  schemaVersion: 1,
  phases: [
    {
      id: "phase2",
      order: 2,
      title: "Phase two",
      requiredChecks: ["check-b"],
      allowedTransitions: []
    },
    {
      id: "phase1",
      order: 1,
      title: "Phase one",
      requiredChecks: ["check-a"],
      allowedTransitions: ["phase2"]
    }
  ],
  checks: [
    { id: "check-b", label: "Check B", command: "pnpm check:b" },
    { id: "check-a", label: "Check A", command: "pnpm check:a" }
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

const PROFILE = {
  project: {
    name: "quicktask-test"
  }
};

test("renderWorkflowContractSnippets is deterministic for the same inputs", () => {
  const first = renderWorkflowContractSnippets(CONTRACT, PROFILE);
  const second = renderWorkflowContractSnippets(CONTRACT, PROFILE);

  assert.equal(first.summaryJson, second.summaryJson);
  assert.equal(first.ruleText, second.ruleText);
});

test("renderWorkflowContractSnippets output changes when contract data changes", () => {
  const baseline = renderWorkflowContractSnippets(CONTRACT, PROFILE);
  const changed = renderWorkflowContractSnippets(
    {
      ...CONTRACT,
      phases: CONTRACT.phases.map((phase) =>
        phase.id === "phase2"
          ? {
              ...phase,
              requiredChecks: ["check-b", "check-c"]
            }
          : phase
      ),
      checks: [...CONTRACT.checks, { id: "check-c", label: "Check C", command: "pnpm check:c" }]
    },
    PROFILE
  );

  assert.notEqual(baseline.summaryJson, changed.summaryJson);
  assert.notEqual(baseline.ruleText, changed.ruleText);
  assert.match(changed.ruleText, /check-c/);
});
