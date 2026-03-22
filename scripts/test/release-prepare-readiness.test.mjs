import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFindings,
  listPendingChangesetFiles,
  normalizeVolatileReportFields,
  parseMilestonePhaseSummary,
  parseOpenReleaseReadinessTasks,
  shouldWriteReport
} from "../release-prepare-readiness.mjs";

test("finds open milestone tasks with phase metadata", () => {
  const tasks = parseOpenReleaseReadinessTasks(`
## Milestone execution order
### Phase 6 - Distribution and docs
- Active/near-term IDs: T053, T054, T065, T071, T083, T084, T085.
### Phase 7 - Release governance and risk gates
- Planned task IDs (in order): T053, T054, T065, T071, T083, T084, T085.
## Completed tasks (not yet archived)

## Active task backlog
### Intake queue
- [ ] T053 - Align release-readiness parser with active TASKS format (P0)
- [~] T054 - Add task tracker schema validator command (P1)
- [!] T065 - Add test coverage for release handoff and docs gate scripts (P1)
- [x] T071 - Add workflow contract checks for release inputs and docs gates (P1)

## Proposed task details

### [ ] T053 - Align release-readiness parser with active TASKS format
- Status: [ ]
### [~] T054 - Add task tracker schema validator command
- Status: [~]
### [!] T065 - Add test coverage for release handoff and docs gate scripts
- Status: [!]
### [x] T071 - Add workflow contract checks for release inputs and docs gates
- Status: [x]
`);

  assert.equal(tasks.length, 3);
  assert.deepEqual(tasks[0], {
    taskId: "T053",
    title: "Align release-readiness parser with active TASKS format",
    priority: "P0",
    phase: "Phase 7"
  });
  assert.equal(tasks[1].taskId, "T054");
  assert.equal(tasks[2].taskId, "T065");
});

test("derives current release phase from highest complete phase", () => {
  const summary = parseMilestonePhaseSummary(`
## Milestone execution order
### Phase 1 - Core foundations
- Planned task IDs (in order): T001
### Phase 2 - Core behavior and reliability
- Planned task IDs (in order): T002
### Phase 3 - Host integrations
- Planned task IDs (in order): T010
## Completed tasks (not yet archived)

## Active task backlog
### Intake queue
- [ ] T010 - Not done thing (P0)
## Proposed task details
### [x] T001 - Done thing
- Status: [x]
### [h] T002 - Done thing
- Status: [h]
### [ ] T010 - Not done thing
- Status: [ ]
`);

  assert.equal(summary.currentReleasePhase, "Phase 2");
});

test("includes open tasks from detail status when backlog line is missing", () => {
  const tasks = parseOpenReleaseReadinessTasks(`
## Milestone execution order
### Phase 7 - Release governance and risk gates
- Planned task IDs (in order): T084
## Completed tasks (not yet archived)

## Active task backlog
### Intake queue
- _Empty._

## Proposed task details
### [!] T084 - Enforce local-only diagnostics and zero-PII logging policy
- Status: [!]
`);

  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].taskId, "T084");
  assert.equal(tasks[0].phase, "Phase 7");
});

test("recognizes pending changeset markdown files", () => {
  const pending = listPendingChangesetFiles(["README.md", "cool-change.md", "config.json"]);
  assert.deepEqual(pending, ["cool-change.md"]);
});

test("adds medium finding when no pending changesets", () => {
  const findings = buildFindings(
    [{ id: "tests", label: "Tests", ok: true, failureSeverity: "high" }],
    [],
    "Phase 4",
    []
  );

  assert.equal(findings.length, 1);
  assert.equal(findings[0].source, "changeset-preflight");
  assert.equal(findings[0].severity, "medium");
});

test("does not rewrite report for timestamp-only changes", () => {
  const previous = `# Release Readiness Report\n\n- Generated at: 2026-01-01T00:00:00.000Z\n- Scope target: all phases (fixed)\n`;
  const next = `# Release Readiness Report\n\n- Generated at: 2026-02-01T00:00:00.000Z\n- Scope target: all phases (fixed)\n`;
  assert.equal(shouldWriteReport(previous, next), false);
});

test("normalizes command durations for stable report comparisons", () => {
  const normalized = normalizeVolatileReportFields(
    "| Workspace typecheck | pass | high | 1496ms |\n- Generated at: 2026-01-01T00:00:00.000Z"
  );
  assert.equal(
    normalized,
    "| Workspace typecheck | pass | high | <normalized> |\n- Generated at: <normalized>"
  );
});
