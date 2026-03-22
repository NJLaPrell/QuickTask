#!/usr/bin/env node

import { readFileSync } from "node:fs";

const VALID_STATUS_MARKERS = new Set(["p", " ", "~", "!", "x", "h"]);
const OPEN_STATUS_MARKERS = new Set(["p", " ", "~", "!"]);
const backlogSectionRules = {
  Proposed: "p",
  "Intake queue": " ",
  "In progress": "~",
  Blocked: "!"
};

function normalizeStatusMarker(marker) {
  return marker === " " ? "[ ]" : `[${marker}]`;
}

function parseBacklogEntries(content) {
  const backlogStart = content.indexOf("## Active task backlog");
  const backlogEnd = content.indexOf("## Proposed task details");
  if (backlogStart === -1 || backlogEnd === -1) {
    return {
      entries: [],
      errors: [
        "Missing required sections: `## Active task backlog` and/or `## Proposed task details`."
      ]
    };
  }

  const sectionLines = content.slice(backlogStart, backlogEnd).split("\n");
  const taskLineRegex = /^- \[([ pxh~!])\] (T\d+) - (.+) \((P\d)\)$/;
  const sectionHeaderRegex = /^### (.+)$/;
  const entries = [];
  const errors = [];
  let sectionName = "";

  for (const line of sectionLines) {
    const sectionMatch = line.match(sectionHeaderRegex);
    if (sectionMatch) {
      sectionName = sectionMatch[1];
      continue;
    }

    const taskMatch = line.match(taskLineRegex);
    if (!taskMatch) {
      continue;
    }

    const status = taskMatch[1];
    const taskId = taskMatch[2];
    const title = taskMatch[3];
    const priority = taskMatch[4];

    if (!VALID_STATUS_MARKERS.has(status)) {
      errors.push(`Backlog task ${taskId} has invalid status marker [${status}].`);
    }

    const expectedStatus = backlogSectionRules[sectionName];
    if (expectedStatus && expectedStatus !== status) {
      errors.push(
        `Backlog task ${taskId} in section "${sectionName}" must use status ${normalizeStatusMarker(expectedStatus)}.`
      );
    }

    entries.push({ taskId, status, title, priority, sectionName });
  }

  return { entries, errors };
}

function parseTaskDetails(content) {
  const sectionStart = content.indexOf("## Proposed task details");
  if (sectionStart === -1) {
    return {
      detailsById: new Map(),
      errors: ["Missing required section: `## Proposed task details`."]
    };
  }

  const lines = content.slice(sectionStart).split("\n");
  const headerRegex = /^### \[([ pxh~!])\] (T\d+) - (.+)$/;
  const fieldRegex = /^- ([A-Za-z][A-Za-z /]+):\s*(.*)$/;
  const detailsById = new Map();
  const errors = [];
  let currentTaskId = null;

  for (const line of lines) {
    const headerMatch = line.match(headerRegex);
    if (headerMatch) {
      currentTaskId = headerMatch[2];
      detailsById.set(currentTaskId, {
        headerStatus: headerMatch[1],
        title: headerMatch[3],
        fields: new Map()
      });
      continue;
    }

    if (line.startsWith("## ")) {
      currentTaskId = null;
      continue;
    }

    if (!currentTaskId) {
      continue;
    }

    const fieldMatch = line.match(fieldRegex);
    if (!fieldMatch) {
      continue;
    }

    const fieldName = fieldMatch[1].trim();
    const fieldValue = fieldMatch[2].trim();
    detailsById.get(currentTaskId).fields.set(fieldName, fieldValue);
  }

  for (const [taskId, detail] of detailsById) {
    if (!VALID_STATUS_MARKERS.has(detail.headerStatus)) {
      errors.push(
        `Task detail ${taskId} has invalid header status marker [${detail.headerStatus}].`
      );
    }

    const requiredFields = ["Status", "Priority", "Goal", "Files", "Dependencies"];
    if (OPEN_STATUS_MARKERS.has(detail.headerStatus) || detail.headerStatus === "!") {
      requiredFields.push("Blocked by", "Unblock plan");
    }
    for (const requiredField of requiredFields) {
      if (!detail.fields.has(requiredField)) {
        errors.push(`Task detail ${taskId} is missing required field: ${requiredField}.`);
      }
    }

    const statusFieldRaw = detail.fields.get("Status");
    if (statusFieldRaw) {
      const statusFieldMatch = statusFieldRaw.match(/^\[([ pxh~!])\]/);
      if (!statusFieldMatch) {
        errors.push(`Task detail ${taskId} has malformed Status field: ${statusFieldRaw}.`);
      } else {
        const statusField = statusFieldMatch[1];
        if (OPEN_STATUS_MARKERS.has(detail.headerStatus) && statusField !== detail.headerStatus) {
          errors.push(
            `Task detail ${taskId} header status ${normalizeStatusMarker(detail.headerStatus)} does not match Status field ${normalizeStatusMarker(statusField)}.`
          );
        }

        if (statusField === "!") {
          const blockedBy = (detail.fields.get("Blocked by") ?? "").trim().toLowerCase();
          const unblockPlan = (detail.fields.get("Unblock plan") ?? "").trim().toLowerCase();
          if (
            !blockedBy ||
            blockedBy === "none" ||
            blockedBy === "none." ||
            blockedBy === "n/a" ||
            blockedBy === "n/a."
          ) {
            errors.push(
              `Task detail ${taskId} is blocked but missing a concrete Blocked by value.`
            );
          }
          if (
            !unblockPlan ||
            unblockPlan === "none" ||
            unblockPlan === "none." ||
            unblockPlan === "n/a" ||
            unblockPlan === "n/a."
          ) {
            errors.push(`Task detail ${taskId} is blocked but missing a concrete Unblock plan.`);
          }
        }
      }
    }
  }

  return { detailsById, errors };
}

export function validateTasksDocument(content) {
  const errors = [];
  const { entries, errors: backlogErrors } = parseBacklogEntries(content);
  const { detailsById, errors: detailErrors } = parseTaskDetails(content);

  errors.push(...backlogErrors, ...detailErrors);

  const seenIds = new Set();
  for (const entry of entries) {
    if (seenIds.has(entry.taskId)) {
      errors.push(`Duplicate active backlog task ID found: ${entry.taskId}.`);
    }
    seenIds.add(entry.taskId);

    const detail = detailsById.get(entry.taskId);
    if (!detail) {
      errors.push(`Backlog task ${entry.taskId} is missing task detail section.`);
      continue;
    }
    if (entry.status !== detail.headerStatus) {
      errors.push(
        `Backlog task ${entry.taskId} status ${normalizeStatusMarker(entry.status)} does not match detail header ${normalizeStatusMarker(detail.headerStatus)}.`
      );
    }
  }

  for (const [taskId, detail] of detailsById) {
    if (OPEN_STATUS_MARKERS.has(detail.headerStatus) && !seenIds.has(taskId)) {
      errors.push(`Open task ${taskId} appears in details but not in active backlog sections.`);
    }
  }

  return { ok: errors.length === 0, errors };
}

export function main() {
  const content = readFileSync("TASKS.md", "utf8");
  const result = validateTasksDocument(content);
  if (!result.ok) {
    console.error("tasks-check: validation failed");
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log("tasks-check: TASKS.md passed validation");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
