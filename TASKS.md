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
  - `[p]` ready-proposed (triaged and ready for implementation)
  - `[ ]` todo (not started)
  - `[~]` in progress (actively being worked)
  - `[!]` blocked (cannot proceed; blocker must be documented)
  - `[x]` complete (done, awaiting archive cycle)
  - `[h]` archived (must live in `TASKS_ARCHIVED.md`, not here)
- **Priority**
  - `P0` critical path
  - `P1` high impact
  - `P2` valuable follow-through
  - `P3` medium-priority enhancement
  - `P4` low-priority optimization
  - `P5` backlog/nice-to-have
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

## Risk acceptance records

Use this section only when medium/high findings are explicitly accepted instead of fixed.

- Required fields per accepted risk:
  - Finding/task ID and severity.
  - Human approver.
  - Decision date.
  - Scope of acceptance.
  - Rationale and mitigation.
  - Sunset/revisit date.
- Active accepted risks:
  - _None._
- Template:
  - `- [ ] Risk ID: R### | Finding: T### | Severity: medium|high | Approver: <name> | Decision date: YYYY-MM-DD | Scope: <scope> | Rationale: <why accepted> | Mitigation: <controls> | Sunset: YYYY-MM-DD`

## Current execution state

- Last updated: 2026-03-22
- Current phase in execution: Phase 10 - Operational polish and deferred enhancements (completion + release)
- Current milestone target: Phase 10 tasks completed, release readiness prepared, and release dispatched.
- Phase objective now: finalize deferred enhancements, enforce governance automation, and close the phase with a production release.
- Active implementation (`[~]`): none
- Scheduled this phase (`[ ]`): none
- Ready queue (`[p]`): 0 tasks
- Blocked tasks (`[!]`): none
- Next tasks in order:
  1. Run post-release verification and marketplace follow-through.
  2. Promote next milestone backlog from ready-proposed queue.
  3. Add/triage newly discovered work for the next phase.
- Definition of "phase complete" for current phase:
  - Phase 9 planned tasks (`T060`, `T064`, `T068`, `T073`, `T074`, `T080`, `T082`, `T098`, `T099`, `T100`, `T075`, `T081`) are complete.
  - No unresolved medium/high CI/release platform blockers remain.

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
- Active/near-term IDs: none.
- Archived task IDs: T019, T020, T050, T051, T052.

### Phase 7 - Release governance and risk gates

- Delivery outcome: Release readiness is deterministic and auditable, with dual-source gating (milestones + active backlog), explicit risk acceptance, and strict diagnostics/privacy guardrails.
- Status: complete and archived.
- Planned task IDs (in order): T053, T054, T065, T071, T083, T084, T085.
- Archived task IDs: T053, T054, T065, T071, T083, T084, T085.

### Phase 8 - Minimal `/qt` product maturity

- Delivery outcome: `/qt` remains intentionally minimal while delivering top user value first (`list`, `show`, `doctor`) and then hardening adapter parity/UX consistency.
- Status: complete and archived.
- Planned task IDs (in order): T086, T062, T056, T066, T077, T061, T055, T076, T070.
- Archived task IDs: T086, T062, T056, T066, T077, T061, T055, T076, T070.

### Phase 9 - CI/release platform hardening

- Delivery outcome: Faster and more reliable release operations with reusable workflows, stronger security enforcement, cross-platform packaging/verification, and artifact contract checks.
- Status: complete and archived.
- Planned task IDs (in order): T060, T064, T068, T073, T074, T080, T082, T098, T099, T100, T075, T081.
- Archived task IDs: T060, T064, T068, T073, T074, T080, T082, T098, T099, T100, T075, T081.

### Phase 10 - Operational polish and deferred enhancements

- Delivery outcome: Deferred enhancements, lifecycle polish, and governance automation are delivered after core release and product milestones are stable.
- Status: complete and archived.
- Planned task IDs (in order): T057, T058, T059, T063, T087, T088, T089, T090, T092, T067, T069, T072, T091, T094, T095, T097, T078, T079, T093, T096.
- Archived task IDs: T057, T058, T059, T063, T087, T088, T089, T090, T092, T067, T069, T072, T091, T094, T095, T097, T078, T079, T093, T096.

## Active task backlog

Pending work below is triaged and ready for implementation.

### Proposed

- _Empty._

### Intake queue

- _Empty._

### In progress

- _Empty._

### Blocked

- _Empty._

## Proposed task details

- _None. Archived records are tracked in `TASKS_ARCHIVED.md`._

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
- Priority: P0|P1|P2|P3|P4|P5
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
