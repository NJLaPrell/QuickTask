# Workspace Kit Starter (Phase 2)

This starter is the Phase 2 bootstrap path for workspace-kit template adoption.

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

4. Run init to generate profile-driven project context snippets:

```bash
node "<quicktask-repo>/packages/workspace-kit/dist/cli.js" init
```

This creates:

- `.workspace-kit/generated/project-context.json`
- `.cursor/rules/workspace-kit-project-context.mdc`

When you update `workspace-kit.profile.json` (for example changing `project.name`), rerun `init` to regenerate these outputs.

## Included starter contract files

- `workspace-kit.profile.json`
- `schemas/workspace-kit-profile.schema.json`
- `.workspace-kit/manifest.json`
- `.workspace-kit/owned-paths.json`
- `.cursor/rules/workspace-kit-profile-pointer.mdc`

These files are intentionally minimal for Phase 2 and will evolve as init/upgrade behavior is implemented.
