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

- Last updated: 2026-03-21
- Current phase in execution: Phase 9 - CI/release platform hardening (ready to start)
- Current milestone target: Phase 9 CI hardening kickoff (`T060` then `T064`)
- Phase objective now: improve CI/release reliability and observability while preserving strict release/security gates.
- Active implementation (`[~]`): none
- Scheduled this phase (`[ ]`): none
- Ready queue (`[p]`): 32 tasks (phase 9-10 backlog)
- Blocked tasks (`[!]`): none
- Next tasks in order:
  1. T060 - Split CI into parallel jobs with clearer failure surfaces
  2. T064 - Refactor duplicated release workflow steps into reusable automation
  3. T068 - Make OpenClaw packaging cross-platform without system tar dependency
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
- Active/near-term IDs: T050, T051, T052, T053, T054, T055, T056, T057, T058, T059, T060, T061, T062, T063, T064, T065, T066, T067, T068, T069, T070, T071, T072, T073, T074, T075, T076, T077, T078, T079, T080, T081, T082, T083, T084, T085, T086, T087, T088, T089, T090, T091, T092, T093, T094, T095, T096, T097, T098, T099, T100.
- Archived task IDs: T019, T020.

### Phase 7 - Release governance and risk gates

- Delivery outcome: Release readiness is deterministic and auditable, with dual-source gating (milestones + active backlog), explicit risk acceptance, and strict diagnostics/privacy guardrails.
- Status: complete (awaiting archive cadence).
- Planned task IDs (in order): T053, T054, T065, T071, T083, T084, T085.

### Phase 8 - Minimal `/qt` product maturity

- Delivery outcome: `/qt` remains intentionally minimal while delivering top user value first (`list`, `show`, `doctor`) and then hardening adapter parity/UX consistency.
- Status: complete (awaiting archive cadence).
- Planned task IDs (in order): T086, T062, T056, T066, T077, T061, T055, T076, T070.

### Phase 9 - CI/release platform hardening

- Delivery outcome: Faster and more reliable release operations with reusable workflows, stronger security enforcement, cross-platform packaging/verification, and artifact contract checks.
- Status: planned.
- Planned task IDs (in order): T060, T064, T068, T073, T074, T080, T082, T098, T099, T100, T075, T081.

### Phase 10 - Operational polish and deferred enhancements

- Delivery outcome: Deferred enhancements, lifecycle polish, and governance automation are delivered after core release and product milestones are stable.
- Status: planned.
- Planned task IDs (in order): T057, T058, T059, T063, T087, T088, T089, T090, T092, T067, T069, T072, T091, T094, T095, T097, T078, T079, T093, T096.

## Active task backlog

Pending work below is triaged and ready for implementation.

### Proposed

- [p] T057 - Support quoted task names and richer parser input forms (P2)
- [p] T058 - Add proposal lifecycle GC to bound in-memory growth (P2)
- [p] T059 - Enforce session-only proposal lifecycle policy (P2)
- [p] T060 - Split CI into parallel jobs with clearer failure surfaces (P1)
- [p] T063 - Add docs/link integrity checker for workflow-critical references (P2)
- [p] T064 - Refactor duplicated release workflow steps into reusable automation (P2)
- [p] T067 - Add `/qt help [topic]` contextual help command (P3)
- [p] T068 - Make OpenClaw packaging cross-platform without system tar dependency (P1)
- [p] T069 - Add template quality lint for `tasks/*.md` content conventions (P3)
- [p] T072 - Add release-note quality validation beyond section format (P3)
- [p] T073 - Harden dependency-review enforcement and fallback behavior (P1)
- [p] T074 - Expand post-release verification across OS matrix (P2)
- [p] T075 - Add test coverage for package-manager consistency checker script (P3)
- [p] T078 - Add local CLI sandbox for QuickTask runtime command simulation (P4)
- [p] T079 - Add automated cleanup policy for quarantined corrupt templates (P4)
- [p] T080 - Validate release asset metadata contract in CI before publish (P1)
- [p] T081 - Add support-matrix consistency check against package/workflow floors (P3)
- [p] T082 - Add distributable package metadata and license compliance checks (P2)
- [p] T087 - Add proposed-task promotion and aging policy in TASKS workflow (P2)
- [p] T088 - Add phase exit checklist automation and report command (P2)
- [p] T089 - Add backlog integrity check for duplicates and phase assignment drift (P2)
- [p] T090 - Remove generated declaration files from source tree (P2)
- [p] T091 - Normalize task-state terminology across docs/commands/rules (P3)
- [p] T092 - Consolidate duplicated policy docs and rule references (P2)
- [p] T093 - Reorganize root documentation into a maintainable docs structure (P4)
- [p] T094 - Define and enforce generated-artifact version-control policy (P3)
- [p] T095 - Refactor duplicated test setup helpers for maintainability (P3)
- [p] T096 - Remove or replace low-value placeholder package docs (P4)
- [p] T097 - Audit and remove dead or unreferenced command/docs entrypoints (P3)
- [p] T098 - Add clean-room install-and-first-run journey tests for release artifacts (P0)
- [p] T099 - Make user-journey artifact tests release-blocking in RC and release workflows (P0)
- [p] T100 - Build host-specific artifact install validation harness (VSIX/OpenClaw/Cursor) (P1)

### Intake queue

- _Empty._

### In progress

- _Empty._

### Blocked

- _Empty._

## Proposed task details

### [x] T053 - Align release-readiness parser with active TASKS format

- Status: [x] complete (not yet archived)
- Priority: P0
- Goal: Restore release-readiness reliability by updating readiness parsing to use both milestone progression and active backlog/task-detail status in `TASKS.md`.
- Files: `scripts/release-prepare-readiness.mjs`, `scripts/test/release-prepare-readiness.test.mjs`, `TASKS.md`.
- Dependencies: T051.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Replace legacy milestone-line parsing assumptions with parsing against active backlog and task detail sections.
  2. Keep milestone-derived phase context and combine it with active status detection for gating.
  3. Recognize active statuses `[p]`, `[ ]`, `[~]`, and `[!]` as open work.
  4. Keep archived/completed status handling deterministic.
  5. Update tests to cover current dual-source gating behavior.
- Acceptance criteria:
  - `pnpm release:prepare` correctly identifies open readiness tasks in current `TASKS.md` format.
  - Release gating uses both milestone phase context and active backlog status signals.
  - Current release phase detection still behaves deterministically.
  - Parser tests cover at least one `[p]`, `[~]`, and `[!]` path.
- Validation evidence:
  - Updated `scripts/release-prepare-readiness.mjs` to parse open backlog/detail statuses (`[p]`, `[ ]`, `[~]`, `[!]`) and combine them with milestone-derived phase context.
  - Added parser regression coverage in `scripts/test/release-prepare-readiness.test.mjs` for `[~]`, `[!]`, and detail-only open-task paths.
  - Ran `node --test scripts/test/release-prepare-readiness.test.mjs`.
  - Ran `pnpm release:prepare` (report writes successfully; handoff remains blocked by expected `changeset-preflight` with zero pending changesets).

