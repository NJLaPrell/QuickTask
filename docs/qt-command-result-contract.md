# QuickTask Command and Result Contract

This document is the canonical source of truth for:

- supported `/qt` command forms, and
- core runtime result codes returned by `@quicktask/core`.

User-facing docs and host adapter docs should reference this file rather than restating behavior independently.

## Command forms

### Core commands

- `/qt` - show command help.
- `/qt [task] [instructions]` - create a new task template.
- `/qt/[task] [input]` - run an existing task.
- `/qt improve [task] [input]` - propose an improvement.

### Improvement action commands

- `/qt improve accept [task] [proposal-id]` - accept and apply a proposed template.
- `/qt improve reject [task] [proposal-id]` - reject a proposed template.
- `/qt improve abandon [task] [proposal-id]` - abandon a proposed template.

## Runtime result codes

`QtRuntimeResult` may return the following codes:

- `qt:help`
- `qt:create:clarify`
- `qt:create:already-exists`
- `qt:create:created`
- `qt:incomplete`
- `qt:run:not-found`
- `qt:run:executed`
- `qt:improve:not-found`
- `qt:improve:proposal-not-found`
- `qt:improve:proposed`
- `qt:improve:accept:applied`
- `qt:improve:reject:recorded`
- `qt:improve:abandon:recorded`
- `qt:improve:already-finalized`
- `qt:storage:error`

## Lightweight drift-check checklist

When command parsing or result types change:

1. Update `packages/core/src/types.ts` and parser/runtime tests.
2. Update this document in the same PR.
3. Update `README.md` command examples if user-facing commands changed.
4. Link host adapter docs to this file instead of duplicating command/result details.
