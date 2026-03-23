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

- Last updated: 2026-03-23
- **Phase 12** (`v1.0.x` adoption): **shipped** as **`v1.1.0`** (2026-03-22); task records **`[h]`** in `TASKS_ARCHIVED.md`. Release: https://github.com/NJLaPrell/QuickTask/releases/tag/v1.1.0
- Current phase in execution: _Workspace kit roadmap Phase 3 package-primary distribution and upgrades._
- Phase kickoff assessment: Phase 3 kickoff completed via `T156`; execution is now in Phase 3 deliverable implementation.
- Active implementation (`[~]`): `T160`
- Scheduled (`[ ]`): _none_
- Ready queue (`[p]`): `T161`
- Blocked tasks (`[!]`): none
- Next tasks: Execute Phase 3 in order `T157` -> `T158` -> `T159` -> `T160`, then run `T161` for 3 -> 4 promotion evidence and phase-state update.
- Phase 11 planned tasks (`T112`, `T113`, `T114`, `T116`, `T117`, `T118`, `T120`, `T123`, `T124`, `T126`, `T132`) remain `[x]`.

## `v1.0.0` release execution plan

Use this as the active board for release planning and go/no-go decisions.

### Scope buckets

- Must-have product scope for `v1.0.0` (ship before RC freeze):
  - T101, T102, T103
  - T105, T104
  - T109, T110, T111
- Must-have release execution scope for `v1.0.0`:
  - T129, T130, T131
- Should-have for `v1.0.0` (include only if must-have is complete and RC remains green):
  - T106
  - T128
- Explicitly deferred beyond `v0.4.0` and now scheduled in Phase 11:
  - T112, T113, T114
  - T116, T117, T118
  - T120, T123, T124, T126, T132

### Ordered delivery waves

1. Wave A - `/qt init` GA path: T101 -> T102 -> T103
2. Wave B - onboarding and docs: T105 -> T104
3. Wave C - improve proposal durability: T109 -> T110 -> T111
4. Wave D (optional) - adoption polish: T106, T128
5. Wave E - stabilization and RC/release: T129 -> T130 -> T131
6. Post-`v0.4.0` wave (Phase 11): T112/T113/T114, T116/T117/T118, T120, T123, T124, T126, T132

### Execution plan completion gate (`v1.0.0`)

The `v1.0.0` execution plan is complete when every task in this set is `[x]`:

- Product must-have task set: `T101`, `T102`, `T103`, `T105`, `T104`, `T109`, `T110`, `T111`
- Release execution task set: `T129`, `T130`, `T131`

Validation expectations are enforced within those tasks' acceptance criteria and evidence blocks.

## `v1.0.x` adoption execution plan (Phase 12)

Use this board for **post-`v1.0.0` adoption** work driven by GitHub user-feedback issues and `docs/product-direction.md`.

### Scope buckets

- **12a — Discover + first-run clarity (P1):** `T134`, `T135`, `T138`
- **12b — Command model + onboarding (P1–P2):** `T133`, `T139`, `T136`, `T140` (ship roughly in that order; see waves)
- **12c — Trust + polish (P2–P4):** `T137` (spec, then future implementation task), `T142` (P2), `T141` (P4)

### Ordered delivery waves

1. **Wave A:** `T134` ⟷ `T135` (parallel where possible; Marketplace work may be out-of-band).
2. **Wave B:** `T138` (contributor sandbox credibility).
3. **Wave C:** `T133` (run-default + create escape hatch), then **`T139`** (UF-012: long paste = create body when template missing — docs/tests aligned with **T133**).
4. **Wave D:** `T136` (tiered help, init steering, suggested next steps).
5. **Wave E:** `T140` (improve empty input).
6. **Wave F:** `T137` (verbose/debug **spec**; add implementation task(s) after spec lands).
7. **Wave G:** `T142` (P2 — extension preflight + hint), then `T141` (P4).

### Phase 12 completion gate

**Closed:** implementation merged to `main`; **`v1.1.0`** tag via **`Release`** workflow. Task records **`T133`–`T142`** archived as **`[h]`**. Linked GitHub feedback issues **#41–#44, #47–#49, #51–#58, #60–#62** closed with the **`v1.1.0`** release (see `USER_FEEDBACK.md` index).

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
- Status: in maintenance; Phase 12 adoption (archived tasks `T133`–`T142`); version line advances with releases.
- Active/near-term IDs: _none._
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
- Status: release hardening scope complete; remaining follow-on scope moved to Phase 11.
- Planned task IDs (in order): T057, T058, T059, T063, T087, T088, T089, T090, T092, T067, T069, T072, T091, T094, T095, T097, T078, T079, T093, T096.
- Archived task IDs: T057, T058, T059, T063, T087, T088, T089, T090, T092, T067, T069, T072, T091, T094, T095, T097, T078, T079, T093, T096.

### Phase 11 - Post-release expansion and workflow modernization

- Delivery outcome: Deferred feature/governance enhancements land after the `v0.4.0` release, and CI/release workflows are modernized for current GitHub Actions runtime policy.
- Status: complete and released as `v1.0.0`.
- Planned task IDs (in order): T132, T112, T113, T114, T116, T117, T118, T120, T123, T124, T126.
- Archived task IDs: none.

### Phase 12 - User feedback resolution (`v1.0.x` adoption)

- **Success measure:** Open GitHub user-feedback issues have a tracked task, shipped work matches `docs/product-direction.md`, and README/Marketplace/extension tell a chat-first, install-credible story.
- **Status:** **complete** — tasks **`T133`–`T142`** archived as **`[h]`** in `TASKS_ARCHIVED.md`; release tag **`v1.1.0`** from **`Release`** workflow.
- **Release milestone tag:** `v1.1.0` (lockstep core + VS Code + OpenClaw packages).
- **Archived task IDs:** T133, T134, T135, T136, T137, T138, T139, T140, T141, T142.

## Active task backlog

Work below is triaged for implementation.

### Proposed

- `[p] T160 [workspace-kit] Reduce starter to thin profile + package wrapper`
- `[p] T161 [workspace-kit] Run Phase 3 promotion evidence pass and status update`

### Scheduled (`[ ]`)

- _Empty._ (Phase 12 tasks **`T133`–`T142`** closed and archived — see `TASKS_ARCHIVED.md`.)

### Intake queue

- _Empty._

### In progress

- _Empty._

### Blocked

- _Empty._

## Proposed task details

### [x] T143 [workspace-kit] Seed Phase 0 inventory and backlog mapping

- Status: [x]
- Priority: P1
- Goal: Convert roadmap Phase 0 scope into concrete executable inventory and linked tasks.
- Files: `TASKS.md`, `ROADMAP.md`, `docs/maintainers/workspace-kit-status.yaml`
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Inventory QuickTask-specific vs reusable workflow/process artifacts.
  2. Record `[workspace-kit]` task mapping to roadmap phase criteria.
  3. Update status YAML `next_agent_actions` to match current work.
- Acceptance criteria:
  - Inventory exists in maintainer path and is referenced by a `[workspace-kit]` task.
  - Active `[workspace-kit]` task sequence is visible in `TASKS.md`.
