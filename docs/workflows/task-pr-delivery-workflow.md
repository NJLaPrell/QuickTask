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
