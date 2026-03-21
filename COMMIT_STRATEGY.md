# QuickTask Commit Strategy

This repository uses a task-driven commit strategy optimized for both human contributors and AI agents.

For branch lifecycle and release tags, see `BRANCHING_TAGGING_STRATEGY.md`.
For PR review and merge policy, see `PR_REVIEW_MERGE_STRATEGY.md`.

## Core defaults

- Commit message format: Conventional Commits with optional scope.
- Commit granularity: one commit per completed task by default.
- Branch naming: `t###-short-slug` (for example: `t004-template-creation-flow`).
- PR format: standardized title and body with summary and test plan.

## Branch strategy

- Create one branch per task from `TASKS.md`.
- Use the task ID in the branch name.
- Keep branch changes scoped to that task only.

Examples:

- `t002-file-backed-store`
- `t010-vscode-runtime-wiring`

## Commit strategy

### Commit timing

- Default intent: create a commit when a task is complete and validated.
- If a task is risky or has clearly separable concerns, split into a small number of logical commits.
- Avoid mixing unrelated changes in the same commit.

### Commit message format

Use:

`type(scope): short imperative summary`

Recommended types:

- `feat`: user-visible behavior or capability
- `fix`: bug fix or behavior correction
- `refactor`: internal restructuring with no behavior change
- `test`: tests only
- `docs`: documentation only
- `chore`: tooling/config/repo maintenance

Examples:

- `feat(core): add file-backed task template store`
- `fix(parser): return structured incomplete result for /qt improve`
- `test(core): cover template overwrite and not-found store behavior`
- `docs(tasks): archive completed phase-1 tasks`

### Commit body guidance

- Focus on why the change exists and key trade-offs.
- Include test/validation notes when not obvious from diff.
- Keep it concise (1-4 bullets or short paragraphs).

## Pull request strategy

### PR title

- Prefer same style as the main commit:
  - `feat(core): add file-backed task template store`

### PR body template

- `## Summary`
  - 1-3 bullets explaining the intent and impact.
- `## Test plan`
  - checklist of commands and expected outcomes.

### PR scope

- One PR per task unless an explicit multi-task release PR is planned.
- Link the task ID in the PR description.

## AI execution rules

- Read `TASKS.md` before committing or opening a PR.
- Align branch and commit metadata with the active task ID.
- After implementation, tests, and validation:
  - update `TASKS.md` statuses,
  - create a task-scoped commit using the format above.
- If runtime or policy requires explicit user approval before commit, ask for confirmation before executing `git commit`.
