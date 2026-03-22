import assert from "node:assert/strict";
import test from "node:test";

import { getQtPromptFromRequest, resolveChatParticipantFactory } from "../dist/chatCompat.js";

test("resolveChatParticipantFactory returns undefined without chat API", () => {
  assert.equal(resolveChatParticipantFactory({}), undefined);
  assert.equal(resolveChatParticipantFactory(undefined), undefined);
});

test("resolveChatParticipantFactory returns callable factory when chat API exists", () => {
  const fakeFactory = () => ({ dispose() {} });
  const factory = resolveChatParticipantFactory({
    chat: {
      createChatParticipant: fakeFactory
    }
  });
  assert.equal(factory, fakeFactory);
});

test("getQtPromptFromRequest normalizes missing and plain prompts", () => {
  assert.equal(getQtPromptFromRequest({ prompt: "" }), "/qt");
  assert.equal(getQtPromptFromRequest({ prompt: "summarize write bullets" }), "/qt summarize write bullets");
  assert.equal(getQtPromptFromRequest({ prompt: "/qt list" }), "/qt list");
});

test("getQtPromptFromRequest respects explicit qt command context", () => {
  assert.equal(
    getQtPromptFromRequest({
      command: { name: "qt" },
      prompt: "summarize write bullets"
    }),
    "summarize write bullets"
  );
});
