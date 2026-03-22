#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createFileTaskStore, createQtRuntime } from "../packages/core/dist/index.js";
import { handleOpenClawQtInput } from "../packages/openclaw-plugin/dist/qtAdapter.js";
import { handleQtChatPrompt } from "../packages/vscode-extension/dist/qtAdapter.js";

function runVsCodeSmoke(tasksDir) {
  const runtime = createQtRuntime(createFileTaskStore({ tasksDir }));
  const createResult = handleQtChatPrompt("summarize write concise bullets", runtime).result;
  assert.equal(createResult.code, "qt:create:created");

  const runResult = handleQtChatPrompt("/qt/summarize Notes from planning", runtime).result;
  assert.equal(runResult.code, "qt:run:executed");

  const improveResult = handleQtChatPrompt(
    "/qt improve summarize add action items",
    runtime
  ).result;
  assert.equal(improveResult.code, "qt:improve:proposed");

  const acceptResult = handleQtChatPrompt(
    `/qt improve accept summarize ${improveResult.proposalId}`,
    runtime
  ).result;
  assert.equal(acceptResult.code, "qt:improve:accept:applied");

  const repeatAccept = handleQtChatPrompt(
    `/qt improve accept summarize ${improveResult.proposalId}`,
    runtime
  ).result;
  assert.equal(repeatAccept.code, "qt:improve:already-finalized");

  const rejectProposal = handleQtChatPrompt(
    "/qt improve summarize add rejection branch",
    runtime
  ).result;
  assert.equal(rejectProposal.code, "qt:improve:proposed");
  const rejectResult = handleQtChatPrompt(
    `/qt improve reject summarize ${rejectProposal.proposalId}`,
    runtime
  ).result;
  assert.equal(rejectResult.code, "qt:improve:reject:recorded");

  const abandonProposal = handleQtChatPrompt(
    "/qt improve summarize add abandon branch",
    runtime
  ).result;
  assert.equal(abandonProposal.code, "qt:improve:proposed");
  const abandonResult = handleQtChatPrompt(
    `/qt improve abandon summarize ${abandonProposal.proposalId}`,
    runtime
  ).result;
  assert.equal(abandonResult.code, "qt:improve:abandon:recorded");

  const listed = handleQtChatPrompt("/qt list", runtime).result;
  assert.equal(listed.code, "qt:list:listed");
  const shown = handleQtChatPrompt("/qt show summarize", runtime).result;
  assert.equal(shown.code, "qt:show:template");
  const doctor = handleQtChatPrompt("/qt doctor", runtime).result;
  assert.equal(doctor.code, "qt:doctor:status");
}

function runOpenClawSmoke(tasksDir) {
  const runtime = createQtRuntime(createFileTaskStore({ tasksDir }));
  const createResult = handleOpenClawQtInput("triage rank bugs by impact", runtime).result;
  assert.equal(createResult.code, "qt:create:created");

  const runResult = handleOpenClawQtInput("/qt/triage Bug 123: login hangs", runtime).result;
  assert.equal(runResult.code, "qt:run:executed");

  const improveResult = handleOpenClawQtInput(
    "/qt improve triage add reproducibility",
    runtime
  ).result;
  assert.equal(improveResult.code, "qt:improve:proposed");

  const acceptResult = handleOpenClawQtInput(
    `/qt improve accept triage ${improveResult.proposalId}`,
    runtime
  ).result;
  assert.equal(acceptResult.code, "qt:improve:accept:applied");

  const rejectProposal = handleOpenClawQtInput(
    "/qt improve triage add rejection branch",
    runtime
  ).result;
  assert.equal(rejectProposal.code, "qt:improve:proposed");
  const rejectResult = handleOpenClawQtInput(
    `/qt improve reject triage ${rejectProposal.proposalId}`,
    runtime
  ).result;
  assert.equal(rejectResult.code, "qt:improve:reject:recorded");

  const abandonProposal = handleOpenClawQtInput(
    "/qt improve triage add abandon branch",
    runtime
  ).result;
  assert.equal(abandonProposal.code, "qt:improve:proposed");
  const abandonResult = handleOpenClawQtInput(
    `/qt improve abandon triage ${abandonProposal.proposalId}`,
    runtime
  ).result;
  assert.equal(abandonResult.code, "qt:improve:abandon:recorded");

  const listed = handleOpenClawQtInput("/qt list", runtime).result;
  assert.equal(listed.code, "qt:list:listed");
  const shown = handleOpenClawQtInput("/qt show triage", runtime).result;
  assert.equal(shown.code, "qt:show:template");
  const doctor = handleOpenClawQtInput("/qt doctor", runtime).result;
  assert.equal(doctor.code, "qt:doctor:status");
}

function runNormalizationParitySmoke() {
  const parityCases = [
    { input: "", expected: "/qt" },
    { input: "summarize write concise bullets", expected: "/qt summarize write concise bullets" },
    { input: "/qt list", expected: "/qt list" },
    { input: "/qt show summarize", expected: "/qt show summarize" },
    {
      input: "/qt improve accept summarize abc123",
      expected: "/qt improve accept summarize abc123"
    }
  ];

  for (const testCase of parityCases) {
    const vscodeCommand = handleQtChatPrompt(testCase.input, {
      handle(commandText) {
        return {
          kind: "help",
          code: "qt:help",
          usage: [commandText]
        };
      }
    }).commandText;
    const openClawCommand = handleOpenClawQtInput(testCase.input, {
      handle(commandText) {
        return {
          kind: "help",
          code: "qt:help",
          usage: [commandText]
        };
      }
    }).commandText;

    assert.equal(vscodeCommand, testCase.expected);
    assert.equal(openClawCommand, testCase.expected);
  }
}

function runExpirySmoke(tasksDir) {
  let nowMs = 1_000;
  const runtime = createQtRuntime(createFileTaskStore({ tasksDir }), {
    proposalTtlMs: 500,
    now: () => nowMs
  });
  runtime.handle("/qt summarize baseline template");
  const proposal = runtime.handle("/qt improve summarize ttl path");
  assert.equal(proposal.code, "qt:improve:proposed");
  nowMs += 10_000;
  const expired = runtime.handle(`/qt improve accept summarize ${proposal.proposalId}`);
  assert.equal(expired.code, "qt:improve:proposal-expired");
}

function runCursorSmoke() {
  const commandDoc = readFileSync(".cursor/commands/qt.md", "utf8");
  assert.match(commandDoc, /docs\/qt-command-result-contract\.md/);
  assert.match(commandDoc, /docs\/qt-adapter-rendering-matrix\.md/);
  assert.match(commandDoc, /Cursor-specific limits/);
}

const tempRoot = mkdtempSync(join(tmpdir(), "quicktask-smoke-"));

try {
  runVsCodeSmoke(join(tempRoot, "vscode"));
  runOpenClawSmoke(join(tempRoot, "openclaw"));
  runNormalizationParitySmoke();
  runExpirySmoke(join(tempRoot, "expiry"));
  runCursorSmoke();
  console.log("smoke-host-adapters: all host smoke checks passed");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
