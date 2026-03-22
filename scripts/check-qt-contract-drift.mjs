#!/usr/bin/env node

import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

export function extractQtCodes(content) {
  return [...new Set(content.match(/qt:[a-z0-9:-]+/g) ?? [])].sort();
}

export function findMissingQtCodeCoverage(codes, content, formatter = (code) => `\`${code}\``) {
  return codes.filter((code) => !content.includes(formatter(code)));
}

export function findMissingRenderCases(codes, renderingContent) {
  return codes.filter((code) => !renderingContent.includes(`case "${code}"`));
}

export function runQtContractDriftCheck({
  rootDir = process.cwd(),
  read = (filePath) => readFileSync(filePath, "utf8")
} = {}) {
  const typesPath = path.join(rootDir, "packages/core/src/types.ts");
  const commandContractPath = path.join(rootDir, "docs/qt-command-result-contract.md");
  const renderingMatrixPath = path.join(rootDir, "docs/qt-adapter-rendering-matrix.md");
  const renderingPath = path.join(rootDir, "packages/core/src/rendering.ts");
  const vscodeAdapterPath = path.join(rootDir, "packages/vscode-extension/src/qtAdapter.ts");
  const openClawAdapterPath = path.join(rootDir, "packages/openclaw-plugin/src/qtAdapter.ts");

  const runtimeCodes = extractQtCodes(read(typesPath));
  const commandContract = read(commandContractPath);
  const renderingMatrix = read(renderingMatrixPath);
  const renderingSource = read(renderingPath);
  const vscodeAdapter = read(vscodeAdapterPath);
  const openClawAdapter = read(openClawAdapterPath);

  const missingCommandContractCodes = findMissingQtCodeCoverage(runtimeCodes, commandContract);
  const missingRenderingMatrixCodes = findMissingQtCodeCoverage(runtimeCodes, renderingMatrix);
  const missingRenderingCases = findMissingRenderCases(runtimeCodes, renderingSource);

  const adapterIssues = [];
  if (!vscodeAdapter.includes("formatQtRuntimeResult")) {
    adapterIssues.push(
      "VS Code adapter is not using shared core renderer (formatQtRuntimeResult)."
    );
  }
  if (!openClawAdapter.includes("formatQtRuntimeResult")) {
    adapterIssues.push(
      "OpenClaw adapter is not using shared core renderer (formatQtRuntimeResult)."
    );
  }

  const issues = [];
  if (missingCommandContractCodes.length > 0) {
    issues.push(
      `Missing command-contract entries for codes: ${missingCommandContractCodes.join(", ")}`
    );
  }
  if (missingRenderingMatrixCodes.length > 0) {
    issues.push(
      `Missing rendering-matrix entries for codes: ${missingRenderingMatrixCodes.join(", ")}`
    );
  }
  if (missingRenderingCases.length > 0) {
    issues.push(`Missing core rendering handlers for codes: ${missingRenderingCases.join(", ")}`);
  }
  issues.push(...adapterIssues);

  return {
    runtimeCodes,
    issues
  };
}

function main() {
  const result = runQtContractDriftCheck();
  if (result.issues.length > 0) {
    for (const issue of result.issues) {
      console.error(`- ${issue}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log(
    `qt-contract-drift: ok (${result.runtimeCodes.length} runtime codes checked across docs/renderers)`
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
