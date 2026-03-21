# QuickTask Tasks

## Agent task maintenance instructions

- Keep task IDs stable forever; never renumber existing tasks.
- When adding a new task:
  1. Append it to the backlog with a new sequential ID.
  2. Add it to the correct phase in milestone execution order.
  3. Set initial status to `[ ]` (not done).
- When updating a task:
  1. Preserve the original task ID and title intent.
  2. Update goal/steps/acceptance criteria/dependencies in place.
  3. If scope materially changes, note the change in the task body.
- When a task is completed:
  1. Mark it as `[x]` in milestone execution order and in the task section.
  2. Keep completed tasks in place until related follow-up work settles.
  3. Assess the closed task for newly discovered gaps; add new tasks or update existing tasks immediately when needed.
- When moving tasks to history:
  1. Move fully completed tasks from the active backlog into `Task history`.
  2. Change status to `[h]` (archived in history).
  3. Keep dependencies pointing at the same task ID.
- Use this status legend consistently:
  - `[ ]` not done (active backlog)
  - `[x]` complete (done, not yet archived)
  - `[h]` completed and archived in history
- Use this priority legend consistently:
  - `P0` critical path (must-have to ship a stable product)
  - `P1` important (high impact, but not a hard blocker to initial ship)
  - `P2` valuable follow-through (improves adoption/operability)

Working rules for all tasks:

- Create one branch per task and open one PR per task.
- Keep changes scoped to the task only.
- Add or update tests where practical for every implementation task.
- Preserve the current monorepo structure unless the task explicitly changes it.
- Prefer exact native `/qt` behavior in each host integration.
- For `/qt improve`, accepted changes must overwrite the existing task template.
- If a task reveals a blocker, document it in the PR and stop at the smallest safe boundary.

## Milestone execution order

### Phase 1 - Core foundations

- Success measure: Core `/qt` parsing, persistence, and tests pass locally with deterministic behavior.
- [h] T001 - Decide persistent task storage layout (P0)
- [h] T003 - Tighten command parsing against the current spec (P0)
- [h] T009 - Add core unit test harness (P0)
- [h] T002 - Replace in-memory store with file-backed task store (P0)

### Phase 2 - Core behavior and reliability

- Success measure: All core create/run/improve lifecycles are contract-stable, failure-safe, and fully test-backed.
- [h] T004 - Implement template creation flow from user instructions (P0)
- [h] T005 - Implement existing task execution flow (P0)
- [h] T006 - Implement improvement proposal flow (P0)
- [h] T008 - Define runtime result contract for host adapters (P0)
- [h] T015 - Add repo-wide build and test workflow (P0)
- [h] T034 - Define improvement proposal lifecycle contract (P0)
- [h] T007 - Implement improvement acceptance and overwrite behavior (P0)
- [h] T022 - Define stable core API surface for adapters (P0)
- [h] T023 - Harden file-backed storage error handling (P0)
- [h] T029 - Define runtime diagnostics and error observability (P0)
- [h] T030 - Add persisted template corruption recovery strategy (P0)
- [h] T031 - Add template format versioning and migration path (P0)
- [h] T035 - Publish canonical command and result contract docs (P0)
- [h] T036 - Define proposal persistence and TTL policy (P0)
- [h] T037 - Return structured runtime errors for parse failures (P0)
- [h] T038 - Add adapter rendering matrix from result contract (P1)
- [h] T039 - Define concurrent template write policy and tests (P1)
- [h] T040 - Add stale write-lock recovery policy and tests (P1)

### Phase 3 - Host integrations

- Success measure: `/qt` works end-to-end in VS Code, Cursor, and OpenClaw via the shared core runtime with no duplicated task logic.
- [h] T010 - Wire the VS Code extension to the core runtime (P0)
- [h] T011 - Implement native VS Code `/qt` chat command (P0)
- [h] T012 - Refine Cursor command integration around the core runtime (P0)
- [h] T013 - Wire the OpenClaw adapter to the core runtime (P0)
- [h] T014 - Implement native OpenClaw `/qt` command flow (P0)

### Phase 4 - CI and quality controls

- Success measure: CI enforces build/test/lint/security/compatibility standards and blocks regressions before merge.
- [h] T015 - Add repo-wide build and test workflow (P0)
- [h] T021 - Add linting and formatting quality gates (P1)
- [h] T024 - Add host-level end-to-end smoke tests (P1)
- [h] T027 - Define support matrix and compatibility policy (P1)
- [h] T028 - Add dependency and supply-chain security scanning (P1)
- [h] T033 - Add repository governance and release guardrails (P1)
- [h] T041 - Add pre-release readiness workflow and report pipeline (P1)
- [h] T042 - Add release readiness preflight for pending changesets (P1)
- [h] T043 - Add CI check for package manager config consistency (P1)
- [h] T044 - Reduce release readiness report churn from timestamp-only updates (P2)

### Phase 5 - Packaging and release operations

- Success measure: Reproducible, versioned release artifacts are generated, validated, and published through an auditable release flow.
- [h] T016 - Add VSIX packaging for the VS Code extension (P1)
- [h] T017 - Add OpenClaw package build artifact (P1)
- [h] T018 - Add release workflow for GitHub Releases (P1)
- [h] T025 - Add release versioning and changelog workflow (P1)
- [h] T026 - Add post-release install verification checks (P1)
- [h] T032 - Add release-candidate validation workflow (P1)
- [h] T045 - Add single-command release handoff wrapper (P2)
- [h] T046 - Publish installable release assets on GitHub releases (P1)
- [h] T047 - Add curated user-focused release notes layer (P1)
- [h] T048 - Publish release integrity metadata (checksums/SBOM) (P2)
- [h] T049 - Define first-public-release version baseline policy (P2)

