#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

function fail(message) {
  console.error(`support-matrix-check: ${message}`);
  process.exit(1);
}

function readReadmeMinimum(label, readme) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`\\|\\s*${escaped}\\s*\\|\\s*([^|]+)\\|`);
  const match = readme.match(pattern);
  return match ? match[1].trim() : undefined;
}

function parseMajorFloor(value) {
  const match = value.match(/(\d+)(?:\.x)?/i);
  return match ? Number.parseInt(match[1], 10) : undefined;
}

export function checkSupportMatrixConsistency(inputs) {
  const findings = [];
  const {
    readme,
    rootPackageJson,
    vscodePackageJson,
    workflowContentsByPath,
    setupWorkspaceAction
  } = inputs;

  const nodeMinimum = readReadmeMinimum("Node.js runtime", readme);
  const pnpmMinimum = readReadmeMinimum("pnpm", readme);
  const vscodeMinimum = readReadmeMinimum("VS Code adapter (`quicktask-vscode`)", readme);

  if (!nodeMinimum) {
    findings.push("README support matrix is missing the Node.js runtime row.");
  }
  if (!pnpmMinimum) {
    findings.push("README support matrix is missing the pnpm row.");
  }
  if (!vscodeMinimum) {
    findings.push("README support matrix is missing the VS Code adapter row.");
  }

  const packageManager = String(rootPackageJson.packageManager ?? "");
  const packageManagerMatch = packageManager.match(/^pnpm@(.+)$/);
  if (!packageManagerMatch) {
    findings.push("package.json#packageManager must be set to pnpm@<version>.");
  }

  const expectedPnpmMajor = packageManagerMatch
    ? parseMajorFloor(packageManagerMatch[1])
    : undefined;
  const readmePnpmMajor = pnpmMinimum ? parseMajorFloor(pnpmMinimum) : undefined;
  if (expectedPnpmMajor && readmePnpmMajor && expectedPnpmMajor !== readmePnpmMajor) {
    findings.push(
      `README pnpm minimum (${pnpmMinimum}) does not match packageManager floor (${packageManagerMatch[1]}).`
    );
  }

  const nodeVersions = [];
  for (const [path, content] of Object.entries(workflowContentsByPath)) {
    const matches = [...content.matchAll(/node-version:\s*"?([0-9]+(?:\.[0-9]+)?)"?/g)];
    for (const [, version] of matches) {
      nodeVersions.push({ path, version });
    }
  }
  const actionNodeMatch = setupWorkspaceAction.match(/default:\s*"(\d+)"/);
  if (actionNodeMatch) {
    nodeVersions.push({
      path: ".github/actions/setup-quicktask-workspace/action.yml",
      version: actionNodeMatch[1]
    });
  }

  const readmeNodeMajor = nodeMinimum ? parseMajorFloor(nodeMinimum) : undefined;
  for (const nodeVersion of nodeVersions) {
    const nodeMajor = parseMajorFloor(nodeVersion.version);
    if (readmeNodeMajor && nodeMajor && nodeMajor !== readmeNodeMajor) {
      findings.push(
        `README Node minimum (${nodeMinimum}) mismatches ${nodeVersion.path} node-version (${nodeVersion.version}).`
      );
    }
  }

  const pnpmVersions = [];
  for (const [path, content] of Object.entries(workflowContentsByPath)) {
    const matches = [
      ...content.matchAll(/pnpm\/action-setup@[^\n]*[\s\S]*?version:\s*"?([0-9]+(?:\.[0-9]+)?)"?/g)
    ];
    for (const match of matches) {
      const version = match[1];
      pnpmVersions.push({ path, version });
    }
  }
  const actionPnpmMatch = setupWorkspaceAction.match(/pnpm_version:[\s\S]*?default:\s*"([^"]+)"/);
  if (actionPnpmMatch) {
    pnpmVersions.push({
      path: ".github/actions/setup-quicktask-workspace/action.yml",
      version: actionPnpmMatch[1]
    });
  }

  for (const pnpmVersion of pnpmVersions) {
    const pnpmMajor = parseMajorFloor(pnpmVersion.version);
    if (expectedPnpmMajor && pnpmMajor && expectedPnpmMajor !== pnpmMajor) {
      findings.push(
        `${pnpmVersion.path} uses pnpm ${pnpmVersion.version} but packageManager requires ${packageManagerMatch[1]}.`
      );
    }
  }

  const vscodeEngine = vscodePackageJson.engines?.vscode;
  if (typeof vscodeEngine !== "string") {
    findings.push("packages/vscode-extension/package.json is missing engines.vscode.");
  } else if (vscodeMinimum && !vscodeMinimum.includes(vscodeEngine)) {
    findings.push(
      `README VS Code minimum (${vscodeMinimum}) does not include package engines.vscode (${vscodeEngine}).`
    );
  }

  return findings;
}

export function main() {
  const readme = readFileSync("README.md", "utf8");
  const rootPackageJson = JSON.parse(readFileSync("package.json", "utf8"));
  const vscodePackageJson = JSON.parse(
    readFileSync("packages/vscode-extension/package.json", "utf8")
  );
  const setupWorkspaceAction = readFileSync(
    ".github/actions/setup-quicktask-workspace/action.yml",
    "utf8"
  );
  const workflowContentsByPath = {};
  for (const workflowFile of readdirSync(".github/workflows").filter((entry) =>
    entry.endsWith(".yml")
  )) {
    const fullPath = join(".github/workflows", workflowFile);
    workflowContentsByPath[fullPath] = readFileSync(fullPath, "utf8");
  }

  const findings = checkSupportMatrixConsistency({
    readme,
    rootPackageJson,
    vscodePackageJson,
    workflowContentsByPath,
    setupWorkspaceAction
  });
  if (findings.length > 0) {
    fail(`found support-floor drift:\n- ${findings.join("\n- ")}`);
  }
  console.log("support-matrix-check: README support floors match package/workflow policy");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
