import assert from "node:assert/strict";
import test from "node:test";

import * as core from "../dist/index.js";

test("exports stable runtime entrypoints for adapters", () => {
  assert.equal(typeof core.parseQtCommand, "function");
  assert.equal(typeof core.createQtRuntime, "function");
  assert.equal(typeof core.createFileTaskStore, "function");
  assert.equal(typeof core.describeQt, "function");
});

test("publishes explicit API surface version", () => {
  assert.equal(core.QUICKTASK_CORE_API_VERSION, "1.0.0");
});
