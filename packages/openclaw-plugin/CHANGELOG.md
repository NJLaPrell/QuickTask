# quicktask-openclaw

## 1.1.0

### Minor Changes

- 1b19f91: ## New Features
  - `/qt <existing-task> …` now runs the template by default; `/qt create …` is the explicit create path for new names.
  - Tiered help: `/qt help` quickstart, `/qt help all` for the full surface, and workspace-aware onboarding hints.
  - Suggested next commands after a successful `/qt list` when templates exist.
  - VS Code / Cursor: one-time activation summary (tasks path, writable, template count) aligned with `/qt doctor`.

  ## Bug Fixes
  - `pnpm qt:sandbox` works from the monorepo root (workspace-linked `@quicktask/core`); `--` is ignored so `pnpm qt:sandbox -- "/qt …"` parses correctly.

  ## Internal Improvements
  - CI exercises `qt:sandbox`; contracts and README updated for Phase 12 (UF-012 long create body, improve minimum input, verbose/debug spec).

  ## Breaking Changes
  - `/qt improve <task>` with empty or very short input now returns `qt:incomplete` with guidance instead of an inferred proposal.

## 1.0.0

### Major Changes

- d15a8a8: ## New Features
  - Add deterministic template-variable support with missing-variable guidance.
  - Add template export/import flows and local template-pack manifest resolution.
  - Add privacy-safe aggregate UX friction diagnostics and baseline template eval harness scaffolding.

  ## Bug Fixes
  - Modernize release-critical workflow publish path to use CLI-based release publication and remove deprecated JS-action runtime dependency during release.

  ## Internal Improvements
  - Upgrade release-critical workflow setup actions to Node-24-ready versions and align governance/contributor docs with canonical policy links and Phase 11 execution checks.

  ## Breaking Changes
  - Graduate QuickTask to the `1.0.0` line with finalized command/runtime contracts, including template variable interpolation and portability command surfaces (`export`, `import`, `import-pack`).

## 0.4.0

### Minor Changes

- 9081476: ## New Features
  - Add `/qt init` bootstrap flow with idempotent starter-template seeding and deterministic first-run guidance.
  - Persist improve proposals across restarts with TTL cleanup and bounded state compaction.

  ## Bug Fixes
  - Improve proposal lifecycle stability so accept/reject/abandon behavior remains deterministic after runtime restarts.

  ## Internal Improvements
  - Expand parser/runtime/adapter tests and docs for init rendering and restart-safe proposal lifecycle semantics.

  ## Breaking Changes
  - None.

## 0.3.0

### Minor Changes

- 51a8440: ## New Features
  - Add quoted task parsing, contextual `/qt help [topic]`, and proposal/store lifecycle cleanup in core runtime behavior.
  - Add local workflow automation for docs-link integrity, task-template quality linting, phase-exit checks, and generated-artifact policy enforcement.

  ## Bug Fixes
  - Remove generated declaration artifacts from tracked source paths and enforce dist-only declaration outputs.
  - Tighten release workflow contracts with release-note quality checks and command-entrypoint consistency checks.

  ## Internal Improvements
  - Consolidate governance documentation with a canonical governance map and policy/workflow references.
  - Add CLI sandbox and expanded script-test coverage for new operational tooling and release readiness checks.

  ## Breaking Changes
  - None.

## 0.2.6

### Patch Changes

- f39524b: ## New Features
  - Add clean-room artifact journey and host-install validation harnesses as release gates.

  ## Bug Fixes
  - Fail release verification on malformed integrity metadata and dependency-review actionable findings.

  ## Internal Improvements
  - Add support-matrix and package-compliance checks across CI and release workflows.

  ## Breaking Changes
  - None.

## 0.2.5

### Patch Changes

- 68a677c: ## New Features
  - Add release-governance automation for task schema checks and workflow-contract drift detection.

  ## Bug Fixes
  - Fix readiness parsing so open-task detection uses active backlog statuses plus task detail status fields.

  ## Internal Improvements
  - Codify change-based release cadence, formal medium/high risk acceptance records, and diagnostics privacy guardrails across docs, rules, and CI workflows.

  ## Breaking Changes
  - None.

- fd9c490: ## New Features
  - Add approved `/qt` discovery and diagnostics commands (`list`, `show`, `doctor`) with end-to-end adapter rendering support.

  ## Bug Fixes
  - Fix command-surface drift risk by introducing contract checks that fail when runtime result codes diverge from docs or adapter coverage.

  ## Internal Improvements
  - Unify host rendering through shared core mapping, expand adapter lifecycle/parity smoke coverage, and tighten VS Code chat compatibility handling.

  ## Breaking Changes
  - None.

## 0.2.4

### Patch Changes

- 7207bdb: ## New Features
  - Align VS Code Marketplace extension identity with publisher `nicklaprell` and display name `QuickTask Workflows`.

  ## Bug Fixes
  - Fix Marketplace publish failure caused by display-name conflict on `QuickTask`.

  ## Internal Improvements
  - Update release/install docs to reference the current marketplace publisher identity.

  ## Breaking Changes
  - None.

## 0.2.3

### Patch Changes

- 281a771: ## New Features
  - Add host-specific installation guidance for VS Code Marketplace, VSIX installs, Cursor, and OpenClaw in `README.md`.

  ## Bug Fixes
  - None.

  ## Internal Improvements
  - Document the release workflow sequence from RC validation through release dispatch and post-release Marketplace publication.

  ## Breaking Changes
  - None.

## 0.2.2

### Patch Changes

- 638d4ff: ## New Features
  - Add release artifact packaging for VSIX and OpenClaw outputs, including automated release attachment to GitHub Releases.
  - Add release candidate and post-release verification workflows with asset integrity checks.

  ## Bug Fixes
  - Prevent release dispatch without successful RC validation and required readiness/doc-sync inputs.

  ## Internal Improvements
  - Add curated release-note generation, changeset section validation, and a single-command release handoff wrapper.
  - Add baseline version policy enforcement and release integrity metadata generation (checksums and SBOM).

  ## Breaking Changes
  - None.

## 0.2.1

### Patch Changes

- f6b2ed8: ## New Features
  - None.

  ## Bug Fixes
  - None.

  ## Internal Improvements
  - Complete Phase 4 hardening by adding CI lint/format gates, host smoke checks, supply-chain scans, governance guardrails, and release-readiness preflights.
  - Add package-manager consistency validation and reduce release-readiness report churn from timestamp-only updates.

  ## Breaking Changes
  - None.

- Updated dependencies [f6b2ed8]
  - @quicktask/core@0.2.1

## 0.2.0

### Minor Changes

- 3b1984a: Complete Phase 3 host integrations by wiring VS Code, Cursor command docs, and OpenClaw adapters to the shared QuickTask core runtime.

  This release adds native host command flows, improves adapter result rendering/diagnostics, and aligns release-readiness gating with current-phase handoff behavior.

### Patch Changes

- Updated dependencies [3b1984a]
  - @quicktask/core@0.2.0

## 0.1.1

### Patch Changes

- f8df572: Prepare the Phase 2 release baseline with contract-stable core behavior, readiness-gated release flow, and updated contributor and release workflow documentation.
