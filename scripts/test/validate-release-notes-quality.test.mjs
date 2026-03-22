import assert from "node:assert/strict";
import test from "node:test";

import { validateReleaseNotesQuality } from "../validate-release-notes-quality.mjs";

test("passes for normal release notes", () => {
  const notes = `
## Summary

- Adds parser improvements and reliability fixes.

## User Highlights

- Better quoted task parsing.

## Bug Fixes

- Resolve stale proposal edge cases.
`;
  const result = validateReleaseNotesQuality(notes);
  assert.equal(result.ok, true);
});

test("fails on duplicate user highlights", () => {
  const notes = `
## Summary

- release focuses on stuff

## User Highlights

- Better parser handling.
- better parser handling.

## Bug Fixes

- None.
`;
  const result = validateReleaseNotesQuality(notes);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /Duplicate user-highlight bullets/);
});
