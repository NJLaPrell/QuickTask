import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createVsCodeQtRuntime,
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

test("renders list/show/doctor command outputs", () => {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-vscode-adapter-"));
  try {
    const runtime = createVsCodeQtRuntime({ tasksDir });
    const init = handleQtChatPrompt("/qt init", runtime);
    assert.equal(init.result.code, "qt:init:initialized");
    assert.match(init.markdown, /Next commands/i);

    const listed = handleQtChatPrompt("/qt list", runtime);
    assert.equal(listed.result.code, "qt:list:listed");
    assert.match(listed.markdown, /Found 4 task templates/);
    assert.match(listed.markdown, /`standup`/);

    const shown = handleQtChatPrompt("/qt show standup", runtime);
    assert.equal(shown.result.code, "qt:show:template");
    assert.match(shown.markdown, /Template for `standup`/);

    const doctor = handleQtChatPrompt("/qt doctor", runtime);
    assert.equal(doctor.result.code, "qt:doctor:status");
    assert.match(doctor.markdown, /QuickTask diagnostics/);
  } finally {
    rmSync(tasksDir, { recursive: true, force: true });
  }
});

test("covers improve action lifecycle through VS Code adapter boundary", () => {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-vscode-improve-"));
  try {
    const runtime = createVsCodeQtRuntime({ tasksDir });
    handleQtChatPrompt("/qt summarize baseline template", runtime);

    const proposal = handleQtChatPrompt("/qt improve summarize add owners", runtime).result;
    assert.equal(proposal.code, "qt:improve:proposed");

    const accepted = handleQtChatPrompt(
      `/qt improve accept summarize ${proposal.proposalId}`,
      runtime
    ).result;
    assert.equal(accepted.code, "qt:improve:accept:applied");

    const alreadyFinalized = handleQtChatPrompt(
      `/qt improve reject summarize ${proposal.proposalId}`,
      runtime
    ).result;
    assert.equal(alreadyFinalized.code, "qt:improve:already-finalized");

    const rejectProposal = handleQtChatPrompt(
      "/qt improve summarize reject branch",
      runtime
    ).result;
    assert.equal(rejectProposal.code, "qt:improve:proposed");
    const rejected = handleQtChatPrompt(
      `/qt improve reject summarize ${rejectProposal.proposalId}`,
      runtime
    ).result;
    assert.equal(rejected.code, "qt:improve:reject:recorded");

    const abandonProposal = handleQtChatPrompt(
      "/qt improve summarize abandon branch",
      runtime
    ).result;
    assert.equal(abandonProposal.code, "qt:improve:proposed");
    const abandoned = handleQtChatPrompt(
      `/qt improve abandon summarize ${abandonProposal.proposalId}`,
      runtime
    ).result;
    assert.equal(abandoned.code, "qt:improve:abandon:recorded");
  } finally {
    rmSync(tasksDir, { recursive: true, force: true });
  }
});
