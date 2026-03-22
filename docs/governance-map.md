# QuickTask Governance Map

This map defines where each governance policy is canonical to reduce copy drift.

## Canonical policy docs

- Commit behavior: `docs/policies/commit-strategy.md`
- Branching/tagging: `docs/policies/branching-tagging-strategy.md`
- PR review and merge gates: `docs/policies/pr-review-merge-strategy.md`
- Task execution loop: `docs/workflows/task-pr-delivery-workflow.md`
- Release policy and cadence: `RELEASE_STRATEGY.md`
- Pre-release readiness workflow: `PRE_RELEASE_READINESS_WORKFLOW.md`
- Active planning and risk acceptance records: `TASKS.md`

## Stable pointer docs (reference aliases)

- `COMMIT_STRATEGY.md`
- `BRANCHING_TAGGING_STRATEGY.md`
- `PR_REVIEW_MERGE_STRATEGY.md`
- `TASK_PR_DELIVERY_WORKFLOW.md`

## Reference-only locations

- `.cursor/rules/*.mdc` should summarize behavior and reference canonical docs above (not duplicate full policy text).
- `CONTRIBUTORS.md` should provide contributor-facing guidance and links, not duplicate full policy text.
- `.cursor/commands/*.md` should remain short command wrappers and link to canonical docs.

## Update rule

When policy changes:

1. Update the canonical policy document first.
2. Update references (`CONTRIBUTORS.md`, `.cursor/rules/*.mdc`, command docs) in the same PR.
3. Run `pnpm docs:check-links` to catch broken references.
