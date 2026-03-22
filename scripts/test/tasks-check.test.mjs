import assert from "node:assert/strict";
import test from "node:test";

import { validateTasksDocument } from "../tasks-check.mjs";

const VALID_TASKS_DOC = `
# QuickTask Tasks

## Active task backlog

### Proposed
- [p] T100 - Proposed item (P2)

### Intake queue
- [ ] T101 - Intake item (P1)

### In progress
- [~] T102 - In progress item (P1)

### Blocked
- [!] T103 - Blocked item (P0)

## Proposed task details

### [p] T100 - Proposed item
- Status: [p]
- Priority: P2
- Goal: Keep backlog valid.
- Files: \`TASKS.md\`
- Dependencies: none.
- Blocked by: none.
- Unblock plan: n/a

### [ ] T101 - Intake item
- Status: [ ]
- Priority: P1
- Goal: Keep intake valid.
- Files: \`TASKS.md\`
- Dependencies: none.
- Blocked by: none.
- Unblock plan: n/a

### [~] T102 - In progress item
- Status: [~]
- Priority: P1
- Goal: Keep in-progress valid.
- Files: \`TASKS.md\`
- Dependencies: none.
- Blocked by: none.
- Unblock plan: n/a

### [!] T103 - Blocked item
- Status: [!]
- Priority: P0
- Goal: Keep blocked metadata valid.
- Files: \`TASKS.md\`
- Dependencies: T100.
- Blocked by: external dependency.
- Unblock plan: wait for dependency response.

## Milestone execution order

### Phase 1 - Example
- Planned task IDs (in order): T100, T101, T102, T103
`;

test("passes for valid tracker structure", () => {
  const result = validateTasksDocument(VALID_TASKS_DOC);
  assert.equal(result.ok, true);
  assert.equal(result.errors.length, 0);
});

test("fails when blocked tasks do not include concrete blocker metadata", () => {
  const malformed = VALID_TASKS_DOC.replace(
    "- Blocked by: external dependency.",
    "- Blocked by: none."
  );
  const result = validateTasksDocument(malformed);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /blocked but missing a concrete Blocked by value/);
});

test("fails when backlog entries use wrong status for section", () => {
  const malformed = VALID_TASKS_DOC.replace(
    "- [p] T100 - Proposed item (P2)",
    "- [ ] T100 - Proposed item (P2)"
  );
  const result = validateTasksDocument(malformed);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /must use status \[p\]/);
});

test("fails when a task appears in multiple phase plan lists", () => {
  const malformed = `${VALID_TASKS_DOC}
### Phase 2 - Another
- Planned task IDs (in order): T100`;
  const result = validateTasksDocument(malformed);
  assert.equal(result.ok, false);
  assert.match(result.errors.join("\n"), /appears in multiple phase plan lists/);
});
