# QuickTask Task Delivery PR Loop

This workflow applies to all tasks unless the user explicitly overrides it.

## Standard execution loop

1. Create a task branch from `main` using `t###-short-slug`.
2. Implement the task, including tests and validation.
3. Open a PR for the task.
4. Perform a PR review and leave a review comment (findings-first with severity).
5. If changes are required:
   - implement fixes,
   - commit and push,
   - leave a follow-up PR comment,
   - repeat review until no blockers remain.
6. Merge to `main` only when:
   - required checks are green (tests, typecheck, lint/format),
   - no blocking findings remain.
7. Update `TASKS.md` status/evidence and provide a user summary.
8. Archive completed records during archive cadence by moving them to `TASKS_ARCHIVED.md`.
9. After task closure, review the implemented changes for scope impact; create follow-up tasks or update existing tasks in `TASKS.md` when gaps are discovered.

## Required automation behavior for AI

- Default to full loop execution when user asks to complete a task.
- Do not skip PR review comments.
- Do not merge with unresolved blockers.
- Use Conventional Commit messages and task-scoped branch names.
- Use GitHub MCP tools first for PR actions and comments; use CLI only when MCP is unavailable.

## PR comment expectations

Use findings-first format:

1. Blocking findings (`high`) with required fixes.
2. Non-blocking findings (`medium`/`low`).
3. Open questions/assumptions.
4. Merge recommendation (approve/request changes) with rationale.
