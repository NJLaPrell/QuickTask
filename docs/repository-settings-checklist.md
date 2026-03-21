# Repository Settings Checklist

Use this checklist to verify platform-level governance and release guardrails.

## Branch protection (`main`)

- Require pull request before merging.
- Require at least 1 approval.
- Dismiss stale approvals when new commits are pushed.
- Require conversation resolution before merge.
- Restrict direct pushes to `main`.
- Require status checks to pass before merge.

Recommended required checks:

- `CI / verify`
- `Security / dependency-review`
- `Security / audit`
- `PR Guardrails / changeset-required`

## Ownership and review

- `CODEOWNERS` is enabled and points critical paths to maintainers.
- Automatic code owner review requests are enabled.
- Release workflow and core runtime files require code owner approval.

## Release safety controls

- Release workflow remains `workflow_dispatch` only.
- Release workflow is limited to `main` branch.
- Tags follow `vMAJOR.MINOR.PATCH`.
- Environment and repository secrets are limited to required maintainers.

## Audit cadence

- Re-check this list when adding new workflows or release paths.
- Record major governance changes in `TASKS.md` task history or task updates.
