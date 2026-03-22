import assert from "node:assert/strict";
import { mkdtempSync, rmSync, utimesSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { createQtRuntime } from "../dist/runtime.js";
import { createFileTaskStore } from "../dist/store.js";

function createRuntimeForTest() {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-runtime-"));
  return {
    runtime: createQtRuntime(createFileTaskStore({ tasksDir })),
    cleanup: () => rmSync(tasksDir, { recursive: true, force: true })
  };
}

test("returns help for /qt", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const result = runtime.handle("/qt");

    assert.equal(result.kind, "help");
    assert.equal(result.code, "qt:help");
    assert.deepEqual(result.usage, [
      "/qt",
      "/qt [task] [instructions]",
      "/qt/[task] [input]",
      "/qt improve [task] [input]",
      "/qt list",
      "/qt show [task]",
      "/qt doctor"
    ]);
  } finally {
    cleanup();
  }
});

test("returns contextual help for known topic and fallback for unknown topic", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const topicHelp = runtime.handle("/qt help improve");
    assert.equal(topicHelp.kind, "help");
    assert.equal(topicHelp.code, "qt:help");
    assert.ok(topicHelp.usage.includes("/qt improve [task] [input]"));

    const unknownHelp = runtime.handle("/qt help nonsense");
    assert.equal(unknownHelp.kind, "help");
    assert.equal(unknownHelp.code, "qt:help");
    assert.match(unknownHelp.message ?? "", /Unknown help topic/);
  } finally {
    cleanup();
  }
});

test("records safe runtime diagnostics events", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    runtime.handle("/qt/summarize sensitive user input");
    const events = runtime.getDiagnostics();

    assert.ok(events.length >= 2);
    assert.equal(events[events.length - 2].phase, "command.received");
    assert.equal(events[events.length - 1].phase, "command.completed");
    assert.equal(events[events.length - 2].commandKind, "run");
    assert.equal(events[events.length - 1].code, "qt:run:not-found");
    for (const event of events) {
      const keys = Object.keys(event).sort();
      assert.ok(keys.includes("requestId"));
      assert.ok(keys.includes("timestamp"));
      assert.ok(keys.includes("phase"));
      assert.ok(keys.includes("commandKind"));
      assert.ok(!keys.includes("userInput"));
      assert.ok(!keys.includes("templateBody"));
      assert.ok(!keys.includes("message"));
    }
    assert.doesNotMatch(JSON.stringify(events), /sensitive user input/);
  } finally {
    cleanup();
  }
});

test("returns structured parse error results for non-quicktask input", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const result = runtime.handle("hello world");
    assert.equal(result.kind, "error");
    assert.equal(result.code, "qt:parse:error");
    assert.equal(result.diagnosticCode, "parse-invalid-input");
    assert.match(result.requestId, /^qt-/);
    assert.equal(result.message, "Input is not a QuickTask command.");

    const events = runtime.getDiagnostics();
    assert.equal(events[events.length - 1].phase, "command.failed");
    assert.equal(events[events.length - 1].commandKind, "invalid_input");
    assert.equal(events[events.length - 1].code, "qt:parse:error");
  } finally {
    cleanup();
  }
});

test("returns task-not-found when running an unknown task", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const result = runtime.handle("/qt/does-not-exist example input");

    assert.equal(result.kind, "not_found");
    assert.equal(result.code, "qt:run:not-found");
    assert.equal(result.taskName, "does-not-exist");
    assert.equal(result.message, "No template exists yet for does-not-exist.");
  } finally {
    cleanup();
  }
});

test("create then run returns template and user input", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const created = runtime.handle("/qt summarize produce concise bullets");
    assert.equal(created.kind, "created");
    assert.equal(created.code, "qt:create:created");
    assert.equal(created.filename, "summarize.md");
    assert.match(created.templateBody, /- Goal: produce concise bullets/);

    const result = runtime.handle("/qt/summarize Team sync notes");
    assert.equal(result.kind, "run_executed");
    assert.equal(result.code, "qt:run:executed");
    assert.equal(result.taskName, "summarize");
    assert.match(result.templateBody, /- Goal: produce concise bullets/);
    assert.equal(result.userInput, "Team sync notes");
  } finally {
    cleanup();
  }
});