- Validation evidence:
  - Added maintainer-only Phase 0 inventory baseline in `ROADMAP.md` under `## Phase 0 inventory baseline (maintainer-internal)` with QuickTask-specific vs process-universal artifact split.
  - Added explicit Phase 0 task-to-criteria mapping table in `ROADMAP.md` linking `T143`/`T144`/`T145`/`T146` to promotion requirements.
  - Confirmed active `[workspace-kit]` task sequence in `TASKS.md` and aligned status handoff focus in `docs/maintainers/workspace-kit-status.yaml`.

### [x] T144 [workspace-kit] Define and commit profile/manifest schema stubs

- Status: [x]
- Priority: P1
- Goal: Create canonical contract stubs so agents scaffold against stable paths, not ad-hoc files.
- Files: `workspace-kit.profile.json`, `schemas/workspace-kit-profile.schema.json`, `.workspace-kit/manifest.json`, `.workspace-kit/owned-paths.json`
- Dependencies: T143
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add schema/document stubs at roadmap-defined canonical paths.
  2. Add minimal field set and comments/examples for v0 profile and manifest.
  3. Ensure stub files align with roadmap execution contracts.
- Acceptance criteria:
  - All canonical file-contract paths exist in repo.
  - Stubs are valid JSON and ready for validator implementation.
- Validation evidence:
  - Confirmed canonical contract files exist at roadmap paths:
    - `workspace-kit.profile.json`
    - `schemas/workspace-kit-profile.schema.json`
    - `.workspace-kit/manifest.json`
    - `.workspace-kit/owned-paths.json`
  - Verified stubs include v0 baseline fields (`project.name`, `packageManager`, `commands.*`, `github.defaultBranch`) and schema alignment with Phase 0 profile draft requirements.
  - JSON parse validation command succeeded:
    - `node -e "const fs=require('fs'); ['workspace-kit.profile.json','schemas/workspace-kit-profile.schema.json','.workspace-kit/manifest.json','.workspace-kit/owned-paths.json'].forEach((p)=>JSON.parse(fs.readFileSync(p,'utf8')));"`

### [x] T145 [workspace-kit] Add agent status metrics structure and update protocol

- Status: [x]
- Priority: P2
- Goal: Make roadmap metrics cadence actionable by adding a durable metrics structure to status handoff.
- Files: `docs/maintainers/workspace-kit-status.yaml`, `ROADMAP.md`
- Dependencies: T143
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add `metrics` structure to status YAML with placeholders for required baseline metrics.
  2. Document update cadence and expected values format.
  3. Ensure session-end protocol includes metrics update trigger conditions.
- Acceptance criteria:
  - Status YAML includes a `metrics` section aligned to roadmap baseline.
  - Agent session protocol has explicit metrics update timing.
- Validation evidence:
  - `docs/maintainers/workspace-kit-status.yaml` now has an explicit `metrics` structure with baseline keys, `updated_at`, and maintainer note for null measurement placeholders.
  - Added metrics value format contract in `ROADMAP.md` under `### Metrics baseline (Phase 5 minimum)` (`updated_at`, numeric/null semantics, source field).
  - Added session-end metrics update trigger conditions in `ROADMAP.md`:
    - phase promotion outcome,
    - cold-start fixture run result,
    - upgrade rehearsal result,
    - friction-review count change.

### [x] T146 [workspace-kit] Run Phase 0 promotion evidence pass and status update

- Status: [x]
- Priority: P1
- Goal: Close Phase 0 with objective evidence and advance kit phase state cleanly.
- Files: `TASKS.md`, `docs/maintainers/workspace-kit-status.yaml`
- Dependencies: T144, T145
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Run required checks from roadmap phase promotion matrix for 0 -> 1.
  2. Capture evidence summary in task block and update status YAML.
  3. If criteria pass, set `current_kit_phase` to `1` and clear completed next actions.
- Acceptance criteria:
  - Evidence for 0 -> 1 checks is recorded in this task.
  - Status YAML phase and focus fields reflect post-promotion state.
- Validation evidence:
  - Ran required promotion checks for `0 -> 1`: `pnpm check && pnpm test` (pass, 2026-03-23).
  - Confirmed non-command evidence requirements for `0 -> 1`:
    - inventory doc exists at maintainer path (`ROADMAP.md` Phase 0 inventory baseline section),
    - profile schema v0 draft committed (`schemas/workspace-kit-profile.schema.json` + `workspace-kit.profile.json`).
  - Updated `docs/maintainers/workspace-kit-status.yaml` to:
    - `current_kit_phase: 1`,
    - Phase 1 `active_focus`,
    - refreshed `next_agent_actions`,
    - populated `last_session_summary`,
    - metrics baseline timestamp update (`metrics.updated_at`).

### [x] T147 [workspace-kit] Scaffold package skeleton for Phase 1 local CLI

- Status: [x]
- Priority: P1
- Goal: Create `packages/workspace-kit` CLI skeleton with `init` and `doctor` command placeholders aligned to roadmap CLI contract.
- Files: `packages/workspace-kit/*`, `package.json`, `pnpm-workspace.yaml`, tests/docs as needed
- Dependencies: T146
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Scaffold package layout and CLI entrypoint.
  2. Implement deterministic placeholder handlers for `init` and `doctor` with contract-stable exit codes.
  3. Add basic test harness or smoke checks for command invocation.
- Acceptance criteria:
  - `packages/workspace-kit` exists with runnable CLI entry and documented command placeholders.
  - CLI returns stable exit codes per roadmap minimal contract.
- Validation evidence:
  - Added new package skeleton at `packages/workspace-kit` with TypeScript build/check/test scripts and dry-run pack stub (`pack:dry-run`) in `packages/workspace-kit/package.json`.
  - Implemented CLI entrypoint with deterministic placeholder handlers and stable exit-code contract (`0` success, `1` validation failure, `2` usage error, `3` internal error) in `packages/workspace-kit/src/cli.ts`.
  - Added package tests for command invocation and `doctor` validation behavior in `packages/workspace-kit/test/cli.test.mjs`.
  - Validation run (pass, 2026-03-23):
    - `pnpm --filter quicktask-workspace-kit test`
    - `pnpm check && pnpm test && pnpm tasks:check && pnpm release:check-workflow-contracts`

### [x] T148 [workspace-kit] Create template starter path and consumer README stub

- Status: [x]
- Priority: P1
- Goal: Stand up Phase 1 template starter location with profile stub and kit-consumer onboarding README.
- Files: `TASKS.md`, `ROADMAP.md`, `docs/maintainers/workspace-kit-status.yaml`
- Dependencies: T147
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Create template starter tree with profile stub and minimal required files.
  2. Add template consumer README for 5-minute init flow.
  3. Ensure template docs stay kit-focused and do not blend into product README.
- Acceptance criteria:
  - Starter template path exists and includes profile stub plus consumer-facing README.
  - README guides local CLI/bootstrap path for Phase 1.
- Validation evidence:
  - Added template starter tree at `templates/workspace-starter/` with canonical contract stubs:
    - `workspace-kit.profile.json`
    - `schemas/workspace-kit-profile.schema.json`
    - `.workspace-kit/manifest.json`
    - `.workspace-kit/owned-paths.json`
  - Added kit-consumer README stub at `templates/workspace-starter/README.md` with 5-minute local init flow and explicit separation from product README.
  - Validation run (pass, 2026-03-23):
    - `pnpm docs:check-links`
    - `pnpm release:check-workflow-contracts`
    - `pnpm templates:eval`

