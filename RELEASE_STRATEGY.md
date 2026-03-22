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
- RC validation: required via `Release Candidate Validation` workflow before final release dispatch.
- Release publication: auto-publish GitHub Release (no draft step).
- Current release assets: VSIX, OpenClaw package, checksums, integrity metadata, SBOM.

## Change-based release cadence policy

QuickTask uses a change-driven release cadence, not a calendar schedule.

Promote to release candidate (`Release Candidate Validation`) when all of the following are true:

1. `main` has at least one pending `.changeset/*.md` entry.
2. There are no unresolved release-governance blockers in `TASKS.md` for the active release phase, or those blockers have explicit accepted-risk records.
3. At least one trigger condition is met:
   - a merged `P0` or `P1` user-impacting task is waiting to ship, or
   - pending changesets count is 3 or more, or
   - a security/compliance fix is included.

Promote from RC to release dispatch when all of the following are true:

1. RC workflow run succeeded on `main`.
2. RC run is still fresh for the current candidate (run again after additional release-significant merges).
3. Pre-release readiness report is `READY`, or blocking findings are explicitly accepted per risk policy.

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
   - Readiness now includes a changeset preflight check (`pending .changeset/*.md`).
3. Run a prerelease README audit:
   - update `README.md` to cover any missing user-facing documentation for shipped behavior,
   - follow `README_EDITING.md` while editing `README.md`.
4. Treat only new medium/high findings for the current release phase as blocking unless explicitly accepted via the risk acceptance policy.
5. Convert findings into `TASKS.md` updates:
   - update existing tasks when applicable,
   - add new tasks with manual phase/priority assignment when unmapped.

This gate uses `TASKS.md` as the issue system (no GitHub issues for this flow).

## Release checklist (manual dispatch)

1. Confirm all intended PRs are merged into `main`.
2. Confirm pre-release readiness gate is green (or explicitly accepted by the user).
   - Confirm accepted risks (if any) include approver, rationale, scope, and sunset date in `TASKS.md`.
3. Run `Release` workflow manually with docs sync inputs.
   - Include a successful `rc_run_id` from `Release Candidate Validation`.
4. Workflow gates:
   - run `pnpm check`
   - run `pnpm test`
   - run `pnpm build`
   - run `pnpm release:validate-changesets`
   - run `pnpm release:check-workflow-contracts`
   - run `pnpm release:docs-check`
5. Workflow builds curated release notes and versions packages/changelogs with `pnpm release:notes` + `pnpm release:version`.
6. Workflow builds and verifies release assets using:
   - `pnpm package:release`
   - `pnpm release:verify-local-artifacts`
7. Workflow creates:
   - release commit on `main`
   - semantic tag `vX.Y.Z`
   - published GitHub Release for `vX.Y.Z`
8. Release notes combine curated user-focused notes with GitHub generated notes.
   - GitHub note categories are configured in `.github/release.yml`.
9. Post-release workflow verifies downloaded published assets.

## Docs sync gate policy

The release workflow requires explicit docs status inputs:

- `readme_status`: `updated` or `no-change`
- `docs_status`: `updated` or `no-change`
- `docs_sync_notes`: required whenever any status is `no-change`

This provides hard gating: the release cannot proceed without explicit docs sync decisions.

## Formal risk acceptance policy

Medium/high findings are blocking by default. They can only be bypassed through an explicit accepted-risk record in `TASKS.md`.

Each accepted-risk record must include:

- Finding/task ID and severity.
- Approver (human maintainer identity).
- Decision date.
- Scope of acceptance (what is allowed to ship).
- Rationale and mitigation plan.
- Sunset/revisit date.

Accepted risk is temporary. If the sunset date passes, release handoff is blocked until the finding is re-reviewed.

## Release baseline policy

- First public release baseline is fixed at `v0.1.0`.
- If no existing `v*` tags exist, the release workflow enforces `0.1.0`.
- All subsequent releases must be stable semver (`X.Y.Z`) and `>= 0.1.0`.
- Enforcement command: `pnpm release:check-baseline`.

## Scope notes

- RC builds are validation-only and do not publish final releases.
- VS Code Marketplace publication runs through a separate manual workflow:
  - workflow: `Publish VS Code Marketplace`
  - dispatch input: `release_tag` (`vX.Y.Z`)
  - required repository secret: `VSCE_PAT` (Visual Studio Marketplace personal access token with publish scope)
  - behavior: checks out the release tag, validates the tag matches `packages/vscode-extension/package.json` version, packages VSIX, and publishes with `vsce`.

Marketplace publishing remains decoupled from the GitHub release workflow so release tagging/publication and marketplace rollout can be controlled independently.
