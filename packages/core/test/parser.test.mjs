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

test("parses run command", () => {
  assert.deepEqual(parseQtCommand("/qt/summarize meeting notes"), {
    kind: "run",
    taskName: "summarize",
    userInput: "meeting notes"
  });
});

test("parses improve command with task and input", () => {
  assert.deepEqual(parseQtCommand("/qt improve summarize favor action items"), {
    kind: "improve",
    taskName: "summarize",
    userInput: "favor action items"
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