### [x] T149 [workspace-kit] Define cold-start fixture and doctor validation harness

- Status: [x]
- Priority: P1
- Goal: Establish repeatable Phase 1 cold-start validation proving template + local CLI `doctor` success.
- Files: `TASKS.md`, `docs/maintainers/workspace-kit-status.yaml`, fixture path/docs/scripts as needed
- Dependencies: T147, T148
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Define canonical cold-start fixture path/process.
  2. Run `doctor` validation against fixture and capture evidence.
  3. Record baseline metrics updates from fixture outcomes.
- Acceptance criteria:
  - Fixture path and invocation steps are documented and repeatable.
  - `doctor` pass evidence is captured for Phase 1 progression.
- Validation evidence:
  - Added canonical fixture guidance at `docs/maintainers/workspace-kit-cold-start-fixture.md` with source template path, fixture path, and reproducible command flow.
  - Added repeatable harness script `scripts/workspace-kit-phase1-cold-start-check.mjs` and root script alias `pnpm workspace-kit:phase1:cold-start-check`.
  - Cold-start run succeeded (2026-03-23):
    - Command: `pnpm workspace-kit:phase1:cold-start-check`
    - Fixture path: `artifacts/workspace-kit-fixtures/phase1-cold-start`
    - Doctor output:
      - `workspace-kit doctor passed.`
      - `All canonical workspace-kit contract files are present and parseable JSON.`
  - Updated status metrics baseline with first measured values from fixture run.

### [x] T150 [workspace-kit] Run Phase 1 promotion evidence pass and status update

- Status: [x]
- Priority: P1
- Goal: Close Phase 1 with objective evidence and advance kit phase state cleanly from 1 -> 2.
- Files: `TASKS.md`, `docs/maintainers/workspace-kit-status.yaml`
- Dependencies: T147, T148, T149
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Run required checks from roadmap phase promotion matrix for 1 -> 2.
  2. Capture command and fixture evidence summary in task block and update status YAML.
  3. If criteria pass, set `current_kit_phase` to `2` and refresh next actions for Phase 2.
- Acceptance criteria:
  - Evidence for 1 -> 2 checks is recorded in this task.
  - Status YAML phase and focus fields reflect post-promotion state.
- Validation evidence:
  - Ran required promotion checks for `1 -> 2` (pass, 2026-03-23):
    - `pnpm check && pnpm test`
  - Confirmed fixture/doctor evidence requirement for `1 -> 2`:
    - `pnpm workspace-kit:phase1:cold-start-check`
    - Output included `workspace-kit doctor passed.` for fixture path `artifacts/workspace-kit-fixtures/phase1-cold-start`.
  - Updated `docs/maintainers/workspace-kit-status.yaml` to:
    - `current_kit_phase: 2`,
    - refreshed `active_focus` and `next_agent_actions` for Phase 2 planning,
    - updated `last_session_summary` with promotion closure details.

### [x] T151 [workspace-kit] Kick off Phase 2 profile-driven migration plan

- Status: [x]
- Priority: P1
- Goal: Convert Phase 2 roadmap deliverables into concrete executable tasks and dependency order.
- Files: `TASKS.md`, `docs/maintainers/workspace-kit-status.yaml`, `ROADMAP.md`
- Dependencies: T150
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Run a Phase 2 kickoff assessment against roadmap deliverables and exit criteria.
  2. Define implementation tasks for profile validation, rule parameterization, and pilot-repo adoption evidence.
  3. Update execution state and status YAML with ordered next actions.
- Acceptance criteria:
  - Phase 2 kickoff summary and concrete task sequence are recorded in active tracker/state files.
  - Follow-on tasks are actionable and aligned to 2 -> 3 promotion requirements.
- Validation evidence:
  - Phase 2 kickoff assessment completed (2026-03-23) against roadmap section `Phase 2 — State and migration`.
  - Reviewed required docs for drift/context: `README.md`, `CONTRIBUTORS.md`, `ARCHITECTURE.md`, `RELEASE_STRATEGY.md`, `PRE_RELEASE_READINESS_WORKFLOW.md`, `ROADMAP.md`, and status YAML.
  - Added concrete follow-on task chain for Phase 2 deliverables and exit criteria:
    - `T152` profile validation + CI gate,
    - `T153` profile-driven generation replacing hardcoded project-name guidance,
    - `T154` migration guide + non-QuickTask pilot adoption evidence,
    - `T155` 2 -> 3 promotion evidence and phase-state update.

### [x] T152 [workspace-kit] Add profile validation command and CI gate wiring

- Status: [x]
- Priority: P1
- Goal: Implement `workspace-kit check` profile validation and enforce it in repository-level validation flow.
- Files: `packages/workspace-kit/src/*`, `packages/workspace-kit/test/*`, `package.json`, docs/status/task files as needed
- Dependencies: T151
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add `check` command to workspace-kit CLI with deterministic pass/fail semantics.
  2. Validate minimal required profile fields and command keys against Phase 2 contract.
  3. Wire root-level validation to execute profile check in CI-relevant check flow.
- Acceptance criteria:
  - `workspace-kit check` exits `0` for valid profile and `1` for validation failures.
  - Repository validation path includes profile check gate.
- Validation evidence:
  - Added `check` command to workspace-kit CLI in `packages/workspace-kit/src/cli.ts` with deterministic profile validation for baseline fields (`project.name`, `packageManager`, `commands.test/lint/typecheck`, `github.defaultBranch`).
  - Added package tests for `check` command pass/fail behavior in `packages/workspace-kit/test/cli.test.mjs`.
  - Wired profile validation into repository-level check path:
    - root `check` now runs `pnpm -r check && pnpm workspace-kit:check-profile`,
    - added `workspace-kit:check-profile` script in root `package.json`.
  - Validation run (pass, 2026-03-23):
    - `pnpm --filter quicktask-workspace-kit test`
    - `pnpm workspace-kit:check-profile`
    - `pnpm check && pnpm tasks:check && pnpm release:check-workflow-contracts`

### [x] T153 [workspace-kit] Implement profile-driven project-context generation

- Status: [x]
- Priority: P1
- Goal: Replace hardcoded project-name assumptions with generated profile-driven context artifacts.
- Files: `packages/workspace-kit/src/*`, `packages/workspace-kit/test/*`, `templates/workspace-starter/**`
- Dependencies: T152
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add generation flow from profile values to project-context artifact(s) consumed by rules/docs.
  2. Extend `workspace-kit init` to create/update generated project-context outputs.
  3. Add tests proving `project.name` changes update generated outputs without manual edits.
- Acceptance criteria:
  - Generated artifacts reflect current profile values.
  - Changing `project.name` and rerunning generation updates output deterministically.
