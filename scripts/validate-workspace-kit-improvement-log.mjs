#!/usr/bin/env node

import { readFileSync } from "node:fs";

const ALLOWED_SEVERITIES = new Set(["low", "medium", "high"]);
const ALLOWED_STATUSES = new Set(["open", "in_progress", "resolved", "accepted_risk", "archived"]);
const ALLOWED_RELEASE_IMPACT = new Set(["none", "note_only", "requires_change"]);
const ALLOWED_SOURCE_KINDS = new Set(["manual", "ci", "release_prepare", "session_retro"]);
const ALLOWED_DISPOSITION_KINDS = new Set(["planned_fix", "accepted_risk", "resolved", "deferred"]);
const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
const RECORD_ID_REGEX = /^F\d{3}$/;
const TASK_ID_REGEX = /^T\d{3}$/;

function hasNonEmptyString(value) {
  return typeof value === "string" && value.length > 0;
}

function isIsoDate(value) {
  return hasNonEmptyString(value) && ISO_DATE_REGEX.test(value);
}

function isObjectRecord(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validateWorkspaceKitImprovementLog(log) {
  const findings = [];
  if (!isObjectRecord(log)) {
    return { ok: false, findings: ["improvement log root must be an object"] };
  }

  if (!Number.isInteger(log.schemaVersion) || log.schemaVersion < 1) {
    findings.push("schemaVersion must be an integer >= 1");
  }

  const policy = log.policy;
  if (!isObjectRecord(policy)) {
    findings.push("policy must be an object");
  }

  const records = Array.isArray(log.records) ? log.records : [];
  if (!Array.isArray(log.records)) {
    findings.push("records must be an array");
  }

  let requiredFieldsBySeverity = null;
  const categories = new Set();
  if (policy) {
    if (!hasNonEmptyString(policy.reviewCadence)) {
      findings.push("policy.reviewCadence must be a non-empty string");
    }

    if (!Array.isArray(policy.severityLevels) || policy.severityLevels.length === 0) {
      findings.push("policy.severityLevels must be a non-empty array");
    } else {
      for (const severity of policy.severityLevels) {
        if (!ALLOWED_SEVERITIES.has(severity)) {
          findings.push(
            `policy.severityLevels contains unsupported severity '${String(severity)}'`
          );
        }
      }
    }

    if (!Array.isArray(policy.categoryTaxonomy) || policy.categoryTaxonomy.length === 0) {
      findings.push("policy.categoryTaxonomy must be a non-empty array");
    } else {
      for (const category of policy.categoryTaxonomy) {
        if (!hasNonEmptyString(category)) {
          findings.push("policy.categoryTaxonomy entries must be non-empty strings");
          continue;
        }
        categories.add(category);
      }
    }

    if (!isObjectRecord(policy.requiredFieldsBySeverity)) {
      findings.push("policy.requiredFieldsBySeverity must be an object");
    } else {
      requiredFieldsBySeverity = policy.requiredFieldsBySeverity;
      for (const severity of ALLOWED_SEVERITIES) {
        const fields = requiredFieldsBySeverity[severity];
        if (!Array.isArray(fields)) {
          findings.push(`policy.requiredFieldsBySeverity.${severity} must be an array`);
          continue;
        }
        for (const field of fields) {
          if (!hasNonEmptyString(field)) {
            findings.push(
              `policy.requiredFieldsBySeverity.${severity} entries must be non-empty strings`
            );
          }
        }
      }
    }

    if (!isObjectRecord(policy.archivePolicy)) {
      findings.push("policy.archivePolicy must be an object");
    } else {
      if (
        !Number.isInteger(policy.archivePolicy.archiveClosedAfterDays) ||
        policy.archivePolicy.archiveClosedAfterDays < 1
      ) {
        findings.push("policy.archivePolicy.archiveClosedAfterDays must be an integer >= 1");
      }
      if (
        !Number.isInteger(policy.archivePolicy.retentionDays) ||
        policy.archivePolicy.retentionDays < 1
      ) {
        findings.push("policy.archivePolicy.retentionDays must be an integer >= 1");
      }
    }
  }

  const recordIds = new Set();
  for (const record of records) {
    if (!isObjectRecord(record)) {
      findings.push("records must contain objects");
      continue;
    }
    const recordId = record.id;
    if (!hasNonEmptyString(recordId) || !RECORD_ID_REGEX.test(recordId)) {
      findings.push("record.id must match /^F\\\\d{3}$/");
      continue;
    }
    if (recordIds.has(recordId)) {
      findings.push(`duplicate record id '${recordId}'`);
    }
    recordIds.add(recordId);

    if (!hasNonEmptyString(record.title)) {
      findings.push(`record '${recordId}' must include non-empty title`);
    }
    if (!ALLOWED_STATUSES.has(record.status)) {
      findings.push(`record '${recordId}' has unsupported status '${String(record.status)}'`);
    }
    if (!ALLOWED_SEVERITIES.has(record.severity)) {
      findings.push(`record '${recordId}' has unsupported severity '${String(record.severity)}'`);
    }
    if (!hasNonEmptyString(record.category)) {
      findings.push(`record '${recordId}' must include non-empty category`);
    } else if (categories.size > 0 && !categories.has(record.category)) {
      findings.push(`record '${recordId}' uses unknown category '${record.category}'`);
    }

    if (!isObjectRecord(record.source)) {
      findings.push(`record '${recordId}' source must be an object`);
    } else {
      if (!ALLOWED_SOURCE_KINDS.has(record.source.kind)) {
        findings.push(
          `record '${recordId}' source.kind '${String(record.source.kind)}' is unsupported`
        );
      }
      if (!hasNonEmptyString(record.source.reference)) {
        findings.push(`record '${recordId}' source.reference must be non-empty`);
      }
    }

    if (!isIsoDate(record.detectedAt)) {
      findings.push(`record '${recordId}' detectedAt must be YYYY-MM-DD`);
    }
    if (!isIsoDate(record.lastUpdated)) {
      findings.push(`record '${recordId}' lastUpdated must be YYYY-MM-DD`);
    }
    if (!hasNonEmptyString(record.promptIntent)) {
      findings.push(`record '${recordId}' promptIntent must be non-empty`);
    }
    if (!hasNonEmptyString(record.frictionObserved)) {
      findings.push(`record '${recordId}' frictionObserved must be non-empty`);
    }
    if (!hasNonEmptyString(record.proposedChange)) {
      findings.push(`record '${recordId}' proposedChange must be non-empty`);
    }

    if (!Array.isArray(record.affectedAreas) || record.affectedAreas.length === 0) {
      findings.push(`record '${recordId}' affectedAreas must be a non-empty array`);
    } else if (record.affectedAreas.some((area) => !hasNonEmptyString(area))) {
      findings.push(`record '${recordId}' affectedAreas entries must be non-empty strings`);
    }

    if (record.followUpTaskId !== undefined && record.followUpTaskId !== null) {
      if (!hasNonEmptyString(record.followUpTaskId) || !TASK_ID_REGEX.test(record.followUpTaskId)) {
        findings.push(`record '${recordId}' followUpTaskId must match /^T\\\\d{3}$/ when provided`);
      }
    }

    if (!ALLOWED_RELEASE_IMPACT.has(record.releaseImpact)) {
      findings.push(
        `record '${recordId}' releaseImpact '${String(record.releaseImpact)}' is unsupported`
      );
    }

    if (record.disposition !== undefined) {
      if (!isObjectRecord(record.disposition)) {
        findings.push(`record '${recordId}' disposition must be an object when provided`);
      } else {
        if (!ALLOWED_DISPOSITION_KINDS.has(record.disposition.kind)) {
          findings.push(
            `record '${recordId}' disposition.kind '${String(record.disposition.kind)}' is unsupported`
          );
        }
        if (!hasNonEmptyString(record.disposition.notes)) {
          findings.push(`record '${recordId}' disposition.notes must be non-empty`);
        }
        if (
          record.disposition.sunsetDate !== undefined &&
          !isIsoDate(record.disposition.sunsetDate)
        ) {
          findings.push(
            `record '${recordId}' disposition.sunsetDate must be YYYY-MM-DD when provided`
          );
        }
      }
    }

    if (requiredFieldsBySeverity) {
      const requiredFields = requiredFieldsBySeverity[record.severity];
      if (Array.isArray(requiredFields)) {
        for (const field of requiredFields) {
          const value = record[field];
          if (
            value === undefined ||
            value === null ||
            (typeof value === "string" && value.length === 0)
          ) {
            findings.push(
              `record '${recordId}' is missing required field '${field}' for severity ${record.severity}`
            );
          }
        }
      }
    }
  }

  return {
    ok: findings.length === 0,
    findings
  };
}

export function main() {
  const logPath = ".workspace-kit/improvement-log.json";
  const log = JSON.parse(readFileSync(logPath, "utf8"));
  const result = validateWorkspaceKitImprovementLog(log);

  if (!result.ok) {
    console.error("workspace-kit-improvement-log: validation failed");
    for (const finding of result.findings) {
      console.error(`- ${finding}`);
    }
    process.exit(1);
  }

  console.log("workspace-kit-improvement-log: validation passed");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
