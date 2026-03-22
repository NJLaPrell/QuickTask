---
"@quicktask/core": minor
"quicktask-vscode": minor
"quicktask-openclaw": minor
---

## New Features

- `/qt <existing-task> …` now runs the template by default; `/qt create …` is the explicit create path for new names.
- Tiered help: `/qt help` quickstart, `/qt help all` for the full surface, and workspace-aware onboarding hints.
- Suggested next commands after a successful `/qt list` when templates exist.
- VS Code / Cursor: one-time activation summary (tasks path, writable, template count) aligned with `/qt doctor`.

## Bug Fixes

- `pnpm qt:sandbox` works from the monorepo root (workspace-linked `@quicktask/core`); `--` is ignored so `pnpm qt:sandbox -- "/qt …"` parses correctly.

## Internal Improvements

- CI exercises `qt:sandbox`; contracts and README updated for Phase 12 (UF-012 long create body, improve minimum input, verbose/debug spec).

## Breaking Changes

- `/qt improve <task>` with empty or very short input now returns `qt:incomplete` with guidance instead of an inferred proposal.
