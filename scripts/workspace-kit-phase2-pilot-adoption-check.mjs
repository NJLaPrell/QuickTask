#!/usr/bin/env node

import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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
    "phase2-pilot-adoption"
  );
  const starterPath = path.join(repoRoot, "templates", "workspace-starter");
  const cliPath = path.join(repoRoot, "packages", "workspace-kit", "dist", "cli.js");

  rmSync(fixtureRoot, { recursive: true, force: true });
  mkdirSync(path.dirname(fixtureRoot), { recursive: true });
  cpSync(starterPath, fixtureRoot, { recursive: true });

  const profilePath = path.join(fixtureRoot, "workspace-kit.profile.json");
  const profile = JSON.parse(readFileSync(profilePath, "utf8"));
  profile.project.name = "phase2-pilot-non-quicktask";
  profile.github.defaultBranch = "trunk";
  writeFileSync(profilePath, `${JSON.stringify(profile, null, 2)}\n`, "utf8");

  run("pnpm", ["--filter", "quicktask-workspace-kit", "build"], { cwd: repoRoot });

  const initOutput = run("node", [cliPath, "init"], { cwd: fixtureRoot });
  const checkOutput = run("node", [cliPath, "check"], { cwd: fixtureRoot });
  const doctorOutput = run("node", [cliPath, "doctor"], { cwd: fixtureRoot });

  const generatedContext = JSON.parse(
    readFileSync(
      path.join(fixtureRoot, ".workspace-kit", "generated", "project-context.json"),
      "utf8"
    )
  );

  console.log(
    JSON.stringify(
      {
        fixtureRoot,
        profileProjectName: profile.project.name,
        generatedProjectName: generatedContext.projectName,
        initOutput,
        checkOutput,
        doctorOutput
      },
      null,
      2
    )
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
