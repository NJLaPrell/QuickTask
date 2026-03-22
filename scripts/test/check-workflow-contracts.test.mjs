import assert from "node:assert/strict";
import test from "node:test";

import { checkWorkflowContracts } from "../check-workflow-contracts.mjs";

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

test("passes when workflow and scripts are aligned", () => {
  const result = checkWorkflowContracts({
    releaseWorkflow: VALID_RELEASE_WORKFLOW,
    rcWorkflow: VALID_RC_WORKFLOW,
    postReleaseWorkflow: VALID_POST_RELEASE_WORKFLOW,
    releaseHandoffScript: VALID_HANDOFF,
    releaseDocsCheckScript: VALID_DOCS_CHECK
  });

  assert.equal(result.ok, true);
  assert.equal(result.findings.length, 0);
});

test("fails when expected release input contract drifts", () => {
  const result = checkWorkflowContracts({
    releaseWorkflow: VALID_RELEASE_WORKFLOW.replace("docs_sync_notes", "docs_notes"),
    rcWorkflow: VALID_RC_WORKFLOW,
    postReleaseWorkflow: VALID_POST_RELEASE_WORKFLOW,
    releaseHandoffScript: VALID_HANDOFF,
    releaseDocsCheckScript: VALID_DOCS_CHECK
  });

  assert.equal(result.ok, false);
  assert.match(result.findings.join("\n"), /docs_sync_notes/);
});
