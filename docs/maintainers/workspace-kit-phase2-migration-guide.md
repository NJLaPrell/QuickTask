# Workspace Kit Phase 2 Migration Guide

This guide moves a workspace from hand-maintained project identity strings to profile-driven workspace-kit outputs.

## Goal

- Keep project identity in one place (`workspace-kit.profile.json`).
- Generate project-context snippets from the profile instead of hardcoding names in rule files.
- Validate profile structure in local/CI checks.

## Migration flow

1. Ensure canonical kit files exist:
   - `workspace-kit.profile.json`
   - `schemas/workspace-kit-profile.schema.json`
   - `.workspace-kit/manifest.json`
   - `.workspace-kit/owned-paths.json`
2. Validate the profile:

```bash
node "<quicktask-repo>/packages/workspace-kit/dist/cli.js" check
```

3. Generate profile-driven project context:

```bash
node "<quicktask-repo>/packages/workspace-kit/dist/cli.js" init
```

4. Confirm generated outputs exist:
   - `.workspace-kit/generated/project-context.json`
   - `.cursor/rules/workspace-kit-project-context.mdc`
5. Update any manually maintained project-name rule text to reference generated context.
6. Re-run validation:

```bash
node "<quicktask-repo>/packages/workspace-kit/dist/cli.js" doctor
node "<quicktask-repo>/packages/workspace-kit/dist/cli.js" check
```

## Pilot evidence command

Run the repeatable pilot harness from repo root:

```bash
pnpm workspace-kit:phase2:pilot-adoption-check
```

The script creates a non-QuickTask fixture under `artifacts/workspace-kit-fixtures/phase2-pilot-adoption`, sets `project.name` to `phase2-pilot-non-quicktask`, and verifies `init`, `check`, and `doctor` all pass with generated outputs aligned to the profile.
