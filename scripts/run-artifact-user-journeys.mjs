#!/usr/bin/env node

import assert from "node:assert/strict";
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

function getArg(flag) {
  const index = process.argv.indexOf(flag);
  if (index === -1 || index + 1 >= process.argv.length) {
    return undefined;
  }
  return process.argv[index + 1];
}

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed\n${result.stdout ?? ""}${result.stderr ?? ""}`
    );
  }
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function findArtifacts(assetsDir, version) {
  const files = readdirSync(assetsDir).filter((entry) => statSync(join(assetsDir, entry)).isFile());
  const vsixPattern = version
    ? new RegExp(`^quicktask-vscode-v${escapeRegex(version)}\\.vsix$`)
    : /^quicktask-vscode-v.+\.vsix$/;
  const openclawPattern = version
    ? new RegExp(`^quicktask-openclaw-v${escapeRegex(version)}\\.tgz$`)
    : /^quicktask-openclaw-v.+\.tgz$/;

  const vsix = files.find((entry) => vsixPattern.test(entry));
  const openclaw = files.find((entry) => openclawPattern.test(entry));
  if (!vsix) {
    throw new Error("missing VSIX artifact");
  }
  if (!openclaw) {
    throw new Error("missing OpenClaw artifact");
  }
  return { vsixPath: join(assetsDir, vsix), openclawPath: join(assetsDir, openclaw) };
}

function runJourneyAssertions(runtime) {
  const createResult = runtime("summarize produce concise bullets").result;
  assert.equal(createResult.code, "qt:create:created");
  const runResult = runtime("/qt/summarize Team notes from weekly sync").result;
  assert.equal(runResult.code, "qt:run:executed");
  const improveResult = runtime("/qt improve summarize add action-items and due dates").result;
  assert.equal(improveResult.code, "qt:improve:proposed");
  const acceptResult = runtime(`/qt improve accept summarize ${improveResult.proposalId}`).result;
  assert.equal(acceptResult.code, "qt:improve:accept:applied");
  const listResult = runtime("/qt list").result;
  assert.equal(listResult.code, "qt:list:listed");
  const showResult = runtime("/qt show summarize").result;
  assert.equal(showResult.code, "qt:show:template");
  const doctorResult = runtime("/qt doctor").result;
  assert.equal(doctorResult.code, "qt:doctor:status");
}

function normalizeExtractedCoreEntrypoints(corePackageJsonPath) {
  const corePackageJson = JSON.parse(readFileSync(corePackageJsonPath, "utf8"));
  corePackageJson.main = "dist/index.js";
  corePackageJson.types = "dist/index.d.ts";
  writeFileSync(corePackageJsonPath, `${JSON.stringify(corePackageJson, null, 2)}\n`, "utf8");
}

async function runVsixJourney(vsixPath, tempRoot) {
  const extractDir = join(tempRoot, "vsix");
  mkdirSync(extractDir, { recursive: true });
  run("unzip", ["-q", vsixPath, "-d", extractDir], process.cwd());
  const packageJson = JSON.parse(
    readFileSync(join(extractDir, "extension", "package.json"), "utf8")
  );
  assert.equal(packageJson.name, "quicktask-vscode");
  normalizeExtractedCoreEntrypoints(
    join(extractDir, "extension", "node_modules", "@quicktask", "core", "package.json")
  );

  const adapterModule = await import(
    pathToFileURL(join(extractDir, "extension", "dist", "qtAdapter.js")).href
  );
  const tasksDir = join(tempRoot, "journey-vscode-tasks");
  const runtime = adapterModule.createVsCodeQtRuntime({ tasksDir });
  runJourneyAssertions((input) => adapterModule.handleQtChatPrompt(input, runtime));
}

async function runOpenClawJourney(openclawPath, tempRoot) {
  const extractDir = join(tempRoot, "openclaw");
  mkdirSync(extractDir, { recursive: true });
  run("tar", ["-xzf", openclawPath, "-C", extractDir], process.cwd());
  const packageJson = JSON.parse(readFileSync(join(extractDir, "package", "package.json"), "utf8"));
  assert.equal(packageJson.name, "quicktask-openclaw");
  normalizeExtractedCoreEntrypoints(
    join(extractDir, "package", "node_modules", "@quicktask", "core", "package.json")
  );

  const pluginModule = await import(
    pathToFileURL(join(extractDir, "package", "dist", "index.js")).href
  );
  const registration = pluginModule.registerQuickTask(join(tempRoot, "journey-openclaw-tasks"));
  runJourneyAssertions((input) => registration.runQt(input));
}

export async function runArtifactUserJourneys({ assetsDir = "artifacts", version } = {}) {
  const { vsixPath, openclawPath } = findArtifacts(assetsDir, version);
  const tempRoot = mkdtempSync(join(tmpdir(), "quicktask-artifact-journey-"));
  try {
    await runVsixJourney(vsixPath, tempRoot);
    await runOpenClawJourney(openclawPath, tempRoot);
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

export async function main() {
  const assetsDir = getArg("--assets-dir") ?? "artifacts";
  const version =
    getArg("--version") ?? JSON.parse(readFileSync("packages/core/package.json", "utf8")).version;
  await runArtifactUserJourneys({ assetsDir, version });
  console.log("artifact-user-journeys: clean-room artifact journeys passed");
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
