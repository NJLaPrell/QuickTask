#!/usr/bin/env node

import { readFileSync } from "node:fs";

const REQUIRED_RELEASE_INPUTS = ["readme_status", "docs_status", "docs_sync_notes", "rc_run_id"];
const REQUIRED_DOCS_GATE_ENVS = [
  "RELEASE_README_STATUS: ${{ inputs.readme_status }}",
  "RELEASE_DOCS_STATUS: ${{ inputs.docs_status }}",
  "RELEASE_DOCS_SYNC_NOTES: ${{ inputs.docs_sync_notes }}"
];
const REQUIRED_HANDOFF_FLAGS = [
  "--readme-status",
  "--docs-status",
  "--docs-sync-notes",
  "--rc-run-id"
];
const REQUIRED_DISPATCH_FIELDS = [
  "readme_status=",
  "docs_status=",
  "docs_sync_notes=",
  "rc_run_id="
];
const REQUIRED_DOCS_CHECK_ENVS = [
  "RELEASE_README_STATUS",
  "RELEASE_DOCS_STATUS",
  "RELEASE_DOCS_SYNC_NOTES"
];
const REQUIRED_RELEASE_GATES = [
  "run: pnpm release:verify-local-artifacts",
  "run: pnpm release:test-artifact-journeys",
  "run: pnpm release:validate-host-installs"
];
const REQUIRED_RC_GATES = [
  "run: pnpm release:verify-local-artifacts",
  "run: pnpm release:test-artifact-journeys",
  "run: pnpm release:validate-host-installs"
];
const REQUIRED_POST_RELEASE_GATES = [
  "os: [ubuntu-latest, macos-latest, windows-latest]",
  "node scripts/run-artifact-user-journeys.mjs",
  "node scripts/host-install-validate.mjs"
];

export function checkWorkflowContracts(sources) {
  const findings = [];
  const {
    releaseWorkflow,
    rcWorkflow,
    postReleaseWorkflow,
    releaseHandoffScript,
    releaseDocsCheckScript
  } = sources;

  for (const inputName of REQUIRED_RELEASE_INPUTS) {
    if (!releaseWorkflow.includes(`      ${inputName}:`)) {
      findings.push(`release.yml is missing workflow_dispatch input '${inputName}'.`);
    }
  }

  for (const envLine of REQUIRED_DOCS_GATE_ENVS) {
    if (!releaseWorkflow.includes(envLine)) {
      findings.push(`release.yml docs gate env is missing expected mapping: ${envLine}`);
    }
  }

  if (!releaseWorkflow.includes("run: pnpm release:docs-check")) {
    findings.push("release.yml is missing `pnpm release:docs-check` gate step.");
  }

  for (const flag of REQUIRED_HANDOFF_FLAGS) {
    if (!releaseHandoffScript.includes(flag)) {
      findings.push(`release-handoff.mjs is missing expected CLI flag ${flag}.`);
    }
  }

  for (const field of REQUIRED_DISPATCH_FIELDS) {
    if (!releaseHandoffScript.includes(field)) {
      findings.push(
        `release-handoff.mjs is missing expected dispatch field mapping containing '${field}'.`
      );
    }
  }

  for (const envName of REQUIRED_DOCS_CHECK_ENVS) {
    if (!releaseDocsCheckScript.includes(envName)) {
      findings.push(`release-docs-check.mjs is missing expected env reference ${envName}.`);
    }
  }

  for (const gate of REQUIRED_RELEASE_GATES) {
    if (!releaseWorkflow.includes(gate)) {
      findings.push(`release.yml is missing required release gate step: ${gate}`);
    }
  }

  for (const gate of REQUIRED_RC_GATES) {
    if (!rcWorkflow.includes(gate)) {
      findings.push(`release-candidate.yml is missing required gate step: ${gate}`);
    }
  }

  for (const gate of REQUIRED_POST_RELEASE_GATES) {
    if (!postReleaseWorkflow.includes(gate)) {
      findings.push(`post-release-verify.yml is missing required verification contract: ${gate}`);
    }
  }

  return {
    ok: findings.length === 0,
    findings
  };
}

export function main() {
  const releaseWorkflow = readFileSync(".github/workflows/release.yml", "utf8");
  const rcWorkflow = readFileSync(".github/workflows/release-candidate.yml", "utf8");
  const postReleaseWorkflow = readFileSync(".github/workflows/post-release-verify.yml", "utf8");
  const releaseHandoffScript = readFileSync("scripts/release-handoff.mjs", "utf8");
  const releaseDocsCheckScript = readFileSync("scripts/release-docs-check.mjs", "utf8");
  const result = checkWorkflowContracts({
    releaseWorkflow,
    rcWorkflow,
    postReleaseWorkflow,
    releaseHandoffScript,
    releaseDocsCheckScript
  });

  if (!result.ok) {
    console.error("release-check-workflow-contracts: contract drift detected");
    for (const finding of result.findings) {
      console.error(`- ${finding}`);
    }
    process.exit(1);
  }

  console.log("release-check-workflow-contracts: contracts are aligned");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