### [x] T054 - Add task tracker schema validator command

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Prevent tracker drift by validating task IDs, statuses, duplicate entries, and required fields through a repeatable command.
- Files: `scripts/tasks-check.mjs` (new), `package.json`, `TASKS.md`, docs/rules references as needed.
- Dependencies: T051, T053.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Implement `tasks-check` script for structural validation of `TASKS.md`.
  2. Validate status markers, ID uniqueness, and required fields for active/proposed/blocked tasks.
  3. Add npm script (`pnpm tasks:check`) and document usage.
  4. Optionally wire into CI as non-blocking first, then blocking.
- Acceptance criteria:
  - Command fails with actionable output on malformed task records.
  - Command passes on valid `TASKS.md`.
  - Status `[p]` and blocker metadata are validated.
- Validation evidence:
  - Added `scripts/tasks-check.mjs` and `pnpm tasks:check` command for tracker schema validation.
  - Added `scripts/test/tasks-check.test.mjs` with valid and malformed fixtures.
  - Wired `pnpm tasks:check` into `.github/workflows/ci.yml` and release readiness checks.
  - Ran `pnpm tasks:check`.

### [x] T055 - Unify adapter result rendering from shared core mapping

- Status: [x] complete (not yet archived)
- Priority: P2
- Goal: Reduce duplication and rendering drift between VS Code and OpenClaw by centralizing code-to-message mapping.
- Files: `packages/core/src/*` (new renderer helpers), `packages/vscode-extension/src/qtAdapter.ts`, `packages/openclaw-plugin/src/qtAdapter.ts`, adapter tests.
- Dependencies: T008, T038.
- Blocked by: none.
- Unblock plan: n/a
- Pros:
  - Reduces long-term adapter drift and duplicate maintenance.
  - Improves consistency for new runtime result codes.
  - Makes command-surface expansion (`list/show/doctor`) safer to ship.
- Cons:
  - High refactor surface across adapters and core.
  - Risk of subtle host-specific UX regressions during consolidation.
  - Can consume time better spent on direct user-facing features if over-scoped.
- Weighted recommendation: proceed, but split into small parity-first steps and gate with strong adapter tests.
- Steps:
  1. Design shared rendering helper inputs/outputs for `QtRuntimeResult`.
  2. Move common render logic to shared core utilities with host-specific formatting hooks.
  3. Update adapter code to consume shared mapping.
  4. Add tests ensuring parity for key result codes.
- Acceptance criteria:
  - Both adapters render the same semantic message for shared result codes.
  - Unknown-code fallback behavior remains explicit and tested.
  - Duplicate switch logic in adapters is significantly reduced.
- Validation evidence:
  - Added shared core renderer (`packages/core/src/rendering.ts`) and updated VS Code/OpenClaw adapters to consume it.
  - Added/updated adapter tests to validate shared semantic rendering paths (including unknown-code fallback safety).
  - Ran `pnpm test`.
  - Ran `pnpm test:smoke`.

### [x] T056 - Improve VS Code `/qt` interaction UX and markdown output

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Improve end-user experience by replacing plain information popups with richer markdown/chat-friendly output handling.
- Files: `packages/vscode-extension/src/extension.ts`, `packages/vscode-extension/src/qtAdapter.ts`, extension tests/docs.
- Dependencies: T055.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Improve command flow so markdown output is surfaced in a readable channel (chat stream/output panel).
  2. Tighten prompt extraction behavior for chat command requests.
  3. Ensure errors and request IDs remain visible.
  4. Add tests for command and chat participant UX paths.
- Acceptance criteria:
  - Markdown-heavy runtime results are rendered in a readable surface.
  - User can run `/qt` flows without parsing truncated popup text.
  - Existing command and participant behavior remains backward compatible.
- Validation evidence:
  - Updated VS Code command flow to write full markdown output to a dedicated `QuickTask` output channel instead of popup-only output.
  - Added compatibility-focused prompt normalization and non-chat fallback behavior via `chatCompat` helper.
  - Added test coverage for compatibility prompt handling and command output paths.
  - Ran `pnpm --filter quicktask-vscode test`.

### [p] T057 - Support quoted task names and richer parser input forms

- Status: [p]
- Priority: P2
- Goal: Expand command usability by supporting quoted task names and more robust token parsing.
- Files: `packages/core/src/parser.ts`, `packages/core/src/types.ts`, parser/runtime tests, contract docs.
- Dependencies: T003, T035.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Add parser support for quoted task names in create/run/improve forms.
  2. Preserve current behavior for simple unquoted forms.
  3. Document supported quoting rules and edge cases.
  4. Add tests for whitespace, quotes, and incomplete quoted input.
- Acceptance criteria:
  - Quoted task names with spaces parse deterministically.
  - Existing command forms continue to parse unchanged.
  - Docs/contracts reflect the expanded parsing behavior.
- Validation evidence:
  - Run parser and runtime tests in `@quicktask/core`.
  - Add targeted parser fixtures for quoted paths.

### [p] T058 - Add proposal lifecycle GC to bound in-memory growth

- Status: [p]
- Priority: P2
- Goal: Improve runtime maintainability by ensuring expired/finalized proposals are pruned from in-memory state.
- Files: `packages/core/src/runtime.ts`, runtime tests/docs.
- Dependencies: T036.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Add deterministic cleanup for expired/finalized proposals.
  2. Trigger cleanup on proposal reads/writes and optionally on interval/checkpoint.
  3. Add test coverage for GC behavior and bounded map growth.
  4. Document lifecycle semantics.
- Acceptance criteria:
  - Expired/finalized proposals do not accumulate unboundedly.
  - Proposal behavior remains deterministic across accept/reject/abandon/expire flows.
  - Runtime tests validate cleanup behavior.
- Validation evidence:
  - Run core runtime tests.
  - Add a stress-like unit test for proposal map size over repeated operations.

### [p] T059 - Enforce session-only proposal lifecycle policy

- Status: [p]
- Priority: P2
- Goal: Remove persistence ambiguity by codifying and enforcing session-only proposal behavior across runtime, docs, and adapter messaging.
- Files: `packages/core/src/runtime.ts`, `packages/core/src/types.ts`, `docs/qt-command-result-contract.md`, adapter docs/tests.
- Dependencies: T036, T058.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Codify session-only proposal policy as permanent product behavior.
  2. Ensure runtime/docs/error messages consistently communicate restart/session boundaries.
  3. Add tests for session reset and proposal-not-found guidance quality.
  4. Remove or avoid persistence-oriented roadmap language in active docs.
- Acceptance criteria:
  - Proposal actions are explicitly session-scoped with no persistence path.
  - Restart behavior consistently yields deterministic `proposal-not-found` messaging.
  - Docs and tests align with the permanent session-only policy.
- Validation evidence:
  - Run core runtime tests for proposal lifecycle.
  - Verify contract docs and adapter messaging updates.

### [p] T060 - Split CI into parallel jobs with clearer failure surfaces

- Status: [p]
- Priority: P1
- Goal: Improve CI maintainability and feedback speed by separating typecheck/lint/test/build/package/smoke into parallel jobs with explicit dependencies.
- Files: `.github/workflows/ci.yml`, docs as needed.
- Dependencies: T015, T024.
- Blocked by: T053, T065.
- Unblock plan: complete release-gating correctness and release-script test coverage first, then parallelize CI.
- Pros:
  - Better failure localization and potentially faster feedback.
  - Cleaner ownership boundaries for check categories.
  - Prepares groundwork for reusable workflow components.
