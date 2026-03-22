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
- Phase 12 proposals: **All accepted (2026-03-23).** Each of **`T133`–`T142`** retains **Proposal review (2026-03-23)** and **Maintainer decision: ACCEPTED**; tasks are **`[ ]` todo** and assigned to **Phase 12** sub-milestones **12a / 12b / 12c** (see each task’s **Phase / milestone** field).
- Current phase in execution: **Phase 12** — user-feedback resolution / `v1.0.x` adoption (see **Phase 12** + **`v1.0.x` adoption execution plan**); direction in `docs/product-direction.md`.
- Current milestone target: **12a** → **12b** → **12c** (see Phase 12 waves below).
- Phase objective now: Implement accepted `T133`–`T142` and close linked GitHub feedback issues.
- Phase kickoff assessment: complete (reviewed `README.md`, `CONTRIBUTORS.md`, `ARCHITECTURE.md`, `RELEASE_STRATEGY.md`, `PRE_RELEASE_READINESS_WORKFLOW.md`, and active contracts).
- Active implementation (`[~]`): none
- Scheduled this phase (`[ ]`): `T133`–`T142` (Phase 12; see **Scheduled** backlog below)
- Ready queue (`[p]`): _Empty._
- Blocked tasks (`[!]`): none
- Next tasks in order (aligned with Phase 12 waves):
  1. **12a — Wave A:** `T134`, `T135` (parallel where possible).
  2. **12a — Wave B:** `T138`.
  3. **12b — Wave C:** `T133`, then `T139`, then `T136`, then `T140`.
  4. **12c:** `T137` (spec), then `T142`, then `T141` (P4).
