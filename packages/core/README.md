# @quicktask/core

Shared QuickTask runtime package used by VS Code, Cursor wrappers, and OpenClaw adapters.

## What this package owns

- `/qt` command parsing (`parseQtCommand`)
- Runtime command execution and proposal lifecycle (`createQtRuntime`)
- Task template file storage helpers (`createFileTaskStore`, `saveTaskTemplate`, `getTaskTemplate`)
- Shared result rendering contracts consumed by host adapters

## Build and test

```bash
pnpm --filter @quicktask/core build
pnpm --filter @quicktask/core test
```

## Contract references

- Command/result contract: `../../docs/qt-command-result-contract.md`
- Adapter rendering matrix: `../../docs/qt-adapter-rendering-matrix.md`
