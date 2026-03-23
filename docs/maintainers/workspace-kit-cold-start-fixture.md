# Workspace Kit Phase 1 Cold-Start Fixture

This maintainer note defines the repeatable fixture used for Phase 1 doctor validation evidence.

## Canonical fixture path

- `artifacts/workspace-kit-fixtures/phase1-cold-start`

## Source template

- `templates/workspace-starter`

## Validation command

Run from repository root:

```bash
pnpm workspace-kit:phase1:cold-start-check
```

The command:

1. Recreates the fixture directory from `templates/workspace-starter`.
2. Builds the local workspace-kit CLI package.
3. Runs `workspace-kit upgrade` and `workspace-kit init` in the fixture workspace.
4. Runs `workspace-kit doctor` in the fixture workspace.
5. Prints JSON output containing `fixtureRoot`, `upgradeOutput`, `initOutput`, and `doctorOutput`.

Use this output in `TASKS.md` evidence when validating Phase 1 completion and 1 -> 2 promotion readiness.
