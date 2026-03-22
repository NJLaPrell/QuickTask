#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";

const DEFAULT_RELEASE_NOTES_PATH = "artifacts/release-notes.md";

function parseSectionItems(markdown, heading) {
  const lines = markdown.split("\n");
  const sectionHeader = `## ${heading}`;
  const startIndex = lines.findIndex((line) => line.trim() === sectionHeader);
  if (startIndex === -1) {
    return [];
  }
  const items = [];
  for (let index = startIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    if (line.startsWith("## ")) {
      break;
    }
    const trimmed = line.trim();
    if (trimmed.startsWith("- ")) {
      items.push(trimmed.slice(2).trim());
    }
  }
  return items;
}

export function validateReleaseNotesQuality(markdown) {
  const errors = [];
  const warnings = [];

  const summaryItems = parseSectionItems(markdown, "Summary");
  const highlights = parseSectionItems(markdown, "User Highlights");
  const fixes = parseSectionItems(markdown, "Bug Fixes");

  if (summaryItems.length === 0 || summaryItems.every((item) => /release focuses/i.test(item))) {
    warnings.push("Summary is generic; add concrete user-facing impact when available.");
  }

  const normalizedHighlights = highlights
    .filter((item) => item.toLowerCase() !== "none.")
    .map((item) => item.toLowerCase());
  const duplicateHighlights = normalizedHighlights.filter(
    (item, index) => normalizedHighlights.indexOf(item) !== index
  );
  if (duplicateHighlights.length > 0) {
    errors.push(
      `Duplicate user-highlight bullets found: ${[...new Set(duplicateHighlights)].join(", ")}`
    );
  }

  if (highlights.length === 1 && highlights[0]?.toLowerCase() === "none." && fixes.length === 0) {
    warnings.push("No user highlights or bug fixes listed; verify this is intentional.");
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}

export function main() {
  if (!existsSync(DEFAULT_RELEASE_NOTES_PATH)) {
    console.error(`release-notes-quality: missing ${DEFAULT_RELEASE_NOTES_PATH}`);
    process.exit(1);
  }
  const markdown = readFileSync(DEFAULT_RELEASE_NOTES_PATH, "utf8");
  const result = validateReleaseNotesQuality(markdown);
  for (const warning of result.warnings) {
    console.warn(`release-notes-quality warning: ${warning}`);
  }
  if (!result.ok) {
    console.error("release-notes-quality failed");
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }
  console.log("release-notes-quality passed");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