- Validation evidence:
  - Updated `workspace-kit init` to generate profile-driven artifacts:
    - generated project-context JSON output in the workspace-kit metadata directory
    - generated Cursor project-context rule output under workspace rules
  - Updated starter template to remove hardcoded project-name assumptions and point to profile/generated context via `templates/workspace-starter/.cursor/rules/workspace-kit-profile-pointer.mdc`.
  - Updated template owned paths and README to document generated project-context behavior and regeneration after profile edits.
  - Added tests in `packages/workspace-kit/test/cli.test.mjs` proving:
    - init generates profile-driven outputs,
    - changing `project.name` in profile and rerunning init updates generated rule output without manual edits.
  - Validation run (pass, 2026-03-23):
    - `pnpm --filter quicktask-workspace-kit test`
    - `pnpm check && pnpm tasks:check && pnpm docs:check-links && pnpm release:check-workflow-contracts`
    - `pnpm workspace-kit:phase1:cold-start-check`

### [x] T154 [workspace-kit] Add Phase 2 migration guide and pilot adoption harness

- Status: [x]
- Priority: P1
- Goal: Document migration from hand-maintained guidance to profile-driven outputs and capture non-QuickTask pilot adoption evidence.
- Files: `docs/maintainers/*`, `scripts/*`, `package.json`, `TASKS.md`, status YAML as needed
- Dependencies: T153
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Write maintainer migration guide for Phase 2 adoption flow.
  2. Add repeatable local pilot harness using a non-QuickTask fixture profile.
  3. Capture pilot run evidence demonstrating successful adoption.
- Acceptance criteria:
  - Migration guide exists and documents profile-driven transition steps.
  - Pilot harness demonstrates successful init/check flow for non-QuickTask fixture.
- Validation evidence:
  - Added migration guide: `docs/maintainers/workspace-kit-phase2-migration-guide.md`.
  - Added pilot harness script and root command:
    - `scripts/workspace-kit-phase2-pilot-adoption-check.mjs`
    - `pnpm workspace-kit:phase2:pilot-adoption-check`
  - Pilot run evidence (pass, 2026-03-23):
    - `profileProjectName: "phase2-pilot-non-quicktask"`
    - `generatedProjectName: "phase2-pilot-non-quicktask"`
    - init/check/doctor output all reported pass.
  - Validation run (pass, 2026-03-23):
    - `pnpm workspace-kit:phase2:pilot-adoption-check`
    - `pnpm check && pnpm tasks:check && pnpm docs:check-links && pnpm release:check-workflow-contracts`

### [x] T155 [workspace-kit] Run Phase 2 promotion evidence pass and status update

- Status: [x]
- Priority: P1
- Goal: Close Phase 2 with objective evidence and advance kit phase state cleanly from 2 -> 3.
- Files: `TASKS.md`, `docs/maintainers/workspace-kit-status.yaml`
- Dependencies: T152, T153, T154
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Run required checks from roadmap phase promotion matrix for 2 -> 3.
  2. Capture command and pilot evidence summary in task block and update status YAML.
  3. If criteria pass, set `current_kit_phase` to `3` and refresh next actions for Phase 3.
- Acceptance criteria:
  - Evidence for 2 -> 3 checks is recorded in this task.
  - Status YAML phase and focus fields reflect post-promotion state.
- Validation evidence:
  - Ran required promotion checks for `2 -> 3` (pass, 2026-03-23):
    - `pnpm check`
    - `pnpm test`
    - `pnpm tasks:check`
    - `pnpm docs:check-links`
    - `pnpm release:check-workflow-contracts`
  - Confirmed profile-driven and pilot exit criteria evidence:
    - `pnpm workspace-kit:phase2:pilot-adoption-check`
    - Output included matching values:
      - `profileProjectName: "phase2-pilot-non-quicktask"`
      - `generatedProjectName: "phase2-pilot-non-quicktask"`
      - init/check/doctor pass output for pilot fixture.
  - Reconfirmed baseline starter doctor fixture remains valid:
    - `pnpm workspace-kit:phase1:cold-start-check`
    - Output included `workspace-kit doctor passed.` for fixture path `artifacts/workspace-kit-fixtures/phase1-cold-start`.
  - Updated `docs/maintainers/workspace-kit-status.yaml` to:
    - set `current_kit_phase: 3`,
    - refresh `active_focus` and `next_agent_actions` for Phase 3 kickoff.

### [x] T156 [workspace-kit] Kick off Phase 3 package-primary upgrade/distribution plan

- Status: [x]
- Priority: P1
- Goal: Convert Phase 3 roadmap deliverables into concrete executable tasks and dependency order.
- Files: `TASKS.md`, `docs/maintainers/workspace-kit-status.yaml`, `ROADMAP.md`
- Dependencies: T155
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Run a Phase 3 kickoff assessment against roadmap deliverables and exit criteria.
  2. Define implementation tasks for `upgrade`, drift check, packaging/publish readiness, and template-thin-wrapper alignment.
  3. Update execution state and status YAML with ordered next actions.
- Acceptance criteria:
  - Phase 3 kickoff summary and concrete task sequence are recorded in active tracker/state files.
  - Follow-on tasks are actionable and aligned to 3 -> 4 promotion requirements.
- Validation evidence:
  - Phase 3 kickoff assessment completed (2026-03-23) against roadmap section `Phase 3 — Package-primary distribution and upgrades`.
  - Reviewed required docs for drift/context: `README.md`, `CONTRIBUTORS.md`, `ARCHITECTURE.md`, `RELEASE_STRATEGY.md`, `PRE_RELEASE_READINESS_WORKFLOW.md`, `ROADMAP.md`, and status YAML.
  - Added concrete follow-on task chain for Phase 3 deliverables and exit criteria:
    - `T157` upgrade command with kit-owned merge strategy and backups,
    - `T158` drift-check command with CI enforcement for pinned package assets,
    - `T159` package-primary distribution readiness/publish handoff using changesets semantics,
    - `T160` starter-template reduction to thin wrapper around package,
    - `T161` 3 -> 4 promotion evidence and phase-state update.

### [x] T157 [workspace-kit] Implement upgrade command with kit-owned merge + backup

- Status: [x]
- Priority: P1
- Goal: Add `workspace-kit upgrade` that updates kit-owned paths from package assets while preserving custom overrides via backups/merge policy.
- Files: `packages/workspace-kit/src/*`, `packages/workspace-kit/test/*`, `templates/workspace-starter/**`, docs/status/task files as needed
- Dependencies: T156
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add `upgrade` command with deterministic merge/overwrite behavior for kit-owned paths.
  2. Implement backup creation for changed kit-owned files before write.
  3. Add tests for merge, overwrite, and backup behavior.
- Acceptance criteria:
  - `workspace-kit upgrade` updates kit-owned assets and writes backup artifacts.
  - Merge strategy is explicit and deterministic for owned vs user-managed paths.
- Validation evidence:
  - Added `upgrade` command in `packages/workspace-kit/src/cli.ts`:
    - validates profile before upgrade execution,
    - preserves merge-managed `workspace-kit.profile.json`,
    - overwrites known kit-owned assets with deterministic baseline content,
    - updates manifest upgrade metadata and regenerates profile-driven context outputs,
    - writes backups for changed files under `.workspace-kit/backups/<ISO timestamp>/`.
  - Added package tests in `packages/workspace-kit/test/cli.test.mjs` for:
    - successful upgrade with backup creation and profile preservation,
    - validation-failure behavior for invalid profile input.
  - Validation run (pass, 2026-03-23):
    - `pnpm --filter quicktask-workspace-kit test`
    - `pnpm workspace-kit:check-profile`