### Phase 6 - Distribution and docs

- Success measure: Users can discover, install, and upgrade QuickTask across hosts using clear docs and repeatable publishing paths.
- [h] T019 - Add VS Code Marketplace publishing workflow (P2)
- [h] T020 - Write installation and release documentation (P2)
- [x] T050 - Fix Marketplace publisher/display-name mismatch (P1)

## Completed tasks (not yet archived)

- [x] T050 - Fix Marketplace publisher/display-name mismatch (P1)

## Active task backlog

## T004 - Implement template creation flow from user instructions

- Status: [h] archived complete
- Priority: P0
- Goal: Generate new task templates from user-provided instructions using the current spec.
- Files: `packages/core/src/templates.ts`, `packages/core/src/runtime.ts`, tests.
- Steps:
  1. Implement creation behavior for a non-existent task.
  2. Return a clear "already exists" result when the task name is already present.
  3. Keep generated directions very short.
  4. Prompt for clarification when the request is unclear.
  5. Save the created template through the file-backed store.
- Acceptance criteria:
  - New tasks are created only when no existing template exists.
  - Existing tasks return a deterministic "already exists" response shape.
  - Generated templates are concise markdown instructions.
  - Unclear requests surface a clarification response instead of a bad template.
  - Tests cover create/success/already-exists/unclear paths.
- Dependencies: T002, T003.

## T005 - Implement existing task execution flow

- Status: [h] archived complete
- Priority: P0
- Goal: Execute an existing task using stored template instructions plus user input.
- Files: `packages/core/src/runtime.ts`, supporting core files, tests.
- Steps:
  1. Load the existing template for `/qt/[task] [input]`.
  2. Pass through the provided user input without discarding it.
  3. Return a structured execution result that host adapters can render.
  4. Handle not-found tasks cleanly.
- Acceptance criteria:
  - Existing tasks resolve from disk.
  - User input is preserved in execution behavior.
  - Not-found tasks return a clear result.
  - Tests cover run/success/not-found/minimal-input cases.
- Dependencies: T002, T003.

## T006 - Implement improvement proposal flow

- Status: [h] archived complete
- Priority: P0
- Goal: Generate old-versus-new template proposals for `/qt improve`.
- Files: `packages/core/src/templates.ts`, `packages/core/src/runtime.ts`, tests.
- Steps:
  1. Load the current template.
  2. Produce a proposed new template using either provided user input or the best available improvement.
  3. Return both old and proposed templates in one result.
  4. Keep the proposal structured for host confirmation UX.
- Acceptance criteria:
  - Improvement flow works with and without user input.
  - Old and proposed templates are both returned.
  - Not-found tasks are handled cleanly.
  - Tests cover both explicit and inferred improvement paths.
- Dependencies: T002, T003.

## T007 - Implement improvement acceptance and overwrite behavior

- Status: [h] archived complete
- Priority: P0
- Goal: When an improvement is accepted, overwrite the existing task template on disk.
- Files: core runtime/store files, tests, docs if needed.
- Steps:
  1. Add a runtime path for accepting a proposed improvement.
  2. Overwrite the existing template file with the accepted content.
  3. Keep overwrite behavior explicit and testable.
  4. Ensure the updated template is used by subsequent runs.
- Acceptance criteria:
  - Accepted improvements overwrite the existing template file.
  - Rejected or abandoned proposals do not alter the file.
  - Tests cover accept/reject/abandon paths.
- Dependencies: T002, T006, T008, T034.

## T008 - Define runtime result contract for host adapters

- Status: [h] archived complete
- Priority: P0
- Goal: Standardize the response shapes that VS Code, Cursor, and OpenClaw adapters consume.
- Files: `packages/core/src/types.ts`, `packages/core/src/runtime.ts`, tests/docs.
- Steps:
  1. Define result shapes for help, clarification, create, run, improve, accept, reject, and error states.
  2. Keep the contract host-agnostic.
  3. Document how adapters should render each result.
- Acceptance criteria:
  - Result contract is explicit in code.
  - Runtime returns only documented result shapes.
  - Tests validate key result types.
- Dependencies: T004, T005, T006.

## T015 - Add repo-wide build and test workflow

- Status: [h] archived complete
- Priority: P0
- Goal: Add GitHub Actions CI for install, test, and build.
- Files: `.github/workflows/*`, package scripts/config as needed.
- Steps:
  1. Add a CI workflow for install, test, and build.
  2. Ensure the monorepo scripts work in CI.
  3. Fail the workflow on typecheck, test, or build failures.
- Acceptance criteria:
  - CI runs on push and PR.
  - Repo installs successfully in CI.
  - Check/test/build steps run in CI.
- Dependencies: T009.

## T016 - Add VSIX packaging for the VS Code extension

- Status: [h] archived complete
- Priority: P1
- Goal: Produce a VSIX artifact from the repo build.
- Files: extension package/config, build scripts, workflow files.
- Steps:
  1. Add the packaging toolchain needed to build a VSIX.
  2. Ensure the VS Code extension packages successfully.
  3. Output a versioned VSIX artifact in CI/release workflows.
- Acceptance criteria:
  - A VSIX can be built from the repo.
  - The artifact is suitable for VS Code and Cursor manual install.
  - Packaging is automated in scripts or workflows.
- Dependencies: T011, T015.

## T017 - Add OpenClaw package build artifact

