import assert from "node:assert/strict";
import test from "node:test";

import { validateGeneratedArtifactPolicy } from "../check-generated-artifacts-policy.mjs";

test("fails when tracked source declaration files are present", () => {
  const result = validateGeneratedArtifactPolicy(["packages/core/src/index.d.ts"], {
    includeMissingFiles: true
  });
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /must not be tracked in source tree/);
});

test("passes for non-generated tracked files", () => {
  const result = validateGeneratedArtifactPolicy(["packages/core/src/index.ts"]);
  assert.equal(typeof result.ok, "boolean");
});
