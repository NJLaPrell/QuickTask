![QuickTask](./logo.png)

# QuickTask

QuickTask is a slash-command workflow for creating, running, and improving reusable task templates through `/qt`. It is organized as a monorepo with a shared core runtime and host adapters for VS Code, Cursor, and OpenClaw.

## Documentation

- Contributor workflows, local development commands, and release preparation: `CONTRIBUTORS.md`
- Production release policy: `RELEASE_STRATEGY.md`
- Pre-release readiness workflow: `PRE_RELEASE_READINESS_WORKFLOW.md`
- Canonical command/result contract: `docs/qt-command-result-contract.md`
- Adapter rendering behavior matrix: `docs/qt-adapter-rendering-matrix.md`

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