- Status: [h] archived complete
- Priority: P1
- Goal: Produce an installable package artifact for OpenClaw.
- Files: OpenClaw package/config, build scripts, workflow files.
- Steps:
  1. Determine the correct OpenClaw packaging shape for installation.
  2. Add the build/package steps.
  3. Output a versioned OpenClaw install artifact in CI/release workflows.
- Acceptance criteria:
  - A repeatable install artifact is produced for OpenClaw.
  - Packaging is automated in scripts or workflows.
  - The installation method is documented.
- Dependencies: T014, T015.

## T018 - Add release workflow for GitHub Releases

- Status: [h] archived complete
- Priority: P1
- Goal: Publish release artifacts from tags or release events.
- Files: `.github/workflows/*`, docs/scripts as needed.
- Steps:
  1. Add a release workflow.
  2. Build the VSIX and OpenClaw artifacts during release.
  3. Attach artifacts to a GitHub Release.
  4. Optionally include a bundled zip if useful.
- Acceptance criteria:
  - Tagged releases publish installable artifacts.
  - Release assets include at least the VSIX and OpenClaw artifact.
  - Release flow is documented.
- Dependencies: T016, T017.

## T019 - Add VS Code Marketplace publishing workflow

- Status: [h] archived complete
- Priority: P2
- Goal: Prepare and automate publishing to the VS Code Marketplace.
- Files: extension metadata, workflow files, docs.
- Steps:
  1. Add the metadata and packaging requirements needed for marketplace publishing.
  2. Add a workflow or documented release step for publishing.
  3. Document required secrets and release procedure.
- Acceptance criteria:
  - The repo contains a clear marketplace publishing path.
  - Required secrets and steps are documented.
  - Publish automation is wired or clearly staged.
- Dependencies: T016, T018.
- Validation evidence:
  - Added workflow `.github/workflows/vscode-marketplace-publish.yml` with manual dispatch input `release_tag`, `VSCE_PAT` guard, release-tag/version parity check, and publish step.
  - Added extension publish script `publish:marketplace` and publish-ready metadata in `packages/vscode-extension/package.json`.
  - Documented secret and post-release publish procedure in `RELEASE_STRATEGY.md` and `CONTRIBUTORS.md`.

## T020 - Write installation and release documentation

- Status: [h] archived complete
- Priority: P2
- Goal: Document install and release flows for VS Code, Cursor, and OpenClaw.
- Files: `README.md`, optionally supporting docs.
- Steps:
  1. Update the repo README with install targets.
  2. Document VS Code install, Cursor VSIX install, and OpenClaw install.
  3. Document release and marketplace publishing flow.
  4. Keep the instructions concise and actionable.
- Acceptance criteria:
  - README explains what QuickTask is and how to install it per host.
  - Release flow is documented.
  - Marketplace publishing notes are documented.
- Dependencies: T018, T019, T027.
- Validation evidence:
  - Added `README.md` install sections for VS Code Marketplace, VSIX manual install, Cursor VSIX install, and OpenClaw package install.
  - Added `README.md` release workflow and post-release Marketplace publishing steps including required `VSCE_PAT` secret.
  - Linked release/install reference docs for follow-through (`RELEASE_STRATEGY.md`, `CONTRIBUTORS.md`, and `docs/release-assets-and-verification.md`).

## T050 - Fix Marketplace publisher/display-name mismatch

- Status: [x] complete (not yet archived)
- Priority: P1
- Goal: Unblock VS Code Marketplace publishing by aligning extension identity metadata with the intended publisher and a unique listing name.
- Files: `packages/vscode-extension/package.json`, `README.md`, `.changeset/*.md`.
- Steps:
  1. Update extension publisher metadata to the target Marketplace publisher account.
  2. Change the extension display name to a unique listing value accepted by Marketplace.
  3. Add a changeset so release automation includes the metadata update.
  4. Re-run release and Marketplace publish workflows on the new release tag.
- Acceptance criteria:
  - Publish workflow no longer fails on missing publisher ownership/display-name conflicts.
  - Marketplace publish path documents the correct publisher identity.
  - A new release tag is produced and used for publish retry.
- Dependencies: T019, T020.
- Validation evidence:
  - Updated `quicktask-vscode` metadata to publisher `nicklaprell` and display name `QuickTask Workflows`.
  - Updated README install/release notes to reference the correct publisher identity.
  - Added a release changeset and triggered the release + publish retry flow.

## T021 - Add linting and formatting quality gates

- Status: [h] archived complete
- Priority: P1
- Goal: Add repository-wide lint and formatting checks that run locally and in CI.
- Files: root/package configs, package-level configs, workflow files, docs as needed.
- Steps:
  1. Choose linting and formatting tools that work well with the TypeScript monorepo.
  2. Add root scripts for lint and format checks.
  3. Wire lint/format checks into CI so violations fail builds.
  4. Keep config shared where practical and scoped where necessary.
- Acceptance criteria:
  - `pnpm lint` and `pnpm format:check` run from repo root.
  - CI fails on lint or formatting violations.
  - Tooling setup is documented briefly for contributors.
- Dependencies: T015.

## T022 - Define stable core API surface for adapters

- Status: [h] archived complete
- Priority: P0
- Goal: Ensure host adapters consume a documented, stable `@quicktask/core` API.
- Files: `packages/core/src/index.ts`, core types/runtime files, tests/docs.
- Steps:
  1. Decide which parser/runtime/store/types exports are public.
  2. Re-export public APIs from the package entrypoint.
  3. Prevent adapter reliance on private internal paths.
  4. Document intended adapter integration boundaries.
