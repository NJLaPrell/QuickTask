import assert from "node:assert/strict";
import test from "node:test";

import { parseQtCommand } from "../dist/parser.js";

test("parses help command", () => {
  assert.deepEqual(parseQtCommand("/qt"), { kind: "menu" });
});

test("falls back to menu for /qt/ with missing task name", () => {
  assert.deepEqual(parseQtCommand("/qt/"), { kind: "menu" });
});

test("parses create command", () => {
  assert.deepEqual(parseQtCommand("/qt summarize write concise summaries"), {
    kind: "create",
    taskName: "summarize",
    instructions: "write concise summaries"
  });
});

test("parses quoted create task names", () => {
  assert.deepEqual(parseQtCommand('/qt "incident triage" create runbook from issue details'), {
    kind: "create",
    taskName: "incident triage",
    instructions: "create runbook from issue details"
  });
});

test("parses run command", () => {
  assert.deepEqual(parseQtCommand("/qt/summarize meeting notes"), {
    kind: "run",
    taskName: "summarize",
    userInput: "meeting notes"
  });
});

test("parses quoted run task names", () => {
  assert.deepEqual(parseQtCommand('/qt/"incident triage" prod outage timeline'), {
    kind: "run",
    taskName: "incident triage",
    userInput: "prod outage timeline"
  });
});

test("parses list command", () => {
  assert.deepEqual(parseQtCommand("/qt list"), { kind: "list" });
});

test("parses show command", () => {
  assert.deepEqual(parseQtCommand("/qt show summarize"), {
    kind: "show",
    taskName: "summarize"
  });
});

test("parses quoted show task names", () => {
  assert.deepEqual(parseQtCommand('/qt show "incident triage"'), {
    kind: "show",
    taskName: "incident triage"
  });
});

test("returns incomplete for /qt show without task", () => {
  assert.deepEqual(parseQtCommand("/qt show"), {
    kind: "incomplete",
    reason: "missing-show-task",
    usage: "/qt show [task]"
  });
});

test("parses doctor command", () => {
  assert.deepEqual(parseQtCommand("/qt doctor"), { kind: "doctor" });
});

test("parses contextual help command", () => {
  assert.deepEqual(parseQtCommand("/qt help improve"), {
    kind: "help",
    topic: "improve"
  });
});

test("parses improve command with task and input", () => {
  assert.deepEqual(parseQtCommand("/qt improve summarize favor action items"), {
    kind: "improve",
    taskName: "summarize",
    userInput: "favor action items"
  });
});

test("parses improve command with quoted task and input", () => {
  assert.deepEqual(parseQtCommand('/qt improve "incident triage" include owner field'), {
    kind: "improve",
    taskName: "incident triage",
    userInput: "include owner field"
  });
});

test("returns structured incomplete result for /qt improve without task", () => {
  assert.deepEqual(parseQtCommand("/qt improve"), {
    kind: "incomplete",
    reason: "missing-improve-task",
    usage: "/qt improve [task] [input]"
  });
});

test("parses improve action command", () => {
  assert.deepEqual(parseQtCommand("/qt improve accept summarize abc123"), {
    kind: "improve_action",
    action: "accept",
    taskName: "summarize",
    proposalId: "abc123"
  });
});

test("parses improve action command with quoted task name", () => {
  assert.deepEqual(parseQtCommand('/qt improve accept "incident triage" abc123'), {
    kind: "improve_action",
    action: "accept",
    taskName: "incident triage",
    proposalId: "abc123"
  });
});

test("returns incomplete for unterminated quoted task name", () => {
  assert.deepEqual(parseQtCommand('/qt show "incident triage'), {
    kind: "incomplete",
    reason: "missing-show-task",
    usage: "/qt show [task]"
  });
});

test("returns incomplete for improve action missing details", () => {
  assert.deepEqual(parseQtCommand("/qt improve reject summarize"), {
    kind: "incomplete",
    reason: "missing-improve-action-details",
    usage: "/qt improve <accept|reject|abandon> [task] [proposal-id]"
  });
});

test("throws for non-quicktask input", () => {
  assert.throws(() => parseQtCommand("hello world"), /Input is not a QuickTask command/);
});
