<h1>
  <img src="./logo.png" alt="QuickTask" />
</h1>

Reusable slash-command task templates for AI chat workflows.

QuickTask gives you a single `/qt` command family to create, run, and iteratively improve task templates. The project uses a shared core runtime so behavior stays consistent across host adapters.

## Why QuickTask

- **Reusable workflows**: define a task once and run it repeatedly with new input.
- **Improvement loop built in**: propose, accept, reject, or abandon template updates.
- **Host-agnostic core**: command parsing and runtime behavior live in one shared package.
- **Deterministic contracts**: command and result shapes are documented for adapter implementations.

## Quick Start (Repository)

QuickTask is currently development-focused. Use these steps to run checks and explore behavior locally.

### Prerequisites

- Node.js current LTS
- `pnpm` 10.x

### Install and validate

```bash
pnpm install
pnpm check
pnpm test
```

### Optional full build

```bash
pnpm build
```

## Usage

### Command forms

- `/qt` - show command help.
- `/qt [task] [instructions]` - create a new task template.
- `/qt/[task] [input]` - run an existing task with input.
- `/qt improve [task] [input]` - propose an improvement for an existing task.
- `/qt improve accept [task] [proposal-id]` - accept and apply a proposal.
- `/qt improve reject [task] [proposal-id]` - reject a proposal.
- `/qt improve abandon [task] [proposal-id]` - abandon a proposal.

### Common workflow example

```text
/qt summarize summarize meeting notes into concise bullet points
/qt/summarize Notes from today's planning session...
/qt improve summarize prioritize action items and owners
/qt improve accept summarize p_abc123
```

Expected behavior:

- Creating a task that already exists returns an explicit already-exists result.
- Running a missing task returns a clear not-found result.
- Improvement proposals are previewed before they can be accepted.

## Current Status

- Core runtime behavior for create/run/improve lifecycle is implemented.
- Host integrations for VS Code, Cursor, and OpenClaw are wired to the shared runtime.
- Installable release artifacts and marketplace distribution are tracked as open work in `TASKS.md`.

## Support Matrix

| Surface                                 | Minimum supported                                    | Validation coverage                                              |
| --------------------------------------- | ---------------------------------------------------- | ---------------------------------------------------------------- |
| Node.js runtime                         | 22.x LTS                                             | CI (`check`, `test`, `build`)                                    |
| pnpm                                    | 10.x                                                 | CI package-manager consistency check                             |
| VS Code adapter (`quicktask-vscode`)    | VS Code `^1.100.0`                                   | Adapter tests + host smoke tests                                 |
| Cursor command wrapper                  | Current Cursor command-file support                  | Command contract smoke check                                     |
| OpenClaw adapter (`quicktask-openclaw`) | Current OpenClaw plugin runtime                      | Adapter tests + host smoke tests                                 |
| Operating systems                       | Ubuntu Linux (baseline), macOS/Windows (best-effort) | Core CI runs on Ubuntu; runtime is host-agnostic TypeScript/Node |

Compatibility policy:

- Breaking compatibility changes must be documented in `TASKS.md` and release notes before merge.
- Update this matrix in the same PR as any support-floor changes.

## Project Structure

- `packages/core` - parser, runtime, storage, and shared types/contracts.
- `packages/vscode-extension` - VS Code host adapter.
- `packages/openclaw-plugin` - OpenClaw host adapter.
- `.cursor/commands` - Cursor slash-command entrypoints.
- `docs/` - contract docs and readiness artifacts.

## Documentation

- User-facing command/result contract: `docs/qt-command-result-contract.md`
- Adapter rendering matrix: `docs/qt-adapter-rendering-matrix.md`
- Contributor guide and local workflow: `CONTRIBUTORS.md`
- Pre-release readiness workflow: `PRE_RELEASE_READINESS_WORKFLOW.md`
- Production release strategy: `RELEASE_STRATEGY.md`
- Task tracking source of truth: `TASKS.md`
