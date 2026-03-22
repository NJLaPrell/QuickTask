import assert from "node:assert/strict";
import test from "node:test";

import {
  extractQtCodes,
  findMissingQtCodeCoverage,
  findMissingRenderCases,
  runQtContractDriftCheck
} from "../check-qt-contract-drift.mjs";

test("extractQtCodes returns sorted unique codes", () => {
  const codes = extractQtCodes("qt:a qt:b qt:a");
  assert.deepEqual(codes, ["qt:a", "qt:b"]);
});

test("findMissingQtCodeCoverage identifies missing doc entries", () => {
  const missing = findMissingQtCodeCoverage(["qt:a", "qt:b"], "`qt:a`");
  assert.deepEqual(missing, ["qt:b"]);
});

test("findMissingRenderCases identifies missing switch cases", () => {
  const missing = findMissingRenderCases(["qt:a", "qt:b"], 'case "qt:a":');
  assert.deepEqual(missing, ["qt:b"]);
});

test("runQtContractDriftCheck reports drift when docs and adapters diverge", () => {
  const files = new Map([
    ["packages/core/src/types.ts", 'code: "qt:a" | "qt:b";'],
    ["docs/qt-command-result-contract.md", "`qt:a`"],
    ["docs/qt-adapter-rendering-matrix.md", "`qt:a`"],
    ["packages/core/src/rendering.ts", 'case "qt:a":\n  return "ok";'],
    ["packages/vscode-extension/src/qtAdapter.ts", "export const noop = true;"],
    ["packages/openclaw-plugin/src/qtAdapter.ts", "export const noop = true;"]
  ]);

  const result = runQtContractDriftCheck({
    rootDir: "/repo",
    read(filePath) {
      const normalized = filePath.replace("/repo/", "");
      if (!files.has(normalized)) {
        throw new Error(`missing fixture ${normalized}`);
      }
      return files.get(normalized);
    }
  });

  assert.ok(result.issues.some((issue) => issue.includes("Missing command-contract entries")));
  assert.ok(result.issues.some((issue) => issue.includes("Missing rendering-matrix entries")));
  assert.ok(result.issues.some((issue) => issue.includes("Missing core rendering handlers")));
  assert.ok(result.issues.some((issue) => issue.includes("VS Code adapter")));
  assert.ok(result.issues.some((issue) => issue.includes("OpenClaw adapter")));
});
