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
2. Decide whether the request is help, init, create, run, export/import, list/show/doctor, improve, improve-action, or import-pack.
3. Resolve the task template.
4. Return a host-specific response.

## Diagnostics and privacy guardrails

QuickTask diagnostics are local-only runtime telemetry for support/debugging.

- Diagnostics are stored in process memory only (`runtime.getDiagnostics()`); they are not persisted to disk or sent remotely by core runtime behavior.
- Diagnostics must not include raw user prompts, task template bodies, or other user-content payloads.
- Adapter fallback/error rendering must keep request correlation IDs while avoiding sensitive payload echoing.
- Any new diagnostics fields require tests proving zero user-content leakage.

## Canonical command/result contract

The single source of truth for supported command forms and runtime result codes is:

- `docs/qt-command-result-contract.md`
- `docs/qt-adapter-rendering-matrix.md` for host rendering behavior by result code.

Host adapters and user-facing docs should reference this contract to avoid drift.

## Workspace-kit workflow contract source

For workspace-kit phase/gate/check contract details, generated artifact paths, and the canonical data-flow diagram, use:

- `docs/maintainers/workspace-kit-workflow-contract-source.md`

That maintainer doc is the single source of truth for contract-in-data wiring between schema/data, generators, and release contract checks.

## Workspace-kit Phase 6 extraction source

For extraction sequencing and consumer-boundary policy used to keep kit/QuickTask release independence, use:

- `docs/maintainers/workspace-kit-phase6-extraction-plan.md`
- `docs/maintainers/workspace-kit-phase6-consumer-boundary.md`

## Approved command-surface scope

QuickTask keeps an intentionally minimal `/qt` surface:

- `/qt` help
- create/run/improve lifecycle
- export/import/template-pack portability
- discovery and diagnostics commands: `/qt list`, `/qt show [task]`, `/qt doctor`

Additional command expansion is deferred by default and requires explicit re-approval.

## Concurrent template write policy

QuickTask uses a lock-file strategy for deterministic concurrent writes:

1. Before saving `tasks/[task].md`, core attempts to create `tasks/[task].md.lock` using exclusive create semantics.
2. If the lock already exists, core checks lock staleness by file age.
3. Stale locks (older than 5 minutes) are removed and the lock acquisition is retried once.
4. Active locks still fail fast with a storage error (`Concurrent write in progress`).
5. When the write completes or fails, core removes the lock.
6. Template file writes still use temp-file-then-rename for atomic content replacement.

This guarantees no partial/corrupted template state while making conflict behavior explicit for adapters.

## Current state

The core runtime now uses a file-backed task store that reads and writes markdown templates on disk using the documented `tasks/` path and lookup rules.

## Compatibility and support policy

QuickTask support floors are defined in `README.md` and validated in CI:

- Node.js 22.x and pnpm 10.x are the repository runtime baseline.
- VS Code support is tied to the extension engine declaration (`^1.100.0`).
- Cursor support is command-wrapper based and validated against canonical contract docs.
- OpenClaw support follows the plugin adapter package runtime.

Policy for compatibility changes:

1. Treat support-floor changes as release-significant.
2. Update `README.md` support matrix and contributor docs in the same change.
3. Include release-note/changelog coverage via changeset when user-visible compatibility changes occur.
