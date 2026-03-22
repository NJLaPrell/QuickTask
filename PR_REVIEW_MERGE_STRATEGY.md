# QuickTask PR Review And Merge Strategy

This repository uses a strict, findings-first PR review process with explicit merge gates.

## Review posture

- Default review mode is strict.
- Present findings first, ordered by severity.
- Severity levels:
  - `high`: correctness, security, data loss, breaking behavior
  - `medium`: meaningful reliability or maintainability risk
  - `low`: minor issues, nits, or non-blocking improvements

## AI review output format

When reviewing a PR, report in this order:

1. Blocking findings (if any), with severity and clear rationale.
2. Non-blocking findings, ordered by severity.
3. Open questions/assumptions.
4. Brief summary of overall risk.

Each finding should include:

- affected file(s),
- what is wrong and why it matters,
- recommended fix direction.

## Merge blockers

A PR is blocked if either condition is true:

1. Any `high` severity finding is unresolved.
2. Any required check is failing.

Medium findings are non-blocking by default, but medium/high findings cannot be silently bypassed for release readiness. If such findings are accepted instead of fixed, record acceptance in `TASKS.md` with approver, rationale, scope, and sunset date.

## Required checks before merge

- Tests pass
- Typecheck pass
- Lint/format checks pass

## Approval policy

- AI can auto-recommend approval only for low-risk PRs.
- For medium/high-risk PRs, AI should recommend request-changes or explicit human review.
- Human reviewers retain final approval and merge decision.
- Human maintainer approval is required for accepted medium/high risk records.

## Merge policy

Merge is allowed only when:

- all required checks are green, and
- there are no unresolved blocking findings.

## AI execution rules

- On "review this PR", always apply strict findings-first output.
- Never hide blocking findings behind summary text.
- If no findings exist, state that explicitly and mention residual risks/testing gaps.
- Do not recommend merge when blockers exist.
- Use GitHub MCP tools for PR reads/comments/merge when available; use CLI only as fallback.