- Cons:
  - Higher workflow orchestration complexity and required-check churn risk.
  - Can introduce flaky dependency ordering and noisy status transitions.
  - Limited immediate end-user value compared with governance fixes.
- Weighted recommendation: defer until core release governance tasks are stable.
- Steps:
  1. Break monolithic verify job into focused jobs with shared setup.
  2. Keep release-relevant checks as required while improving failure localization.
  3. Preserve artifact uploads and smoke coverage.
  4. Update contributor docs with any command/check mapping changes.
- Acceptance criteria:
  - CI reports failures by domain (lint/test/build/etc.) with less log noise.
  - End-to-end required checks remain equivalent in strictness.
  - Workflow runtime improves or remains neutral with clearer observability.
- Validation evidence:
  - Validate workflow syntax and run on PR.
  - Compare check outcomes before/after on representative changes.

### [x] T061 - Add contract drift guard between runtime codes and adapters/docs

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Prevent behavior/docs drift by enforcing that runtime result codes are represented in adapter renderers and canonical docs.
- Files: `packages/core/src/types.ts`, adapter renderers, `docs/qt-command-result-contract.md`, `docs/qt-adapter-rendering-matrix.md`, new validation script/tests.
- Dependencies: T035, T038, T055.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Enumerate canonical runtime result codes from source of truth.
  2. Add guard test/script validating renderer/doc coverage.
  3. Fail CI when new runtime codes are undocumented or unrendered.
  4. Document remediation workflow for contributors.
- Acceptance criteria:
  - Drift is caught automatically before merge.
  - Adding a new runtime code requires explicit renderer/doc updates.
  - Guard output is actionable.
- Validation evidence:
  - Added `scripts/check-qt-contract-drift.mjs` and `pnpm qt:check-contract-drift` to validate runtime code coverage across contract docs and shared renderer coverage.
  - Added `scripts/test/check-qt-contract-drift.test.mjs` with intentional mismatch fixture assertions.
  - Wired drift guard into `.github/workflows/ci.yml`.
  - Ran `pnpm qt:check-contract-drift`.
  - Ran `pnpm test`.

### [x] T062 - Add `/qt list` and `/qt show [task]` discovery commands

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Improve user experience by letting users discover existing templates without guessing names.
- Files: `packages/core/src/parser.ts`, `packages/core/src/runtime.ts`, `packages/core/src/store.ts`, `packages/core/src/types.ts`, adapter renderers, docs/tests.
- Dependencies: T003, T008, T035.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Add parser support for `/qt list` and `/qt show [task]`.
  2. Implement runtime/store listing and template preview behavior.
  3. Render responses across VS Code/OpenClaw/Cursor pathways.
  4. Update canonical command/result docs and tests.
- Acceptance criteria:
  - Users can list available task templates and inspect one template body.
  - Not-found handling for `/qt show` is deterministic.
  - New commands are documented and adapter-rendered consistently.
- Validation evidence:
  - Added parser/runtime/store support for `/qt list` and `/qt show [task]` with deterministic not-found handling.
  - Added adapter rendering coverage and smoke-path assertions for list/show flows.
  - Updated canonical command/result and rendering-matrix docs for new commands.
  - Ran `pnpm test`.
  - Ran `pnpm test:smoke`.

### [p] T063 - Add docs/link integrity checker for workflow-critical references

- Status: [p]
- Priority: P2
- Goal: Improve maintainability by automatically validating that referenced policy/workflow documents and key intra-repo links exist and remain current.
- Files: `scripts/check-doc-links.mjs` (new), `package.json`, docs and rule files as needed, optional workflow wiring.
- Dependencies: T054.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Parse core docs/rules/command files for local markdown/code path references.
  2. Validate referenced files exist and required anchor-like sections are present where practical.
  3. Add command (`pnpm docs:check-links`) and contributor guidance.
  4. Optionally wire into CI.
- Acceptance criteria:
  - Broken local doc references fail with actionable output.
  - Checker runs quickly and deterministically in local/CI environments.
  - Core governance docs are included in default scan targets.
- Validation evidence:
  - Run `pnpm docs:check-links`.
  - Add fixture coverage for missing-reference failures.

### [p] T064 - Refactor duplicated release workflow steps into reusable automation

- Status: [p]
- Priority: P2
- Goal: Reduce CI/release maintenance overhead by extracting repeated setup/validation steps shared by release and RC workflows.
- Files: `.github/workflows/release.yml`, `.github/workflows/release-candidate.yml`, reusable workflow/composite action files (new), docs.
- Dependencies: T060.
- Blocked by: T060, T071.
- Unblock plan: establish stable workflow contracts and CI job boundaries before deduplicating.
- Pros:
  - Reduces duplicate YAML and future maintenance burden.
  - Improves consistency between RC and release flows.
  - Makes future release logic changes easier to apply safely.
- Cons:
  - Refactor risk in the most critical release path.
  - Can obscure behavior if abstraction is too early or too broad.
  - Debuggability may worsen during transition.
- Weighted recommendation: keep, but treat as late hardening after contract checks are in place.
- Steps:
  1. Identify duplicated steps (setup/install/check/build/package/verify).
  2. Move shared logic to reusable workflow or composite action.
  3. Keep branch gating and release-specific logic isolated.
  4. Validate both workflows produce equivalent outcomes.
- Acceptance criteria:
  - Duplicate YAML step volume is reduced materially.
  - RC and release workflows remain functionally equivalent.
  - Contributor docs describe reusable workflow boundaries.
- Validation evidence:
  - Run workflow lint/validation.
  - Validate both workflows on test dispatch runs.

### [x] T065 - Add test coverage for release handoff and docs gate scripts

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Improve release reliability by adding focused tests for `release-handoff` and `release-docs-check` script behavior and edge cases.
- Files: `scripts/release-handoff.mjs`, `scripts/release-docs-check.mjs`, `scripts/test/*.test.mjs` (new/updated).
- Dependencies: T053.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Add unit tests for argument/env validation and failure conditions.
  2. Validate docs-status/no-change justification behavior.
  3. Add tests for readiness-state gate checks and forced override behavior.
  4. Ensure tests run as part of root `pnpm test`.
- Acceptance criteria:
  - Script behavior is covered for pass/fail edge cases.
  - Regressions in release gate checks are caught in CI tests.
  - Test output is actionable for maintainers.
- Validation evidence:
  - Refactored `scripts/release-handoff.mjs` and `scripts/release-docs-check.mjs` to export testable validation helpers without changing CLI behavior.
  - Added `scripts/test/release-handoff.test.mjs` and `scripts/test/release-docs-check.test.mjs` for argument/env, readiness-state, and force-override paths.
  - Ran `node --test scripts/test/**/*.test.mjs`.
  - Ran `pnpm test`.

### [x] T066 - Remove unsafe VS Code chat API casts with compatibility wrapper

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Improve maintainability and type safety by removing `as unknown as` casting in VS Code adapter chat integration.
- Files: `packages/vscode-extension/src/extension.ts`, extension types/helpers/tests.
- Dependencies: T056.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Introduce typed compatibility wrapper for optional chat API availability.
  2. Remove unsafe casting while preserving runtime fallback behavior.
  3. Add tests for no-chat-API and chat-enabled environments.
  4. Document compatibility expectations.
