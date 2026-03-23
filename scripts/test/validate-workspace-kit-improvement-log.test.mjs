import assert from "node:assert/strict";
import test from "node:test";

import { validateWorkspaceKitImprovementLog } from "../validate-workspace-kit-improvement-log.mjs";

const VALID_LOG = {
  schemaVersion: 1,
  policy: {
    reviewCadence: "per-kit-minor-release",
    severityLevels: ["low", "medium", "high"],
    categoryTaxonomy: ["process", "tooling", "release"],
    requiredFieldsBySeverity: {
      low: ["id", "title"],
      medium: ["id", "title", "followUpTaskId"],
      high: ["id", "title", "followUpTaskId", "disposition"]
    },
    archivePolicy: {
      archiveClosedAfterDays: 30,
      retentionDays: 365
    }
  },
  records: [
    {
      id: "F001",
      title: "Sample friction",
      status: "in_progress",
      severity: "medium",
      category: "process",
      source: {
        kind: "manual",
        reference: "test"
      },
      detectedAt: "2026-03-23",
      lastUpdated: "2026-03-23",
      promptIntent: "Improve release workflow resilience",
      frictionObserved: "Manual checks were repetitive.",
      proposedChange: "Add machine-readable summary generation.",
      affectedAreas: ["release"],
      followUpTaskId: "T168",
      releaseImpact: "requires_change",
      disposition: {
        kind: "planned_fix",
        notes: "Implement this phase."
      }
    }
  ]
};

test("validateWorkspaceKitImprovementLog passes with valid log", () => {
  const result = validateWorkspaceKitImprovementLog(VALID_LOG);
  assert.equal(result.ok, true);
  assert.equal(result.findings.length, 0);
});

test("validateWorkspaceKitImprovementLog fails on missing required field by severity", () => {
  const result = validateWorkspaceKitImprovementLog({
    ...VALID_LOG,
    records: [
      {
        ...VALID_LOG.records[0],
        followUpTaskId: undefined
      }
    ]
  });
  assert.equal(result.ok, false);
  assert.match(result.findings.join("\n"), /missing required field 'followUpTaskId'/);
});

test("validateWorkspaceKitImprovementLog fails on unsupported category", () => {
  const result = validateWorkspaceKitImprovementLog({
    ...VALID_LOG,
    records: [
      {
        ...VALID_LOG.records[0],
        category: "unknown"
      }
    ]
  });
  assert.equal(result.ok, false);
  assert.match(result.findings.join("\n"), /unknown category/);
});
