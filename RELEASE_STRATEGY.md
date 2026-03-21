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
2. Documentation updates when behavior changes:
   - `README.md` for user-facing usage/install/release flow changes.
   - files under `docs/` for contract/reference behavior changes.
3. Test/typecheck/lint/build checks passing.

## Release checklist (manual dispatch)

1. Confirm all intended PRs are merged into `main`.
2. Run `Release` workflow manually with docs sync inputs.
3. Workflow gates:
   - run `pnpm check`
   - run `pnpm test`
   - run `pnpm build`
   - run `pnpm release:docs-check`
4. Workflow versions packages and changelogs with `pnpm release:version`.
5. Workflow creates:
   - release commit on `main`
   - semantic tag `vX.Y.Z`
   - published GitHub Release for `vX.Y.Z`
6. Release notes come from GitHub generated notes and the repository changelogs.

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
