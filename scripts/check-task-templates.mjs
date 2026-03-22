#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const TASKS_DIR = "tasks";

function validateTemplate(filePath, content) {
  const errors = [];
  const lines = content.split("\n");
  const titleLine = lines.find((line) => line.startsWith("# "));
  const goalLine = lines.find((line) => line.startsWith("- Goal:"));

  if (!titleLine) {
    errors.push(`${filePath}: missing top-level markdown title (# ...)`);
  }
  if (!goalLine) {
    errors.push(`${filePath}: missing "- Goal:" directive`);
  }
  if (content.length < 60) {
    errors.push(`${filePath}: template content is too short to be useful`);
  }

  return errors;
}

export function validateTaskTemplates(tasksDir = TASKS_DIR) {
  if (!existsSync(tasksDir)) {
    return { ok: true, errors: [], checkedFiles: 0 };
  }

  const markdownFiles = readdirSync(tasksDir)
    .filter((entry) => entry.endsWith(".md"))
    .map((entry) => path.join(tasksDir, entry));
  const errors = [];

  for (const filePath of markdownFiles) {
    const content = readFileSync(filePath, "utf8");
    errors.push(...validateTemplate(filePath, content));
  }

  return {
    ok: errors.length === 0,
    errors,
    checkedFiles: markdownFiles.length
  };
}

export function main() {
  const result = validateTaskTemplates();
  if (!result.ok) {
    console.error("tasks:check-templates failed");
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }
  console.log(`tasks:check-templates passed (${result.checkedFiles} template file(s) checked)`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
