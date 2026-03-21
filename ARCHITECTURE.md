# QuickTask architecture

## Monorepo layout

- `packages/core`: shared parser, store, template helpers, runtime
- `packages/vscode-extension`: VS Code wrapper
- `packages/openclaw-plugin`: OpenClaw wrapper
- `.cursor/commands`: Cursor slash command entrypoint

## Persistent task storage decision (T001)

### Storage path

- Persist task templates under the repository root at `tasks/`.
- Each task template is stored as one markdown file: `tasks/[normalized-task-name].md`.
- This keeps templates visible, versionable, and shared across host adapters in the same repo.

### Task-name to filename normalization

Normalize logical task names to filenames using lowercase kebab-case:

1. Trim leading and trailing whitespace.
2. Convert to lowercase.
3. Replace whitespace and underscores with `-`.
4. Remove characters that are not letters, numbers, or `-`.
5. Collapse repeated `-` to a single `-`.
6. Trim leading and trailing `-`.
7. Append `.md`.

Examples:

- `Summarize Notes` -> `summarize-notes.md`
- `  Bug_Triage  ` -> `bug-triage.md`
- `Release Plan v2` -> `release-plan-v2.md`

### Host lookup rules

Host adapters resolve the task store path with this precedence:

1. Explicit runtime/config setting from the host adapter.
2. Environment variable override (for example `QUICKTASK_TASKS_DIR`).
3. Default repository path: `<repo-root>/tasks`.

This keeps behavior consistent across VS Code, Cursor, and OpenClaw while allowing host-specific overrides when needed.

## Runtime flow

1. Parse the `/qt` command.
2. Decide whether the request is help, create, run, improve, or improve-action.
3. Resolve the task template.
4. Return a host-specific response.

## Canonical command/result contract

The single source of truth for supported command forms and runtime result codes is:

- `docs/qt-command-result-contract.md`
- `docs/qt-adapter-rendering-matrix.md` for host rendering behavior by result code.

Host adapters and user-facing docs should reference this contract to avoid drift.

## Concurrent template write policy

QuickTask uses a lock-file strategy for deterministic concurrent writes:

1. Before saving `tasks/[task].md`, core attempts to create `tasks/[task].md.lock` using exclusive create semantics.
2. If the lock already exists, save fails fast with a storage error (`Concurrent write in progress`).
3. When the write completes or fails, core removes the lock.
4. Template file writes still use temp-file-then-rename for atomic content replacement.

This guarantees no partial/corrupted template state while making conflict behavior explicit for adapters.

## Current state

The core runtime now uses a file-backed task store that reads and writes markdown templates on disk using the documented `tasks/` path and lookup rules.
