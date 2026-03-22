# quicktask-openclaw

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
