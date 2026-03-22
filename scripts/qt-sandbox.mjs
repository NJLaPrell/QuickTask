#!/usr/bin/env node

import { createFileTaskStore, createQtRuntime } from "@quicktask/core/dist/index.js";

function parseArgs(argv) {
  const args = { command: "", tasksDir: undefined, help: false };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") {
      args.help = true;
      continue;
    }
    if (arg === "--tasks-dir") {
      args.tasksDir = argv[index + 1];
      index += 1;
      continue;
    }
    args.command = args.command ? `${args.command} ${arg}` : arg;
  }
  return args;
}

function printHelp() {
  console.log("Usage: pnpm qt:sandbox -- <command> [--tasks-dir <path>]");
  console.log("Examples:");
  console.log('  pnpm qt:sandbox -- /qt "incident triage" write timeline workflow');
  console.log('  pnpm qt:sandbox -- /qt/"incident triage" "latest outage details"');
}

export function runSandbox({ command, tasksDir }) {
  const runtime = createQtRuntime(createFileTaskStore({ tasksDir }));
  const result = runtime.handle(command);
  return {
    command,
    result
  };
}

export function main() {
  const parsed = parseArgs(process.argv.slice(2));
  if (parsed.help || !parsed.command.trim()) {
    printHelp();
    process.exit(parsed.help ? 0 : 1);
  }

  const output = runSandbox(parsed);
  console.log(JSON.stringify(output, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
