import assert from "node:assert/strict";
import test from "node:test";

import { runWorkspaceKitPhase6ConsumerCheck } from "../workspace-kit-phase6-consumer-check.mjs";

test("phase6 consumer check script exports callable function", () => {
  assert.equal(typeof runWorkspaceKitPhase6ConsumerCheck, "function");
});
