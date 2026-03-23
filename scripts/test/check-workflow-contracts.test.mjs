import assert from "node:assert/strict";
import test from "node:test";

import { checkWorkflowContracts } from "../check-workflow-contracts.mjs";
import { buildWorkspaceKitImprovementSummary } from "../generate-workspace-kit-improvement-summary.mjs";
import { renderWorkflowContractSnippets } from "../generate-workflow-contract-snippets.mjs";

const VALID_RELEASE_WORKFLOW = `
on:
  workflow_dispatch:
    inputs:
      readme_status:
        required: true
      docs_status:
        required: true
      docs_sync_notes:
        required: false
      rc_run_id:
        required: true
jobs:
  release:
    steps:
      - name: Validate docs/command contracts
        run: |
          pnpm workspace-kit:phase6:consumer-check
          pnpm docs:check-links
          pnpm check:command-entrypoints
      - name: Validate generated artifact policy
        run: pnpm check:generated-artifacts
      - name: Validate release note quality
        run: pnpm release:check-notes-quality
      - name: Verify built release assets
        run: pnpm release:verify-local-artifacts
      - name: Run clean-room artifact user journeys
        run: pnpm release:test-artifact-journeys
      - name: Validate host install harness
        run: pnpm release:validate-host-installs
      - name: Docs synchronization gate
        env:
          RELEASE_README_STATUS: \${{ inputs.readme_status }}
          RELEASE_DOCS_STATUS: \${{ inputs.docs_status }}
          RELEASE_DOCS_SYNC_NOTES: \${{ inputs.docs_sync_notes }}
        run: pnpm release:docs-check
`;
const VALID_RC_WORKFLOW = `
jobs:
  validate-rc:
    steps:
      - name: Validate docs/command contracts
        run: |
          pnpm workspace-kit:phase6:consumer-check
          pnpm docs:check-links
          pnpm check:command-entrypoints
      - name: Validate generated artifact policy
        run: pnpm check:generated-artifacts
      - name: Validate release note quality
        run: pnpm release:check-notes-quality
      - name: Verify candidate artifacts
        run: pnpm release:verify-local-artifacts
      - name: Run clean-room artifact user journeys
        run: pnpm release:test-artifact-journeys
      - name: Validate host install harness
        run: pnpm release:validate-host-installs
`;
const VALID_POST_RELEASE_WORKFLOW = `
jobs:
  verify-release-assets:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest, windows-latest]
    steps:
      - run: node scripts/run-artifact-user-journeys.mjs --assets-dir artifacts
      - run: node scripts/host-install-validate.mjs --assets-dir artifacts
`;

const VALID_HANDOFF = `
const readmeStatus = argValue(argv, "--readme-status");
const docsStatus = argValue(argv, "--docs-status");
const docsSyncNotes = argValue(argv, "--docs-sync-notes");
const rcRunId = argValue(argv, "--rc-run-id");
const args = [
  "workflow",
  "run",
  "Release",
  "-f",
  \`readme_status=\${readmeStatus}\`,
  "-f",
  \`docs_status=\${docsStatus}\`,
  "-f",
  \`docs_sync_notes=\${docsSyncNotes}\`,
  "-f",
  \`rc_run_id=\${rcRunId}\`
];
`;

const VALID_DOCS_CHECK = `
const readmeStatus = process.env.RELEASE_README_STATUS;
const docsStatus = process.env.RELEASE_DOCS_STATUS;
const docsSyncNotes = process.env.RELEASE_DOCS_SYNC_NOTES;
`;
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
const VALID_PROFILE = {
  project: {
    name: "quicktask-test"
  }
};
const VALID_RENDERED = renderWorkflowContractSnippets(VALID_CONTRACT, VALID_PROFILE);
const VALID_IMPROVEMENT_LOG = {
  schemaVersion: 1,
  policy: {
    reviewCadence: "per-kit-minor-release",
    severityLevels: ["low", "medium", "high"],
    categoryTaxonomy: ["process", "release"],
    requiredFieldsBySeverity: {
      low: ["id", "title"],
      medium: ["id", "title", "followUpTaskId"],
      high: ["id", "title", "followUpTaskId", "disposition"]
    },
    archivePolicy: {
      archiveClosedAfterDays: 30,
      retentionDays: 365
    }
  },
  records: [
    {
      id: "F001",
      title: "Sample friction",
      status: "in_progress",
      severity: "medium",
      category: "process",
      source: {
        kind: "manual",
        reference: "sample"
      },
      detectedAt: "2026-03-23",
      lastUpdated: "2026-03-23",
      promptIntent: "Improve delivery loop",
      frictionObserved: "Manual process drift",
      proposedChange: "Add checks",
      affectedAreas: ["release"],
      followUpTaskId: "T168",
      releaseImpact: "requires_change",
      disposition: {
        kind: "planned_fix",
        notes: "In progress"
      }
    }
  ]
};
const VALID_IMPROVEMENT_SUMMARY = `${JSON.stringify(
  buildWorkspaceKitImprovementSummary(VALID_IMPROVEMENT_LOG),
  null,
  2
)}\n`;

