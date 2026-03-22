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

### First 30 minutes (new contributor path)

1. `pnpm install`
2. `pnpm build`
3. `pnpm test`
4. `pnpm qt:sandbox -- /qt init`
5. `pnpm qt:sandbox -- /qt list`
6. Pick a single `P0`/`P1` task from `TASKS.md`, branch `t###-short-slug`, and ship one scoped PR.

If setup fails, run `/qt doctor` through sandbox (`pnpm qt:sandbox -- /qt doctor`) and fix path/write errors before coding.

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
pnpm lint
pnpm format:check
pnpm test
pnpm test:smoke
pnpm build
pnpm package:vscode
pnpm package:openclaw
pnpm package:release
pnpm release:verify-local-artifacts
pnpm release:validate-changesets
pnpm release:check-workflow-contracts
pnpm release:check-notes-quality
pnpm tasks:check
pnpm tasks:check-templates
pnpm docs:check-links
pnpm check:generated-artifacts
pnpm check:command-entrypoints
pnpm phase:check -- --phase 11
pnpm templates:eval
pnpm qt:sandbox -- /qt help
pnpm check:package-manager
pnpm clean
```

### Target one package

```bash
pnpm --filter @quicktask/core build
pnpm --filter quicktask-vscode check
pnpm --filter quicktask-vscode package:vsix
pnpm --filter quicktask-openclaw build
pnpm --filter quicktask-openclaw package:artifact
```

## Contribution workflow

Use these documents as policy:

- `docs/workflows/task-pr-delivery-workflow.md` (canonical; `TASK_PR_DELIVERY_WORKFLOW.md` is stable pointer)
- `docs/policies/commit-strategy.md` (canonical; `COMMIT_STRATEGY.md` is stable pointer)
- `docs/policies/branching-tagging-strategy.md` (canonical; `BRANCHING_TAGGING_STRATEGY.md` is stable pointer)
- `docs/policies/pr-review-merge-strategy.md` (canonical; `PR_REVIEW_MERGE_STRATEGY.md` is stable pointer)
- `docs/governance-map.md`

Working defaults:

1. Start from `main`.
2. Create one branch per task (`t###-short-slug`).
3. Keep one PR per task.
4. Add/update tests with implementation changes.
5. Run validation before PR merge.
6. Update `TASKS.md` status/history on completion.

## Task tracking policy

`TASKS.md` is the active tracker for project work and release-readiness findings.
`TASKS_ARCHIVED.md` stores archived (`[h]`) historical task records.

- Keep IDs stable; never renumber.
- Use statuses consistently:
  - `[p]` ready-proposed (triaged and ready for implementation)
  - `[ ]` not done
  - `[~]` in progress
  - `[!]` blocked (must include blocker + unblock plan)
  - `[x]` complete (not yet archived)
  - `[h]` archived complete (in `TASKS_ARCHIVED.md`)
- When a task closes, assess for gaps and add/update follow-up tasks immediately.
- Keep `TASKS.md` `Current execution state` accurate (active phase, milestone target, in-progress list, and next tasks).

Task discovery:

- Use `TASK_DISCOVERY_WORKFLOW.md` when asked to discover new development tasks.
- Discovery runs manually on user request and can auto-add up to 10 `[p]` ready-proposed tasks.

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

## Template eval harness

Use the baseline harness to score template quality signals over time:

```bash
pnpm templates:eval
```

- Dataset: `docs/templates/eval-dataset.json`
- Sample templates: `docs/templates/samples/*.md`
- Add a new eval case by appending to `cases[]` with:
  - `taskName`
  - `templatePath` (relative to dataset file)
  - `checks[]` (`includes` or `regex` with optional penalty)

## Validation expectations

At minimum for implementation PRs:

- `pnpm check`
- `pnpm lint`
- `pnpm format:check`
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
- validates task-tracker schema and workflow/script release contracts,
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
2. Run `Release Candidate Validation` workflow from `main` and capture `run_id`.
3. Trigger release via:
   - `pnpm release:handoff -- --readme-status updated --docs-status updated --docs-sync-notes "docs verified" --rc-run-id <run_id>`
   - or manual `Release` workflow dispatch with the same inputs.
