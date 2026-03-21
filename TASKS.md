# QuickTask Tasks

`TASKS.md` is the active planning and execution board.

Historical completed task records live in `TASKS_ARCHIVED.md`.

## Agent task maintenance instructions

- Keep task IDs stable forever; never renumber existing tasks.
- Add new tasks with the next sequential ID (`T###`).
- Keep `TASKS.md` focused on active work and near-term completions.
- Move fully archived records to `TASKS_ARCHIVED.md`.
- When a task closes, assess follow-on gaps and add/update tasks immediately.

## Status, priority, severity, and blocker policy

Use these fields consistently:

- **Status**
  - `[p]` proposed (discovered and auto-added; awaiting promotion triage)
  - `[ ]` todo (not started)
  - `[~]` in progress (actively being worked)
  - `[!]` blocked (cannot proceed; blocker must be documented)
  - `[x]` complete (done, awaiting archive cycle)
  - `[h]` archived (must live in `TASKS_ARCHIVED.md`, not here)
- **Priority**
  - `P0` critical path
  - `P1` high impact
  - `P2` valuable follow-through
- **Severity** (for findings/risks attached to a task)
  - `S0` release/system blocking
  - `S1` major reliability/quality risk
  - `S2` minor risk or polish
- **Blockers**
  - Every `[!]` task must include `Blocked by` and `Unblock plan`.
  - Use task IDs for internal blockers (for example `T052`).
  - Use explicit external blockers when outside repo control.

## Working rules for all tasks

- One branch per task, one PR per task by default.
- Keep changes scoped to one task ID.
- Add/update tests for implementation tasks.
- Run checks proportional to change scope before merge.
- Keep monorepo structure unless task scope explicitly changes it.
- Use `TASKS_ARCHIVED.md` for historical details; do not re-expand this file with archived task bodies.

## Milestone execution order

### Phase 1 - Core foundations

- Success measure: Core `/qt` parsing, persistence, and tests are deterministic.
- Status: complete and archived.
- Archived task IDs: T001, T002, T003, T009.

### Phase 2 - Core behavior and reliability

- Success measure: Create/run/improve lifecycles are contract-stable and failure-safe.
- Status: complete and archived.
- Archived task IDs: T004, T005, T006, T007, T008, T015, T022, T023, T029, T030, T031, T034, T035, T036, T037, T038, T039, T040.

### Phase 3 - Host integrations

- Success measure: `/qt` works end-to-end in VS Code, Cursor, OpenClaw using shared core runtime.
- Status: complete and archived.
- Archived task IDs: T010, T011, T012, T013, T014.

### Phase 4 - CI and quality controls

- Success measure: CI enforces build/test/lint/security/compatibility standards and blocks regressions.
- Status: complete and archived.
- Archived task IDs: T021, T024, T027, T028, T033, T041, T042, T043, T044.

### Phase 5 - Packaging and release operations

- Success measure: Reproducible release artifacts are generated, validated, and published.
- Status: complete and archived.
- Archived task IDs: T016, T017, T018, T025, T026, T032, T045, T046, T047, T048, T049.

### Phase 6 - Distribution and docs

- Success measure: Users can discover, install, and upgrade QuickTask across hosts with clear docs.
- Status: in maintenance.
- Active/near-term IDs: T050, T051.
- Archived task IDs: T019, T020.

## Active task backlog

No open tasks right now. Add new tasks below when discovered.

### Proposed

- _Empty._

### Intake queue

- _Empty._

### In progress

- _Empty._

### Blocked

- _Empty._

## Completed tasks (not yet archived)

### [x] T050 - Fix Marketplace publisher/display-name mismatch

- Status: [x] complete (not yet archived)
- Priority: P1
- Severity: S1
- Goal: Unblock VS Code Marketplace publishing by aligning extension identity metadata with intended publisher and unique listing name.
- Files: `packages/vscode-extension/package.json`, `README.md`, `.changeset/*.md`.
- Dependencies: T019, T020.
- Validation evidence:
  - Updated `quicktask-vscode` metadata to publisher `nicklaprell` and display name `QuickTask Workflows`.
  - Updated `README.md` install/release notes to reference correct publisher identity.
  - Added release changeset and triggered release + publish retry flow.

### [x] T051 - Restructure task tracking for reliability

- Status: [x] complete (not yet archived)
- Priority: P1
- Severity: S1
- Goal: Improve tasking reliability and maintainability by separating active and archived records and codifying blocker/severity handling.
- Files: `TASKS.md`, `TASKS_ARCHIVED.md`, `.cursor/rules/*.mdc`.
- Dependencies: none.
- Steps:
  1. Split active board from archived records.
  2. Remove duplicate/contradictory listings in active tracker.
  3. Add explicit status/severity/blocker policy.
  4. Align AI workflow rules to the new tracker model.
- Acceptance criteria:
  - `TASKS.md` remains concise and active-focused.
  - Archived tasks are moved to `TASKS_ARCHIVED.md`.
  - Rules that reference task tracking align with split-file policy.
  - Blocked and in-progress states are explicitly supported.

### [x] T052 - Codify discovery workflow for proposed tasks

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Make "discover new tasks for development" a deterministic workflow that auto-adds proposed tasks from doc and code review.
- Files: `TASK_DISCOVERY_WORKFLOW.md`, `.cursor/rules/task-discovery-workflow.mdc`, `.cursor/commands/discover-tasks.md`, `TASKS.md`, docs/rules references.
- Dependencies: T051.
- Acceptance criteria:
  - Discovery workflow is documented with manual trigger and max 10-task intake.
  - Agent behavior is codified in an always-applied rule.
  - Discovered tasks are auto-added with status `[p]`.
  - `TASKS.md` supports proposed lane and status legend entry.
  - Command entrypoint exists for discovery runs.

## Archive cadence

- Archive `[x]` tasks after one stable release cycle or when follow-up risk is cleared.
- During archive:
  1. Move task detail block from `TASKS.md` to `TASKS_ARCHIVED.md`.
  2. Change status marker to `[h]`.
  3. Keep ID/title unchanged.
  4. Update phase archived-ID list if needed.

## Task template (copy for new tasks)

```md
### [p] T0XX - <short imperative title>

- Status: [p]
- Priority: P0|P1|P2
- Severity: S0|S1|S2 (optional when not release-critical)
- Goal: <outcome>
- Files: `<path>`, `<path>`
- Dependencies: T0YY, T0ZZ | none
- Blocked by: <task IDs or external dependency> | none
- Unblock plan: <specific next step> | n/a
- Steps:
  1. ...
  2. ...
- Acceptance criteria:
  - ...
  - ...
- Validation evidence:
  - <add after implementation>
```
