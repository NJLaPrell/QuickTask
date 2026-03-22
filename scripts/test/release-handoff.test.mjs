import assert from "node:assert/strict";
import test from "node:test";

import {
  buildReleaseHandoffDispatchArgs,
  parseReleaseHandoffArgs,
  validateReleaseHandoffArgs
} from "../release-handoff.mjs";

test("parses handoff flags including force", () => {
  const args = parseReleaseHandoffArgs([
    "--readme-status",
    "updated",
    "--docs-status",
    "no-change",
    "--docs-sync-notes",
    "docs unchanged this release",
    "--rc-run-id",
    "12345",
    "--force"
  ]);

  assert.equal(args.readmeStatus, "updated");
  assert.equal(args.docsStatus, "no-change");
  assert.equal(args.docsSyncNotes, "docs unchanged this release");
  assert.equal(args.rcRunId, "12345");
  assert.equal(args.force, true);
});

test("fails validation when readiness report is missing and force is not set", () => {
  const validation = validateReleaseHandoffArgs(
    {
      readmeStatus: "updated",
      docsStatus: "updated",
      docsSyncNotes: "",
      rcRunId: "222",
      force: false
    },
    {
      exists: false,
      content: ""
    }
  );

  assert.equal(validation.ok, false);
  assert.match(validation.errors.join("\n"), /does not exist/);
});

test("allows non-ready report when force is set", () => {
  const validation = validateReleaseHandoffArgs(
    {
      readmeStatus: "updated",
      docsStatus: "updated",
      docsSyncNotes: "",
      rcRunId: "333",
      force: true
    },
    {
      exists: true,
      content: "- BLOCKED: unresolved findings"
    }
  );

  assert.equal(validation.ok, true);
});

test("builds deterministic gh workflow dispatch arguments", () => {
  const args = buildReleaseHandoffDispatchArgs({
    readmeStatus: "updated",
    docsStatus: "no-change",
    docsSyncNotes: "docs unchanged",
    rcRunId: "444"
  });

  assert.deepEqual(args, [
    "workflow",
    "run",
    "Release",
    "--ref",
    "main",
    "-f",
    "readme_status=updated",
    "-f",
    "docs_status=no-change",
    "-f",
    "docs_sync_notes=docs unchanged",
    "-f",
    "rc_run_id=444"
  ]);
});
