import assert from "node:assert/strict";
import test from "node:test";

import { evaluateReleaseDocsGate } from "../release-docs-check.mjs";

function makeOptions(overrides = {}) {
  return {
    readmeStatus: "updated",
    docsStatus: "updated",
    docsSyncNotes: "",
    readmeExists: true,
    releaseStrategyExists: true,
    readmeContent: "See RELEASE_STRATEGY.md for release policy.",
    ...overrides
  };
}

test("passes when statuses are valid and docs references exist", () => {
  const result = evaluateReleaseDocsGate(makeOptions());
  assert.equal(result.ok, true);
  assert.deepEqual(result.errors, []);
});

test("requires docs sync notes when any status is no-change", () => {
  const result = evaluateReleaseDocsGate(
    makeOptions({
      docsStatus: "no-change",
      docsSyncNotes: "   "
    })
  );
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /docs_sync_notes is required/);
});

test("fails when README is missing release strategy reference", () => {
  const result = evaluateReleaseDocsGate(
    makeOptions({
      readmeContent: "Release flow is described elsewhere."
    })
  );
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /README\.md must reference RELEASE_STRATEGY\.md/);
});
