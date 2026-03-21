# Release Readiness Report

- Generated at: 2026-03-21T04:31:41.376Z
- Scope: pre-release readiness checks before `Release` workflow handoff
- Blocking policy: medium/high findings block handoff

## Command checks

| Check | Result | Severity on failure | Duration |
| --- | --- | --- | --- |
| Workspace typecheck | pass | high | 1042ms |
| Workspace tests | pass | high | 1063ms |
| Workspace build | pass | high | 1012ms |
| Release docs sync gate | pass | medium | 208ms |

## Findings

- [medium] Open release-readiness task remains: T010 (existing task: T010)
  - Source: tasks-backlog
  - Details: T010 (P0) - Wire the VS Code extension to the core runtime
- [medium] Open release-readiness task remains: T011 (existing task: T011)
  - Source: tasks-backlog
  - Details: T011 (P0) - Implement native VS Code `/qt` chat command
- [medium] Open release-readiness task remains: T012 (existing task: T012)
  - Source: tasks-backlog
  - Details: T012 (P0) - Refine Cursor command integration around the core runtime
- [medium] Open release-readiness task remains: T013 (existing task: T013)
  - Source: tasks-backlog
  - Details: T013 (P0) - Wire the OpenClaw adapter to the core runtime
- [medium] Open release-readiness task remains: T014 (existing task: T014)
  - Source: tasks-backlog
  - Details: T014 (P0) - Implement native OpenClaw `/qt` command flow
- [medium] Open release-readiness task remains: T015 (existing task: T015)
  - Source: tasks-backlog
  - Details: T015 (P0) - Add repo-wide build and test workflow
- [medium] Open release-readiness task remains: T021 (existing task: T021)
  - Source: tasks-backlog
  - Details: T021 (P1) - Add linting and formatting quality gates
- [medium] Open release-readiness task remains: T024 (existing task: T024)
  - Source: tasks-backlog
  - Details: T024 (P1) - Add host-level end-to-end smoke tests
- [medium] Open release-readiness task remains: T027 (existing task: T027)
  - Source: tasks-backlog
  - Details: T027 (P1) - Define support matrix and compatibility policy
- [medium] Open release-readiness task remains: T028 (existing task: T028)
  - Source: tasks-backlog
  - Details: T028 (P1) - Add dependency and supply-chain security scanning
- [medium] Open release-readiness task remains: T033 (existing task: T033)
  - Source: tasks-backlog
  - Details: T033 (P1) - Add repository governance and release guardrails
- [medium] Open release-readiness task remains: T016 (existing task: T016)
  - Source: tasks-backlog
  - Details: T016 (P1) - Add VSIX packaging for the VS Code extension
- [medium] Open release-readiness task remains: T017 (existing task: T017)
  - Source: tasks-backlog
  - Details: T017 (P1) - Add OpenClaw package build artifact
- [medium] Open release-readiness task remains: T018 (existing task: T018)
  - Source: tasks-backlog
  - Details: T018 (P1) - Add release workflow for GitHub Releases
- [medium] Open release-readiness task remains: T025 (existing task: T025)
  - Source: tasks-backlog
  - Details: T025 (P1) - Add release versioning and changelog workflow
- [medium] Open release-readiness task remains: T026 (existing task: T026)
  - Source: tasks-backlog
  - Details: T026 (P1) - Add post-release install verification checks
- [medium] Open release-readiness task remains: T032 (existing task: T032)
  - Source: tasks-backlog
  - Details: T032 (P1) - Add release-candidate validation workflow
- [medium] Open release-readiness task remains: T019 (existing task: T019)
  - Source: tasks-backlog
  - Details: T019 (P2) - Add VS Code Marketplace publishing workflow
- [medium] Open release-readiness task remains: T020 (existing task: T020)
  - Source: tasks-backlog
  - Details: T020 (P2) - Write installation and release documentation

## Handoff decision

- BLOCKED: 19 medium/high finding(s) must be resolved or accepted before running the release workflow.

## Task maintenance action

- For findings without an existing task, add new tasks in `TASKS.md` and assign phase/priority manually.
- For findings mapped to existing tasks, update those task sections with latest validation evidence.
- Do not use GitHub issues for this flow.