### [x] T158 [workspace-kit] Add drift-check command and CI wiring for pinned assets

- Status: [x]
- Priority: P1
- Goal: Detect installed-asset drift relative to pinned kit version and enforce drift check in CI paths.
- Files: `packages/workspace-kit/src/*`, `packages/workspace-kit/test/*`, root `package.json`, scripts/docs/status/task files as needed
- Dependencies: T157
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add `workspace-kit drift-check` command comparing installed assets against pinned manifest version.
  2. Define warning/failure semantics for drift outcomes.
  3. Wire drift-check into repository check flow appropriate for Phase 3 evidence.
- Acceptance criteria:
  - Drift check reports deterministic pass/fail status for asset-version mismatches.
  - CI-relevant validation path includes drift check execution.
- Validation evidence:
  - Added `drift-check` command in `packages/workspace-kit/src/cli.ts`:
    - validates profile before drift evaluation,
    - compares supported owned-path assets to expected package-managed content,
    - validates manifest ownership policy and package-version alignment where applicable,
    - returns deterministic pass/fail with explicit drift findings and warnings.
  - Added root script wiring in `package.json`:
    - new `workspace-kit:drift-check`,
    - root `check` now runs `pnpm workspace-kit:drift-check` after profile validation.
  - Added package tests in `packages/workspace-kit/test/cli.test.mjs` for:
    - drift-check pass when managed assets are aligned,
    - drift-check failure when managed content drifts.
  - Validation run (pass, 2026-03-23):
    - `pnpm --filter quicktask-workspace-kit test`
    - `pnpm workspace-kit:drift-check`
    - `pnpm check && pnpm tasks:check && pnpm docs:check-links && pnpm release:check-workflow-contracts`

### [x] T159 [workspace-kit] Add package-primary distribution readiness and publish handoff

- Status: [x]
- Priority: P1
- Goal: Establish publish-ready package-primary workflow with lockstep version/changelog handoff evidence.
- Files: `packages/workspace-kit/package.json`, release scripts/config, changesets/docs/status/task files as needed
- Dependencies: T158
- Blocked by: human gate for registry credentials/publish permissions
- Unblock plan: prepare publish-handoff checklist and artifact verification evidence while keeping actual publish human-triggered.
- Steps:
  1. Add package readiness scripts/docs for publish handoff using existing release strategy.
  2. Ensure changeset/release metadata for workspace-kit package path are validated.
  3. Record human-gated handoff checklist for publish trigger.
- Acceptance criteria:
  - Publish-readiness checks are documented and executable without publishing.
  - Human-only publish gates are explicit and auditable.
- Validation evidence:
  - Added publish-readiness check script and root command:
    - `scripts/workspace-kit-phase3-publish-readiness-check.mjs`
    - `pnpm workspace-kit:phase3:publish-readiness-check`
  - Added maintainer handoff documentation:
    - `docs/maintainers/workspace-kit-phase3-publish-handoff.md`
  - Publish-readiness evidence run (pass, 2026-03-23):
    - `pnpm workspace-kit:phase3:publish-readiness-check`
    - Output included:
      - `packageVersion: "0.0.0"`
      - generated artifact `quicktask-workspace-kit-0.0.0.tgz`
      - explicit human-gate checklist entries.
  - Confirms publish itself remains human-triggered per release strategy and credentials gate.

### [~] T160 [workspace-kit] Reduce starter to thin profile + package wrapper

- Status: [~]
- Priority: P1
- Goal: Align starter template to Phase 3 objective so it acts as profile stub + package invocation wrapper.
- Files: `templates/workspace-starter/**`, docs/status/task files as needed
- Dependencies: T157, T158
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Minimize starter files to profile/config essentials and package-driven commands.
  2. Update starter README to package-primary cold-start flow.
  3. Validate starter cold-start can reach Phase 1-complete project baseline using package + profile.
- Acceptance criteria:
  - Starter template is thin and package-primary.
  - Cold-start flow works with package + profile and no manual rule copying.
- Validation evidence:
  - In progress.

### [p] T161 [workspace-kit] Run Phase 3 promotion evidence pass and status update

- Status: [p]
- Priority: P1
- Goal: Close Phase 3 with objective evidence and advance kit phase state cleanly from 3 -> 4.
- Files: `TASKS.md`, `docs/maintainers/workspace-kit-status.yaml`
- Dependencies: T157, T158, T159, T160
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Run required checks from roadmap phase promotion matrix for 3 -> 4.
  2. Capture command and upgrade/drift/package evidence summary in task block and update status YAML.
  3. If criteria pass, set `current_kit_phase` to `4` and refresh next actions for Phase 4.
- Acceptance criteria:
  - Evidence for 3 -> 4 checks is recorded in this task.
  - Status YAML phase and focus fields reflect post-promotion state.
- Validation evidence:
  - Pending.

### [x] T101 - Specify `/qt init` command contract and result codes

- Status: [x]
- Priority: P0
- Goal: Define deterministic command/result behavior for first-run initialization.
- Files: `docs/qt-command-result-contract.md`, `docs/qt-adapter-rendering-matrix.md`, `packages/core/src/types.ts`
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add `/qt init` command form and result-code set.
  2. Define payload fields for success, partial success, and failure.
  3. Add drift-check notes for adapter parity.
- Acceptance criteria:
  - Contract docs include `/qt init` command forms and result semantics.
  - Result codes include deterministic success/error variants for init flow.
- Validation evidence:
  - Added `/qt init` command form, approved command-surface policy entry, and deterministic init result-code contract in `docs/qt-command-result-contract.md`.
  - Added init payload field requirements and adapter rendering expectations in `docs/qt-adapter-rendering-matrix.md`.
  - Added `init_status` runtime result typing (`qt:init:initialized`, `qt:init:already-initialized`, `qt:init:partial`) and explicit `qt:init:failed` error typing in `packages/core/src/types.ts`.
  - Validation run: `pnpm check && pnpm test` (pass, 2026-03-22).

### [x] T102 - Implement core `/qt init` runtime flow

- Status: [x]
- Priority: P0
- Goal: Create `tasks/`, seed templates, run diagnostics, and return guided next steps.
- Files: `packages/core/src/*`, `tasks/*.md` (seed templates), `packages/core/test/*`
- Dependencies: T101
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add parser/runtime handling for `/qt init`.
  2. Create idempotent directory/bootstrap behavior and seed template creation.
  3. Return actionable next-command guidance in result payload.
- Acceptance criteria:
  - `/qt init` is idempotent and safe on existing repositories.
  - Runtime returns created/skipped assets and recommended next commands.
  - Core tests cover first-run and repeat-run behavior.
- Validation evidence:
  - Added parser/runtime `/qt init` handling with idempotent asset bootstrap in `packages/core/src/parser.ts` and `packages/core/src/runtime.ts`.
  - Added deterministic init payload/status handling and starter-template guidance in `packages/core/src/types.ts` and `packages/core/src/rendering.ts`.
  - Added core runtime coverage for init first-run/repeat-run in `packages/core/test/runtime.test.mjs`.
  - Validation run: `pnpm test` (pass, 2026-03-22).

