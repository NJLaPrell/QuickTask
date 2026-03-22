# Branching And Tagging Strategy

Canonical source for branch and release tag policy.

## Branching

- Trunk-based with `main` as the primary branch.
- Task branches use `t###-short-slug`.
- Keep one task per branch by default.

## Merging

- Prefer squash merge.
- Merge only after required checks pass.

## Tags

- Production tags only: `vMAJOR.MINOR.PATCH`.
- Create tags from `main` release commits.
