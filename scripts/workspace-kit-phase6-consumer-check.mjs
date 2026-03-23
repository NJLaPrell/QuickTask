#!/usr/bin/env node

import { cpSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
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

function listWorkspaceKitTarballs(packDir) {
  return readdirSync(packDir)
    .filter((entry) => entry.endsWith(".tgz"))
    .sort((left, right) => right.localeCompare(left));
}

export function runWorkspaceKitPhase6ConsumerCheck(repoRoot = process.cwd()) {
  const packDir = path.join(repoRoot, "artifacts", "workspace-kit-pack");
  const fixtureRoot = path.join(
    repoRoot,
    "artifacts",
    "workspace-kit-fixtures",
    "phase6-consumer-check"
  );
  const starterPath = path.join(repoRoot, "templates", "workspace-starter");

  rmSync(packDir, { recursive: true, force: true });
  rmSync(fixtureRoot, { recursive: true, force: true });
  mkdirSync(packDir, { recursive: true });
  mkdirSync(path.dirname(fixtureRoot), { recursive: true });

  run("pnpm", ["--filter", "quicktask-workspace-kit", "pack:dry-run"], { cwd: repoRoot });

  const tarballs = listWorkspaceKitTarballs(packDir);
  if (tarballs.length === 0) {
    throw new Error("No workspace-kit tarball found under artifacts/workspace-kit-pack.");
  }

  const selectedTarball = path.join(packDir, tarballs[0]);
  cpSync(starterPath, fixtureRoot, { recursive: true });

  const fixturePackageJsonPath = path.join(fixtureRoot, "package.json");
  const fixturePackageJson = JSON.parse(readFileSync(fixturePackageJsonPath, "utf8"));
  fixturePackageJson.devDependencies = {
    ...(fixturePackageJson.devDependencies ?? {}),
    "quicktask-workspace-kit": `file:${selectedTarball}`
  };
  writeFileSync(
    `${fixturePackageJsonPath}`,
    `${JSON.stringify(fixturePackageJson, null, 2)}\n`,
    "utf8"
  );

  run("pnpm", ["--ignore-workspace", "--dir", fixtureRoot, "install", "--no-frozen-lockfile"], {
    cwd: repoRoot
  });
  const upgradeOutput = run(
    "pnpm",
    ["--ignore-workspace", "--dir", fixtureRoot, "exec", "workspace-kit", "upgrade"],
    { cwd: repoRoot }
  );
  const initOutput = run(
    "pnpm",
    ["--ignore-workspace", "--dir", fixtureRoot, "exec", "workspace-kit", "init"],
    { cwd: repoRoot }
  );
  const checkOutput = run(
    "pnpm",
    ["--ignore-workspace", "--dir", fixtureRoot, "exec", "workspace-kit", "check"],
    { cwd: repoRoot }
  );
  const doctorOutput = run(
    "pnpm",
    ["--ignore-workspace", "--dir", fixtureRoot, "exec", "workspace-kit", "doctor"],
    { cwd: repoRoot }
  );

  return {
    fixtureRoot,
    packageArtifactDir: "artifacts/workspace-kit-pack",
    selectedTarball: path.relative(repoRoot, selectedTarball),
    checksRun: [
      "pnpm --filter quicktask-workspace-kit pack:dry-run",
      "pnpm --ignore-workspace --dir <fixture> install --no-frozen-lockfile",
      "pnpm --ignore-workspace --dir <fixture> exec workspace-kit upgrade",
      "pnpm --ignore-workspace --dir <fixture> exec workspace-kit init",
      "pnpm --ignore-workspace --dir <fixture> exec workspace-kit check",
      "pnpm --ignore-workspace --dir <fixture> exec workspace-kit doctor"
    ],
    outputs: {
      upgradeOutput,
      initOutput,
      checkOutput,
      doctorOutput
    }
  };
}

function main() {
  const result = runWorkspaceKitPhase6ConsumerCheck();
  console.log(JSON.stringify(result, null, 2));
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