- User feedback triage: Each open UF issue is mapped in `USER_FEEDBACK.md` **Index** (GitHub + **TASKS.md** task column). UF-019 / [#59](https://github.com/NJLaPrell/QuickTask/issues/59) closed **not planned** (README + Releases only).
- Definition of "phase complete" for current phase:
  - **Phase 12** completion gate: `T133`–`T142` are `[x]` and linked GitHub user-feedback issues are updated/closed (see Phase 12 section).
  - Phase 11 planned tasks (`T112`, `T113`, `T114`, `T116`, `T117`, `T118`, `T120`, `T123`, `T124`, `T126`, `T132`) remain `[x]`.
  - CI/release workflow validation remains green after action-version modernization changes.

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

Phase 12 is **ready to close** when: `T133`–`T142` are `[x]` and user-feedback issues linked in those tasks are updated/closed by maintainers.

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
- Status: in maintenance; **Phase 12** extends this track for user-feedback adoption.
- Active/near-term IDs: `T133`–`T142` (see **Phase 12** above).
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
- **Status:** **in execution** — proposals **ACCEPTED** (2026-03-23); tasks **`T133`–`T142`** are **`[ ]` todo** with **Phase / milestone** assignments (**12a** / **12b** / **12c**).
- **Release milestone tag:** `v1.0.x` adoption (post-`v1.0.0`); ship order follows **Ordered delivery waves** in **`v1.0.x` adoption execution plan** above.
- **Planned task IDs (by wave):**
  - **12a Wave A — Discover + install trust:** `T134` (GitHub #48, #49, #60; #50 completed → #48), `T135` (GitHub #41, #43, #44, #47, #62; #46 completed → #47).
  - **12a Wave B — Contributor path:** `T138` (GitHub #42).
  - **12b — Command model + onboarding (waves C–E):** `T133` (#51, #53) → `T139` (#52) → `T136` (#54, #58) → `T140` (#55).
  - **12c — Trust + polish (waves F–G):** `T137` (#45, #57) → `T142` (#61) → `T141` (#56).

### Phase 12 dependency sketch

```text
T134 ──┬── (Marketplace external work can parallelize with repo)
T135 ──┘
T138 (independent; contributor)
T133 → T140 (improve UX may assume stable create/run; can parallelize carefully)
T136 (help/init; can parallel T133 with coordination)
T137 → (future) verbose implementation task after spec
T139 coordinates with T133 (create when missing vs run when exists)
T142 (P2), T141 (P4) — extension preflight + templates polish
```

## Active task backlog

Work below is triaged for implementation.

### Proposed

- _Empty._

### Scheduled (`[ ]`) — Phase 12 accepted 2026-03-23

**Milestone: `v1.0.x` adoption — Phase 12**

- **12a (discover + first-run + contributor path)**  
  - [ ] `T134` — Marketplace + README install trust — [#48](https://github.com/NJLaPrell/QuickTask/issues/48), [#49](https://github.com/NJLaPrell/QuickTask/issues/49), [#60](https://github.com/NJLaPrell/QuickTask/issues/60)  
  - [ ] `T135` — Chat-first docs + Contributing-only monorepo — [#41](https://github.com/NJLaPrell/QuickTask/issues/41), [#43](https://github.com/NJLaPrell/QuickTask/issues/43), [#44](https://github.com/NJLaPrell/QuickTask/issues/44), [#47](https://github.com/NJLaPrell/QuickTask/issues/47), [#62](https://github.com/NJLaPrell/QuickTask/issues/62)  
  - [ ] `T138` — `qt:sandbox` fix or doc demotion — [#42](https://github.com/NJLaPrell/QuickTask/issues/42)
- **12b (command model + onboarding)**  
  - [ ] `T133` — Run when template exists + create escape hatch — [#51](https://github.com/NJLaPrell/QuickTask/issues/51), [#53](https://github.com/NJLaPrell/QuickTask/issues/53)  
  - [ ] `T139` — UF-012 long paste = create body + docs — [#52](https://github.com/NJLaPrell/QuickTask/issues/52)  
  - [ ] `T136` — Help tiering, init steer, next steps — [#54](https://github.com/NJLaPrell/QuickTask/issues/54), [#58](https://github.com/NJLaPrell/QuickTask/issues/58)  
  - [ ] `T140` — Improve empty/incomplete input — [#55](https://github.com/NJLaPrell/QuickTask/issues/55)
- **12c (trust + polish)**  
  - [ ] `T137` — Verbose/debug **spec** — [#45](https://github.com/NJLaPrell/QuickTask/issues/45), [#57](https://github.com/NJLaPrell/QuickTask/issues/57)  
  - [ ] `T142` — Extension hint + full preflight — [#61](https://github.com/NJLaPrell/QuickTask/issues/61)  
  - [ ] `T141` — Seeded template run-line footer — [#56](https://github.com/NJLaPrell/QuickTask/issues/56)

### Intake queue

- _Empty._

### In progress

- _Empty._

### Blocked

- _Empty._

## Proposed task details

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

### [ ] T133 - Prefer run when `/qt <existing-task> …` (explicit create escape hatch)

- Status: [ ]
- Priority: P1
- **Phase / milestone:** **Phase 12** — `v1.0.x` adoption / sub-milestone **12b** (command model); delivery **wave C** (after **T138**; coordinate with **T139**).
- Goal: When a template name already exists, default `/qt <name> …` to **run**, not create—per `docs/product-direction.md`. Preserve a clear **create-new** path for power users (subcommand, flag, or documented form).
- **Proposal review (2026-03-23):**
  - **What:** Changes default meaning of `/qt <existing-name> …` from create to **run**, with an explicit escape hatch to create/overwrite.
  - **How:** Update `packages/core` parser + runtime, contract docs, tests, then adapter result copy where `already-exists` / did-you-mean still appears.
  - **Impact:** **User-visible behavior change** on all hosts using core; power users trained on “space = create” need the new documented form.
  - **Maintainer decision:** **ACCEPTED** (2026-03-23).
- **GitHub user feedback:** [#51](https://github.com/NJLaPrell/QuickTask/issues/51), [#53](https://github.com/NJLaPrell/QuickTask/issues/53) (UF-011, UF-013).
- Files: `packages/core/src/parser.ts`, `packages/core/src/runtime.ts`, `docs/qt-command-result-contract.md`, `packages/core/test/*`, host adapters as needed
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Update parser semantics and contract docs for create vs run when task exists.
  2. Implement runtime behavior + deterministic result payloads (incl. migration notes for users trained on “space = create”).
  3. Add tests for run default, create escape hatch, and edge cases (quoted names, missing task).
  4. Align adapter copy for `already-exists` / did-you-mean if still surfaced.
- Acceptance criteria:
  - Documented command forms match implemented behavior.
  - Core tests cover run-default and explicit-create paths.
- Validation evidence:
  - _Pending implementation._

### [ ] T134 - Marketplace + README install trust pass (identity, screenshots, copy)

- Status: [ ]
- Priority: P1
- **Phase / milestone:** **Phase 12** — `v1.0.x` adoption / sub-milestone **12a** (discover + install trust); delivery **wave A** (parallel with **T135**).
- Goal: Address UF-008, UF-009, UF-010: listing feels findable and credible; README reinforces canonical identity and install paths. Include **post-install verification** (UF-020): how to confirm the extension is enabled and what to try next.
- **Proposal review (2026-03-23):**
  - **What:** Make Marketplace + README **credible and findable**; add post-install “you’re good” checklist (UF-020).
  - **How:** Update VS Code Marketplace listing (external console), edit `README.md`, optional small doc cross-links; coordinate copy with **T142** for doctor/hint wording.
  - **Impact:** **No core/runtime code** required for listing/README; improves acquisition and first-run trust only.
  - **Maintainer decision:** **ACCEPTED** (2026-03-23).
- **GitHub user feedback:** [#48](https://github.com/NJLaPrell/QuickTask/issues/48), [#49](https://github.com/NJLaPrell/QuickTask/issues/49), [#60](https://github.com/NJLaPrell/QuickTask/issues/60) (UF-008, UF-009, UF-020); **[#50](https://github.com/NJLaPrell/QuickTask/issues/50) completed** (consolidated tracking) — UF-010 scope merged here (canonical naming).
- Files: Marketplace listing (external), `README.md`, `USER_FEEDBACK.md` cross-links as needed
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Refresh Marketplace overview, keywords, and screenshots; link repo/support.
  2. Align README install section with listing and `docs/product-direction.md` priorities.
  3. Spot-check Cursor/VS Code discoverability notes (no new landing page required).
  4. Add short post-install checklist (Extensions view + version + optional `/qt doctor` / first command); align **doctor** / verification wording with **T142** when both ship.
- Acceptance criteria:
  - Canonical identity (display name, extension id, direct URL) is consistent in README and listing.
  - Marketplace page does not read “empty upload.”
  - README gives a clear “you installed the right thing” verification path.
- Validation evidence:
  - _Pending implementation._

### [ ] T135 - Chat-first first-run docs and Contributing-only monorepo path

- Status: [ ]
- Priority: P1
- **Phase / milestone:** **Phase 12** — `v1.0.x` adoption / sub-milestone **12a** (first-run clarity); delivery **wave A** (parallel with **T134**).
- Goal: UF-001, UF-003, UF-004, UF-006, UF-007, UF-022: default story is **QuickTask chat participant + `/qt`**; clone/`pnpm` only under Contributing. Command Palette / VSIX steps stay **secondary** but exact strings remain documented for install.
- **Proposal review (2026-03-23):**
  - **What:** Reorder and rewrite onboarding so **extension + chat** is the default path; monorepo build is **Contributing-only**; link participant name ↔ `/qt`.
  - **How:** `README.md`, `CONTRIBUTORS.md`, extension UI strings / walkthrough copy as needed.
  - **Impact:** **Docs + extension copy only** (no core command semantics); reduces “I thought I had to clone the repo” confusion.
  - **Maintainer decision:** **ACCEPTED** (2026-03-23).
- **GitHub user feedback:** [#41](https://github.com/NJLaPrell/QuickTask/issues/41), [#43](https://github.com/NJLaPrell/QuickTask/issues/43), [#44](https://github.com/NJLaPrell/QuickTask/issues/44), [#47](https://github.com/NJLaPrell/QuickTask/issues/47), [#62](https://github.com/NJLaPrell/QuickTask/issues/62); **[#46](https://github.com/NJLaPrell/QuickTask/issues/46) completed** (consolidated tracking) — UF-006 scope merged here (VSIX palette + first-run).
- Files: `README.md`, `CONTRIBUTORS.md`, `packages/vscode-extension/*` (copy/walkthrough if any), `docs/*` as needed
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Reorder or signpost README so extension/chat path leads; monorepo quickstart clearly “contributors.”
  2. Document “where to click/type” with chat as primary; Command Palette secondary.
  3. One-liner linking participant **QuickTask** / `quicktask` to **`/qt`** in key surfaces.
  4. During implementation, align README copy with **T142** (activation hint + preflight) so docs and in-editor UX match.
- Acceptance criteria:
  - New reader does not see repo build as the default “try it” path.
  - Chat-first steps are explicit for Cursor/VS Code.
- Validation evidence:
  - _Pending implementation._

### [ ] T136 - `/qt help` tiering, init steering, and suggested next steps

- Status: [ ]
- Priority: P2
- **Phase / milestone:** **Phase 12** — `v1.0.x` adoption / sub-milestone **12b** (onboarding); delivery **wave D** (after **T133** + **T139**).
- Goal: Per `docs/product-direction.md`, init owns onboarding; **`/qt help`** should default to a **short quickstart** (UF-014), with a separate path to full reference (e.g. `help all` or equivalent). Help should detect uninitialized workspace and **steer into or run** init (suggest vs auto-run — specify in implementation). After successes like first **`list`**, surface **suggested next commands** (UF-018: show → run → improve).
- **Proposal review (2026-03-23):**
  - **What:** Tiered help (short vs full), init steering when not bootstrapped, and “what to do next” after `list`.
  - **How:** Core help/init detection + rendering changes, contract updates, adapter output for help payloads; fix pipe/table rendering if needed.
  - **Impact:** **All hosts** see different help text and possibly different init flows; core result shapes may change for help.
  - **Maintainer decision:** **ACCEPTED** (2026-03-23).
- **GitHub user feedback:** [#54](https://github.com/NJLaPrell/QuickTask/issues/54), [#58](https://github.com/NJLaPrell/QuickTask/issues/58) (UF-014, UF-018).
- Files: `packages/core/src/runtime.ts`, `packages/core/src/parser.ts` or help handler, `packages/core/src/rendering.ts`, `docs/qt-command-result-contract.md`, adapters
- Dependencies: T101–T103 behavior remains coherent (may only need messaging)
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Define contract for tiered help output and “not initialized” detection + help/init branching.
  2. Implement core + adapter rendering for short vs full help; fix pipe/table rendering if needed.
  3. Implement suggested next steps after key commands (at minimum post-`list` for first-time pattern).
  4. Tests for help on fresh vs initialized workspace and tiered output.
- Acceptance criteria:
  - First-time user hitting help gets a path to initialized state without reading the full manual.
  - Default help reads as onboarding, not only API reference.
  - After at least one `list` success path, user sees suggested next commands (e.g. show → run → improve).
- Validation evidence:
  - _Pending implementation._

### [ ] T137 - Spec verbose/debug mode for paths and internal codes

- Status: [ ]
- Priority: P2
- **Phase / milestone:** **Phase 12** — `v1.0.x` adoption / sub-milestone **12c** (trust + polish); delivery **wave F** (spec only; implementation task may follow).
- Goal: Plan optional **verbose/debug** surface for absolute paths, touched files, and internal-style codes (UF-005, UF-017)—not default happy path. Default UX should remain human-first summaries once implementation tasks spin out from this spec.
- **Proposal review (2026-03-23):**
  - **What:** Produce a **written spec** for verbose/debug (settings, which commands emit codes/paths, adapter duties)—**no product code required** in this task beyond docs.
  - **How:** Edit `docs/qt-command-result-contract.md`, `docs/qt-adapter-rendering-matrix.md`, optional extension settings sketch in docs.
  - **Impact:** **Zero runtime change** until a follow-on implementation task; defines future behavior for trust/diagnostics.
  - **Maintainer decision:** **ACCEPTED** (2026-03-23).
- **GitHub user feedback:** [#45](https://github.com/NJLaPrell/QuickTask/issues/45), [#57](https://github.com/NJLaPrell/QuickTask/issues/57) (UF-005, UF-017).
- Files: `docs/qt-command-result-contract.md`, `docs/qt-adapter-rendering-matrix.md`, `packages/vscode-extension/*` (settings sketch), `ARCHITECTURE.md` if needed
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Write spec: setting name(s), which commands emit extra detail, adapter responsibilities.
  2. Open follow-on implementation task(s) if spec approves scope.
- Acceptance criteria:
  - Written spec agreed and linked from `docs/product-direction.md` open follow-ups if still relevant.
- Validation evidence:
  - _Pending implementation._

### [ ] T138 - Fix or document `qt:sandbox` from monorepo root

- Status: [ ]
- Priority: P2
- **Phase / milestone:** **Phase 12** — `v1.0.x` adoption / sub-milestone **12a** (contributor path); delivery **wave B** (after Wave A or parallel if resourcing allows).
- Goal: Contributor path: `pnpm qt:sandbox -- /qt …` works from a clean clone **or** docs stop recommending it until CI proves it (UF-002). Align with `docs/product-direction.md` open follow-up: fix vs de-emphasize—pick one and make docs/tooling consistent.
- **Proposal review (2026-03-23):**
  - **What:** Make contributor sandbox path **honest**: either fix workspace resolution from repo root **or** demote the script in docs with a working alternative.
  - **How:** `package.json`/pnpm workspace fixes, optional CI job proving `qt:sandbox`, `CONTRIBUTORS.md` / `README` updates.
  - **Impact:** **Contributor tooling + CI only**; end-user extension behavior unchanged.
  - **Maintainer decision:** **ACCEPTED** (2026-03-23).
- **GitHub user feedback:** [#42](https://github.com/NJLaPrell/QuickTask/issues/42) (UF-002).
- Files: `package.json` scripts, workspace resolution, `CONTRIBUTORS.md`, `README.md`, CI workflow proving sandbox if fix path
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Reproduce failure from repo root; fix workspace/`@quicktask/core` resolution **or** demote script in docs with alternative contributor flow.
  2. Add CI check that `pnpm qt:sandbox -- /qt help` succeeds if we keep recommending it.
- Acceptance criteria:
  - Documented path matches working tooling.
- Validation evidence:
  - _Pending implementation._

### [ ] T139 - UF-012: long paste as new template body; glossary and create/run clarity

- Status: [ ]
- Priority: P2
- **Phase / milestone:** **Phase 12** — `v1.0.x` adoption / sub-milestone **12b** (command model); delivery **wave C** (immediately after **T133**).
- Goal: **Product decision (C)** — When the **template name does not exist**, text after `/qt <name>` (including a **long paste**) is **the body of the template to create** — intentional authoring, not “run web research now.” Deliver **docs + help copy** and verify **core/parser** treats remainder-of-line / multiline input correctly on **create** paths. Pair with **T133**: when the template **exists**, prefer **run** so `/qt research …` does not keep overwriting the template with pasted text unless user uses explicit **create** escape hatch.
- **Proposal review (2026-03-23):**
  - **What:** Encode decision **(C)** in docs/help and ensure **create** accepts long bodies when the template is missing; clarify create vs run with **T133**.
  - **How:** README/docs, core tests + parser/runtime fixes if needed, adapter messaging.
  - **Impact:** **Create path** behavior and messaging across hosts; depends on **T133** for the “template exists” branch.
  - **Maintainer decision:** **ACCEPTED** (2026-03-23).
- **GitHub user feedback:** [#52](https://github.com/NJLaPrell/QuickTask/issues/52) (UF-012).
- Files: `README.md`, `docs/*`, `docs/product-direction.md`, `packages/core/src/*`, host adapters, `packages/core/test/*`
- Dependencies: **T133** — align messaging and tests after run-default lands.
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Confirm `docs/product-direction.md` decision (C) matches shipped docs.
  2. Document in README/help: create stores template text; does not invoke web search; long paste on **new** template is valid.
  3. Add or adjust core tests for “create with long body when task missing”; fix parser/runtime if paste is truncated or misclassified.
  4. Adapter copy: clarify difference between **create** (template missing) and **run** (template exists, **T133**).
- Acceptance criteria:
  - Decision (C) is reflected in user-facing docs and matches behavior for new templates.
  - Tests cover create-with-substantial-body when template absent.
- Validation evidence:
  - _Pending implementation._

### [ ] T140 - Improve flow: empty or incomplete input

- Status: [ ]
- Priority: P2
- **Phase / milestone:** **Phase 12** — `v1.0.x` adoption / sub-milestone **12b** (command model); delivery **wave E** (after **T136**).
- Goal: UF-015: `/qt improve <task>` with missing or vague input should not silently “infer” in a way that confuses first-time users; prompt or show example usage.
- **Proposal review (2026-03-23):**
  - **What:** Stop “mystery infer” on **empty or too-thin** improve input; return a clear prompt or example instead.
  - **How:** Core runtime/parser rules + adapter presentation of the new result shape.
  - **Impact:** **`/qt improve` UX change** for minimal input; may reduce surprise proposals for new users.
  - **Maintainer decision:** **ACCEPTED** (2026-03-23).
- **GitHub user feedback:** [#55](https://github.com/NJLaPrell/QuickTask/issues/55) (UF-015).
- Files: `packages/core/src/runtime.ts`, `packages/core/src/parser.ts`, adapters, `packages/core/test/*`
- Dependencies: none
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Define behavior for empty/minimal improve input (error + example vs interactive prompt pattern per host).
  2. Implement + tests.
- Acceptance criteria:
  - First-time improve attempt gets clear guidance when input is insufficient.
- Validation evidence:
  - _Pending implementation._

### [ ] T141 - Seeded templates: copy-pastable run line in body/footer

- Status: [ ]
- Priority: P4
- **Phase / milestone:** **Phase 12** — `v1.0.x` adoption / sub-milestone **12c** (polish); delivery **wave G** (after **T142**; **T133** stable for example syntax).
- Goal: UF-016: starter templates include a one-line “Run with: `/qt/<task> …`” (or equivalent) so `show` is self-teaching.
- **Proposal review (2026-03-23):**
  - **What:** Add a **run example line** (comment/footer) inside each **seeded** starter template.
  - **How:** Edit seed template files consumed by `/qt init`; align wording after **T133** stabilizes run syntax.
  - **Impact:** **New inits only** (existing `tasks/` unchanged); `show` becomes more self-explanatory.
  - **Maintainer decision:** **ACCEPTED** (2026-03-23).
- **GitHub user feedback:** [#56](https://github.com/NJLaPrell/QuickTask/issues/56) (UF-016).
- Files: Seed templates under `packages/core` / `tasks/` as seeded by init, template docs
- Dependencies: T133 (run syntax) should be stable before finalizing example lines.
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Add footer/comment block to each seeded template with run example.
  2. Verify init path picks up changes.
- Acceptance criteria:
  - `show <task>` surfaces run syntax without leaving the template body.
- Validation evidence:
  - _Pending implementation._

### [ ] T142 - Extension: activation hint + full preflight (doctor / workspace)

- Status: [ ]
- Priority: P2
- **Phase / milestone:** **Phase 12** — `v1.0.x` adoption / sub-milestone **12c** (trust + extension UX); delivery **wave G** (after **T137** spec or parallel if resourcing allows; coordinate copy with **T134** / **T135**).
- Goal: UF-021: **`doctor` must not feel like a dead-on-arrival rescue only.** Ship **(1) a visible hint in the extension** after install/activation (notification, welcome view, or sidebar cue) pointing to **QuickTask chat + `/qt`** and suggesting **`/qt doctor`** or **`/qt init`** as appropriate; **(2) full preflight** — extension-side checks (writable workspace, resolvable **`tasks/`** path, basic sanity) with clear outcomes, aligned with **`/qt doctor`** so behavior is consistent (reuse core/runtime where possible vs duplicating logic).
- **Product decision:** `docs/product-direction.md` — **full preflight + extension hint** (not docs-only).
- **Proposal review (2026-03-23):**
  - **What:** In-editor **activation/install hint** plus **preflight** (workspace writable, tasks path) tied to **`/qt doctor`** semantics.
  - **How:** Implement in `packages/vscode-extension` (activation, notifications or welcome UI); reuse core doctor where feasible; README alignment.
  - **Impact:** **VS Code / Cursor extension only** (OpenClaw unchanged unless shared helpers added); more activation/UI surface area to maintain.
  - **Maintainer decision:** **ACCEPTED** (2026-03-23).
- **GitHub user feedback:** [#61](https://github.com/NJLaPrell/QuickTask/issues/61) (UF-021).
- Files: `packages/vscode-extension/*`, `README.md`, `docs/qt-command-result-contract.md` or adapter notes if doctor wiring changes
- Dependencies: none (coordinate copy with **T135** chat-first story)
- Blocked by: none
- Unblock plan: n/a
- Steps:
  1. Design hint UX (when fired: first activation, first folder open, or once per workspace — document choice).
  2. Implement preflight checks + user-visible summary (and link or delegate to **`/qt doctor`** for full detail).
  3. Align strings with **T137** later if verbose/debug toggles affect surfaced detail.
  4. README: one paragraph on “after install” matching extension behavior.
- Acceptance criteria:
  - New install sees an in-editor hint, not only documentation.
  - User can understand workspace writable / tasks path status without having already failed silently.
- Validation evidence:
  - _Pending implementation._

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