### [x] T103 - Add adapter rendering for `/qt init` results

- Status: [x]
- Priority: P0
- Goal: Ensure all hosts render init outcomes consistently and clearly.
- Files: `packages/vscode-extension/*`, `packages/openclaw-plugin/*`, `.cursor/commands/qt.md`, adapter tests
- Dependencies: T101, T102
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add result-code mapping for init outcomes in each adapter.
  2. Render starter-template and next-command instructions with host-appropriate UX.
  3. Add unknown-code-safe fallback coverage for init variants.
- Acceptance criteria:
  - VS Code, Cursor, and OpenClaw all render init paths without adapter-specific drift.
  - Adapter tests cover success, idempotent repeat, and error outputs.
- Validation evidence:
  - Added init rendering support in shared renderer for `qt:init:*` codes in `packages/core/src/rendering.ts`.
  - Added VS Code/OpenClaw adapter init coverage in `packages/vscode-extension/test/qt-adapter.test.mjs` and `packages/openclaw-plugin/test/qt-adapter.test.mjs`.
  - Updated Cursor command guidance for init/persisted proposal lifecycle in `.cursor/commands/qt.md`.

### [x] T104 - Add guided first-run host onboarding flow

- Status: [x]
- Priority: P1
- Goal: Make first successful task creation/run/improve happen in under two minutes.
- Files: `packages/vscode-extension/*`, `packages/openclaw-plugin/*`, `.cursor/commands/qt.md`, `README.md`
- Dependencies: T102, T103
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add host-first-run messaging that guides create -> run -> improve lifecycle.
  2. Include command snippets users can copy directly.
  3. Add fallback guidance when host UX controls are limited.
- Acceptance criteria:
  - First-run flows include clear progressive guidance in each host.
  - Help/onboarding content points users to one canonical happy path.
- Validation evidence:
  - Added first-run next-command guidance in `/qt init` payload and rendering (`packages/core/src/runtime.ts`, `packages/core/src/rendering.ts`).
  - Updated command onboarding guidance in `.cursor/commands/qt.md` and user flow in `README.md`.

### [x] T105 - Rewrite README with two-minute quickstart

- Status: [x]
- Priority: P0
- Goal: Reduce install-to-value time by leading docs with a minimal guided path.
- Files: `README.md`, `docs/release-assets-and-verification.md`
- Dependencies: T101, T102
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add a top-of-file "2-minute quickstart" section.
  2. Separate host install paths into concise, visual steps.
  3. Link deeper policy docs after user-facing onboarding content.
- Acceptance criteria:
  - README starts with install + first-run commands before governance material.
  - Users can complete first create/run/improve flow using quickstart only.
- Validation evidence:
  - Added top-level `2-Minute Quickstart` workflow in `README.md` with init/list/show/run/improve flow.
  - Kept release/install guidance linked from the updated quickstart.

### [x] T106 - Add bundled starter template set

- Status: [x]
- Priority: P1
- Goal: Provide immediately useful templates for common workflows.
- Files: `tasks/*.md` (starter set), `README.md`, docs as needed
- Dependencies: T102
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Define initial curated templates (standup, incident triage, release notes, PR review).
  2. Ensure names normalize cleanly and avoid collisions.
  3. Document expected customization guidance.
- Acceptance criteria:
  - Starter set ships with clear purpose and user-facing examples.
  - Templates are high-signal and compatible with current command lifecycle.
- Validation evidence:
  - Added bundled starter template seeding (`standup`, `incident-triage`, `release-notes`, `pr-review`) in `packages/core/src/runtime.ts`.
  - Added adapter/core test expectations for seeded template discovery.

### [x] T109 - Persist improve proposals to disk-backed store

- Status: [x]
- Priority: P0
- Goal: Keep proposal lifecycle stable across runtime/session resets.
- Files: `packages/core/src/*`, `packages/core/test/*`, docs contracts
- Dependencies: T101
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add proposal persistence model under a repo-local metadata directory.
  2. Store proposal state transitions with integrity-safe writes.
  3. Guard against sensitive data leakage in diagnostics/logging.
- Acceptance criteria:
  - Proposals survive runtime restart and remain actionable within TTL window.
  - Persistence behavior is documented and tested.
- Validation evidence:
  - Added disk-backed proposal state read/write under runtime metadata directory in `packages/core/src/runtime.ts`.
  - Added restart lifecycle coverage in `packages/core/test/runtime.test.mjs`.

### [x] T110 - Implement proposal TTL cleanup and stale recovery

- Status: [x]
- Priority: P1
- Goal: Bound proposal-state growth and handle stale states predictably.
- Files: `packages/core/src/*`, `packages/core/test/*`, contract docs
- Dependencies: T109
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add deterministic expiration and cleanup routines.
  2. Define stale-state remediation semantics and messages.
  3. Add tests for cleanup boundaries.
- Acceptance criteria:
  - Expired proposals are purged safely without breaking valid active proposals.
  - Runtime returns clear action guidance when proposals expire.
- Validation evidence:
  - Added deterministic TTL + bounded-size cleanup behavior with persisted-state compaction in `packages/core/src/runtime.ts`.
  - Added stale/expired behavior tests in `packages/core/test/runtime.test.mjs`.

### [x] T111 - Restore proposal actions after runtime restart

- Status: [x]
- Priority: P1
- Goal: Ensure accept/reject/abandon actions work for persisted active proposals.
- Files: `packages/core/src/*`, adapters, tests
- Dependencies: T109, T110
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Load active proposal index on runtime startup.
  2. Wire action commands to hydrated proposal state.
  3. Add adapter guidance for restored proposals.
- Acceptance criteria:
  - Post-restart proposal action commands succeed when proposal is valid.
  - Tests cover restart boundaries and finalized/expired behavior.
- Validation evidence:
  - Added startup hydration of active proposals from persisted store in `packages/core/src/runtime.ts`.
  - Added restart accept-action coverage in `packages/core/test/runtime.test.mjs`.
  - Updated lifecycle contract wording in `docs/qt-command-result-contract.md`.

### [x] T112 - Define template variable syntax and contract

- Status: [x]
- Priority: P1
- Goal: Introduce reusable parameterized templates with deterministic syntax.
- Files: `docs/qt-command-result-contract.md`, `docs/qt-adapter-rendering-matrix.md`, core types
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Specify variable token syntax and escaping rules.
  2. Define runtime behavior for missing/defaulted variables.
  3. Document backward compatibility with existing templates.
- Acceptance criteria:
  - Contract docs define syntax, defaults, and error modes.
  - Existing non-parameterized templates remain valid.
- Validation evidence:
  - Added template variable contract semantics (`{{name}}`, `{{name|default}}`, escape `\{{`) and backward-compatibility notes in `docs/qt-command-result-contract.md`.
  - Added result/rendering coverage for missing-variable handling in `docs/qt-adapter-rendering-matrix.md`.
  - Extended runtime result/type contracts in `packages/core/src/types.ts` for deterministic missing-variable guidance (`qt:run:missing-variables`).

### [x] T113 - Implement template variable interpolation in core runtime

