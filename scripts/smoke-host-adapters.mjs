#!/usr/bin/env node

import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { createFileTaskStore, createQtRuntime } from "../packages/core/src/index.js";
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
  runCursorSmoke();
  console.log("smoke-host-adapters: all host smoke checks passed");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
