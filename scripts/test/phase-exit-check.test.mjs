import assert from "node:assert/strict";
import test from "node:test";

import { evaluatePhaseExit } from "../phase-exit-check.mjs";

const SAMPLE_TASKS = `
### Phase 7 - Governance
- Planned task IDs (in order): T001, T002

## Active task backlog
- [x] T001 - Done task (P1)
- [ ] T002 - Open task (P1)

### [x] T001 - Done task
- Status: [x]

### [ ] T002 - Open task
- Status: [ ]
`;

test("reports blocking tasks for incomplete phase", () => {
  const result = evaluatePhaseExit(SAMPLE_TASKS, 7);
  assert.equal(result.ready, false);
  assert.equal(result.blockers.length, 1);
  assert.equal(result.blockers[0].taskId, "T002");
});

test("reports ready when all planned tasks are complete", () => {
  const ready = evaluatePhaseExit(
    SAMPLE_TASKS.replace("- [ ] T002", "- [x] T002").replace(
      "### [ ] T002 - Open task\n- Status: [ ]",
      "### [x] T002 - Open task\n- Status: [x]"
    ),
    7
  );
  assert.equal(ready.ready, true);
});
