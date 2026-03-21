![QuickTask](./logo.png)

# QuickTask

QuickTask is a slash-command workflow for creating, running, and improving reusable task templates through `/qt`. It is organized as a monorepo with a shared core runtime and host adapters for VS Code, Cursor, and OpenClaw.

## Quick Start

This is the current development quick start based on what is implemented today.

For commit and PR workflow conventions, see `COMMIT_STRATEGY.md`.
For PR review and merge policy, see `PR_REVIEW_MERGE_STRATEGY.md`.
For task execution loop conventions, see `TASK_PR_DELIVERY_WORKFLOW.md`.
For production release policy, see `RELEASE_STRATEGY.md`.
For the canonical command/result contract, see `docs/qt-command-result-contract.md`.
For adapter rendering behavior per host, see `docs/qt-adapter-rendering-matrix.md`.

### Prerequisites

- Node.js (current LTS recommended)
- `pnpm` 10.x

### Install dependencies

```bash
pnpm install
```

### Run repo checks

```bash
pnpm check
```

### Build all packages

```bash
pnpm build
```

### Run tests

```bash
pnpm test
```

### Clean build outputs

```bash
pnpm clean
```

### Work on one package

Use pnpm filters to target a single workspace package:

```bash
pnpm --filter @quicktask/core build
pnpm --filter quicktask-vscode check
pnpm --filter quicktask-openclaw build
```

### Current limitations

- There is no fully packaged install flow yet for VS Code, Cursor, or OpenClaw.
- Core behavior is available as library/runtime code; host adapters are still being completed.
- Release, marketplace publishing, and install docs are tracked in `TASKS.md`.

## Release workflow

QuickTask uses Changesets with lockstep versions across workspace packages.

### Add release notes during development

For user-visible changes, add a changeset entry:

```bash
pnpm changeset
```

### Run a production release

Use the GitHub `Release` workflow (`workflow_dispatch`) from `main`.

The workflow will:

1. run checks/tests/build,
2. enforce docs synchronization inputs,
3. apply Changesets version/changelog updates,
4. commit release changes,
5. create tag `vX.Y.Z`,
6. publish a GitHub Release with generated notes.

## User Guide

### What `/qt` does

QuickTask supports these command forms:

- `/qt` - show command help.
- `/qt [task] [instructions]` - create a new task template.
- `/qt/[task] [input]` - run an existing task with user input.
- `/qt improve [task] [input]` - propose an improvement to an existing task.
- `/qt improve accept [task] [proposal-id]` - accept and apply a proposal.
- `/qt improve reject [task] [proposal-id]` - reject a proposal.
- `/qt improve abandon [task] [proposal-id]` - abandon a proposal.

### Command behavior

#### Show help

Use `/qt` to get the command summary and supported forms.

#### Create a task template

Use `/qt [task] [instructions]` to define a task. Example:

`/qt summarize summarize meeting notes into concise bullet points`

If the task already exists, the runtime should return an "already exists" style result instead of silently replacing it.

#### Run a task

Use `/qt/[task] [input]` to execute a saved template with user input. Example:

`/qt/summarize Notes from today's planning session...`

If the task does not exist, QuickTask returns a clear not-found result.

#### Propose an improvement

Use `/qt improve [task] [input]` to generate a proposed update to an existing template. Example:

`/qt improve summarize favor action items and owners`

Improvement proposals are shown before acceptance so hosts can present confirmation UX.

### Current project state

- Core runtime behavior exists and is being expanded.
- Host integrations are scaffolded and being wired to the shared core runtime.
- Full installation and release instructions are tracked in `TASKS.md`.
