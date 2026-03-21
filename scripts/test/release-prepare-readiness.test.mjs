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
### Phase 4 - CI and quality controls
- [ ] T021 - Add linting and formatting quality gates (P1)
- [x] T041 - Add pre-release readiness workflow and report pipeline (P1)
## Completed tasks (not yet archived)
`);

  assert.equal(tasks.length, 1);
  assert.deepEqual(tasks[0], {
    taskId: "T021",
    title: "Add linting and formatting quality gates",
    priority: "P1",
    phase: "Phase 4"
  });
});

test("derives current release phase from highest complete phase", () => {
  const summary = parseMilestonePhaseSummary(`
## Milestone execution order
### Phase 1 - Core foundations
- [h] T001 - Done thing (P0)
### Phase 2 - Core behavior and reliability
- [x] T002 - Done thing (P0)
### Phase 3 - Host integrations
- [ ] T010 - Not done thing (P0)
## Completed tasks (not yet archived)
`);

  assert.equal(summary.currentReleasePhase, "Phase 2");
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
