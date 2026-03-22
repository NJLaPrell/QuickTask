# Task PR Delivery Workflow

Canonical source for task delivery execution loop.

## Loop

1. Branch from `main` using `t###-short-slug`.
2. Implement task scope + tests + validation.
3. Open PR.
4. Review with findings-first format.
5. Fix blockers and re-review until clear.
6. Merge only with green required checks and no blockers.
7. Post-merge cleanup: delete task branches, switch local repo to `main`, fast-forward sync.
8. Update `TASKS.md` status/evidence and `Current execution state`.

## Low-risk fast-lane policy

Use fast-lane only when all criteria are true:

| Criterion      | Required value                                                               |
| -------------- | ---------------------------------------------------------------------------- |
| Task priority  | `P2` or lower                                                                |
| Scope          | docs/rules/workflow text only (no runtime/adapter/workflow behavior changes) |
| Release impact | no changeset required, no release-contract drift                             |
| Risk class     | no medium/high findings introduced                                           |

Fast-lane minimum validation:

1. `pnpm tasks:check`
2. `pnpm docs:check-links`
3. `pnpm release:check-workflow-contracts` (when workflow/policy docs touched)

Fast-lane exclusions (must use full loop validations):

- Any change under `packages/**`
- Any `.github/workflows/**` or release script changes
- Contract updates (`docs/qt-command-result-contract.md`, `docs/qt-adapter-rendering-matrix.md`)
- Security/compliance policy or support-floor changes
