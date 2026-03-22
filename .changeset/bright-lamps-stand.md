---
"@quicktask/core": minor
"quicktask-vscode": minor
"quicktask-openclaw": minor
---

## New Features

- Add `/qt init` bootstrap flow with idempotent starter-template seeding and deterministic first-run guidance.
- Persist improve proposals across restarts with TTL cleanup and bounded state compaction.

## Bug Fixes

- Improve proposal lifecycle stability so accept/reject/abandon behavior remains deterministic after runtime restarts.

## Internal Improvements

- Expand parser/runtime/adapter tests and docs for init rendering and restart-safe proposal lifecycle semantics.

## Breaking Changes

- None.
