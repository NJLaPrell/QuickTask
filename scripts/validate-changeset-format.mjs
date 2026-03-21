#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const requiredSections = ["New Features", "Bug Fixes", "Internal Improvements", "Breaking Changes"];

function listChangesetFiles() {
  try {
    return readdirSync(".changeset")
      .filter((entry) => entry.endsWith(".md") && entry !== "README.md")
      .map((entry) => join(".changeset", entry));
  } catch {
    return [];
  }
}

function readBody(content) {
  if (!content.startsWith("---")) {
    return content;
  }

  const lines = content.split("\n");
  const closingLineIndex = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closingLineIndex === -1) {
    return content.trim();
  }

  return lines
    .slice(closingLineIndex + 1)
    .join("\n")
    .trim();
}

function parseSections(markdown) {
  const lines = markdown.split("\n");
  const sections = new Map();
  let current = null;

  for (const line of lines) {
    if (line.startsWith("## ")) {
      current = line.slice(3).trim();
      if (!sections.has(current)) {
        sections.set(current, []);
      }
      continue;
    }

    if (!current) {
      continue;
    }
    sections.get(current).push(line);
  }

  return sections;
}

function hasListItem(content) {
  return content
    .split("\n")
    .map((line) => line.trim())
    .some((line) => line.startsWith("- "));
}

const files = listChangesetFiles();
if (files.length === 0) {
  console.log("changeset-format: no pending changeset files found");
  process.exit(0);
}

const failures = [];

for (const file of files) {
  const content = readFileSync(file, "utf8");
  const body = readBody(content);
  const sections = parseSections(body);

  for (const section of requiredSections) {
    const block = (sections.get(section) ?? []).join("\n").trim();
    if (!block) {
      failures.push(`${file}: missing required section "## ${section}"`);
      continue;
    }

    if (!hasListItem(block)) {
      failures.push(`${file}: section "${section}" must include at least one bullet`);
    }
  }
}

if (failures.length > 0) {
  console.error("changeset-format: invalid changeset content");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`changeset-format: validated ${files.length} changeset file(s)`);
