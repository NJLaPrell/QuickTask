# QuickTask Archived Tasks

This file stores archived (`[h]`) task records that are no longer active.

Active planning stays in `TASKS.md`.

## Archive policy

- Keep task IDs and titles unchanged.
- Keep tasks grouped by original phase for auditability.
- Keep this file append-only except for typo fixes.
- Do not move open/in-progress/blocked tasks here.

## Archived tasks by phase

### Phase 1 - Core foundations

- [h] T001 - Decide persistent task storage layout
- [h] T002 - Replace in-memory store with file-backed task store
- [h] T003 - Tighten command parsing against the current spec
- [h] T009 - Add core unit test harness

### Phase 2 - Core behavior and reliability

- [h] T004 - Implement template creation flow from user instructions
- [h] T005 - Implement existing task execution flow
- [h] T006 - Implement improvement proposal flow
- [h] T007 - Implement improvement acceptance and overwrite behavior
- [h] T008 - Define runtime result contract for host adapters
- [h] T015 - Add repo-wide build and test workflow
- [h] T022 - Define stable core API surface for adapters
- [h] T023 - Harden file-backed storage error handling
- [h] T029 - Define runtime diagnostics and error observability
- [h] T030 - Add persisted template corruption recovery strategy
- [h] T031 - Add template format versioning and migration path
- [h] T034 - Define improvement proposal lifecycle contract
- [h] T035 - Publish canonical command and result contract docs
- [h] T036 - Define proposal persistence and TTL policy
- [h] T037 - Return structured runtime errors for parse failures
- [h] T038 - Add adapter rendering matrix from result contract
- [h] T039 - Define concurrent template write policy and tests
- [h] T040 - Add stale write-lock recovery policy and tests

### Phase 3 - Host integrations

- [h] T010 - Wire the VS Code extension to the core runtime
- [h] T011 - Implement native VS Code `/qt` chat command
- [h] T012 - Refine Cursor command integration around the core runtime
- [h] T013 - Wire the OpenClaw adapter to the core runtime
- [h] T014 - Implement native OpenClaw `/qt` command flow

### Phase 4 - CI and quality controls

- [h] T021 - Add linting and formatting quality gates
- [h] T024 - Add host-level end-to-end smoke tests
- [h] T027 - Define support matrix and compatibility policy
- [h] T028 - Add dependency and supply-chain security scanning
- [h] T033 - Add repository governance and release guardrails
- [h] T041 - Add pre-release readiness workflow and report pipeline
- [h] T042 - Add release readiness preflight for pending changesets
- [h] T043 - Add CI check for package manager config consistency
- [h] T044 - Reduce release readiness report churn from timestamp-only updates

### Phase 5 - Packaging and release operations

- [h] T016 - Add VSIX packaging for the VS Code extension
- [h] T017 - Add OpenClaw package build artifact
- [h] T018 - Add release workflow for GitHub Releases
- [h] T025 - Add release versioning and changelog workflow
- [h] T026 - Add post-release install verification checks
- [h] T032 - Add release-candidate validation workflow
- [h] T045 - Add single-command release handoff wrapper
- [h] T046 - Publish installable release assets on GitHub releases
- [h] T047 - Add curated user-focused release notes layer
- [h] T048 - Publish release integrity metadata (checksums/SBOM)
- [h] T049 - Define first-public-release version baseline policy

### Phase 6 - Distribution and docs

- [h] T019 - Add VS Code Marketplace publishing workflow
- [h] T020 - Write installation and release documentation
- [h] T050 - Fix Marketplace publisher/display-name mismatch
- [h] T051 - Restructure task tracking for reliability
- [h] T052 - Codify discovery workflow for proposed tasks

### Phase 7 - Release governance and risk gates

- [h] T053 - Align release-readiness parser with active TASKS format
- [h] T054 - Add task tracker schema validator command
- [h] T065 - Add test coverage for release handoff and docs gate scripts
- [h] T071 - Add workflow contract checks for release inputs and docs gates
- [h] T083 - Codify change-based release cadence and trigger timing policy
- [h] T084 - Enforce local-only diagnostics and zero-PII logging policy
- [h] T085 - Add formal risk acceptance policy for medium/high findings

### Phase 8 - Minimal `/qt` product maturity

