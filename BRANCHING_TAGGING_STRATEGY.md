# QuickTask Branching And Tagging Strategy

This repository uses a trunk-based workflow with short-lived task branches and semantic version tags.

## Branching model

- Primary branch: `main`
- Working branches: short-lived task branches from `main`
- No long-lived `develop` branch

## Branch naming

Use:

- `t###-short-slug`

Examples:

- `t004-template-creation-flow`
- `t021-lint-format-quality-gates`

## Merge policy

- Merge method: squash merge only
- Keep one PR per task by default
- Require passing checks before merge

## Release tagging

Tag format:

- `vMAJOR.MINOR.PATCH`

Examples:

- `v0.1.0`
- `v0.1.1`

Tag trigger:

- Create tags only for production releases from `main`
- Do not tag every merge

## Hotfix flow

For urgent fixes:

1. Create a hotfix branch from `main` (use a task-style branch name).
2. Open a fast-track PR with focused patch scope.
3. Squash merge into `main` after validation.
4. Create a patch tag (for example `v0.1.2`).

## AI execution rules

- Always branch from `main` using `t###-short-slug`.
- Keep changes scoped to one task per branch.
- Prefer squash-merge-ready history.
- Tag only when preparing a production release from `main`.
