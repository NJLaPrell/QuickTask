import assert from "node:assert/strict";
import test from "node:test";

import {
  RELEASE_INTEGRITY_SCHEMA_VERSION,
  validateReleaseIntegrityMetadata
} from "../release-integrity-schema.mjs";

test("accepts valid release integrity metadata", () => {
  const findings = validateReleaseIntegrityMetadata({
    schemaVersion: RELEASE_INTEGRITY_SCHEMA_VERSION,
    generatedAt: "2026-03-22T10:11:12.000Z",
    generatedBy: "scripts/generate-release-integrity.mjs",
    artifacts: [
      {
        file: "quicktask-vscode-v0.2.5.vsix",
        sizeBytes: 1234,
        sha256: "a".repeat(64)
      }
    ]
  });

  assert.deepEqual(findings, []);
});

test("reports malformed metadata fields", () => {
  const findings = validateReleaseIntegrityMetadata({
    schemaVersion: "0.9.0",
    generatedAt: "not-a-date",
    generatedBy: "",
    artifacts: [
      {
        file: "",
        sizeBytes: 0,
        sha256: "xyz"
      }
    ]
  });

  assert.ok(findings.length >= 6);
  assert.match(findings.join("\n"), /schemaVersion/);
  assert.match(findings.join("\n"), /generatedAt/);
  assert.match(findings.join("\n"), /generatedBy/);
  assert.match(findings.join("\n"), /artifacts\[0\]\.sha256/);
});