test("quoted task names are supported across create, run, and show", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const created = runtime.handle('/qt "incident triage" capture timeline and owner');
    assert.equal(created.kind, "created");
    assert.equal(created.taskName, "incident triage");

    const run = runtime.handle('/qt/"incident triage" service degraded in us-east-1');
    assert.equal(run.kind, "run_executed");
    assert.equal(run.taskName, "incident triage");

    const shown = runtime.handle('/qt show "incident triage"');
    assert.equal(shown.kind, "show");
    assert.equal(shown.taskName, "incident triage");
  } finally {
    cleanup();
  }
});

test("run supports minimal input with empty user input", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    runtime.handle("/qt summarize produce concise bullets");
    const result = runtime.handle("/qt/summarize");

    assert.equal(result.kind, "run_executed");
    assert.equal(result.code, "qt:run:executed");
    assert.equal(result.userInput, "");
  } finally {
    cleanup();
  }
});

test("list and show commands return template discovery results", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    runtime.handle("/qt summarize produce concise bullets");
    runtime.handle("/qt triage rank bugs by impact");

    const listed = runtime.handle("/qt list");
    assert.equal(listed.kind, "list");
    assert.equal(listed.code, "qt:list:listed");
    assert.deepEqual(listed.tasks, ["summarize", "triage"]);

    const shown = runtime.handle("/qt show summarize");
    assert.equal(shown.kind, "show");
    assert.equal(shown.code, "qt:show:template");
    assert.equal(shown.taskName, "summarize");
    assert.match(shown.templateBody, /produce concise bullets/);
  } finally {
    cleanup();
  }
});

test("show command returns deterministic not found behavior", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const result = runtime.handle("/qt show does-not-exist");
    assert.equal(result.kind, "not_found");
    assert.equal(result.code, "qt:run:not-found");
    assert.equal(result.taskName, "does-not-exist");
  } finally {
    cleanup();
  }
});

test("doctor command reports safe diagnostics metadata", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    runtime.handle("/qt summarize baseline instructions");
    runtime.handle("/qt list");
    const doctor = runtime.handle("/qt doctor");

    assert.equal(doctor.kind, "doctor");
    assert.equal(doctor.code, "qt:doctor:status");
    assert.equal(typeof doctor.diagnostics.tasksDir, "string");
    assert.equal(typeof doctor.diagnostics.taskCount, "number");
    assert.equal(typeof doctor.diagnostics.writable, "boolean");
    assert.equal(typeof doctor.diagnostics.runtimeVersion, "string");
    assert.ok(Array.isArray(doctor.diagnostics.recentRuntimeCodes));
  } finally {
    cleanup();
  }
});

test("create returns clarification when instructions are missing", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const result = runtime.handle("/qt summarize");
    assert.equal(result.kind, "clarification");
    assert.equal(result.code, "qt:create:clarify");
    assert.equal(result.taskName, "summarize");
    assert.equal(result.usage, "/qt summarize [instructions]");
    assert.equal(result.message, "Please provide instructions for summarize.");
  } finally {
    cleanup();
  }
});

test("create does not overwrite an existing task", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    runtime.handle("/qt summarize first version");
    const secondCreate = runtime.handle("/qt summarize second version");

    assert.equal(secondCreate.kind, "already_exists");
    assert.equal(secondCreate.code, "qt:create:already-exists");
    assert.equal(secondCreate.taskName, "summarize");
    assert.match(secondCreate.message, /A template already exists for summarize\./);

    const runResult = runtime.handle("/qt/summarize sample input");
    assert.match(runResult.templateBody, /- Goal: first version/);
    assert.doesNotMatch(runResult.templateBody, /- Goal: second version/);
  } finally {
    cleanup();
  }
});

test("improve returns old and proposed templates for existing task", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    runtime.handle("/qt summarize produce concise bullets");

    const result = runtime.handle("/qt improve summarize emphasize owners");
    assert.equal(result.kind, "improve_proposed");
    assert.equal(result.code, "qt:improve:proposed");
    assert.equal(result.taskName, "summarize");
    assert.match(result.proposalId, /^[a-f0-9]{12}$/);
    assert.equal(result.source, "explicit");
    assert.match(result.oldTemplate, /# summarize/);
    assert.match(result.proposedTemplate, /Improvement note for summarize: emphasize owners/);
  } finally {
    cleanup();
  }
});

test("improve without user input uses inferred proposal source", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    runtime.handle("/qt summarize produce concise bullets");
    const result = runtime.handle("/qt improve summarize");

    assert.equal(result.kind, "improve_proposed");
    assert.equal(result.source, "inferred");
    assert.match(
      result.proposedTemplate,
      /refine this template to better handle explicit user input\./
    );
  } finally {
    cleanup();
  }
});