function withWorkflowSources(overrides = {}) {
  return {
    releaseWorkflow: VALID_RELEASE_WORKFLOW,
    rcWorkflow: VALID_RC_WORKFLOW,
    postReleaseWorkflow: VALID_POST_RELEASE_WORKFLOW,
    releaseHandoffScript: VALID_HANDOFF,
    releaseDocsCheckScript: VALID_DOCS_CHECK,
    workflowContract: VALID_CONTRACT,
    workflowProfile: VALID_PROFILE,
    generatedWorkflowSummary: VALID_RENDERED.summaryJson,
    generatedWorkflowRule: VALID_RENDERED.ruleText,
    workspaceKitImprovementLog: VALID_IMPROVEMENT_LOG,
    generatedImprovementSummary: VALID_IMPROVEMENT_SUMMARY,
    ...overrides
  };
}

test("passes when workflow and scripts are aligned", () => {
  const result = checkWorkflowContracts(withWorkflowSources());

  assert.equal(result.ok, true);
  assert.equal(result.findings.length, 0);
});

test("fails when expected release input contract drifts", () => {
  const result = checkWorkflowContracts(
    withWorkflowSources({
      releaseWorkflow: VALID_RELEASE_WORKFLOW.replace("docs_sync_notes", "docs_notes")
    })
  );

  assert.equal(result.ok, false);
  assert.match(result.findings.join("\n"), /docs_sync_notes/);
});

test("fails when generated workflow-contract artifacts drift", () => {
  const result = checkWorkflowContracts(
    withWorkflowSources({
      generatedWorkflowSummary: `${VALID_RENDERED.summaryJson}\n# drift`,
      generatedWorkflowRule: `${VALID_RENDERED.ruleText}\n# drift`
    })
  );

  assert.equal(result.ok, false);
  assert.match(result.findings.join("\n"), /summary drift detected/);
  assert.match(result.findings.join("\n"), /rule drift detected/);
});

test("fails when workflow-contract data is malformed", () => {
  const result = checkWorkflowContracts(
    withWorkflowSources({
      workflowContract: {
        schemaVersion: 0,
        phases: [],
        checks: [],
        gates: []
      }
    })
  );

  assert.equal(result.ok, false);
  assert.match(result.findings.join("\n"), /workflow-contract validation/);
});

test("fails when workspace-kit improvement summary drifts", () => {
  const result = checkWorkflowContracts(
    withWorkflowSources({
      generatedImprovementSummary: `${VALID_IMPROVEMENT_SUMMARY}\n# drift`
    })
  );

  assert.equal(result.ok, false);
  assert.match(result.findings.join("\n"), /improvement summary drift detected/);
});

test("fails when workspace-kit improvement log is malformed", () => {
  const result = checkWorkflowContracts(
    withWorkflowSources({
      workspaceKitImprovementLog: {
        schemaVersion: 1,
        policy: {
          reviewCadence: "",
          severityLevels: [],
          categoryTaxonomy: [],
          requiredFieldsBySeverity: {},
          archivePolicy: {
            archiveClosedAfterDays: 0,
            retentionDays: 0
          }
        },
        records: []
      }
    })
  );

  assert.equal(result.ok, false);
  assert.match(result.findings.join("\n"), /improvement-log validation/);
});
