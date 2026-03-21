#!/usr/bin/env node

import { mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const outputPath = "artifacts/release-notes.md";

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

function readSection(sections, heading) {
  const content = (sections.get(heading) ?? []).join("\n");
  return content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.startsWith("- "))
    .map((line) => line.slice(2).trim())
    .filter((line) => line && line.toLowerCase() !== "none.");
}

const pendingFiles = listChangesetFiles();
const features = [];
const fixes = [];
const internal = [];
const breaking = [];

for (const file of pendingFiles) {
  const body = readBody(readFileSync(file, "utf8"));
  const sections = parseSections(body);
  features.push(...readSection(sections, "New Features"));
  fixes.push(...readSection(sections, "Bug Fixes"));
  internal.push(...readSection(sections, "Internal Improvements"));
  breaking.push(...readSection(sections, "Breaking Changes"));
}

mkdirSync("artifacts", { recursive: true });

const lines = [
  "## Summary",
  "",
  features.length + fixes.length > 0
    ? "- This release includes user-facing improvements across QuickTask adapters and release tooling."
    : "- This release focuses on release-system updates and operational hardening.",
  "",
  "## User Highlights",
  "",
  ...(features.length > 0 ? features.map((item) => `- ${item}`) : ["- None."]),
  "",
  "## Bug Fixes",
  "",
  ...(fixes.length > 0 ? fixes.map((item) => `- ${item}`) : ["- None."]),
  "",
  "## Breaking Changes",
  "",
  ...(breaking.length > 0 ? breaking.map((item) => `- ${item}`) : ["- None."]),
  "",
  "## Upgrade Notes",
  "",
  "- Installable assets are attached to this release (`.vsix` and OpenClaw `.tgz`).",
  "- Verify artifact checksums using `checksums.txt` before installation.",
  "",
  "## Internal Improvements",
  "",
  ...(internal.length > 0 ? internal.map((item) => `- ${item}`) : ["- None."])
];

writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
console.log(`release-notes: wrote ${outputPath} from ${pendingFiles.length} changeset file(s)`);