- Acceptance criteria:
  - Unsafe cast chain in extension activation path is removed.
  - Extension still works when chat API is unavailable.
  - Behavior remains backward compatible and test-covered.
- Validation evidence:
  - Replaced unsafe extension chat API casts with compatibility helper (`packages/vscode-extension/src/chatCompat.ts`) and guarded chat API resolution.
  - Added tests for chat-API missing and chat-API present compatibility paths.
  - Ran `pnpm --filter quicktask-vscode check`.
  - Ran `pnpm --filter quicktask-vscode test`.

### [p] T067 - Add `/qt help [topic]` contextual help command

- Status: [p]
- Priority: P3
- Goal: Improve discoverability by providing targeted help for command families (create/run/improve/actions) instead of one generic help block.
- Files: `packages/core/src/parser.ts`, `packages/core/src/runtime.ts`, `packages/core/src/types.ts`, adapter renderers/docs/tests.
- Dependencies: T062, T086.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Add parser support for `/qt help [topic]`.
  2. Return topic-specific usage guidance in runtime results.
  3. Render topical help consistently across adapters.
  4. Update command contract docs and tests.
- Acceptance criteria:
  - Users can request targeted help for major command families.
  - Invalid topics return deterministic fallback guidance.
  - Docs and tests cover new help behavior.
- Validation evidence:
  - Run core parser/runtime tests.
  - Verify adapter rendering paths for topic help.

### [p] T068 - Make OpenClaw packaging cross-platform without system tar dependency

- Status: [p]
- Priority: P1
- Goal: Improve workspace portability by replacing shell `tar` dependency with a Node-based cross-platform archive path.
- Files: `scripts/package-openclaw-artifact.mjs`, dependencies/config if needed, packaging docs/tests.
- Dependencies: T017.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Replace external `tar` invocation with Node package or native API approach.
  2. Preserve current artifact structure and naming conventions.
  3. Add validation checks for archive contents.
  4. Update docs for packaging assumptions.
- Acceptance criteria:
  - Packaging succeeds on Linux/macOS/Windows runner environments.
  - Artifact layout remains install-compatible.
  - Packaging errors remain clear and actionable.
- Validation evidence:
  - Run `pnpm package:openclaw`.
  - Verify archive contents in `artifacts/`.

### [p] T069 - Add template quality lint for `tasks/*.md` content conventions

- Status: [p]
- Priority: P3
- Goal: Improve task/template output quality by validating conventions (title, goal line, concise directives) for task template markdown files.
- Files: `scripts/check-task-templates.mjs` (new), `package.json`, `tasks/` samples/tests/docs.
- Dependencies: T054.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Define minimal template conventions and anti-patterns.
  2. Add checker script and command (`pnpm tasks:check-templates`).
  3. Add fixtures/tests for pass/fail paths.
  4. Document remediation guidance for template authors.
- Acceptance criteria:
  - Invalid template structure is detected with actionable errors.
  - Checker does not block legitimate variation in task intent.
  - Template quality checks are easy to run in contributor workflow.
- Validation evidence:
  - Run `pnpm tasks:check-templates`.
  - Verify fixture-based tests.

### [x] T070 - Add adapter E2E coverage for improve action lifecycle

- Status: [x] complete (not yet archived)
- Priority: P2
- Goal: Strengthen reliability by extending host smoke tests to cover accept/reject/abandon/expired improve actions end-to-end.
- Files: `scripts/smoke-host-adapters.mjs`, adapter tests, optional test helpers.
- Dependencies: T024, T036.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Extend smoke flow to include full proposal lifecycle actions.
  2. Add deterministic expiry path testing (with controlled time where needed).
  3. Ensure host-specific rendering expectations are validated.
  4. Keep test runtime practical for CI.
- Acceptance criteria:
  - Improve action lifecycle regressions are caught by smoke/e2e coverage.
  - Proposal expiry behavior is tested deterministically.
  - Tests remain stable and low-flake.
- Validation evidence:
  - Extended `scripts/smoke-host-adapters.mjs` to cover accept/reject/abandon plus deterministic expiry lifecycle path.
  - Added adapter-boundary lifecycle assertions in VS Code and OpenClaw adapter test suites.
  - Ran `pnpm test:smoke`.
  - Ran `pnpm --filter quicktask-vscode test`.
  - Ran `pnpm --filter quicktask-openclaw test`.

### [x] T071 - Add workflow contract checks for release inputs and docs gates

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Reduce release risk by validating that workflow dispatch inputs, script flags, and docs-gate env expectations stay aligned over time.
- Files: `scripts/check-workflow-contracts.mjs` (new), workflow files, release scripts/tests/docs.
- Dependencies: T064, T065.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Define contract assertions across `release.yml`, `release-handoff.mjs`, and docs gate scripts.
  2. Implement static checks for expected input/flag/env names.
  3. Add command (for example `pnpm release:check-workflow-contracts`).
  4. Wire check into CI/release prep pipeline.
- Acceptance criteria:
  - Contract drift between workflow YAML and helper scripts is detected pre-release.
  - Checks fail with clear remediation hints.
  - Contributors can run contract check locally.
- Validation evidence:
  - Added `scripts/check-workflow-contracts.mjs` and `pnpm release:check-workflow-contracts`.
  - Added fixture coverage in `scripts/test/check-workflow-contracts.test.mjs` for aligned and drifted contract paths.
  - Wired contract checks into `ci.yml`, `release.yml`, `release-candidate.yml`, and `release:prepare`.
  - Ran `pnpm release:check-workflow-contracts`.

### [p] T072 - Add release-note quality validation beyond section format

- Status: [p]
- Priority: P3
- Goal: Improve user-facing release quality by enforcing practical checks on generated/curated notes (empty highlights, duplicate bullets, weak summaries).
- Files: `scripts/validate-release-notes-quality.mjs` (new), `scripts/generate-curated-release-notes.mjs`, `package.json`, release workflow/docs.
- Dependencies: T047.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Define quality heuristics for release-note usefulness.
  2. Add validator command and integrate with release workflow.
  3. Ensure validator remains permissive enough for low-change releases.
  4. Document how to resolve quality warnings/failures.
- Acceptance criteria:
  - Low-quality/empty release notes are flagged before publication.
  - Validator output points to specific section issues.
  - Release workflow remains reliable for expected edge cases.
- Validation evidence:
  - Run quality validator locally.
  - Verify release workflow integration in dry-run/test branch.

### [p] T073 - Harden dependency-review enforcement and fallback behavior

- Status: [p]
- Priority: P1
- Goal: Improve security signal reliability by removing silent pass behavior in dependency review while preserving clear fallback semantics.
- Files: `.github/workflows/security.yml`, security docs.
- Dependencies: T028.
- Blocked by: T085.
- Unblock plan: finalize formal risk-acceptance policy so security gating exceptions are explicit and auditable.
- Pros:
  - Stronger supply-chain security signal on PRs.
  - Prevents silent acceptance of high-severity dependency risk.
  - Aligns security behavior with stricter governance.
- Cons:
  - Tool availability/false-positive edge cases can block healthy PR flow.
  - Requires careful fallback semantics to avoid developer frustration.
  - Could increase operational overhead without acceptance policy discipline.
