# QuickTask Pre-Release Readiness Workflow

This workflow defines everything that happens before the `Release` workflow takes over.

## Intent

- Triggered by asking the chat assistant to prepare a release.
- Runs full-hardening validation in the current repo state.
- Produces a readiness report.
- Converts uncovered medium/high findings into `TASKS.md` task updates (not GitHub issues).
- Stops at the handoff boundary where `RELEASE_STRATEGY.md` begins.

## Blocking policy

- Existing findings already tracked in `TASKS.md`: non-blocking for handoff.
- New `high`/`medium` findings mapped to the current release phase: blocking unless explicitly accepted under the formal risk-acceptance policy.
- New `low` findings: non-blocking.

Current release phase is derived from milestone progress in `TASKS.md` (highest phase with no open tasks).

## Standard execution steps

1. Run:
   - `pnpm release:prepare`
   - Scope is always full-product (`all phases`); there is no per-phase mode.
2. Review `docs/release-readiness-report.md`.
   - Includes changeset preflight (`pending .changeset/*.md` entries).
   - Report writes are stable: timestamp-only deltas do not rewrite the file.
3. Perform a README prerelease audit:
   - update `README.md` with any missing user-facing documentation for shipped behavior,
   - follow `README_EDITING.md` while editing.
4. For each finding:
   - If it maps to an existing task, update that task section in `TASKS.md` with validation evidence.
   - If no task exists, add a new task to `TASKS.md`.
5. For any newly added task:
   - assign phase manually,
   - assign priority manually (`P0` through `P5`),
   - include dependency links where relevant.
6. Re-run `pnpm release:prepare` after changes.
7. When report has no new medium/high findings for the current release phase, handoff to release:
   - follow `RELEASE_STRATEGY.md` manual release checklist.
   - optional single-command handoff: `pnpm release:handoff -- --readme-status <updated|no-change> --docs-status <updated|no-change> --docs-sync-notes "<notes>" --rc-run-id <id>`

## What `pnpm release:prepare` validates

- `pnpm check`
- `pnpm test`
- `pnpm build`
- `pnpm release:docs-check` (with readiness defaults)
- `pnpm tasks:check`
- `pnpm release:check-workflow-contracts`
- pending `.changeset/*.md` release inputs
- Existing open `TASKS.md` tasks across all phases.

## Risk acceptance protocol (medium/high findings)

Use this only when a blocking finding cannot be resolved before release:

1. Add or update a finding task in `TASKS.md`.
2. Record an accepted-risk entry in the `Risk acceptance records` section with:
   - finding/task ID and severity,
   - approver (human maintainer),
   - decision date,
   - scope,
   - rationale/mitigation,
   - sunset/revisit date.
3. Re-run `pnpm release:prepare` and confirm only explicitly accepted blockers remain.
4. Include accepted-risk IDs in release handoff notes for auditability.

## Task system policy (required)

- Use `TASKS.md` as the only issue tracker for this release-readiness flow.
- Do not create or assign GitHub issues.
- Keep phase assignment manual for new findings.

## Artifacts

- Readiness report: `docs/release-readiness-report.md`
- Source scripts: `scripts/release-prepare-readiness.mjs`
- Release handoff policy: `RELEASE_STRATEGY.md`
