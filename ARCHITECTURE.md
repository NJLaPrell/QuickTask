# QuickTask architecture

## Monorepo layout

- `packages/core`: shared parser, store, template helpers, runtime
- `packages/vscode-extension`: VS Code wrapper
- `packages/openclaw-plugin`: OpenClaw wrapper
- `.cursor/commands`: Cursor slash command entrypoint

## Runtime flow

1. Parse the `/qt` command.
2. Decide whether the request is help, create, run, or improve.
3. Resolve the task template.
4. Return a host-specific response.

## Current state

The first runtime scaffold currently uses an in-memory store so command behavior can be developed before file persistence is added.
