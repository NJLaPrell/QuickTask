# Workspace Kit Phase 3 Publish Handoff

This handoff defines publish-readiness checks for the package-primary distribution phase without performing an actual registry publish.

## Readiness command

Run from repository root:

```bash
pnpm workspace-kit:phase3:publish-readiness-check
```

The command performs:

1. `pnpm --filter quicktask-workspace-kit build`
2. `pnpm --filter quicktask-workspace-kit pack:dry-run`
3. `pnpm release:validate-changesets`

It then prints JSON evidence including:

- `packageVersion`
- generated tarball list in `artifacts/workspace-kit-pack`
- explicit `humanGates` items for publish handoff

## Human-only gates (must remain human triggered)

1. Provide registry credentials and publish permissions.
2. Trigger publish/tag/release workflow per `RELEASE_STRATEGY.md`.
3. Confirm docs synchronization gate inputs before release publication.

## Evidence capture

Record the JSON output from `workspace-kit:phase3:publish-readiness-check` in the active task block when closing Phase 3 package-readiness work.
