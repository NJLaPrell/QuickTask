# quicktask-vscode

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