- Acceptance criteria:
  - Adapters can integrate using only documented core exports.
  - Public exports are explicit and test-covered where practical.
  - No required deep imports into core internals remain.
- Dependencies: T008, T009.

## T023 - Harden file-backed storage error handling

- Status: [h] archived complete
- Priority: P0
- Goal: Make template persistence robust across common filesystem failure modes.
- Files: `packages/core/src/store.ts`, `packages/core/src/runtime.ts`, tests/docs.
- Steps:
  1. Define behavior for permission errors, missing directories, and I/O failures.
  2. Add safe read/write patterns to avoid corrupting templates on overwrite.
  3. Return clear runtime error results that adapters can render.
  4. Keep scope to operational filesystem failures; treat semantic file corruption in T030.
  5. Add targeted tests for unhappy paths and recovery behavior.
- Acceptance criteria:
  - Permission and path errors are handled without crashes.
  - Operational filesystem failures surface clear errors.
  - Overwrite operations are safe and test-covered.
  - Semantic corruption handling is explicitly deferred to T030.
  - Error paths are documented for adapter authors.
- Dependencies: T002, T008, T009.

## T024 - Add host-level end-to-end smoke tests

- Status: [h] archived complete
- Priority: P1
- Goal: Validate working `/qt` flows through host adapters using built artifacts.
- Files: host test harness files, workflow files, docs as needed.
- Steps:
  1. Define minimal smoke scenarios for help/create/run/improve.
  2. Add automated smoke tests for VS Code and OpenClaw adapters.
  3. Validate Cursor integration behavior using practical scripted checks where feasible.
  4. Run smoke tests in CI on pull requests and mainline changes.
- Acceptance criteria:
  - Smoke tests verify core user flows in each supported host path.
  - Failures clearly indicate host integration regressions.
  - Smoke checks are documented and repeatable.
- Dependencies: T011, T012, T014, T015.

## T025 - Add release versioning and changelog workflow

- Status: [h] archived complete
- Priority: P1
- Goal: Standardize semantic versioning and changelog generation for releases.
- Files: release docs/config/scripts/workflow files.
- Steps:
  1. Choose a release versioning approach compatible with the monorepo.
  2. Add a changelog generation or maintenance workflow.
  3. Require release notes content for shipped artifacts.
  4. Align release automation with tag and artifact publishing steps.
- Acceptance criteria:
  - Version bumps follow a documented semver policy.
  - Changelog entries are produced for each release.
  - Release notes are attached or generated consistently.
- Dependencies: T018.

## T026 - Add post-release install verification checks

- Status: [h] archived complete
- Priority: P1
- Goal: Confirm published artifacts are installable and usable after release.
- Files: workflow/check scripts, release docs.
- Steps:
  1. Define post-release verification for VSIX and OpenClaw artifacts.
  2. Automate install-and-basic-run checks against released assets.
  3. Capture pass/fail evidence in release workflows.
  4. Document manual fallback validation steps if automation is incomplete.
- Acceptance criteria:
  - Each release has a recorded install verification result.
  - Basic `/qt` functionality is confirmed on published artifacts.
  - Verification failures block or flag release completion.
- Dependencies: T016, T017, T018.

## T027 - Define support matrix and compatibility policy

- Status: [h] archived complete
- Priority: P1
- Goal: Set clear compatibility expectations across hosts, OSes, and runtime versions.
- Files: `README.md`, `ARCHITECTURE.md`, CI configs as needed.
- Steps:
  1. Define minimum supported VS Code, Cursor, OpenClaw, and Node versions.
  2. Document supported operating systems and any known limitations.
  3. Align CI coverage with the declared compatibility matrix.
  4. Add policy guidance for introducing breaking compatibility changes.
- Acceptance criteria:
  - Compatibility matrix is documented in repo docs.
  - CI validates at least the declared minimum supported environments.
  - Breaking changes follow a documented policy.
- Dependencies: T015.

## T028 - Add dependency and supply-chain security scanning

- Status: [h] archived complete
- Priority: P1
- Goal: Detect vulnerable dependencies and risky supply-chain changes early.
- Files: workflow files, dependency policies/docs, package configs as needed.
- Steps:
  1. Add automated dependency vulnerability scanning in CI.
  2. Add lockfile and dependency change checks for pull requests.
  3. Define remediation expectations for high and critical findings.
  4. Document local and CI security check commands.
- Acceptance criteria:
  - CI reports dependency vulnerabilities with actionable output.
  - High and critical findings fail CI or are explicitly gated.
  - Security scanning workflow is documented for contributors.
- Dependencies: T015.

## T029 - Define runtime diagnostics and error observability

- Status: [h] archived complete
- Priority: P0
- Goal: Make runtime and adapter failures diagnosable in development and support scenarios.
- Files: core runtime/types files, adapter integration files, docs/tests.
- Steps:
  1. Define structured error/result metadata for core and adapters.
  2. Add consistent logging hooks or diagnostic events at key flow boundaries.
  3. Ensure errors include context without leaking sensitive user content.
  4. Add tests for key diagnostic and error reporting paths.
- Acceptance criteria:
  - Error results contain stable diagnostic fields.
  - Host adapters can surface useful failure information.
  - Observability behavior is documented and test-covered.
- Dependencies: T008, T022, T023.

## T030 - Add persisted template corruption recovery strategy