4. Provide required docs sync and RC inputs (`readme_status`, `docs_status`, `docs_sync_notes`, `rc_run_id`).

The release workflow then performs versioning/tagging/release publication as defined in `RELEASE_STRATEGY.md`.

Runtime-policy note:

- Release/RC workspace setup uses Node-24-ready GitHub Actions versions (`actions/checkout@v5`, `actions/setup-node@v5`, `actions/upload-artifact@v5`) and CLI-based release publish to avoid Node 20 deprecation paths.

### Change-based cadence and timing rules

- Do not release on a fixed calendar.
- Promote to RC/release based on pending changesets, shipped change risk/volume, and readiness state.
- If additional release-significant commits land after a successful RC, run RC again before release dispatch.
- Any accepted medium/high risk must be documented in `TASKS.md` with approver, rationale, scope, and sunset date.

### Stage 3: Publish VS Code Marketplace listing (optional, post-release)

Run this after a release tag exists and the extension version matches that tag:

1. Add repository secret `VSCE_PAT` with a Visual Studio Marketplace token that can publish updates.
2. Dispatch workflow `Publish VS Code Marketplace`.
3. Set `release_tag` to the released tag (`vX.Y.Z`).
4. The workflow validates version parity, packages the VSIX, and publishes to Marketplace.

## Security checks

QuickTask enforces dependency and supply-chain checks in CI:

- `Security / dependency-review` fails PRs on high-severity findings when dependency graph is available.
- Dependency-review fallback is allowed only when GitHub dependency-graph is platform-unavailable; this is summarized in workflow output.
- `Security / audit` fails on known high/critical vulnerabilities.

Run locally before opening a dependency-heavy PR:

```bash
pnpm audit --prod --audit-level high
```

## Governance and guardrails

Repository governance is codified through:

- `CODEOWNERS` for critical path ownership
- `.github/workflows/pr-guardrails.yml` for release-note/changeset checks on release-relevant PRs
- `docs/repository-settings-checklist.md` for required branch protection and check settings

Package manager policy:

- Source of truth is `package.json#packageManager`.
- CI and release workflows must pin the same `pnpm` version.
- Validate with `pnpm check:package-manager`.
- Keep `README.md` support floors aligned with workflow/package policy via `pnpm check:support-matrix`.
- Enforce distributable package metadata policy with `pnpm check:package-compliance`.
- Enforce generated artifact policy with `pnpm check:generated-artifacts`.

Generated artifact policy:

- Generated declarations (`*.d.ts`) are build outputs only and must not be tracked in source directories.
- Build/release artifacts under `artifacts/` are ephemeral local/CI outputs unless explicitly documented otherwise.
- If artifact policy changes, update policy references in `docs/governance-map.md` in the same PR.

Diagnostics and logging policy:

- Runtime diagnostics must stay local-only in process memory.
- Never log raw user prompts, template bodies, or other potentially sensitive content.
- Add privacy-focused tests when touching diagnostics, runtime errors, or adapter fallback rendering.

## Changelog and release-note writing standard

QuickTask changelog content is produced from Changesets (`pnpm release:version`) and GitHub generated release notes (`.github/release.yml` categories).

When writing a changeset summary, always use these sections:

- `New Features`
- `Bug Fixes`
- `Internal Improvements`
- `Breaking Changes`

Rules:

- Include `- None.` in empty sections.
- Call out breaking changes explicitly, with migration steps when needed.
- Prefer plain language focused on user impact over implementation details.
- Add PR labels that match release categories so generated GitHub notes remain readable.

## Documentation map

- User-facing usage: `README.md`
- Contributor workflow: `CONTRIBUTORS.md` (this file)
- Release policy: `RELEASE_STRATEGY.md`
- Pre-release readiness flow: `PRE_RELEASE_READINESS_WORKFLOW.md`
- Governance source map: `docs/governance-map.md`
- Cursor command entrypoints:
  - `.cursor/commands/qt.md`
  - `.cursor/commands/prepare-release.md`
  - `.cursor/commands/discover-tasks.md`
