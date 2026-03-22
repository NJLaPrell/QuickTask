import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { validateTaskTemplates } from "../check-task-templates.mjs";

test("passes when tasks directory is missing", () => {
  const result = validateTaskTemplates("tasks-does-not-exist");
  assert.equal(result.ok, true);
});

test("fails for malformed template file", () => {
  const dir = mkdtempSync(path.join(os.tmpdir(), "qt-template-lint-"));
  try {
    writeFileSync(path.join(dir, "bad.md"), "# bad\n", "utf8");
    const result = validateTaskTemplates(dir);
    assert.equal(result.ok, false);
    assert.match(result.errors.join("\n"), /missing "- Goal:" directive/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
