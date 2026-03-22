import assert from "node:assert/strict";
import test from "node:test";

import { checkPackageCompliance } from "../check-package-compliance.mjs";

function compliantPackages() {
  return {
    "packages/core/package.json": {
      name: "@quicktask/core",
      version: "0.2.5",
      license: "MIT",
      repository: { url: "https://github.com/NJLaPrell/QuickTask.git" },
      files: ["src", "dist"]
    },
    "packages/vscode-extension/package.json": {
      name: "quicktask-vscode",
      version: "0.2.5",
      license: "MIT",
      repository: { url: "https://github.com/NJLaPrell/QuickTask.git" },
      publisher: "nicklaprell",
      engines: { vscode: "^1.100.0" }
    },
    "packages/openclaw-plugin/package.json": {
      name: "quicktask-openclaw",
      version: "0.2.5",
      license: "MIT",
      repository: { url: "https://github.com/NJLaPrell/QuickTask.git" },
      files: ["dist", "package.json", "CHANGELOG.md"]
    }
  };
}

test("passes for compliant distributable package metadata", () => {
  const findings = checkPackageCompliance(compliantPackages());
  assert.deepEqual(findings, []);
});

test("reports missing metadata and file-policy violations", () => {
  const packages = compliantPackages();
  delete packages["packages/core/package.json"].license;
  packages["packages/openclaw-plugin/package.json"].files = ["package.json"];
  packages["packages/vscode-extension/package.json"].publisher = "";
  const findings = checkPackageCompliance(packages);

  assert.ok(findings.length >= 3);
  assert.match(findings.join("\n"), /core\/package\.json: missing non-empty license/);
  assert.match(findings.join("\n"), /openclaw-plugin\/package\.json: files must include dist/);
  assert.match(findings.join("\n"), /vscode-extension\/package\.json: missing publisher metadata/);
});
