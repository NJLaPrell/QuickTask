import assert from "node:assert/strict";
import test from "node:test";

import {
  handleOpenClawQtInput,
  normalizeOpenClawQtInput,
  renderOpenClawQtResult
} from "../dist/qtAdapter.js";

test("normalizes implicit command to /qt create form", () => {
  assert.equal(
    normalizeOpenClawQtInput("summarize concise bullets"),
    "/qt summarize concise bullets"
  );
});

test("preserves explicit /qt command", () => {
  assert.equal(
    normalizeOpenClawQtInput("/qt improve summarize add actions"),
    "/qt improve summarize add actions"
  );
});

test("renders proposal output with proposal id", () => {
  const rendered = renderOpenClawQtResult({
    kind: "improve_proposed",
    code: "qt:improve:proposed",
    taskName: "summarize",
    proposalId: "p_555",
    source: "explicit",
    oldTemplate: "old",
    proposedTemplate: "new"
  });

  assert.match(rendered, /Proposal ID: p_555/);
});

test("routes slash command through runtime boundary", () => {
  const runtime = {
    handle(input) {
      assert.equal(input, "/qt improve summarize add owners");
      return {
        kind: "improve_action",
        code: "qt:improve:accept:applied",
        taskName: "summarize",
        action: "accept",
        proposalId: "p_9",
        status: "accepted",
        message: "Proposal p_9 accepted and applied to summarize."
      };
    }
  };

  const response = handleOpenClawQtInput("improve summarize add owners", runtime);
  assert.equal(response.result.code, "qt:improve:accept:applied");
  assert.match(response.text, /accepted and applied/);
});
