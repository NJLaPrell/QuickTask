# QuickTask Command and Result Contract

This document is the canonical source of truth for:

- supported `/qt` command forms, and
- core runtime result codes returned by `@quicktask/core`.

User-facing docs and host adapter docs should reference this file rather than restating behavior independently.
Adapter rendering behavior by host is defined in `docs/qt-adapter-rendering-matrix.md`.

## Command forms

### Core commands

- `/qt` - show command help.
- `/qt help [topic]` - show contextual help (`create`, `run`, `improve`, `actions`, `discover`).
- `/qt init` - initialize QuickTask first-run assets and guidance.
- `/qt [task] [instructions]` - create a new task template.
- `/qt/[task] [input]` - run an existing task.
- `/qt improve [task] [input]` - propose an improvement.
- `/qt list` - list available task templates.
- `/qt show [task]` - show one task template body.
- `/qt doctor` - show runtime/storage diagnostics.

Quoted task names are supported anywhere a `[task]` argument is accepted. Use double quotes for names with spaces:

- `/qt "incident triage" [instructions]`
- `/qt/"incident triage" [input]`
- `/qt show "incident triage"`
- `/qt improve "incident triage" [input]`

### Improvement action commands

- `/qt improve accept [task] [proposal-id]` - accept and apply a proposed template.
- `/qt improve reject [task] [proposal-id]` - reject a proposed template.
- `/qt improve abandon [task] [proposal-id]` - abandon a proposed template.

## Approved command-surface policy

The approved `/qt` command surface is intentionally minimal:

- help (`/qt`)
- contextual help (`/qt help [topic]`)
- init/bootstrap (`/qt init`)
- create (`/qt [task] [instructions]`)
- run (`/qt/[task] [input]`)
- improve lifecycle (`/qt improve ...`, accept/reject/abandon)
- discovery and diagnostics (`/qt list`, `/qt show [task]`, `/qt doctor`)

Additional command expansions are deferred by default and require explicit re-approval.

## Runtime result codes

`QtRuntimeResult` may return the following codes:

- `qt:help`
- `qt:init:initialized`
- `qt:init:already-initialized`
- `qt:init:partial`
- `qt:create:clarify`
- `qt:create:already-exists`
- `qt:create:created`
- `qt:incomplete`
- `qt:run:not-found`
- `qt:run:executed`
- `qt:list:listed`
- `qt:show:template`
- `qt:doctor:status`
- `qt:improve:not-found`
- `qt:improve:proposal-not-found`
- `qt:improve:proposed`
- `qt:improve:accept:applied`
- `qt:improve:reject:recorded`
- `qt:improve:abandon:recorded`
- `qt:improve:proposal-expired`
- `qt:improve:already-finalized`
- `qt:init:failed`
- `qt:parse:error`
- `qt:storage:error`

### `/qt init` result payload contract

`/qt init` returns deterministic status codes so adapters can render first-run flows consistently:

- `qt:init:initialized`
  - Meaning: first-run bootstrap completed and required assets were created.
  - Required fields: `status`, `createdAssets[]`, `skippedAssets[]`, `nextCommands[]`, `message`.
- `qt:init:already-initialized`
  - Meaning: idempotent repeat run; required assets were already present.
  - Required fields: `status`, `createdAssets[]`, `skippedAssets[]`, `nextCommands[]`, `message`.
- `qt:init:partial`
  - Meaning: bootstrap completed with non-fatal skips or warnings that need user attention.
  - Required fields: `status`, `createdAssets[]`, `skippedAssets[]`, `warnings[]`, `nextCommands[]`, `message`.
- `qt:init:failed`
  - Meaning: bootstrap could not complete due to storage/setup failure.
  - Required fields: `diagnosticCode`, `requestId`, `message`.

## Proposal lifecycle storage policy

- Improve proposals are persisted to `.quicktask/proposals.json`.
- Active proposals are restored on runtime startup when not expired.
- Proposal actions use a TTL window (default 30 minutes in runtime) and return `qt:improve:proposal-expired` when stale.
- When no active proposal exists (expired/finalized/missing), runtime returns `qt:improve:proposal-not-found`.
- Expired proposals and surplus finalized proposals are garbage-collected to keep persisted proposal state bounded.

## Diagnostics and privacy policy

- Runtime diagnostic events are local-only and in-memory.
- Diagnostic events include operational metadata only (`requestId`, timestamp, lifecycle phase, command kind, result code).
- Do not include raw user input, template bodies, or other user-content fields in diagnostics.
- Adapter unknown-result fallbacks must avoid dumping full payloads to output surfaces.

## Lightweight drift-check checklist

When command parsing or result types change:

1. Update `packages/core/src/types.ts` and parser/runtime tests.
2. Update this document in the same PR.
3. Update `README.md` command examples if user-facing commands changed.
4. Update `docs/qt-adapter-rendering-matrix.md` when result codes or payload shapes change.
5. Link host adapter docs to these canonical docs instead of duplicating command/result details.
