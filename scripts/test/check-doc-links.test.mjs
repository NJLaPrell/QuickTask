import assert from "node:assert/strict";
import test from "node:test";

import { validateDocLinks } from "../check-doc-links.mjs";

test("passes for valid links across selected docs", () => {
  const result = validateDocLinks(["README.md", "CONTRIBUTORS.md"]);
  assert.equal(result.ok, true);
});

test("fails when scan target is missing", () => {
  const result = validateDocLinks(["docs/does-not-exist.md"]);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /Scan target is missing/);
});
