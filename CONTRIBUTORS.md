# QuickTask Contributor Guide

This guide is the contributor-facing source of truth for development workflow, validation, and release preparation.

## Who this is for

- Contributors implementing code or docs changes
- Reviewers validating PR quality and release readiness
- Maintainers preparing a release handoff

## Project layout

- `packages/core` - parser, runtime, store, template helpers, shared contracts
- `packages/vscode-extension` - VS Code host adapter
- `packages/openclaw-plugin` - OpenClaw host adapter
- `.cursor/commands` - slash-command entrypoints
- `.cursor/rules` - codified AI workflow/rules
- `docs/` - canonical runtime/adapter and readiness docs
- `TASKS.md` - planning and execution source of truth

## Local setup

### Prerequisites

- Node.js current LTS
- `pnpm` 10.x

### Install

```bash
pnpm install
```

### Core workspace commands

```bash
pnpm check
pnpm test
pnpm build
pnpm clean
```

### Target one package

```bash
pnpm --filter @quicktask/core build
pnpm --filter quicktask-vscode check
pnpm --filter quicktask-openclaw build
```

## Contribution workflow

Use these documents as policy:

- `TASK_PR_DELIVERY_WORKFLOW.md`
- `COMMIT_STRATEGY.md`
- `BRANCHING_TAGGING_STRATEGY.md`
- `PR_REVIEW_MERGE_STRATEGY.md`

Working defaults:

1. Start from `main`.
2. Create one branch per task (`t###-short-slug`).
3. Keep one PR per task.
4. Add/update tests with implementation changes.
5. Run validation before PR merge.
6. Update `TASKS.md` status/history on completion.

## Task tracking policy

`TASKS.md` is the tracker for project work and release-readiness findings.

- Keep IDs stable; never renumber.
- Use statuses consistently:
  - `[ ]` not done
  - `[x]` complete (not yet archived)
  - `[h]` archived complete
- When a task closes, assess for gaps and add/update follow-up tasks immediately.

## Runtime and adapter contracts

Keep behavior aligned with canonical docs:

- Commands/results: `docs/qt-command-result-contract.md`
- Host rendering matrix: `docs/qt-adapter-rendering-matrix.md`

When command/result behavior changes, update contracts and tests in the same PR.

## Host adapter validation (Phase 3)

For VS Code and OpenClaw adapter boundary updates:

```bash
pnpm --filter quicktask-vscode test
pnpm --filter quicktask-openclaw test
```

These tests validate command normalization, runtime-boundary routing, and result rendering behavior without duplicating core task logic.

## Validation expectations

At minimum for implementation PRs:

- `pnpm check`
- `pnpm test`
- `pnpm build` when build outputs are affected

For release preparation, use the dedicated readiness flow below.

## Release preparation and release trigger

Release work has two stages:

1. **Pre-release readiness** (this guide + `PRE_RELEASE_READINESS_WORKFLOW.md`)
2. **Release workflow handoff** (`RELEASE_STRATEGY.md`)

### Stage 1: Prepare release readiness

Run:

```bash
pnpm release:prepare
```

Release-prep scope is full-product across all phases.

This command:

- runs full-hardening checks (`check`, `test`, `build`, docs gate),
- writes `docs/release-readiness-report.md`,
- treats only new `medium`/`high` findings for the current release phase as blocking,
- reports open `TASKS.md` tasks from all phases.

After each run:

1. Read `docs/release-readiness-report.md`.
2. Update existing `TASKS.md` tasks for mapped findings.
3. Add new `TASKS.md` tasks for unmapped findings.
4. Assign phase and priority manually for any new task.
5. Re-run `pnpm release:prepare` until blockers are cleared, or explicitly accepted.

Do not use GitHub issues for this flow; use `TASKS.md`.

### Stage 2: Trigger production release

Once readiness is green (or explicitly accepted), hand off to the release strategy:

1. Confirm intended PRs are merged to `main`.
2. Trigger GitHub `Release` workflow (`workflow_dispatch`) from `main`.
3. Provide required docs sync inputs (`readme_status`, `docs_status`, `docs_sync_notes`).

The release workflow then performs versioning/tagging/release publication as defined in `RELEASE_STRATEGY.md`.

## Documentation map

- User-facing usage: `README.md`
- Contributor workflow: `CONTRIBUTORS.md` (this file)
- Release policy: `RELEASE_STRATEGY.md`
- Pre-release readiness flow: `PRE_RELEASE_READINESS_WORKFLOW.md`