- Weighted recommendation: proceed, but only alongside explicit risk-acceptance policy and clear fallback criteria.
- Steps:
  1. Rework `dependency-review` job to avoid `continue-on-error: true` for actionable failures.
  2. Define explicit fallback behavior only for platform-unavailable cases.
  3. Ensure audit and dependency-review findings are clearly separated in job output.
  4. Document expected failure semantics for contributors.
- Acceptance criteria:
  - High-severity dependency review findings fail PR checks deterministically.
  - Fallback messaging is only used for genuine platform limitations.
  - Security workflow behavior is documented.
- Validation evidence:
  - Run/inspect security workflow on a PR with dependency changes.
  - Verify failure and fallback paths with test scenarios.

### [p] T074 - Expand post-release verification across OS matrix

- Status: [p]
- Priority: P2
- Goal: Increase release confidence by validating published assets on multiple operating systems, not Ubuntu only.
- Files: `.github/workflows/post-release-verify.yml`, verification scripts/docs.
- Dependencies: T026, T046.
- Blocked by: T080.
- Unblock plan: lock artifact metadata/schema checks first, then scale verification matrix.
- Pros:
  - Improves real-world release confidence across supported platforms.
  - Catches OS-specific install/runtime issues earlier.
  - Strengthens external reliability posture.
- Cons:
  - Higher CI cost and runtime, with potential platform flake.
  - Operational complexity in triaging OS-specific failures.
  - Lower immediate ROI before core release gates are stabilized.
- Weighted recommendation: defer until artifact-contract checks are deterministic.
- Steps:
  1. Introduce matrix runs for at least Ubuntu + macOS + Windows where feasible.
  2. Keep asset download and checksum verification consistent across environments.
  3. Capture OS-specific install/verification constraints in workflow summaries.
  4. Update docs for post-release verification scope.
- Acceptance criteria:
  - Post-release verification validates artifacts on at least two OS families beyond Linux baseline.
  - OS-specific failures are visible and actionable.
  - Verification runtime remains practical.
- Validation evidence:
  - Trigger post-release verification on a tag/release test.
  - Compare matrix job summaries.

### [p] T075 - Add test coverage for package-manager consistency checker script

- Status: [p]
- Priority: P3
- Goal: Improve tooling reliability by adding unit tests for `scripts/check-package-manager-consistency.mjs`.
- Files: `scripts/check-package-manager-consistency.mjs`, `scripts/test/*.test.mjs` (new).
- Dependencies: T043.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Add testable helper exports for workflow parsing and version checks.
  2. Add tests for matching version, mismatch, and no-pnpm-setup cases.
  3. Ensure script still works as CLI entrypoint.
  4. Integrate tests into root test run.
- Acceptance criteria:
  - Core checker logic is test-covered for pass/fail paths.
  - Regressions in version matching are caught before CI failures.
  - Script output remains actionable.
- Validation evidence:
  - Run `pnpm test`.
  - Run `pnpm check:package-manager`.

### [x] T076 - Add adapter normalization parity test suite in shared smoke harness

- Status: [x] complete (not yet archived)
- Priority: P2
- Goal: Prevent host UX drift by asserting command normalization parity between VS Code and OpenClaw adapters.
- Files: `scripts/smoke-host-adapters.mjs`, adapter tests, optional shared test fixtures.
- Dependencies: T055, T070.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Define normalization parity cases (empty input, plain text, explicit `/qt` command forms).
  2. Add shared assertions for both adapters in smoke or dedicated cross-adapter tests.
  3. Ensure divergences are intentional and documented where unavoidable.
  4. Keep parity tests lightweight and deterministic.
- Acceptance criteria:
  - Unintended normalization mismatches fail tests.
  - Known/intentional host differences are explicit in test expectations.
  - Test coverage includes command and improve-action forms.
- Validation evidence:
  - Added cross-adapter normalization parity assertions in shared smoke harness for empty input, implicit create, explicit command, show, and improve-action forms.
  - Added adapter normalization parity test coverage in OpenClaw test suite.
  - Ran `pnpm test:smoke`.
  - Ran adapter test suites via `pnpm test`.

### [x] T077 - Add `/qt doctor` diagnostics command for storage/runtime health

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Improve user supportability with a diagnostics command that reports storage path, writability, and recent runtime health signals.
- Files: `packages/core/src/parser.ts`, `packages/core/src/runtime.ts`, `packages/core/src/types.ts`, adapter renderers/docs/tests.
- Dependencies: T029.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Add parser/runtime support for `/qt doctor`.
  2. Return safe diagnostic metadata (tasks dir resolution, write-check status, version info).
  3. Render diagnostics consistently in each adapter.
  4. Update docs/contracts and tests.
- Acceptance criteria:
  - `/qt doctor` returns structured, non-sensitive diagnostics.
  - Common storage misconfiguration issues are detectable quickly.
  - Command behavior is documented and test-covered.
- Validation evidence:
  - Added parser/runtime support for `/qt doctor` with safe diagnostics payload (tasks path, writability, task count, runtime version, recent runtime codes).
  - Added store health probe helpers and adapter render/test coverage for doctor output.
  - Updated command/result contract and adapter rendering matrix documentation.
  - Ran core/parser/runtime and adapter tests via `pnpm test`.

### [p] T078 - Add local CLI sandbox for QuickTask runtime command simulation

- Status: [p]
- Priority: P4
- Goal: Improve developer experience by adding a small local CLI harness to run and inspect runtime command responses without loading a host adapter.
- Files: `scripts/qt-sandbox.mjs` (new), `package.json`, contributor docs.
- Dependencies: T022.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Add a script that accepts command text and optional tasks-dir override.
  2. Print normalized command/result payloads for debugging.
  3. Add examples to contributor docs.
  4. Ensure script does not alter default repo state unexpectedly.
- Acceptance criteria:
  - Contributors can debug parser/runtime flows quickly from terminal.
  - Script supports custom tasks directory for isolated testing.
  - Usage is documented and easy to discover.
- Validation evidence:
  - Run CLI with help/create/run/improve scenarios.
  - Verify no unintended writes outside selected tasks dir.

### [p] T079 - Add automated cleanup policy for quarantined corrupt templates

- Status: [p]
- Priority: P4
- Goal: Improve workspace hygiene by managing growth of `*.corrupt.*.bak` files created during corruption quarantine.
- Files: `packages/core/src/store.ts`, maintenance script (new), docs/tests.
- Dependencies: T030.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Define retention policy for quarantined backup files (count/age based).
  2. Implement cleanup strategy (on write/read path or dedicated maintenance script).
  3. Preserve forensic usefulness while preventing unbounded backup accumulation.
  4. Document recovery and cleanup behavior.
- Acceptance criteria:
  - Quarantine backups remain available short-term but do not grow unboundedly.
  - Cleanup behavior is deterministic and test-covered.
  - Policy is documented for operators.
- Validation evidence:
  - Add/store tests for retention behavior.
  - Verify cleanup with fixture backup sets.

### [p] T080 - Validate release asset metadata contract in CI before publish

- Status: [p]
- Priority: P1
- Goal: Increase release reliability by asserting required fields and schema consistency in generated integrity metadata before release publication.
- Files: `scripts/generate-release-integrity.mjs`, `scripts/verify-release-assets.mjs`, schema/validation helper (new), workflows/tests.
- Dependencies: T048.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Define explicit metadata schema for release-integrity JSON.
  2. Add validation step before publishing release artifacts.
  3. Fail CI/release when metadata is missing required fields or malformed.
  4. Document schema expectations.
