#!/usr/bin/env node

import { mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
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
  const packDir = path.join(repoRoot, "artifacts", "workspace-kit-pack");
  const workspaceKitPackageJson = path.join(repoRoot, "packages", "workspace-kit", "package.json");

  rmSync(packDir, { recursive: true, force: true });
  mkdirSync(packDir, { recursive: true });

  run("pnpm", ["--filter", "quicktask-workspace-kit", "build"], { cwd: repoRoot });
  run("pnpm", ["--filter", "quicktask-workspace-kit", "pack:dry-run"], { cwd: repoRoot });
  run("pnpm", ["release:validate-changesets"], { cwd: repoRoot });

  const packedArtifacts = readdirSync(packDir).filter((entry) => entry.endsWith(".tgz"));
  if (packedArtifacts.length === 0) {
    throw new Error("No workspace-kit package artifact generated in artifacts/workspace-kit-pack");
  }

  const packageVersion = JSON.parse(readFileSync(workspaceKitPackageJson, "utf8")).version;

  console.log(
    JSON.stringify(
      {
        packageVersion,
        packageArtifactDir: "artifacts/workspace-kit-pack",
        packageArtifacts: packedArtifacts,
        checksRun: [
          "pnpm --filter quicktask-workspace-kit build",
          "pnpm --filter quicktask-workspace-kit pack:dry-run",
          "pnpm release:validate-changesets"
        ],
        humanGates: [
          "Registry credentials and publish permissions must be provided by a human maintainer.",
          "Human maintainer must trigger publish/tag/release workflow per RELEASE_STRATEGY.md.",
          "Human maintainer must confirm docs synchronization gate before release publication."
        ]
      },
      null,
      2
    )
  );
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
