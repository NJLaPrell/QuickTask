#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

const DEFAULT_DOC_FILES = [
  "README.md",
  "CONTRIBUTORS.md",
  "ARCHITECTURE.md",
  "TASKS.md",
  "TASK_DISCOVERY_WORKFLOW.md",
  "PRE_RELEASE_READINESS_WORKFLOW.md",
  "RELEASE_STRATEGY.md",
  "COMMIT_STRATEGY.md",
  "BRANCHING_TAGGING_STRATEGY.md",
  "PR_REVIEW_MERGE_STRATEGY.md",
  "TASK_PR_DELIVERY_WORKFLOW.md",
  ".cursor/commands/qt.md",
  ".cursor/commands/prepare-release.md",
  ".cursor/commands/discover-tasks.md"
];

const LOCAL_LINK_REGEX = /\[[^\]]+]\(([^)]+)\)/g;
const CODE_PATH_REGEX = /`([A-Za-z0-9_./-]+\.(?:md|mdc|mjs|yml|yaml|json))`/g;

function slugifyHeading(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function collectHeadingAnchors(markdown) {
  return new Set(
    markdown
      .split("\n")
      .filter((line) => /^#{1,6}\s+/.test(line))
      .map((line) => line.replace(/^#{1,6}\s+/, ""))
      .map(slugifyHeading)
  );
}

function resolveLocalPath(fromFile, rawTarget) {
  const cleanTarget = rawTarget.trim();
  if (!cleanTarget || cleanTarget.startsWith("http://") || cleanTarget.startsWith("https://")) {
    return undefined;
  }
  if (cleanTarget.includes("*") || /\s/.test(cleanTarget)) {
    return undefined;
  }
  if (!cleanTarget.includes("/") && !cleanTarget.startsWith(".")) {
    return undefined;
  }
  if (cleanTarget.startsWith("#")) {
    return {
      targetPath: fromFile,
      anchor: cleanTarget.slice(1)
    };
  }

  const [filePart, anchorPart] = cleanTarget.split("#");
  const baseDir = path.dirname(fromFile);
  const relativePath = path.normalize(path.join(baseDir, filePart));
  const rootPath = path.normalize(filePart);
  const targetPath = existsSync(relativePath) ? relativePath : rootPath;
  return {
    targetPath,
    anchor: anchorPart
  };
}

export function validateDocLinks(docFiles = DEFAULT_DOC_FILES) {
  const errors = [];
  const cachedAnchors = new Map();

  for (const docFile of docFiles) {
    if (!existsSync(docFile)) {
      errors.push(`Scan target is missing: ${docFile}`);
      continue;
    }

    const content = readFileSync(docFile, "utf8");
    const discoveredLinks = [];

    for (const match of content.matchAll(LOCAL_LINK_REGEX)) {
      discoveredLinks.push(match[1]);
    }
    for (const match of content.matchAll(CODE_PATH_REGEX)) {
      discoveredLinks.push(match[1]);
    }

    for (const rawTarget of discoveredLinks) {
      const resolved = resolveLocalPath(docFile, rawTarget);
      if (!resolved) {
        continue;
      }

      if (!existsSync(resolved.targetPath)) {
        errors.push(`${docFile} references missing path: ${rawTarget}`);
        continue;
      }

      if (!resolved.anchor) {
        continue;
      }

      if (!cachedAnchors.has(resolved.targetPath)) {
        const targetContent = readFileSync(resolved.targetPath, "utf8");
        cachedAnchors.set(resolved.targetPath, collectHeadingAnchors(targetContent));
      }
      const anchors = cachedAnchors.get(resolved.targetPath);
      const normalizedAnchor = slugifyHeading(resolved.anchor);
      if (!anchors.has(normalizedAnchor)) {
        errors.push(
          `${docFile} references missing anchor "${resolved.anchor}" in ${resolved.targetPath}`
        );
      }
    }
  }

  return {
    ok: errors.length === 0,
    errors
  };
}

export function main() {
  const result = validateDocLinks();
  if (!result.ok) {
    console.error("docs:check-links failed");
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }
  console.log("docs:check-links passed");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
