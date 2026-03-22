import assert from "node:assert/strict";
import test from "node:test";

import { validateCommandEntrypoints } from "../check-command-entrypoints.mjs";

test("fails when command entrypoint has no references", () => {
  const refs = new Map([["README.md", "no refs here"]]);
  const result = validateCommandEntrypoints([".cursor/commands/qt.md"], refs);
  assert.equal(result.ok, false);
});

test("passes when command entrypoint is referenced", () => {
  const refs = new Map([["README.md", "See .cursor/commands/qt.md for usage."]]);
  const result = validateCommandEntrypoints([".cursor/commands/qt.md"], refs);
  assert.equal(result.ok, true);
});