- Acceptance criteria:
  - Metadata schema violations are caught before release publish.
  - Verification output clearly identifies missing/invalid fields.
  - Schema is versioned or explicitly managed for future changes.
- Validation evidence:
  - Run release packaging and verification commands.
  - Add test/fixture with malformed metadata.

### [p] T081 - Add support-matrix consistency check against package/workflow floors

- Status: [p]
- Priority: P3
- Goal: Prevent documentation drift by checking `README.md` support matrix values against package engine declarations and workflow Node/pnpm floors.
- Files: `scripts/check-support-matrix-consistency.mjs` (new), `README.md`, package manifests, workflow files, docs/tests.
- Dependencies: T027.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Parse support-floor entries from README matrix.
  2. Compare values with package `engines`, CI/release workflow setup, and package manager policy.
  3. Emit actionable diff when mismatch is detected.
  4. Add command and optional CI wiring.
- Acceptance criteria:
  - Mismatches between docs and enforced runtime floors fail check.
  - Contributors get clear guidance on which source should be updated.
  - Check can run locally and in CI.
- Validation evidence:
  - Run consistency check command.
  - Validate mismatch detection with fixture or controlled edit.

### [p] T082 - Add distributable package metadata and license compliance checks

- Status: [p]
- Priority: P2
- Goal: Improve distribution quality by validating that publishable artifacts include required metadata (license/repository/version fields) and expected files.
- Files: package manifests under `packages/`, packaging scripts, compliance checker script (new), CI/docs.
- Dependencies: T016, T017, T046.
- Blocked by: T080, T083.
- Unblock plan: complete release asset contract validation and change-based cadence policy before adding compliance gates.
- Pros:
  - Improves distribution quality and legal/compliance hygiene.
  - Reduces risk of metadata omissions in publishable artifacts.
  - Useful foundation for broader marketplace/enterprise adoption.
- Cons:
  - Can add heavy process overhead for modest near-term product gain.
  - Benefit depends on distribution/compliance requirements that may be premature.
  - Another potential gate that could delay releases if over-strict.
- Weighted recommendation: keep as late-stage hardening, not near-term critical path.
- Steps:
  1. Define minimum metadata/file requirements for distributable packages.
  2. Add checker script for package manifests and built artifact contents.
  3. Integrate check into packaging/release verification path.
  4. Document compliance expectations.
- Acceptance criteria:
  - Missing required metadata/file entries fail compliance checks.
  - Distribution artifacts meet declared package policy.
  - Checker output is actionable for maintainers.
- Validation evidence:
  - Run compliance check command.
  - Verify packaging pipeline behavior with compliance gate enabled.

### [x] T083 - Codify change-based release cadence and trigger timing policy

- Status: [x] complete (not yet archived)
- Priority: P0
- Goal: Define and enforce a release cadence based on shipped change volume/risk rather than calendar intervals.
- Files: `RELEASE_STRATEGY.md`, `CONTRIBUTORS.md`, `PRE_RELEASE_READINESS_WORKFLOW.md`, `.cursor/rules/release-strategy.mdc`, optional helper scripts.
- Dependencies: T053, T071.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Define change-based release trigger thresholds (for example pending changesets + risk state + docs sync readiness).
  2. Document best-practice timing policy for release dispatch (for example avoid releasing while unresolved medium/high findings exist, ensure RC success freshness).
  3. Add checklist/automation hints for release timing decisions.
  4. Align rules and contributor docs with the same cadence policy.
- Acceptance criteria:
  - Release cadence policy is explicit, non-calendar-based, and documented.
  - Trigger criteria are deterministic and reusable by maintainers/agents.
  - Policy is reflected in workflow/rule docs.
- Validation evidence:
  - Updated `RELEASE_STRATEGY.md`, `CONTRIBUTORS.md`, `PRE_RELEASE_READINESS_WORKFLOW.md`, and `.cursor/rules/release-strategy.mdc` with deterministic change-based trigger/timing criteria.
  - Confirmed release handoff workflow now references change-volume/risk/readiness gates rather than calendar cadence.
  - Ran `pnpm release:prepare` against updated cadence/checklist policy.

### [x] T084 - Enforce local-only diagnostics and zero-PII logging policy

- Status: [x] complete (not yet archived)
- Priority: P0
- Goal: Guarantee diagnostics remain local-only and never log PII/user-content across core runtime, adapters, and workflows.
- Files: `packages/core/src/runtime.ts`, adapter logging/render paths, docs (`ARCHITECTURE.md`, contracts), tests.
- Dependencies: T029, T077.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Codify a strict diagnostics privacy policy (local-only, no PII/content logging) in docs.
  2. Audit runtime and adapter logging paths for potential sensitive leakage.
  3. Add tests/assertions that diagnostics payloads exclude user input/template content.
  4. Add contributor guidance for safe diagnostic additions.
- Acceptance criteria:
  - Documented policy states diagnostics are local-only forever.
  - Runtime/adapters do not emit raw user input or template bodies in diagnostics.
  - Test coverage fails on sensitive-field leakage regressions.
- Validation evidence:
  - Added privacy assertions in `packages/core/test/runtime.test.mjs` and adapter unknown-result tests in `packages/vscode-extension/test/qt-adapter.test.mjs` and `packages/openclaw-plugin/test/qt-adapter.test.mjs`.
  - Updated diagnostics/privacy policy documentation in `ARCHITECTURE.md`, `docs/qt-command-result-contract.md`, and `CONTRIBUTORS.md`.
  - Ran `pnpm test` to validate core and adapter privacy guardrails.

### [x] T085 - Add formal risk acceptance policy for medium/high findings

- Status: [x] complete (not yet archived)
- Priority: P0
- Goal: Standardize how medium/high findings can be explicitly accepted, by whom, with required rationale and expiration.
- Files: `PRE_RELEASE_READINESS_WORKFLOW.md`, `RELEASE_STRATEGY.md`, `PR_REVIEW_MERGE_STRATEGY.md`, `.cursor/rules/pre-release-readiness.mdc`, `.cursor/rules/pr-review-merge-strategy.mdc`, `TASKS.md` guidance.
- Dependencies: T071, T083.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Define acceptance criteria for medium/high findings (required approver, rationale, scope, and sunset/revisit date).
  2. Define where acceptance records are stored in `TASKS.md`.
  3. Update readiness/review docs and rules to enforce the same policy.
  4. Add template/checklist for recording accepted risk.
- Acceptance criteria:
  - Risk acceptance process is explicit and auditable.
  - Medium/high findings cannot be silently bypassed.
  - Docs/rules consistently reference the same acceptance protocol.
- Validation evidence:
  - Added `Risk acceptance records` policy/template section in `TASKS.md` with required audit fields and active-record tracking.
  - Updated `PRE_RELEASE_READINESS_WORKFLOW.md`, `RELEASE_STRATEGY.md`, `PR_REVIEW_MERGE_STRATEGY.md`, `.cursor/rules/pre-release-readiness.mdc`, and `.cursor/rules/pr-review-merge-strategy.mdc` for consistent medium/high acceptance protocol.
  - Validated policy docs for consistency and exercised readiness flow with explicit accepted-risk record template guidance.

