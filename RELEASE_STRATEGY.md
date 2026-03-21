# QuickTask Release Strategy

This document defines the production release process for QuickTask.

## Goals

- Ship reproducible releases from `main`.
- Generate changelogs and GitHub release notes consistently.
- Keep `README.md` and docs aligned with shipped behavior.
- Use semantic version tags in the form `vMAJOR.MINOR.PATCH`.

## Release model

- Versioning model: fixed lockstep for all workspace packages.
- Trigger: manual `workflow_dispatch` release workflow from `main`.
- Changelog engine: Changesets.
- Prerelease channel: not enabled yet.
- Release publication: auto-publish GitHub Release (no draft step).
- Current release assets: source-only (packaged install artifacts are tracked separately).

## Pre-merge release requirements

Each release-relevant PR should include:

1. A changeset entry (`pnpm changeset`) for user-visible changes.
   - Structure changeset summaries with:
     - `New Features`
     - `Bug Fixes`
     - `Internal Improvements`
     - `Breaking Changes` (explicitly `None.` when not applicable)
2. Documentation updates when behavior changes:
   - `README.md` for user-facing usage/install/release flow changes.
   - files under `docs/` for contract/reference behavior changes.
3. Test/typecheck/lint/build checks passing.
4. PR labels aligned to release-note categories when applicable:
   - `breaking-change`, `semver-major`
   - `feature`, `enhancement`, `semver-minor`
   - `bug`, `fix`, `bugfix`, `semver-patch`

## Pre-release readiness gate (chat-triggered)

Before running the `Release` workflow, run pre-release readiness:

1. Ask the assistant to prepare release readiness, or run `pnpm release:prepare`.
   - Scope is always full-product (`all phases`); there is no per-phase mode.
2. Review `docs/release-readiness-report.md`.
3. Run a prerelease README audit:
   - update `README.md` to cover any missing user-facing documentation for shipped behavior,
   - follow `README_EDITING.md` while editing `README.md`.
4. Treat only new medium/high findings for the current release phase as blocking.
5. Convert findings into `TASKS.md` updates:
   - update existing tasks when applicable,
   - add new tasks with manual phase/priority assignment when unmapped.

This gate uses `TASKS.md` as the issue system (no GitHub issues for this flow).

## Release checklist (manual dispatch)

1. Confirm all intended PRs are merged into `main`.
2. Confirm pre-release readiness gate is green (or explicitly accepted by the user).
3. Run `Release` workflow manually with docs sync inputs.
4. Workflow gates:
   - run `pnpm check`
   - run `pnpm test`
   - run `pnpm build`
   - run `pnpm release:docs-check`
5. Workflow versions packages and changelogs with `pnpm release:version`.
6. Workflow creates:
   - release commit on `main`
   - semantic tag `vX.Y.Z`
   - published GitHub Release for `vX.Y.Z`
7. Release notes come from GitHub generated notes and the repository changelogs.
   - GitHub note categories are configured in `.github/release.yml`.

## Docs sync gate policy

The release workflow requires explicit docs status inputs:

- `readme_status`: `updated` or `no-change`
- `docs_status`: `updated` or `no-change`
- `docs_sync_notes`: required whenever any status is `no-change`

This provides hard gating: the release cannot proceed without explicit docs sync decisions.

## Scope limits for current phase

- No prerelease (`rc`/`beta`) path yet.
- No packaged release assets (VSIX/OpenClaw artifact) yet.
- Marketplace publishing is out of scope for this workflow.

Those flows are tracked by release backlog tasks in `TASKS.md`.
