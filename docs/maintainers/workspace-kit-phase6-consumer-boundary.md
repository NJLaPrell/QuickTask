# Workspace Kit Phase 6 consumer boundary

This maintainer note defines how QuickTask validates workspace-kit as an external consumer.

## Consumer contract

- QuickTask must validate workspace-kit through packaged artifacts (published version or tagged tarball).
- Consumer checks must run `workspace-kit upgrade`, `workspace-kit init`, `workspace-kit check`, and `workspace-kit doctor` from a fixture workspace.
- Validation must avoid monorepo-relative unpublished kit source wiring as the primary gate.

## Canonical command

Run from repository root:

```bash
pnpm workspace-kit:phase6:consumer-check
```

The command:

1. Creates a package tarball via `pnpm --filter quicktask-workspace-kit pack:dry-run`.
2. Copies the starter fixture.
3. Installs the packed tarball into the fixture.
4. Runs the consumer command chain:
   - `workspace-kit upgrade`
   - `workspace-kit init`
   - `workspace-kit check`
   - `workspace-kit doctor`
5. Emits machine-readable JSON evidence with selected tarball and command outputs.

## CI and readiness policy

- CI (`.github/workflows/ci.yml`, workflow-contracts job) runs `pnpm workspace-kit:phase6:consumer-check`.
- Pre-release readiness (`pnpm release:prepare`) includes the same command as a medium-severity gate.

## Operational note

Phase 6 does not require immediate repository extraction to be considered complete; it requires extraction readiness with validated consumer boundaries and explicit cutover planning.