### [x] T086 - Codify approved `/qt` command surface (list/show/doctor) and defer non-core growth

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Prevent command-surface churn by explicitly approving `list/show/doctor` additions while deferring non-core expansion unless re-approved.
- Files: `docs/qt-command-result-contract.md`, `README.md`, `ARCHITECTURE.md`, `.cursor/commands/qt.md`, `TASK_DISCOVERY_WORKFLOW.md`.
- Dependencies: T062, T077.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Document approved near-term command scope as `/qt`, create/run/improve actions, plus `list/show/doctor`.
  2. Mark additional command proposals as deferred unless explicitly requested.
  3. Align discovery workflow so future task generation respects this boundary.
  4. Update docs/command wrapper references to the same scope statement.
- Acceptance criteria:
  - Approved command scope is explicit in canonical docs.
  - Task discovery avoids proposing out-of-scope command expansions by default.
  - Contributors can quickly identify command-surface policy.
- Validation evidence:
  - Updated approved command-surface policy across `docs/qt-command-result-contract.md`, `README.md`, `ARCHITECTURE.md`, `.cursor/commands/qt.md`, and `TASK_DISCOVERY_WORKFLOW.md`.
  - Explicitly documented deferred-by-default policy for non-core command expansion.
  - Verified contract/docs alignment and kept discovery workflow constrained to approved surface.

### [p] T087 - Add proposed-task promotion and aging policy in TASKS workflow

- Status: [p]
- Priority: P2
- Goal: Prevent backlog bloat by defining deterministic rules for promoting `[p]` tasks, aging stale proposals, and pruning low-value items.
- Files: `TASKS.md`, `TASK_DISCOVERY_WORKFLOW.md`, `.cursor/rules/task-discovery-workflow.mdc`, contributor docs.
- Dependencies: T054, T086.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Define promotion criteria from `[p] -> [ ]` (impact, dependency readiness, risk).
  2. Define stale-task aging policy (for example review every N cycles; archive/cancel if no sponsor).
  3. Add explicit pruning/parking-lot behavior for low-ROI proposals.
  4. Update docs/rules to enforce the same lifecycle.
- Acceptance criteria:
  - Proposed-task lifecycle policy is explicit and documented.
  - Backlog hygiene actions are repeatable and auditable.
  - Discovery runs no longer allow indefinite accumulation without triage.
- Validation evidence:
  - Review docs/rules consistency.
  - Simulate triage pass against current proposed backlog.

### [p] T088 - Add phase exit checklist automation and report command

- Status: [p]
- Priority: P2
- Goal: Improve delivery predictability by adding a command that validates phase exit criteria and reports remaining blockers.
- Files: `scripts/phase-exit-check.mjs` (new), `package.json`, `TASKS.md`, docs/rules.
- Dependencies: T053, T085.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Define machine-checkable phase exit criteria inputs (open statuses, blocker counts, required policies).
  2. Implement command (for example `pnpm phase:check --phase <N>`) with concise report output.
  3. Ensure dual-source gating signals are reflected for release-related phases.
  4. Document operator usage and expected outputs.
- Acceptance criteria:
  - Phase check command identifies whether a phase is exit-ready.
  - Output lists concrete blocking tasks/policies when not ready.
  - Command behavior is deterministic and test-covered.
- Validation evidence:
  - Run phase check for at least Phase 7 and Phase 8.
  - Add tests for ready/not-ready fixtures.

### [p] T089 - Add backlog integrity check for duplicates and phase assignment drift

- Status: [p]
- Priority: P2
- Goal: Prevent planning errors by detecting duplicate task references across phases/sections and mismatched phase assignment metadata.
- Files: `scripts/tasks-check.mjs`, `TASKS.md`, optional test fixtures/docs.
- Dependencies: T054.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Extend task checker to detect duplicate task IDs across phase planning lines and backlog sections.
  2. Validate tasks are not assigned to conflicting phases simultaneously.
  3. Report drift with actionable fix suggestions.
  4. Add tests for duplicate and phase-conflict scenarios.
- Acceptance criteria:
  - Duplicate phase/task references are caught automatically.
  - Phase-assignment drift fails checks with clear remediation guidance.
  - Checker remains fast and usable in local workflow.
- Validation evidence:
  - Run `pnpm tasks:check` (or equivalent) with drift fixtures.
  - Confirm clean pass on current backlog after fixes.

### [p] T090 - Remove generated declaration files from source tree

- Status: [p]
- Priority: P2
- Goal: Reduce source-tree noise and dead file confusion by removing committed generated `.d.ts` files from `packages/core/src` and enforcing declaration output in build artifacts only.
- Files: `packages/core/src/*.d.ts`, `packages/core/tsconfig.json`, build scripts/config, docs as needed.
- Dependencies: T022.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Identify generated declaration files incorrectly tracked in `packages/core/src`.
  2. Remove tracked generated declarations from source tree.
  3. Ensure declaration generation targets build output (`dist/`) only.
  4. Add guard/check to prevent reintroducing generated declarations in `src/`.
- Acceptance criteria:
  - No generated `.d.ts` files remain under source directories.
  - Build outputs still include required declarations for consumers.
  - CI catches accidental reintroduction of generated source declarations.
- Validation evidence:
  - Run `pnpm --filter @quicktask/core build`.
  - Verify `packages/core/src` declaration cleanup and `dist` declaration presence.

### [p] T091 - Normalize task-state terminology across docs/commands/rules

- Status: [p]
- Priority: P3
- Goal: Eliminate terminology drift by consistently using `ready-proposed` language for `[p]` status across contributor docs, command wrappers, and rules.
- Files: `CONTRIBUTORS.md`, `TASK_DISCOVERY_WORKFLOW.md`, `.cursor/commands/*.md`, `.cursor/rules/*.mdc`, related docs.
- Dependencies: T051.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Audit all docs/rules/commands for outdated `[p]` wording.
  2. Replace inconsistent status language with canonical terminology.
  3. Add a doc wording check or checklist item to prevent drift.
  4. Confirm no conflicting phrasing remains.
- Acceptance criteria:
  - All task-tracking docs use consistent `[p]` terminology.
  - No outdated "pending triage/proposed" wording remains where it conflicts with current policy.
  - Contributors can infer status semantics from one canonical definition.
- Validation evidence:
  - Run a wording search for stale phrases.
  - Verify canonical status legend references match all task docs.

### [p] T092 - Consolidate duplicated policy docs and rule references

- Status: [p]
- Priority: P2
- Goal: Improve maintainability by reducing duplicated governance text across root strategy docs, workflow docs, and `.cursor/rules` references.
- Files: `COMMIT_STRATEGY.md`, `BRANCHING_TAGGING_STRATEGY.md`, `PR_REVIEW_MERGE_STRATEGY.md`, `.cursor/rules/*.mdc`, `CONTRIBUTORS.md`.
- Dependencies: T063.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Identify overlapping policy sections duplicated across multiple docs.
  2. Define canonical source docs and convert duplicates to references/summaries.
  3. Update rules to reference canonical docs rather than restating policy fragments.
  4. Add governance-doc map showing source-of-truth locations.
- Acceptance criteria:
  - Policy duplication is materially reduced.
  - Canonical source for each governance domain is explicit.
  - Rule/docs drift risk is lowered through references instead of copy text.
