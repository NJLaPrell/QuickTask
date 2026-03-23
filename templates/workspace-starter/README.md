# Workspace Kit Starter (Phase 1)

This starter is the Phase 1 bootstrap path for workspace-kit template adoption.

## 5-minute local init flow

1. Copy this starter into a clean working directory.
2. Build the local workspace-kit package from the QuickTask repo root:

```bash
pnpm --filter quicktask-workspace-kit build
```

3. Run the local CLI doctor from the target workspace root:

```bash
node "<quicktask-repo>/packages/workspace-kit/dist/cli.js" doctor
```

4. Run the init placeholder command:

```bash
node "<quicktask-repo>/packages/workspace-kit/dist/cli.js" init
```

## Included starter contract files

- `workspace-kit.profile.json`
- `schemas/workspace-kit-profile.schema.json`
- `.workspace-kit/manifest.json`
- `.workspace-kit/owned-paths.json`

These files are intentionally minimal for Phase 1 and will evolve as init/upgrade behavior is implemented.
