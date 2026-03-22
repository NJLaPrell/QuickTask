# QuickTask Governance Map

This map defines where each governance policy is canonical to reduce copy drift.

## Canonical policy docs

- Commit behavior: `COMMIT_STRATEGY.md`
- Branching/tagging: `BRANCHING_TAGGING_STRATEGY.md`
- PR review and merge gates: `PR_REVIEW_MERGE_STRATEGY.md`
- Task execution loop: `TASK_PR_DELIVERY_WORKFLOW.md`
- Release policy and cadence: `RELEASE_STRATEGY.md`
- Pre-release readiness workflow: `PRE_RELEASE_READINESS_WORKFLOW.md`
- Active planning and risk acceptance records: `TASKS.md`

## Reference-only locations

- `.cursor/rules/*.mdc` should summarize behavior and reference the canonical docs above.
- `CONTRIBUTORS.md` should provide contributor-facing guidance and links, not duplicate full policy text.
- `.cursor/commands/*.md` should remain short command wrappers and link to canonical docs.

## Update rule

When policy changes:

1. Update the canonical policy document first.
2. Update references (`CONTRIBUTORS.md`, `.cursor/rules/*.mdc`, command docs) in the same PR.
3. Run `pnpm docs:check-links` to catch broken references.
