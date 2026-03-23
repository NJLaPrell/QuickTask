import assert from "node:assert/strict";
import test from "node:test";

import { buildWorkspaceKitImprovementSummary } from "../generate-workspace-kit-improvement-summary.mjs";

const LOG = {
  schemaVersion: 1,
  policy: {
    reviewCadence: "per-kit-minor-release",
    severityLevels: ["low", "medium", "high"],
    categoryTaxonomy: ["process", "tooling", "release"],
    requiredFieldsBySeverity: {
      low: ["id"],
      medium: ["id"],
      high: ["id"]
    },
    archivePolicy: {
      archiveClosedAfterDays: 30,
      retentionDays: 365
    }
  },
  records: [
    {
      id: "F002",
      title: "Second friction",
      status: "open",
      severity: "high",
      category: "release",
      source: {
        kind: "ci",
        reference: "ci run"
      },
      detectedAt: "2026-03-23",
      lastUpdated: "2026-03-23",
      promptIntent: "Stabilize release gates",
      frictionObserved: "Gate failed unexpectedly.",
      proposedChange: "Add explicit check.",
      affectedAreas: ["release"],
      releaseImpact: "requires_change"
    },
    {
      id: "F001",
      title: "First friction",
      status: "resolved",
      severity: "low",
      category: "process",
      source: {
        kind: "manual",
        reference: "retro"
      },
      detectedAt: "2026-03-20",
      lastUpdated: "2026-03-21",
      promptIntent: "Improve flow",
      frictionObserved: "Manual step noise.",
      proposedChange: "Automate summary.",
      affectedAreas: ["tasks"],
      releaseImpact: "note_only"
    }
  ]
};

test("buildWorkspaceKitImprovementSummary is deterministic and sorted", () => {
  const first = buildWorkspaceKitImprovementSummary(LOG);
  const second = buildWorkspaceKitImprovementSummary(LOG);
  assert.deepEqual(first, second);
  assert.deepEqual(first.openRecordIds, ["F002"]);
  assert.equal(first.recordCount, 2);
});

test("buildWorkspaceKitImprovementSummary aggregates counts correctly", () => {
  const summary = buildWorkspaceKitImprovementSummary(LOG);
  assert.equal(summary.statusCounts.open, 1);
  assert.equal(summary.statusCounts.resolved, 1);
  assert.equal(summary.severityCounts.high, 1);
  assert.equal(summary.severityCounts.low, 1);
  assert.equal(summary.releaseSignals.requiresChangeCount, 1);
  assert.equal(summary.releaseSignals.noteOnlyCount, 1);
  assert.equal(summary.releaseSignals.noneCount, 0);
  assert.equal(summary.categoryCounts.process, 1);
  assert.equal(summary.categoryCounts.release, 1);
});
