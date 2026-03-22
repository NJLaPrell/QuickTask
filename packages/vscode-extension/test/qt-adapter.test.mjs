import assert from "node:assert/strict";
import test from "node:test";

import {
  handleQtChatPrompt,
  renderQtRuntimeResult,
  toQtCommandTextFromChatPrompt
} from "../dist/qtAdapter.js";

test("normalizes plain prompt into /qt create command", () => {
  assert.equal(
    toQtCommandTextFromChatPrompt("summarize create bullets"),
    "/qt summarize create bullets"
  );
});

test("keeps explicit /qt command unchanged", () => {
  assert.equal(toQtCommandTextFromChatPrompt("/qt/summarize notes"), "/qt/summarize notes");
});

test("returns proposal id in improve rendering", () => {
  const markdown = renderQtRuntimeResult({
    kind: "improve_proposed",
    code: "qt:improve:proposed",
    taskName: "summarize",
    proposalId: "p_123",
    source: "explicit",
    oldTemplate: "old",
    proposedTemplate: "new"
  });

  assert.match(markdown, /Proposal ID: `p_123`/);
});

test("delegates prompt handling to runtime boundary", () => {
  const runtime = {
    handle(input) {
      assert.equal(input, "/qt summarize write concise bullets");
      return {
        kind: "created",
        code: "qt:create:created",
        taskName: "summarize",
        filename: "summarize.md",
        templateBody: "- Goal: write concise bullets"
      };
    }
  };

  const response = handleQtChatPrompt("summarize write concise bullets", runtime);
  assert.equal(response.result.code, "qt:create:created");
  assert.match(response.markdown, /Created template `summarize`/);
});

test("unknown result rendering does not leak user content", () => {
  const markdown = renderQtRuntimeResult({
    code: "qt:unknown",
    requestId: "qt-safe",
    userInput: "secret user text",
    templateBody: "secret template text"
  });

  assert.match(markdown, /unsupported result code/i);
  assert.doesNotMatch(markdown, /secret user text/);
  assert.doesNotMatch(markdown, /secret template text/);
});
