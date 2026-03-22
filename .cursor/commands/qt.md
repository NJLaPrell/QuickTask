---
description: QuickTask entry command
---

Use the QuickTask runtime to interpret the user's `/qt` request using the repository task templates.

Canonical docs:

- `docs/qt-command-result-contract.md` for command forms and runtime result codes.
- `docs/qt-adapter-rendering-matrix.md` for host rendering behavior and unknown-code fallback.

Approved command surface (current):

- `/qt`
- `/qt help [create|run|improve|actions|discover]`
- `/qt init`
- `/qt [task] [instructions]`
- `/qt/[task] [input]`
- `/qt improve [task] [input]`
- `/qt improve <accept|reject|abandon> [task] [proposal-id]`
- `/qt list`
- `/qt show [task]`
- `/qt doctor`

Quoted task names are supported for commands that take `[task]`.

If a request asks for non-core command expansion, treat it as deferred unless explicitly approved.

Execution requirements:

1. Keep behavior aligned to `@quicktask/core` command parsing and runtime result codes.
2. Do not reimplement task template logic in this command wrapper.
3. Render responses from runtime result `code` and include request IDs for `qt:parse:error` and `qt:storage:error`.

Cursor-specific limits (documented):

- Cursor command files are prompt wrappers, not a native runtime host process.
- Proposal state persists on disk under QuickTask runtime metadata; expired/finalized IDs can still return `qt:improve:proposal-not-found`.
- When host UX controls are unavailable, present clear next-command guidance (for example accept/reject/abandon forms) in plain text.