- Status: [h] archived complete
- Priority: P0
- Goal: Prevent data loss and provide recovery behavior for corrupted task template files.
- Files: `packages/core/src/store.ts`, runtime/docs/tests, scripts if needed.
- Steps:
  1. Define detection rules for malformed, truncated, or semantically invalid template files.
  2. Add safe fallback behavior for unreadable templates.
  3. Add optional backup or rollback behavior for overwrite operations.
  4. Document operator and user recovery procedures.
- Acceptance criteria:
  - Corrupted files do not crash runtime flows.
  - Recovery behavior is deterministic and documented.
  - Tests cover corrupted-file detection and recovery outcomes.
- Dependencies: T002, T023.

## T031 - Add template format versioning and migration path

- Status: [h] archived complete
- Priority: P0
- Goal: Ensure persisted templates can evolve without breaking existing user data.
- Files: core store/runtime files, migration utilities, tests/docs.
- Steps:
  1. Define a version marker strategy for persisted template format.
  2. Implement migration logic for older template versions.
  3. Add backward-compatibility tests with representative legacy files.
  4. Document migration behavior and rollback expectations.
- Acceptance criteria:
  - Older template files are readable or migratable without manual edits.
  - Migration logic is automated and test-covered.
  - Versioning policy is documented for future changes.
- Dependencies: T002, T023, T030.

## T032 - Add release-candidate validation workflow

- Status: [h] archived complete
- Priority: P1
- Goal: Validate release artifacts in a staged RC process before final publication.
- Files: release workflow files, docs, optional validation scripts.
- Steps:
  1. Add a release-candidate build and publish path.
  2. Run smoke and install verification against RC artifacts.
  3. Gate final release publication on RC validation results.
  4. Document RC promotion and rollback procedures.
- Acceptance criteria:
  - RC artifacts are produced and validated before final release.
  - Promotion to final release is explicit and auditable.
  - Failed RC validation blocks final publication.
- Dependencies: T018, T024, T026.

## T033 - Add repository governance and release guardrails

- Status: [h] archived complete
- Priority: P1
- Goal: Enforce review, ownership, and quality controls on high-impact changes.
- Files: `CODEOWNERS`, workflow files, contributing docs.
- Steps:
  1. Add ownership rules for core runtime, adapters, and release workflows.
  2. Require review and required checks for protected branches.
  3. Add PR-level checks for changelog/release-note completeness.
  4. Document governance expectations for contributors.
- Acceptance criteria:
  - Critical paths have explicit code ownership.
  - PRs cannot merge without required checks and reviews.
  - Release-note/changelog guardrails are enforced.
  - A repository settings checklist artifact is included to verify platform-level enforcement.
- Dependencies: T015, T025.

## T034 - Define improvement proposal lifecycle contract

- Status: [h] archived complete
- Priority: P0
- Goal: Standardize how improvement proposals are identified, accepted, rejected, or abandoned across hosts.
- Files: `packages/core/src/types.ts`, `packages/core/src/runtime.ts`, adapter docs/tests.
- Steps:
  1. Define proposal identity and metadata requirements (for example ID/token and originating task).
  2. Define runtime action shapes for accept/reject/abandon operations.
  3. Define stale/conflicting proposal handling and idempotency behavior.
  4. Document adapter UX requirements for proposal confirmation flows.
- Acceptance criteria:
  - Proposal lifecycle state transitions are explicit and testable.
  - Accept/reject/abandon paths are deterministic across hosts.
  - Stale proposal handling is documented and tested.
  - Contract is documented for adapter implementations.
- Dependencies: T006, T008.

## T035 - Publish canonical command and result contract docs

- Status: [h] archived complete
- Priority: P0
- Goal: Keep user-facing and adapter-facing command/contract docs aligned with actual runtime behavior.
- Files: `README.md`, `ARCHITECTURE.md`, `packages/core/src/types.ts`, new docs under `docs/` as needed.
- Steps:
  1. Define one canonical command and runtime-result contract reference.
  2. Update `README.md` command forms to include lifecycle action commands.
  3. Cross-link adapter guidance to the same contract source.
  4. Add a lightweight consistency check or review checklist to prevent future drift.
- Acceptance criteria:
  - Documented commands match parser-supported commands.
  - Documented result states match `QtRuntimeResult`.
  - User docs and adapter docs reference the same contract source.
- Dependencies: T008, T022, T034.

## T036 - Define proposal persistence and TTL policy

- Status: [h] archived complete
- Priority: P0
- Goal: Ensure improve proposal IDs behave deterministically across runtime restarts and long-running sessions.
- Files: `packages/core/src/runtime.ts`, `packages/core/src/store.ts`, `packages/core/src/types.ts`, tests/docs.
- Steps:
  1. Decide whether proposals are persisted to disk or explicitly session-scoped.
  2. Define proposal expiration/TTL and stale proposal behavior.
  3. Implement the chosen behavior in runtime/store.
  4. Add tests for restart, expiry, and stale action flows.
- Acceptance criteria:
  - Proposal accept/reject/abandon behavior is deterministic after restart.
  - TTL/staleness behavior is explicit and test-covered.
  - Adapter expectations for stale proposals are documented.
- Dependencies: T006, T007, T034.

## T037 - Return structured runtime errors for parse failures

- Status: [h] archived complete
- Priority: P0
- Goal: Ensure `createQtRuntime().handle()` never throws for invalid input and always returns structured error results.
- Files: `packages/core/src/runtime.ts`, `packages/core/src/types.ts`, parser/runtime tests.
- Steps:
  1. Wrap parser failures in runtime so non-`/qt` input returns a structured error result.
  2. Add parse-error-specific diagnostic code(s) in the runtime result contract.
  3. Ensure diagnostics events include failed parse attempts safely.
  4. Add tests for invalid/non-command inputs.