- [h] T086 - Codify approved `/qt` command surface (list/show/doctor) and defer non-core growth
- [h] T062 - Add `/qt list` and `/qt show [task]` discovery commands
- [h] T056 - Improve VS Code `/qt` interaction UX and markdown output
- [h] T066 - Remove unsafe VS Code chat API casts with compatibility wrapper
- [h] T077 - Add `/qt doctor` diagnostics command for storage/runtime health
- [h] T061 - Add contract drift guard between runtime codes and adapters/docs
- [h] T055 - Unify adapter result rendering from shared core mapping
- [h] T076 - Add adapter normalization parity test suite in shared smoke harness
- [h] T070 - Add adapter E2E coverage for improve action lifecycle

### Phase 9 - CI/release platform hardening

- [h] T060 - Split CI into parallel jobs with clearer failure surfaces
- [h] T064 - Refactor duplicated release workflow steps into reusable automation
- [h] T068 - Make OpenClaw packaging cross-platform without system tar dependency
- [h] T073 - Harden dependency-review enforcement and fallback behavior
- [h] T074 - Expand post-release verification across OS matrix
- [h] T080 - Validate release asset metadata contract in CI before publish
- [h] T082 - Add distributable package metadata and license compliance checks
- [h] T098 - Add clean-room install-and-first-run journey tests for release artifacts
- [h] T099 - Make user-journey artifact tests release-blocking in RC and release workflows
- [h] T100 - Build host-specific artifact install validation harness (VSIX/OpenClaw/Cursor)
- [h] T075 - Add test coverage for package-manager consistency checker script
- [h] T081 - Add support-matrix consistency check against package/workflow floors

### Phase 10 - Operational polish and deferred enhancements

- [h] T057 - Support quoted task names and richer parser input forms
- [h] T058 - Add proposal lifecycle GC to bound in-memory growth
- [h] T059 - Enforce session-only proposal lifecycle policy
- [h] T063 - Add docs/link integrity checker for workflow-critical references
- [h] T087 - Add proposed-task promotion and aging policy in TASKS workflow
- [h] T088 - Add phase exit checklist automation and report command
- [h] T089 - Add backlog integrity check for duplicates and phase assignment drift
- [h] T090 - Remove generated declaration files from source tree
- [h] T092 - Consolidate duplicated policy docs and rule references
- [h] T067 - Add `/qt help [topic]` contextual help command
- [h] T069 - Add template quality lint for `tasks/*.md` content conventions
- [h] T072 - Add release-note quality validation beyond section format
- [h] T091 - Normalize task-state terminology across docs/commands/rules
- [h] T094 - Define and enforce generated-artifact version-control policy
- [h] T095 - Refactor duplicated test setup helpers for maintainability
- [h] T097 - Audit and remove dead or unreferenced command/docs entrypoints
- [h] T078 - Add local CLI sandbox for QuickTask runtime command simulation
- [h] T079 - Add automated cleanup policy for quarantined corrupt templates
- [h] T093 - Reorganize root documentation into a maintainable docs structure
- [h] T096 - Remove or replace low-value placeholder package docs

### Phase 12 - User feedback resolution (`v1.0.x` adoption)

- [h] T133 - Prefer run when `/qt <existing-task> …` (explicit `/qt create` escape hatch) — shipped `v1.1.0`; core + contract + tests.
- [h] T134 - Marketplace + README install trust — README identity, checklist, listing cross-links (Marketplace assets external).
- [h] T135 - Chat-first docs + Contributing-only monorepo path — README reorder, `CONTRIBUTORS.md` sandbox quotes.
- [h] T136 - `/qt help` tiering, init steer, suggested next after `list` — core runtime + rendering.
- [h] T137 - Verbose/debug **spec** — `docs/qt-command-result-contract.md`, `docs/qt-adapter-rendering-matrix.md`.
- [h] T138 - `qt:sandbox` from repo root — root `devDependency` `@quicktask/core`, `scripts/qt-sandbox.mjs` `--` fix, CI job.
- [h] T139 - UF-012 long paste create body + docs — tests + README/contract.
- [h] T140 - Improve empty/thin input — `qt:incomplete` + minimum length in runtime.
- [h] T141 - Seeded template run-line footer — `/qt init` seeds in `packages/core/src/runtime.ts`.
- [h] T142 - Extension activation + doctor-aligned preflight — `packages/vscode-extension/src/extension.ts` (once per workspace).

## Notes

- Detailed implementation history, diffs, and acceptance evidence for archived tasks remain in git history and PR records.
- Keep `TASKS.md` concise; this file is the long-tail archive.