- Status: [x]
- Priority: P1
- Goal: Execute parameterized templates safely and predictably during run/improve.
- Files: `packages/core/src/*`, `packages/core/test/*`
- Dependencies: T112
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add variable extraction and interpolation engine.
  2. Enforce validation for required variables.
  3. Preserve deterministic rendering output for adapters.
- Acceptance criteria:
  - Runtime resolves variables correctly with clear failure signals when missing.
  - Core tests cover defaults, required fields, and malformed variables.
- Validation evidence:
  - Added extraction/interpolation/input parsing engine in `packages/core/src/templateVariables.ts`.
  - Wired runtime interpolation + missing-variable signal path in `packages/core/src/runtime.ts`.
  - Added coverage in `packages/core/test/template-variables.test.mjs` and `packages/core/test/runtime.test.mjs`.

### [x] T114 - Add adapter prompts for missing template variables

- Status: [x]
- Priority: P2
- Goal: Make variable-enabled templates easy to run without memorizing syntax.
- Files: adapters, `.cursor/commands/qt.md`, adapter tests
- Dependencies: T112, T113
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Render missing-variable prompts with exact completion examples.
  2. Keep host behavior aligned while respecting host UX limits.
  3. Add tests for missing/default variable UX flows.
- Acceptance criteria:
  - Missing-variable failures include a clear re-run command with values.
  - Host renderers preserve parity with contract docs.
- Validation evidence:
  - Added renderer handling for `qt:run:missing-variables` in `packages/core/src/rendering.ts`.
  - Added adapter boundary tests for missing-variable guidance in `packages/vscode-extension/test/qt-adapter.test.mjs` and `packages/openclaw-plugin/test/qt-adapter.test.mjs`.
  - Synced command/render contract docs (`docs/qt-adapter-rendering-matrix.md`).

### [x] T116 - Add task export command and runtime behavior

- Status: [x]
- Priority: P1
- Goal: Enable portable sharing of task templates from one repository/host to another.
- Files: core parser/runtime, contract docs, tests
- Dependencies: T101
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Define export command shape and payload.
  2. Implement deterministic export format with metadata.
  3. Add tests for single and batch export cases.
- Acceptance criteria:
  - Users can export template definitions without hand-copying markdown.
  - Export output is documented and stable for import workflows.
- Validation evidence:
  - Added parser/runtime support for `/qt export [task|--all]` in `packages/core/src/parser.ts` and `packages/core/src/runtime.ts`.
  - Added deterministic export envelope (`quicktask-export` v1) with stable payload rendering.
  - Added runtime tests for single-task export flow in `packages/core/test/runtime.test.mjs`.

### [x] T117 - Add task import command with conflict policies

- Status: [x]
- Priority: P1
- Goal: Support controlled template ingestion with safe collision handling.
- Files: core runtime/store, contract docs, tests
- Dependencies: T116
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Define import command and conflict strategy options.
  2. Implement no-overwrite default with explicit override mode.
  3. Add detailed error/recovery messaging for malformed imports.
- Acceptance criteria:
  - Import supports safe default behavior and explicit override path.
  - Conflict outcomes are deterministic and tested.
- Validation evidence:
  - Added parser/runtime support for `/qt import [--force] [payload-json]`.
  - Implemented default conflict-skip behavior and explicit overwrite mode with deterministic status codes (`qt:import:*`).
  - Added import/export integration coverage in `packages/core/test/runtime.test.mjs`.

### [x] T118 - Define template-pack manifest and local resolution rules

- Status: [x]
- Priority: P2
- Goal: Provide an organized unit for distributing sets of templates.
- Files: docs contracts, core support utilities, tests
- Dependencies: T116, T117
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Define pack manifest schema and validation rules.
  2. Implement local pack discovery/resolution behavior.
  3. Add compatibility/versioning strategy for manifest evolution.
- Acceptance criteria:
  - Manifest schema is documented with examples and validation checks.
  - Runtime can resolve valid packs and reject invalid manifests safely.
- Validation evidence:
  - Added pack manifest schema validation/resolution utilities in `packages/core/src/templatePacks.ts`.
  - Added runtime pack import command (`/qt import-pack [--force] [manifest-path]`) with invalid/missing-safe behavior.
  - Added tests in `packages/core/test/template-packs.test.mjs` and `packages/core/test/runtime.test.mjs`.

### [x] T120 - Create template eval harness scaffolding

- Status: [x]
- Priority: P1
- Goal: Introduce measurable quality checks for templates over time.
- Files: `tools/*` or `scripts/*`, CI workflow files, docs
- Dependencies: T106
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Define eval dataset format and pass/fail thresholds.
  2. Add baseline harness command integrated into CI optional checks.
  3. Document how to add new eval cases.
- Acceptance criteria:
  - Repository includes runnable eval harness with deterministic output.
  - Maintainers can add new template eval scenarios with documented steps.
- Validation evidence:
  - Added deterministic eval harness script `scripts/template-eval-harness.mjs`.
  - Added baseline dataset + sample templates in `docs/templates/eval-dataset.json` and `docs/templates/samples/*.md`.
  - Added `pnpm templates:eval` script and optional CI signal job in `.github/workflows/ci.yml`.
  - Documented eval expansion steps in `CONTRIBUTORS.md`.

### [x] T123 - Define low-risk fast-lane workflow policy

- Status: [x]
- Priority: P1
- Goal: Reduce process overhead for small low-risk changes without weakening release gates.
- Files: `docs/workflows/task-pr-delivery-workflow.md`, policy docs, contributor guide
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Define eligibility criteria for fast-lane changes.
  2. Specify reduced validation minimum and approval path.
  3. Add guardrails preventing fast-lane use for release-critical paths.
- Acceptance criteria:
  - Policy clearly identifies what qualifies and what is excluded.
  - Contributor docs include a deterministic decision table.
- Validation evidence:
  - Added fast-lane policy decision table, minimum validations, and exclusions in `docs/workflows/task-pr-delivery-workflow.md`.
  - Scope guardrails explicitly exclude release-critical/runtime-affecting changes from fast-lane behavior.

### [x] T124 - Add governance doc simplification and canonicalization pass

- Status: [x]
- Priority: P2
- Goal: Lower contributor cognitive load by reducing policy duplication.
- Files: `docs/governance-map.md`, policy docs, `CONTRIBUTORS.md`, `.cursor/rules/*.mdc`
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Audit duplicated guidance across policy sources.
  2. Collapse repeated text into canonical docs plus concise references.
  3. Add checks to prevent future policy drift.
- Acceptance criteria:
  - Governance docs are shorter and still auditable.
  - Duplicate/conflicting guidance is reduced and linked to one source of truth.
- Validation evidence:
  - Updated `docs/governance-map.md` to point canonical sources at `docs/policies/*` and `docs/workflows/*`.
  - Retained root pointer docs as explicit stable aliases to reduce duplication drift.
  - Updated contributor policy references in `CONTRIBUTORS.md` to canonical-first links.

### [x] T126 - Add privacy-safe product feedback loop for UX friction

- Status: [x]
- Priority: P2
- Goal: Capture actionable UX pain without collecting sensitive user content.
- Files: core diagnostics policy/implementation, docs, tests
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Define telemetry-lite UX events consistent with privacy guardrails.
  2. Add aggregate reporting path for onboarding/error friction signals.
  3. Add tests proving no raw prompt/template body leakage.
