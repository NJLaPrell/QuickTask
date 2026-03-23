# Workspace Kit Starter (Phase 3)

This starter is the Phase 3 package-primary bootstrap path.

## 5-minute local init flow

1. Copy this starter into a clean working directory.
2. Install dependencies in the starter workspace:

```bash
pnpm install
```

3. Apply package-managed canonical assets:

```bash
pnpm workspace-kit:upgrade
```

4. Generate profile-driven project context snippets:

```bash
pnpm workspace-kit:init
```

5. Validate:

```bash
pnpm workspace-kit:check
pnpm workspace-kit:doctor
```

When you update `workspace-kit.profile.json` (for example changing `project.name`), rerun `pnpm workspace-kit:init` and `pnpm workspace-kit:drift-check`.

## Included starter contract files

- `workspace-kit.profile.json`
- `package.json`
- `README.md`

`workspace-kit:upgrade` materializes package-managed canonical files and generated context outputs in the target workspace.
