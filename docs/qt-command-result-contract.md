# QuickTask Command and Result Contract

This document is the canonical source of truth for:

- supported `/qt` command forms, and
- core runtime result codes returned by `@quicktask/core`.

User-facing docs and host adapter docs should reference this file rather than restating behavior independently.
Adapter rendering behavior by host is defined in `docs/qt-adapter-rendering-matrix.md`.

## Command forms

### Core commands

- `/qt` - compact command index (points at `/qt help` and `/qt help all`).
- `/qt help` - short quickstart (chat + init + pointer to full reference).
- `/qt help all` - full command list (same surface as historical `/qt` menu).
- `/qt help [topic]` - contextual help (`create`, `run`, `improve`, `actions`, `discover`, `all`).
- `/qt init` - initialize QuickTask first-run assets and guidance.
- `/qt [task] [body or run input]` - **if the template name is new**, the remainder is the template body (long pastes are valid authoring). **If the template already exists**, the remainder is treated as **run input** (same semantics as `/qt/[task]`).
- `/qt create [task] [instructions]` - **explicit create** only; if the name already exists, returns `qt:create:already-exists` (does not run).
- `/qt/[task] [input]` - run an existing task.
- `/qt improve [task] [input]` - propose an improvement. **Input must be substantive** (runtime enforces a minimum length); otherwise returns `qt:incomplete` with an example.
- `/qt export [task|--all]` - export one or all templates as a deterministic JSON payload.
- `/qt import [--force] [payload-json]` - import template records from exported payloads.
- `/qt import-pack [--force] [manifest-path]` - resolve and import a local template-pack manifest.
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

- help (`/qt`, `/qt help`, `/qt help [topic|all]`)
- init/bootstrap (`/qt init`)
- create / run disambiguation (`/qt [task] …`, `/qt create [task] …`, `/qt/[task] …`)
- run (`/qt/[task] [input]`, and `/qt [task] …` when the template exists)
- improve lifecycle (`/qt improve ...`, accept/reject/abandon)
- portability (`/qt export`, `/qt import`, `/qt import-pack`)
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
- `qt:run:missing-variables`
- `qt:run:executed`
- `qt:export:task`
- `qt:export:all`
- `qt:import:created`
- `qt:import:updated`
- `qt:import:conflict`
- `qt:import:invalid`
- `qt:pack:resolved`
- `qt:pack:invalid`
- `qt:pack:not-found`
- `qt:list:listed` (optional `suggestedNext[]` onboarding hints after a non-empty list)
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

## Template variable syntax and runtime behavior

- Variable token syntax: `{{variableName}}`.
- Variable default syntax: `{{variableName|default value}}`.
- Variable names must match: `[a-zA-Z][a-zA-Z0-9_-]*`.
- Escape rule for literal open braces: `\{{`.
- Runtime variable input uses `key=value` tokens in `/qt/[task] [input]`.
  - Example: `/qt/summarize topic=incident tone=concise`
- Missing required variables (without defaults) return `qt:run:missing-variables` with deterministic usage guidance.
- Backward compatibility: templates with no variable tokens run unchanged.

## Export/import contract

- Export payload format:
  - object with `type: "quicktask-export"`, `version: 1`, `generatedAt`, and `tasks[]`.
  - each task record includes `taskName` and `body`.
- Import accepts either:
  - full export payload (`quicktask-export` envelope), or
  - single `{ "taskName": "...", "body": "..." }` record.
- Conflict policy:
  - default import skips collisions and returns `qt:import:conflict` when nothing is imported,
  - `--force` allows deterministic overwrite and returns `qt:import:updated` when updates occur.

## Template-pack manifest contract

- Local manifest is JSON with:
  - `version: 1`
  - `name` (non-empty string)
  - `templates[]` entries with `taskName` + `file`
- Pack resolution is local-only and resolves template file paths relative to the manifest directory.
- Invalid manifests return `qt:pack:invalid`; missing manifest files return `qt:pack:not-found`.
- Successful pack resolution/import returns `qt:pack:resolved` with imported/skipped counts.

## Verbose and debug mode (spec, Phase 12 / T137)

**Status:** specified only; default UX remains human-first summaries until an implementation task ships.

- **Goals:** optional surfacing of absolute paths, touched files, internal diagnostic codes, and structured “reason” tokens for support — **off by default** for `/qt` happy paths (`docs/product-direction.md`).
- **Suggested control surface (VS Code / Cursor):** workspace setting `quicktask.verbose` (boolean) and optional `quicktask.debug` (boolean) with `debug` implying `verbose`. OpenClaw hosts may expose equivalent host config that maps into the same runtime flags when implemented.
- **Runtime (future):** accept optional verbosity flags on `createQtRuntime` options or per-request context from adapters; when verbose, append a fenced “Diagnostics” section to markdown output for `doctor`, `init_status`, storage errors, and `not_found` (paths only, no raw user template text). When debug, include last N diagnostic event codes and `requestId` on non-error results where privacy policy still allows.
- **Commands (future):** at minimum `doctor`, `init`, `export`/`import` outcomes; consider `list`/`show` path hints only under debug.
- **Adapters:** hosts must not log full template bodies to shared telemetry; verbose/debug is for local buffers and user-visible output only. See `docs/qt-adapter-rendering-matrix.md` § Verbose/debug.

## Diagnostics and privacy policy

- Runtime diagnostic events are local-only and in-memory.
- Diagnostic events include operational metadata only (`requestId`, timestamp, lifecycle phase, command kind, result code).
- Do not include raw user input, template bodies, or other user-content fields in diagnostics.
- Aggregate UX feedback signals are allowed in doctor output only as counters (clarifications, incomplete commands, parse/storage errors, missing-task attempts) with no raw payload content.
- Adapter unknown-result fallbacks must avoid dumping full payloads to output surfaces.

## Lightweight drift-check checklist

When command parsing or result types change:

1. Update `packages/core/src/types.ts` and parser/runtime tests.
2. Update this document in the same PR.
3. Update `README.md` command examples if user-facing commands changed.
4. Update `docs/qt-adapter-rendering-matrix.md` when result codes or payload shapes change.
5. Link host adapter docs to these canonical docs instead of duplicating command/result details.