test("improve lifecycle records action states by proposal id", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    runtime.handle("/qt summarize produce concise bullets");
    const proposalResult = runtime.handle("/qt improve summarize emphasize owners");
    assert.equal(proposalResult.kind, "improve_proposed");
    const proposalId = proposalResult.proposalId;

    const acceptResult = runtime.handle(`/qt improve accept summarize ${proposalId}`);
    assert.equal(acceptResult.kind, "improve_action");
    assert.equal(acceptResult.code, "qt:improve:accept:applied");
    assert.equal(acceptResult.status, "accepted");
    assert.match(acceptResult.message, /accepted and applied/);

    const runAfterAccept = runtime.handle("/qt/summarize follow-up input");
    assert.equal(runAfterAccept.kind, "run_executed");
    assert.match(runAfterAccept.templateBody, /Improvement note for summarize: emphasize owners/);

    const repeatAccept = runtime.handle(`/qt improve accept summarize ${proposalId}`);
    assert.equal(repeatAccept.kind, "improve_action");
    assert.equal(repeatAccept.code, "qt:improve:already-finalized");
    assert.equal(repeatAccept.status, "accepted");
  } finally {
    cleanup();
  }
});

test("improve lifecycle handles proposal not found", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const result = runtime.handle("/qt improve abandon summarize does-not-exist");
    assert.equal(result.kind, "not_found");
    assert.equal(result.code, "qt:improve:proposal-not-found");
    assert.equal(result.taskName, "summarize");
  } finally {
    cleanup();
  }
});

test("improve lifecycle proposal IDs are session-scoped across restart", () => {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-runtime-session-"));
  try {
    const runtimeA = createQtRuntime(createFileTaskStore({ tasksDir }));
    runtimeA.handle("/qt summarize baseline instructions");
    const proposal = runtimeA.handle("/qt improve summarize session scoped change");
    assert.equal(proposal.kind, "improve_proposed");

    const runtimeB = createQtRuntime(createFileTaskStore({ tasksDir }));
    const result = runtimeB.handle(`/qt improve accept summarize ${proposal.proposalId}`);
    assert.equal(result.kind, "not_found");
    assert.equal(result.code, "qt:improve:proposal-not-found");
    assert.match(result.message, /session-scoped/);
  } finally {
    rmSync(tasksDir, { recursive: true, force: true });
  }
});

test("improve lifecycle returns proposal-expired when ttl is exceeded", () => {
  let currentTime = 1_000;
  const now = () => currentTime;
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-runtime-ttl-"));
  try {
    const runtime = createQtRuntime(createFileTaskStore({ tasksDir }), {
      proposalTtlMs: 1000,
      now
    });
    runtime.handle("/qt summarize baseline instructions");
    const proposal = runtime.handle("/qt improve summarize ttl change");
    assert.equal(proposal.kind, "improve_proposed");

    currentTime += 2000;
    const result = runtime.handle(`/qt improve accept summarize ${proposal.proposalId}`);
    assert.equal(result.kind, "improve_action");
    assert.equal(result.code, "qt:improve:proposal-expired");
    assert.equal(result.status, "expired");
  } finally {
    rmSync(tasksDir, { recursive: true, force: true });
  }
});

test("improve reject and abandon do not apply template changes", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    runtime.handle("/qt summarize baseline instructions");
    const rejectProposal = runtime.handle("/qt improve summarize add rejection change");
    assert.equal(rejectProposal.kind, "improve_proposed");
    runtime.handle(`/qt improve reject summarize ${rejectProposal.proposalId}`);

    const abandonProposal = runtime.handle("/qt improve summarize add abandon change");
    assert.equal(abandonProposal.kind, "improve_proposed");
    runtime.handle(`/qt improve abandon summarize ${abandonProposal.proposalId}`);

    const runResult = runtime.handle("/qt/summarize verify unchanged");
    assert.equal(runResult.kind, "run_executed");
    assert.match(runResult.templateBody, /baseline instructions/);
    assert.doesNotMatch(runResult.templateBody, /add rejection change/);
    assert.doesNotMatch(runResult.templateBody, /add abandon change/);
  } finally {
    cleanup();
  }
});

