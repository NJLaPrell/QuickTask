# Workspace Kit Phase 3 Package Cold-Start Fixture

This maintainer note defines the repeatable package-primary cold-start fixture used for Phase 3 evidence.

## Canonical fixture path

- `artifacts/workspace-kit-fixtures/phase3-package-cold-start`

## Source template

- `templates/workspace-starter`

## Validation command

Run from repository root:

```bash
pnpm workspace-kit:phase3:package-cold-start-check
```

The command:

1. Recreates the fixture directory from `templates/workspace-starter`.
2. Builds the local workspace-kit CLI package.
3. Runs `workspace-kit upgrade` in the fixture.
4. Runs `workspace-kit init`, `workspace-kit check`, and `workspace-kit doctor`.
5. Prints JSON output containing fixture path and command outputs.

Use this output in `TASKS.md` evidence when validating Phase 3 package-primary starter alignment.
