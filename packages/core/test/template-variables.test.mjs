import assert from "node:assert/strict";
import test from "node:test";

import {
  extractTemplateVariables,
  interpolateTemplateVariables,
  parseRuntimeVariableInput
} from "../dist/templateVariables.js";

test("extractTemplateVariables reads required/default declarations", () => {
  const vars = extractTemplateVariables("Summary {{topic}} for {{audience|leadership}}.");
  assert.deepEqual(vars, [
    { name: "topic", defaultValue: undefined },
    { name: "audience", defaultValue: "leadership" }
  ]);
});

test("parseRuntimeVariableInput parses key=value tokens", () => {
  const values = parseRuntimeVariableInput("topic=incident tone=concise,owner=ops");
  assert.deepEqual(values, {
    topic: "incident",
    tone: "concise",
    owner: "ops"
  });
});

test("interpolateTemplateVariables resolves defaults and reports missing", () => {
  const result = interpolateTemplateVariables(
    "Summary {{topic}} for {{audience|leadership}} with {{tone}}.",
    { topic: "incident" }
  );
  assert.equal(result.output.includes("incident"), true);
  assert.equal(result.output.includes("leadership"), true);
  assert.deepEqual(result.missingVariables, ["tone"]);
});