- Acceptance criteria:
  - Invalid input paths return structured runtime errors.
  - Runtime no longer throws parser errors through the public `handle()` API.
  - Parse-failure behavior is test-covered and documented.
- Dependencies: T003, T008, T029.

## T038 - Add adapter rendering matrix from result contract

- Status: [h] archived complete
- Priority: P1
- Goal: Define exactly how each host should render each runtime result code and required user actions.
- Files: new doc under `docs/`, adapter integration docs in `packages/vscode-extension`, `.cursor/commands`, and `packages/openclaw-plugin` as needed.
- Steps:
  1. Enumerate all runtime result codes and required payload fields.
  2. Map each result code to expected VS Code/Cursor/OpenClaw UX behavior.
  3. Document fallback behavior for unknown/new result codes.
  4. Add adapter integration checklist against the matrix.
- Acceptance criteria:
  - Every runtime result code has explicit rendering guidance per host.
  - Unknown-code fallback behavior is documented.
  - Adapter work references this matrix as the source of truth.
- Dependencies: T008, T022.

## T039 - Define concurrent template write policy and tests

- Status: [h] archived complete
- Priority: P1
- Goal: Prevent inconsistent template state when multiple host processes write the same task concurrently.
- Files: `packages/core/src/store.ts`, runtime/store tests, docs.
- Steps:
  1. Define concurrency policy (last-write-wins, optimistic lock/version check, or lock file strategy).
  2. Implement the chosen policy for save/overwrite flows.
  3. Add deterministic tests simulating concurrent writes.
  4. Document conflict behavior for adapter UX.
- Acceptance criteria:
  - Concurrent write behavior is deterministic and documented.
  - No partial/corrupted state from concurrent write attempts.
  - Conflict or overwrite outcomes are test-covered.
- Dependencies: T023, T030, T031.

## T040 - Add stale write-lock recovery policy and tests

- Status: [h] archived complete
- Priority: P1
- Goal: Ensure lock-file based concurrency control can recover safely when a host process crashes and leaves stale locks behind.
- Files: `packages/core/src/store.ts`, runtime/store tests, docs.
- Steps:
  1. Define stale-lock detection semantics (age, metadata, or explicit cleanup command).
  2. Implement deterministic stale-lock recovery while preserving concurrent-write safety.
  3. Add tests for stale lock recovery and active lock no-bypass behavior.
  4. Document host-facing conflict/recovery UX expectations.
- Acceptance criteria:
  - Stale lock files do not permanently block template writes.
  - Active concurrent writes remain blocked with deterministic error behavior.
  - Recovery behavior is documented and test-covered.
- Dependencies: T039.

## T041 - Add pre-release readiness workflow and report pipeline

- Status: [h] archived complete
- Priority: P1
- Goal: Standardize chat-triggered pre-release preparation with full-hardening validation and `TASKS.md`-based finding tracking before release workflow handoff.
- Files: `package.json`, `scripts/release-prepare-readiness.mjs`, `PRE_RELEASE_READINESS_WORKFLOW.md`, `.cursor/rules/`, `.cursor/commands/`, `RELEASE_STRATEGY.md`, `README.md`, `docs/release-readiness-report.md`.
- Steps:
  1. Add a single command to run readiness checks and generate a report artifact.
  2. Define blocking policy (`medium` and `high`) and release handoff condition.
  3. Codify readiness flow for chat-triggered execution and `TASKS.md`-only issue tracking.
  4. Wire docs/rules so the assistant executes the same pattern consistently, including a prerelease `README.md` audit that follows `README_EDITING.md`.
  5. Run readiness preparation once to establish a baseline report.
- Acceptance criteria:
  - `pnpm release:prepare` exists and writes a readiness report.
  - Readiness findings are tracked in `TASKS.md`, not GitHub issues.
  - Prerelease workflow includes explicit `README.md` audit guidance that references `README_EDITING.md`.
  - Release strategy references readiness handoff criteria.
  - Workflow/rule docs are present and aligned.
- Dependencies: T018, T025, T033.

## T042 - Add release readiness preflight for pending changesets

- Status: [h] archived complete
- Priority: P1
- Goal: Catch missing changeset release inputs during readiness instead of failing late in the release workflow.
- Files: `scripts/release-prepare-readiness.mjs`, release docs/tests, optional helper script.
- Steps:
  1. Add a readiness preflight that checks for pending `.changeset` entries relevant to the target release scope.
  2. Emit a deterministic medium/high finding when no releaseable changeset input is present.
  3. Include actionable remediation guidance in the readiness report.
  4. Add tests for has-changeset and no-changeset paths.
- Acceptance criteria:
  - Readiness report clearly flags missing changeset input before release dispatch.
  - Release preflight outcome is deterministic and test-covered.
  - Guidance points contributors to create or merge a changeset entry.
- Dependencies: T025, T041.

## T043 - Add CI check for package manager config consistency

- Status: [h] archived complete
- Priority: P1
- Goal: Prevent workflow failures from mismatched package manager version declarations across repo config and CI workflows.
- Files: workflow files, validation scripts, docs.
- Steps:
  1. Define policy for package manager version source of truth (for example `package.json#packageManager`).
  2. Add a CI validation step that checks workflows/scripts against this policy.
  3. Fail CI when inconsistent package manager version settings are detected.
  4. Document remediation and ownership for consistency failures.
- Acceptance criteria:
  - CI catches package manager config drift before merge.
  - Version source-of-truth policy is documented.
  - Validation step is reproducible locally and in CI.
