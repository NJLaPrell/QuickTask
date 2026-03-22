#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

const COMMANDS_DIR = ".cursor/commands";
const REFERENCE_FILES = ["README.md", "CONTRIBUTORS.md", "TASK_DISCOVERY_WORKFLOW.md", "TASKS.md"];

export function validateCommandEntrypoints(commandFiles, referenceContentsByFile = new Map()) {
  const errors = [];
  for (const commandFile of commandFiles) {
    const fileName = path.basename(commandFile);
    const commandRef = `.cursor/commands/${fileName}`;
    const hasReference = [...referenceContentsByFile.values()].some((content) =>
      content.includes(commandRef)
    );
    if (!hasReference) {
      errors.push(`Unreferenced command entrypoint: ${commandRef}`);
    }
  }
  return { ok: errors.length === 0, errors };
}

export function main() {
  const commandFiles = readdirSync(COMMANDS_DIR)
    .filter((entry) => entry.endsWith(".md"))
    .map((entry) => path.join(COMMANDS_DIR, entry));
  const references = new Map(REFERENCE_FILES.map((file) => [file, readFileSync(file, "utf8")]));

  const result = validateCommandEntrypoints(commandFiles, references);
  if (!result.ok) {
    console.error("command entrypoint check failed");
    for (const error of result.errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }
  console.log("command entrypoint check passed");
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
