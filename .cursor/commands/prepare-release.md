---
description: Prepare QuickTask release readiness before release workflow handoff
---

Run the pre-release readiness workflow from `PRE_RELEASE_READINESS_WORKFLOW.md`.

Required command:

```bash
pnpm release:prepare
```

Then:

1. Read `docs/release-readiness-report.md`.
2. Convert medium/high findings into `TASKS.md` updates (existing task updates first, new tasks when needed).
3. Keep phase assignment manual for any newly added task.
4. Do not create GitHub issues for this flow.
5. If no medium/high findings remain, handoff to `RELEASE_STRATEGY.md`.