- Dependencies: T015, T033.

## T044 - Reduce release readiness report churn from timestamp-only updates

- Status: [h] archived complete
- Priority: P2
- Goal: Avoid noisy repo diffs when release readiness state is unchanged across runs.
- Files: `scripts/release-prepare-readiness.mjs`, `docs/release-readiness-report.md`, docs.
- Steps:
  1. Define output strategy for readiness reporting (stable summary file, artifact-only details, or both).
  2. Prevent timestamp-only rewrites when report content is otherwise unchanged.
  3. Preserve enough metadata for auditing while minimizing unnecessary commits.
  4. Document expected local and CI output behavior.
- Acceptance criteria:
  - Re-running readiness without state changes does not create noisy diffs.
  - Report output remains actionable and auditable.
  - Behavior is documented and test-covered where practical.
- Dependencies: T041.

## T045 - Add single-command release handoff wrapper

- Status: [h] archived complete
- Priority: P2
- Goal: Provide one command that validates readiness state and dispatches release workflow with required inputs.
- Files: scripts, package scripts, release docs.
- Steps:
  1. Add a release handoff command that checks readiness report status and required inputs.
  2. Trigger the release workflow dispatch only when readiness gate passes (or explicit override is provided).
  3. Emit clear terminal output for handoff success, block reasons, and next actions.
  4. Document expected usage for phase-scoped and full-product release flows.
- Acceptance criteria:
  - Contributors can execute release handoff through a single command path.
  - Handoff command enforces readiness gating behavior.
  - Failure messaging is deterministic and actionable.
- Dependencies: T018, T041, T042.

## T046 - Publish installable release assets on GitHub releases

- Status: [h] archived complete
- Priority: P1
- Goal: Ensure GitHub releases include installable artifacts rather than source-only outputs.
- Files: `.github/workflows/release.yml`, packaging scripts, release docs.
- Steps:
  1. Build VSIX and OpenClaw installable artifacts during release workflow.
  2. Attach generated artifacts to the GitHub release.
  3. Validate artifact naming/versioning consistency with release tag.
  4. Document where users should download/install each asset.
- Acceptance criteria:
  - Release page includes installable assets for supported hosts.
  - Asset filenames and versions match release tag/version.
  - Release workflow fails when expected assets are missing.
- Dependencies: T016, T017, T018.

## T047 - Add curated user-focused release notes layer

- Status: [h] archived complete
- Priority: P1
- Goal: Improve release note quality so published notes emphasize user-impactful changes over internal implementation noise.
- Files: release workflow/docs/changelog templates, `.changeset` policy docs.
- Steps:
  1. Define structure for user-facing highlights, breaking changes, and upgrade notes.
  2. Add workflow/doc logic to include curated notes in release publication.
  3. Keep generated PR lists as supporting detail, not the primary release narrative.
  4. Add contributor guidance for writing concise user-impact summaries.
- Acceptance criteria:
  - Published release notes include a clear user-facing summary section.
  - Internal-only maintenance changes are de-emphasized or grouped.
  - Release note quality expectations are documented for contributors.
- Dependencies: T025, T041.

## T048 - Publish release integrity metadata (checksums/SBOM)

- Status: [h] archived complete
- Priority: P2
- Goal: Improve trust and auditability of published release artifacts.
- Files: release workflow files, scripts, security docs.
- Steps:
  1. Generate checksums for release artifacts and publish alongside assets.
  2. Add optional SBOM generation for release outputs.
  3. Attach integrity metadata to GitHub releases.
  4. Document artifact verification steps for users and operators.
- Acceptance criteria:
  - Each release publishes checksum metadata for installable assets.
  - Integrity metadata is available from the release page.
  - Verification instructions are documented and repeatable.
- Dependencies: T046, T028.

## T049 - Define first-public-release version baseline policy

- Status: [h] archived complete
- Priority: P2
- Goal: Avoid ambiguity around initial release numbering and future version transitions.
- Files: `RELEASE_STRATEGY.md`, `CONTRIBUTORS.md`, changelog/versioning docs.
- Steps:
  1. Define policy for initial public release version (for example `v0.1.0` vs `v0.1.1`) and rationale.
  2. Document how the policy applies to future release trains.
  3. Align release automation and contributor docs with the chosen baseline policy.
  4. Add a lightweight check/review item to enforce policy adherence.
- Acceptance criteria:
  - Version baseline policy is explicit and documented.
  - Contributors can determine the correct next release number deterministically.
  - Release process docs and automation are aligned with the policy.
- Dependencies: T025, T041.

## Task history

### [h] T010 - Wire the VS Code extension to the core runtime

- Status: [h] archived complete
- Priority: P0
- Goal: Replace the VS Code scaffold with a real integration point to QuickTask core.
- Files: `packages/vscode-extension/*`, core files as needed, tests.
- Steps:
  1. Add dependency wiring from the extension to `@quicktask/core`.
  2. Invoke the runtime from the extension entrypoint.
  3. Keep the extension structure aligned with exact native `/qt` behavior as the target.
  4. Add extension-level tests where practical.
- Acceptance criteria:
  - The extension uses the shared core runtime.
  - No task logic is duplicated in the extension.
  - Tests cover the adapter boundary where practical.
- Dependencies: T008, T009, T022.

### [h] T011 - Implement native VS Code `/qt` chat command

- Status: [h] archived complete
- Priority: P0
- Goal: Support QuickTask through a native VS Code chat command flow.
- Files: `packages/vscode-extension/*`, docs/tests.
- Steps:
  1. Register the native VS Code chat participant or slash-command mechanism.
  2. Map `/qt` requests into the core runtime.
  3. Render help/create/run/improve/confirmation results naturally in chat.
  4. Ensure improvement acceptance overwrites the template.
