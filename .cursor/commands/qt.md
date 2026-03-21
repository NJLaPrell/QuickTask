---
description: QuickTask entry command
---

Use the QuickTask runtime to interpret the user's `/qt` request using the repository task templates.

Canonical docs:

- `docs/qt-command-result-contract.md` for command forms and runtime result codes.
- `docs/qt-adapter-rendering-matrix.md` for host rendering behavior and unknown-code fallback.

Execution requirements:

1. Keep behavior aligned to `@quicktask/core` command parsing and runtime result codes.
2. Do not reimplement task template logic in this command wrapper.
3. Render responses from runtime result `code` and include request IDs for `qt:parse:error` and `qt:storage:error`.

Cursor-specific limits (documented):

- Cursor command files are prompt wrappers, not a native runtime host process.
- Proposal/session state is runtime-session scoped; if session context resets, proposal actions can return `qt:improve:proposal-not-found`.
- When host UX controls are unavailable, present clear next-command guidance (for example accept/reject/abandon forms) in plain text.