test("proposal cache stays bounded after repeated finalized actions", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    runtime.handle("/qt summarize baseline instructions");
    const proposalIds = [];
    for (let index = 0; index < 220; index += 1) {
      const proposal = runtime.handle(`/qt improve summarize change ${index}`);
      assert.equal(proposal.kind, "improve_proposed");
      proposalIds.push(proposal.proposalId);
      const rejected = runtime.handle(`/qt improve reject summarize ${proposal.proposalId}`);
      assert.equal(rejected.kind, "improve_action");
    }

    const oldest = runtime.handle(`/qt improve reject summarize ${proposalIds[0]}`);
    assert.equal(oldest.kind, "not_found");

    const newest = runtime.handle(
      `/qt improve reject summarize ${proposalIds[proposalIds.length - 1]}`
    );
    assert.equal(newest.kind, "improve_action");
  } finally {
    cleanup();
  }
});

test("improve handles missing tasks cleanly", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const result = runtime.handle("/qt improve missing-task make it better");
    assert.equal(result.kind, "not_found");
    assert.equal(result.code, "qt:improve:not-found");
    assert.equal(result.taskName, "missing-task");
    assert.equal(result.message, "No template exists yet for missing-task.");
  } finally {
    cleanup();
  }
});

test("returns structured response for incomplete improve command", () => {
  const { runtime, cleanup } = createRuntimeForTest();
  try {
    const result = runtime.handle("/qt improve");

    assert.equal(result.kind, "incomplete");
    assert.equal(result.code, "qt:incomplete");
    assert.equal(result.usage, "/qt improve [task] [input]");
    assert.equal(result.message, "Missing required input. Usage: /qt improve [task] [input]");
  } finally {
    cleanup();
  }
});

test("returns storage error result when template write fails", () => {
  const runtime = createQtRuntime(createFileTaskStore({ tasksDir: "/dev/null/quicktask" }));
  const result = runtime.handle("/qt summarize cannot persist here");

  assert.equal(result.kind, "error");
  assert.equal(result.code, "qt:storage:error");
  assert.equal(result.diagnosticCode, "storage-io-failure");
  assert.match(result.requestId, /^qt-/);
  assert.match(result.message, /Failed to save task template|ENOTDIR/);
});

test("returns storage error result when a concurrent write lock exists", () => {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-lock-runtime-"));
  try {
    writeFileSync(path.join(tasksDir, "summarize.md.lock"), `${process.pid}`, "utf8");
    const runtime = createQtRuntime(createFileTaskStore({ tasksDir }));
    const result = runtime.handle("/qt summarize cannot write while locked");

    assert.equal(result.kind, "error");
    assert.equal(result.code, "qt:storage:error");
    assert.equal(result.diagnosticCode, "storage-io-failure");
    assert.match(result.requestId, /^qt-/);
    assert.match(result.message, /Concurrent write in progress/);
  } finally {
    rmSync(tasksDir, { recursive: true, force: true });
  }
});

test("recovers stale write lock and creates template successfully", () => {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-stale-lock-runtime-"));
  try {
    const lockPath = path.join(tasksDir, "summarize.md.lock");
    writeFileSync(lockPath, `${process.pid}`, "utf8");
    const staleSeconds = Math.floor((Date.now() - 10 * 60 * 1000) / 1000);
    utimesSync(lockPath, staleSeconds, staleSeconds);

    const runtime = createQtRuntime(createFileTaskStore({ tasksDir }));
    const result = runtime.handle("/qt summarize recovered from stale lock");
    assert.equal(result.kind, "created");
    assert.equal(result.code, "qt:create:created");
  } finally {
    rmSync(tasksDir, { recursive: true, force: true });
  }
});

test("returns storage error result and recovers when template file is corrupted", () => {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-corrupt-runtime-"));
  try {
    writeFileSync(
      path.join(tasksDir, "broken.md"),
      "---\nquicktaskVersion: invalid\n---\n# broken template",
      "utf8"
    );
    const runtime = createQtRuntime(createFileTaskStore({ tasksDir }));
    const result = runtime.handle("/qt/broken input");

    assert.equal(result.kind, "error");
    assert.equal(result.code, "qt:storage:error");
    assert.equal(result.diagnosticCode, "storage-io-failure");
    assert.match(result.requestId, /^qt-/);
    assert.match(result.message, /is corrupted and was moved to/);
  } finally {
    rmSync(tasksDir, { recursive: true, force: true });
  }
});
