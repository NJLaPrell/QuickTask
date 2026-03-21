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
2. Decide whether the request is help, create, run, or improve.
3. Resolve the task template.
4. Return a host-specific response.

## Current state

The first runtime scaffold currently uses an in-memory store so command behavior can be developed before file persistence is added.