- Acceptance criteria:
  - Product feedback signals exist for key UX drop-off points.
  - Privacy constraints remain enforced and tested.
- Validation evidence:
  - Added aggregate, content-free friction counters (`clarification`, `incomplete`, `parse/storage error`, `missing-task`) to doctor diagnostics in `packages/core/src/runtime.ts`.
  - Updated doctor status contracts in `packages/core/src/types.ts` and rendering in `packages/core/src/rendering.ts`.
  - Extended runtime tests to assert feedback-signal diagnostics shape in `packages/core/test/runtime.test.mjs`.

### [x] T132 - Upgrade GitHub Actions to Node 24-compatible versions

- Status: [x]
- Priority: P1
- Goal: Remove GitHub-hosted workflow deprecation warnings by upgrading Node 20-based actions and validating RC/release workflows remain green.
- Files: `.github/workflows/*.yml`, `.github/actions/*` (if needed), `CONTRIBUTORS.md`/release docs as needed
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Audit all workflow actions currently running on Node 20 (checkout/setup-node/upload-artifact/action-gh-release, etc.).
  2. Upgrade to Node 24-compatible action versions and pin to supported releases.
  3. Align contributor/release docs that hardcode prior phase checks (for example `phase:check -- --phase 10`) with active Phase 11 execution.
  4. Re-run CI + RC + Release candidate validation and confirm deprecation annotations are cleared.
- Acceptance criteria:
  - RC/release workflow runs no longer emit Node 20 deprecation warnings.
  - Updated action versions and any phase-check doc references are documented and verified in workflow validation.
- Validation evidence:
  - Updated release-critical workflows/composite action to Node-24-ready action versions:
    - `.github/workflows/release-candidate.yml`: `actions/checkout@v5`, `actions/upload-artifact@v5`
    - `.github/workflows/release.yml`: `actions/checkout@v5`, `actions/upload-artifact@v5`
    - `.github/actions/setup-quicktask-workspace/action.yml`: `actions/setup-node@v5`
  - Replaced JS release action with CLI-based publish step in `.github/workflows/release.yml` to avoid Node 20 action-runtime dependency.
  - Aligned contributor docs to active phase checks (`pnpm phase:check -- --phase 11`) in `CONTRIBUTORS.md`.
  - RC validation succeeded after modernization changes: [run 23411644909](https://github.com/NJLaPrell/QuickTask/actions/runs/23411644909).
  - Production release succeeded with updated workflow path: [run 23411671946](https://github.com/NJLaPrell/QuickTask/actions/runs/23411671946).
  - Published release/tag output: [v1.0.0](https://github.com/NJLaPrell/QuickTask/releases/tag/v1.0.0).

### [x] T128 - Add contributor onboarding quickstart and first-task path

- Status: [x]
- Priority: P1
- Goal: Decrease time-to-first-contribution for new maintainers/contributors.
- Files: `CONTRIBUTORS.md`, `README.md`, docs templates/checklists
- Dependencies: T123, T124
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add a concise "first 30 minutes" contributor guide.
  2. Provide first-task playbook with branch/PR/check expectations.
  3. Add troubleshooting tips for common local setup failures.
- Acceptance criteria:
  - New contributors can complete first scoped task without policy scavenger hunt.
  - Onboarding docs include direct links to canonical workflow references.
- Validation evidence:
  - Added `First 30 minutes` onboarding path and troubleshooting guidance in `CONTRIBUTORS.md`.
  - Linked first-task branch/validation expectations in contributor quickstart flow.

### [x] T129 - Run `v1.0.0` stabilization and release-candidate validation loop

- Status: [x]
- Priority: P0
- Goal: Confirm release candidate quality on `main` after must-have product tasks land.
- Files: `TASKS.md`, `docs/release-readiness-report.md`, GitHub Actions RC workflow evidence
- Dependencies: T102, T103, T105, T104, T109, T110, T111
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Run `pnpm release:prepare` and resolve any new medium/high findings for current release phase.
  2. Run `Release Candidate Validation` workflow on `main`.
  3. If release-significant changes merge after RC, re-run RC and update evidence.
- Acceptance criteria:
  - Readiness report is `READY` with no unresolved medium/high findings for current phase (or explicit accepted-risk records).
  - Latest RC run for candidate commit set is successful and captured in task evidence.
- Validation evidence:
  - Readiness run: `pnpm release:prepare` -> `READY` (`docs/release-readiness-report.md`, 2026-03-22T19:22:21.624Z).
  - RC workflow run succeeded on `main`: [run 23410616375](https://github.com/NJLaPrell/QuickTask/actions/runs/23410616375).

### [x] T130 - Prepare `v1.0.0` release handoff inputs and docs-sync decisions

- Status: [x]
- Priority: P0
- Goal: Produce a complete, auditable release handoff payload before final dispatch.
- Files: `TASKS.md`, `README.md`, docs sync inputs/evidence in release handoff notes
- Dependencies: T129
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Confirm docs-sync gate inputs: `readme_status`, `docs_status`, `docs_sync_notes`.
  2. Confirm pending changesets match intended `v1.0.0` scope.
  3. Capture final `rc_run_id` and release handoff command/inputs in evidence.
- Acceptance criteria:
  - Release handoff inputs are complete, valid, and recorded.
  - Docs-sync decisions are explicit and justified when `no-change` is used.
- Validation evidence:
  - Handoff inputs prepared with explicit docs sync decisions: `readme_status=updated`, `docs_status=updated`, `docs_sync_notes="phase-10 init and lifecycle updates"`.
  - Pending changesets confirmed (`Pending changesets: 1`) in readiness report.
  - Captured final `rc_run_id=23410616375` and dispatch command via `pnpm release:handoff`.

### [x] T131 - Dispatch and verify `v1.0.0` production release workflow

- Status: [x]
- Priority: P0
- Goal: Execute the production release workflow and confirm `v1.0.0` publication outcomes.
- Files: `TASKS.md`, release workflow run evidence, tag/release artifact evidence
- Dependencies: T130
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Dispatch `Release` workflow from `main` with validated inputs and `rc_run_id`.
  2. Verify workflow succeeds through release gates, tag creation, and GitHub Release publication.
  3. Record run URL/ID, created tag, and key artifact verification evidence in task notes.
- Acceptance criteria:
  - `v1.0.0` release workflow run succeeds and publishes release/tag outputs.
  - Evidence in `TASKS.md` is sufficient for audit and post-release follow-up.
- Validation evidence:
  - Initial dispatch failed before merge: [run 23410634350](https://github.com/NJLaPrell/QuickTask/actions/runs/23410634350) at no-release-diff gate.
  - Merged release-significant updates to `main` via PR [#38](https://github.com/NJLaPrell/QuickTask/pull/38), reran RC [23410709034](https://github.com/NJLaPrell/QuickTask/actions/runs/23410709034), then re-dispatched release handoff.
  - Final release workflow succeeded: [run 23410723831](https://github.com/NJLaPrell/QuickTask/actions/runs/23410723831).
  - Published release/tag output: [v0.4.0](https://github.com/NJLaPrell/QuickTask/releases/tag/v0.4.0).

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
