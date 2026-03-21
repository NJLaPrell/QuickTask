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

## Notes

- Detailed implementation history, diffs, and acceptance evidence for archived tasks remain in git history and PR records.
- Keep `TASKS.md` concise; this file is the long-tail archive.