- Acceptance criteria:
  - `/qt` works natively in VS Code chat.
  - Help/create/run/improve flows are reachable.
  - Accepting an improvement overwrites the stored template.
  - Tests or validation steps are documented.
- Dependencies: T010.

### [h] T012 - Refine Cursor command integration around the core runtime

- Status: [h] archived complete
- Priority: P0
- Goal: Turn the current Cursor stub into a practical exact-UX integration around the shared runtime.
- Files: `.cursor/commands/qt.md`, supporting docs or scripts, tests if practical.
- Steps:
  1. Review what exact native behavior is feasible in Cursor.
  2. Update the command wrapper to align with the core runtime contract.
  3. Document any unavoidable Cursor-specific limits without changing the core behavior.
  4. Keep the command experience as close to native `/qt` as possible.
- Acceptance criteria:
  - Cursor integration points to the shared runtime behavior.
  - Known Cursor limitations are documented.
  - No duplicate task logic exists outside the core.
- Dependencies: T008.

### [h] T013 - Wire the OpenClaw adapter to the core runtime

- Status: [h] archived complete
- Priority: P0
- Goal: Replace the OpenClaw scaffold with a real integration point to QuickTask core.
- Files: `packages/openclaw-plugin/*`, core files as needed, tests/docs.
- Steps:
  1. Add dependency wiring from the OpenClaw package to `@quicktask/core`.
  2. Invoke the runtime from the OpenClaw entrypoint.
  3. Keep the package aligned with exact native `/qt` behavior as the target.
  4. Add adapter-level tests where practical.
- Acceptance criteria:
  - The OpenClaw package uses the shared core runtime.
  - No task logic is duplicated in the adapter.
  - Tests cover the adapter boundary where practical.
- Dependencies: T008, T009, T022.

### [h] T014 - Implement native OpenClaw `/qt` command flow

- Status: [h] archived complete
- Priority: P0
- Goal: Support QuickTask through a native OpenClaw slash-command flow.
- Files: `packages/openclaw-plugin/*`, docs/tests.
- Steps:
  1. Register or wire the native OpenClaw slash-command path.
  2. Map `/qt` requests into the core runtime.
  3. Render help/create/run/improve/confirmation flows appropriately.
  4. Ensure accepted improvements overwrite stored templates.
- Acceptance criteria:
  - `/qt` works natively in OpenClaw.
  - Help/create/run/improve flows are reachable.
  - Accepting an improvement overwrites the stored template.
  - Validation steps are documented.
- Dependencies: T013.

### [h] T001 - Decide persistent task storage layout

- Status: [h] archived complete
- Priority: P0
- Goal: Choose and document the repository path and naming rules for persisted `[task].md` files.
- Files: `ARCHITECTURE.md`, optionally new doc under repo root if needed.
- Steps:
  1. Review the current spec and runtime scaffold.
  2. Decide where task template files should live in the repo.
  3. Define task-name-to-filename normalization rules.
  4. Define how host adapters locate the task store.
  5. Document the decision clearly.
- Acceptance criteria:
  - Persistent storage path is explicitly documented.
  - Filename normalization rules are documented.
  - Host lookup rules are documented.
  - No runtime code changes beyond what is needed to support the documentation.
- Dependencies: none.

### [h] T002 - Replace in-memory store with file-backed task store

- Status: [h] archived complete
- Priority: P0
- Goal: Persist task templates as markdown files instead of using the in-memory store.
- Files: `packages/core/src/store.ts`, supporting core files, tests.
- Steps:
  1. Implement file-backed read/write operations for task templates.
  2. Use the documented storage layout from T001.
  3. Preserve task lookup by logical task name.
  4. Ensure saved templates are written as `[task].md` content.
  5. Keep interfaces small and host-agnostic.
- Acceptance criteria:
  - Templates can be saved, loaded, and overwritten from disk.
  - Missing tasks are handled cleanly.
  - File contents round-trip correctly.
  - Automated tests cover save/load/overwrite/not-found behavior.
- Dependencies: T001.

### [h] T003 - Tighten command parsing against the current spec

- Status: [h] archived complete
- Priority: P0
- Goal: Make the parser behavior match the agreed command forms exactly.
- Files: `packages/core/src/parser.ts`, related types/tests.
- Steps:
  1. Review supported command forms in the spec.
  2. Handle `/qt`, `/qt [task] [instructions]`, `/qt/[task] [input]`, and `/qt improve [task] [input]` precisely.
  3. Return structured parse results for unclear or incomplete input where needed.
  4. Avoid inventing unsupported command forms.
- Acceptance criteria:
  - Parser behavior matches the current spec.
  - Ambiguous/incomplete input is test-covered.
  - Tests cover all valid command forms and obvious invalid ones.
- Dependencies: none.

### [h] T009 - Add core unit test harness

- Status: [h] archived complete
- Priority: P0
- Goal: Establish a clean test setup for the core package.
- Files: core package config/tests, root config if needed.
- Steps:
  1. Choose and configure a test runner for the monorepo.
  2. Add package scripts for running core tests.
  3. Add representative tests for parser, store, and runtime.
  4. Ensure CI can run the tests later.
- Acceptance criteria:
  - Tests run from the repo with a documented command.
  - Core package tests pass locally in CI-ready form.
  - Existing implemented behavior is covered at a useful level.
- Dependencies: none.
