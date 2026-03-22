import assert from "node:assert/strict";
import test from "node:test";

import { checkSupportMatrixConsistency } from "../check-support-matrix-consistency.mjs";

const README_FIXTURE = `
## Support Matrix

| Surface                                 | Minimum supported                                    | Validation coverage |
| --------------------------------------- | ---------------------------------------------------- | ------------------- |
| Node.js runtime                         | 22.x LTS                                             | CI                  |
| pnpm                                    | 10.x                                                 | CI                  |
| VS Code adapter (\`quicktask-vscode\`)    | VS Code \`^1.100.0\`                                   | Adapter tests       |
`;

test("passes when support matrix matches package/workflow floors", () => {
  const findings = checkSupportMatrixConsistency({
    readme: README_FIXTURE,
    rootPackageJson: { packageManager: "pnpm@10.0.0" },
    vscodePackageJson: { engines: { vscode: "^1.100.0" } },
    setupWorkspaceAction: `inputs:\n  pnpm_version:\n    default: "10.0.0"\n  node_version:\n    default: "22"\n`,
    workflowContentsByPath: {
      ".github/workflows/ci.yml": `
jobs:
  check:
    steps:
      - uses: pnpm/action-setup@v4
        with:
          version: 10.0.0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
`
    }
  });

  assert.deepEqual(findings, []);
});

test("reports mismatched floors", () => {
  const findings = checkSupportMatrixConsistency({
    readme: README_FIXTURE.replace("10.x", "9.x"),
    rootPackageJson: { packageManager: "pnpm@10.0.0" },
    vscodePackageJson: { engines: { vscode: "^1.100.0" } },
    setupWorkspaceAction: `inputs:\n  pnpm_version:\n    default: "10.0.0"\n  node_version:\n    default: "20"\n`,
    workflowContentsByPath: {
      ".github/workflows/ci.yml": `
jobs:
  check:
    steps:
      - uses: pnpm/action-setup@v4
        with:
          version: 9.0.0
      - uses: actions/setup-node@v4
        with:
          node-version: 20
`
    }
  });

  assert.ok(findings.length >= 2);
  assert.match(findings.join("\n"), /README pnpm minimum/);
  assert.match(findings.join("\n"), /README Node minimum/);
});
