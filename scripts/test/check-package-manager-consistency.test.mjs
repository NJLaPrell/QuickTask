import assert from "node:assert/strict";
import test from "node:test";

import {
  checkWorkflowPnpmConsistency,
  parseExpectedPnpmVersion
} from "../check-package-manager-consistency.mjs";

test("parseExpectedPnpmVersion returns pnpm version when configured", () => {
  const parsed = parseExpectedPnpmVersion(JSON.stringify({ packageManager: "pnpm@10.0.0" }));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.version, "10.0.0");
});

test("parseExpectedPnpmVersion fails for missing packageManager policy", () => {
  const parsed = parseExpectedPnpmVersion(JSON.stringify({}));
  assert.equal(parsed.ok, false);
  assert.match(parsed.error, /pnpm@<version>/);
});

test("checkWorkflowPnpmConsistency passes when versions align", () => {
  const findings = checkWorkflowPnpmConsistency(
    {
      ".github/workflows/ci.yml": `
name: CI
jobs:
  checks:
    steps:
      - uses: pnpm/action-setup@v4
        with:
          version: 10.0.0
`
    },
    "10.0.0"
  );

  assert.deepEqual(findings, []);
});

test("checkWorkflowPnpmConsistency reports mismatch and ignores non-pnpm workflows", () => {
  const findings = checkWorkflowPnpmConsistency(
    {
      ".github/workflows/ci.yml": `
jobs:
  checks:
    steps:
      - uses: pnpm/action-setup@v4
        with:
          version: 9.0.0
`,
      ".github/workflows/no-pnpm.yml": `
jobs:
  checks:
    steps:
      - run: echo "noop"
`
    },
    "10.0.0"
  );

  assert.equal(findings.length, 1);
  assert.match(findings[0], /does not set version: 10.0.0/);
});
