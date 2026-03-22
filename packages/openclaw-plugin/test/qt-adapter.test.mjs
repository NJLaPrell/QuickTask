import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createOpenClawQtRuntime,
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

test("unknown result rendering keeps diagnostics local and redacted", () => {
  const text = renderOpenClawQtResult({
    code: "qt:unknown",
    requestId: "qt-safe",
    userInput: "sensitive input",
    templateBody: "sensitive template"
  });

  assert.match(text, /unsupported result code/i);
  assert.doesNotMatch(text, /sensitive input/);
  assert.doesNotMatch(text, /sensitive template/);
});

test("normalization parity for common command forms", () => {
  const cases = [
    { input: "", expected: "/qt" },
    { input: "summarize create bullets", expected: "/qt summarize create bullets" },
    { input: "/qt list", expected: "/qt list" },
    { input: "/qt show summarize", expected: "/qt show summarize" },
    { input: "/qt improve accept summarize p_1", expected: "/qt improve accept summarize p_1" }
  ];

  for (const testCase of cases) {
    assert.equal(normalizeOpenClawQtInput(testCase.input), testCase.expected);
  }
});

test("renders list/show/doctor command outputs", () => {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-openclaw-adapter-"));
  try {
    const runtime = createOpenClawQtRuntime(tasksDir);
    const init = handleOpenClawQtInput("/qt init", runtime);
    assert.equal(init.result.code, "qt:init:initialized");
    assert.match(init.text, /Next commands/i);

    const listed = handleOpenClawQtInput("/qt list", runtime);
    assert.equal(listed.result.code, "qt:list:listed");
    assert.match(listed.text, /Found 4 task templates/);

    const shown = handleOpenClawQtInput("/qt show standup", runtime);
    assert.equal(shown.result.code, "qt:show:template");
    assert.match(shown.text, /Template for standup:/);

    const doctor = handleOpenClawQtInput("/qt doctor", runtime);
    assert.equal(doctor.result.code, "qt:doctor:status");
    assert.match(doctor.text, /QuickTask diagnostics/);
  } finally {
    rmSync(tasksDir, { recursive: true, force: true });
  }
});

test("covers improve action lifecycle through OpenClaw adapter boundary", () => {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-openclaw-improve-"));
  try {
    const runtime = createOpenClawQtRuntime(tasksDir);
    handleOpenClawQtInput("summarize baseline template", runtime);

    const proposal = handleOpenClawQtInput("/qt improve summarize add owners", runtime).result;
    assert.equal(proposal.code, "qt:improve:proposed");

    const accepted = handleOpenClawQtInput(
      `/qt improve accept summarize ${proposal.proposalId}`,
      runtime
    ).result;
    assert.equal(accepted.code, "qt:improve:accept:applied");

    const missing = handleOpenClawQtInput(
      "/qt improve abandon summarize does-not-exist",
      runtime
    ).result;
    assert.equal(missing.code, "qt:improve:proposal-not-found");
  } finally {
    rmSync(tasksDir, { recursive: true, force: true });
  }
});
