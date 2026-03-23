#!/usr/bin/env node

import { cpSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    stdio: "pipe",
    encoding: "utf8",
    ...options
  });

  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed (exit ${result.status})\n${result.stderr || result.stdout}`
    );
  }

  return result.stdout.trim();
}

function main() {
  const repoRoot = process.cwd();
  const fixtureRoot = path.join(
    repoRoot,
    "artifacts",
    "workspace-kit-fixtures",
    "phase3-package-cold-start"
  );
  const starterPath = path.join(repoRoot, "templates", "workspace-starter");
  const cliPath = path.join(repoRoot, "packages", "workspace-kit", "dist", "cli.js");

  rmSync(fixtureRoot, { recursive: true, force: true });
  mkdirSync(path.dirname(fixtureRoot), { recursive: true });
  cpSync(starterPath, fixtureRoot, { recursive: true });

  run("pnpm", ["--filter", "quicktask-workspace-kit", "build"], { cwd: repoRoot });
  const upgradeOutput = run("node", [cliPath, "upgrade"], { cwd: fixtureRoot });
  const initOutput = run("node", [cliPath, "init"], { cwd: fixtureRoot });
  const checkOutput = run("node", [cliPath, "check"], { cwd: fixtureRoot });
  const doctorOutput = run("node", [cliPath, "doctor"], { cwd: fixtureRoot });

  console.log(
    JSON.stringify({ fixtureRoot, upgradeOutput, initOutput, checkOutput, doctorOutput }, null, 2)
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
