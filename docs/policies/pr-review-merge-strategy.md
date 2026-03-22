# PR Review And Merge Strategy

Canonical source for review posture and merge gates.

## Findings-first output

- Report `high` findings first, then `medium`/`low`, then open questions.
- Include file context, risk, and recommended fix direction.

## Blockers

- Any unresolved `high` finding blocks merge.
- Any failing required check blocks merge.

## Required checks

- tests
- typecheck
- lint/format

## Accepted risk

- Medium/high findings accepted without fix require a `TASKS.md` accepted-risk record (approver, rationale, scope, sunset date).