- Validation evidence:
  - Run docs link/integrity checks.
  - Verify contributor and rule docs still cover required policy behavior.

### [p] T093 - Reorganize root documentation into a maintainable docs structure

- Status: [p]
- Priority: P4
- Goal: Improve repo hygiene by organizing root-level markdown files into a clearer docs hierarchy without losing discoverability.
- Files: root `*.md` policy files, `docs/` structure, `README.md`, internal links.
- Dependencies: T092.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Propose target docs structure (for example `docs/policies`, `docs/workflows`, `docs/contracts`).
  2. Move or regroup non-entrypoint docs from repo root into structure.
  3. Update all references and command/rule links.
  4. Keep top-level README as navigation hub.
- Acceptance criteria:
  - Root folder has fewer policy/workflow markdown files.
  - Documentation remains discoverable with updated navigation.
  - No broken links after reorganization.
- Validation evidence:
  - Run docs/link checks.
  - Verify contributor onboarding flow against new docs layout.

### [p] T094 - Define and enforce generated-artifact version-control policy

- Status: [p]
- Priority: P3
- Goal: Clarify what generated artifacts should be committed versus ephemeral to reduce repo churn and confusion.
- Files: `artifacts/`, `docs/release-readiness-report.md`, `.gitignore`, release docs/workflows.
- Dependencies: T044, T063.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Inventory generated artifacts currently tracked in git.
  2. Decide commit policy per artifact class (tracked baseline vs CI artifact-only).
  3. Update `.gitignore` and workflows to align with policy.
  4. Document policy in contributor/release docs.
- Acceptance criteria:
  - Generated artifact tracking policy is explicit and documented.
  - Repo churn from ephemeral generated files is reduced.
  - Release/readiness workflows remain fully functional.
- Validation evidence:
  - Run release/readiness workflows with updated artifact policy.
  - Verify git status remains clean after standard validation commands.

### [p] T095 - Refactor duplicated test setup helpers for maintainability

- Status: [p]
- Priority: P3
- Goal: Reduce test duplication by extracting shared tmp-dir/runtime setup helpers used across core runtime/store tests.
- Files: `packages/core/test/*.test.mjs`, shared test helper module (new), optional adapter tests.
- Dependencies: T070.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Identify repeated setup/teardown patterns in tests.
  2. Extract reusable helper utilities.
  3. Migrate tests incrementally to helper usage.
  4. Preserve test readability and isolation.
- Acceptance criteria:
  - Repeated setup code is materially reduced.
  - Tests remain deterministic and easy to understand.
  - No regression in test coverage or behavior.
- Validation evidence:
  - Run `pnpm test`.
  - Compare test output and timing before/after refactor.

### [p] T096 - Remove or replace low-value placeholder package docs

- Status: [p]
- Priority: P4
- Goal: Improve documentation quality by removing placeholder package docs or replacing them with meaningful package-level guidance.
- Files: `packages/core/src/README.md`, package-level docs, root docs references.
- Dependencies: T093.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Audit package-level README files for low-value placeholder content.
  2. Remove placeholders with no value or replace with concise actionable docs.
  3. Ensure references point to canonical package docs where needed.
  4. Add minimal quality expectations for package-level docs.
- Acceptance criteria:
  - Placeholder docs are removed or upgraded.
  - Package docs provide concrete guidance or are intentionally omitted.
  - Documentation references remain accurate.
- Validation evidence:
  - Review package docs map for completeness.
  - Run docs/link checks.

### [p] T097 - Audit and remove dead or unreferenced command/docs entrypoints

- Status: [p]
- Priority: P3
- Goal: Improve maintainability by pruning stale `.cursor/commands` and documentation entrypoints that are no longer referenced or used.
- Files: `.cursor/commands/*.md`, root/docs index references, related rule links.
- Dependencies: T063, T093.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Inventory command/doc entrypoints and their inbound references.
  2. Mark unused or obsolete files for removal or consolidation.
  3. Delete stale files and update references.
  4. Add a lightweight check ensuring command docs are discoverable and referenced.
- Acceptance criteria:
  - No stale/unreferenced command entrypoints remain.
  - Command/docs navigation remains clear after pruning.
  - Cleanup does not remove active workflows.
- Validation evidence:
  - Run docs/command reference checks.
  - Verify active command workflows still resolve correctly.

### [p] T098 - Add clean-room install-and-first-run journey tests for release artifacts

- Status: [p]
- Priority: P0
- Goal: Validate releases like a real first-time user by running install-and-use flows from packaged artifacts in clean environments.
- Files: `scripts/` test harness files (new), `.github/workflows/release-candidate.yml`, `.github/workflows/post-release-verify.yml`, docs.
- Dependencies: T046, T074.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Create clean-room test harness that starts from empty temp workspace with no prior state.
  2. Install release artifacts (VSIX/OpenClaw package) from built/downloaded outputs.
  3. Run first-use journeys: create task, run task, improve, accept proposal.
  4. Assert visible outputs and expected persisted task files.
- Acceptance criteria:
  - First-run journey tests execute against packaged artifacts (not source-only runtime).
  - Tests fail deterministically on broken install/activation/command execution.
  - Harness runs in CI and is reusable for RC and post-release verification.
- Validation evidence:
  - Run harness locally against artifacts directory.
  - Run in RC workflow and post-release verify workflow.

### [p] T099 - Make user-journey artifact tests release-blocking in RC and release workflows

- Status: [p]
- Priority: P0
- Goal: Prevent shipping broken releases by making artifact-based user journeys hard gates for RC and release.
- Files: `.github/workflows/release-candidate.yml`, `.github/workflows/release.yml`, `.github/workflows/post-release-verify.yml`, release docs.
- Dependencies: T098.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Wire clean-room user-journey harness into RC workflow as required check.
  2. Gate release workflow on successful artifact journey checks.
  3. Ensure post-release verification re-runs critical user journeys on published assets.
  4. Update docs with explicit go/no-go criteria.
- Acceptance criteria:
  - RC cannot pass when artifact-based user journeys fail.
  - Release workflow does not publish when journey checks fail.
  - Post-release verification confirms published assets still pass journey checks.
- Validation evidence:
  - Trigger RC run with harness enabled and inspect required-check behavior.
  - Verify release workflow blocks on injected harness failures.

### [p] T100 - Build host-specific artifact install validation harness (VSIX/OpenClaw/Cursor)

- Status: [p]
- Priority: P1
- Goal: Ensure each host integration is validated through host-appropriate install and execution paths before release.
- Files: `scripts/host-install-validate/*.mjs` (new), adapter docs, CI workflow wiring.
- Dependencies: T098, T099.
- Blocked by: none.
- Unblock plan: n/a
- Steps:
  1. Implement VS Code/Cursor VSIX install validation flow with command execution checks.
  2. Implement OpenClaw package artifact validation flow with runtime registration checks.
  3. Add uniform pass/fail report format across hosts.
  4. Integrate into RC/release verification stages.
- Acceptance criteria:
  - Host-specific install validation runs for all supported host targets.
  - Failures identify host stage (install, activation, command run) clearly.
  - Validation is documented and maintainable for future host changes.
- Validation evidence:
  - Run host harness locally in artifact test mode.
  - Run in CI across RC and post-release verification paths.

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
