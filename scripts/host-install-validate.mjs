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
import { pathToFileURL } from "node:url";
import { spawnSync } from "node:child_process";

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

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function resolveArtifactNames(assetsDir, version) {
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
  return { vsix, openclaw };
}

function appendStage(stages, stage, status, message) {
  stages.push({ stage, status, message });
}

function normalizeExtractedCoreEntrypoints(corePackageJsonPath) {
  const corePackageJson = JSON.parse(readFileSync(corePackageJsonPath, "utf8"));
  corePackageJson.main = "dist/index.js";
  corePackageJson.types = "dist/index.d.ts";
  writeFileSync(corePackageJsonPath, `${JSON.stringify(corePackageJson, null, 2)}\n`, "utf8");
}

async function validateVsixHost(assetsDir, version, tempRoot) {
  const stages = [];
  try {
    const { vsix } = resolveArtifactNames(assetsDir, version);
    const vsixPath = join(assetsDir, vsix);
    const extractDir = join(tempRoot, "vscode-vsix");
    mkdirSync(extractDir, { recursive: true });
    run("unzip", ["-q", vsixPath, "-d", extractDir], process.cwd());
    appendStage(stages, "install", "pass", `extracted ${vsix}`);

    const packageJson = JSON.parse(
      readFileSync(join(extractDir, "extension", "package.json"), "utf8")
    );
    assert.equal(packageJson.name, "quicktask-vscode");
    normalizeExtractedCoreEntrypoints(
      join(extractDir, "extension", "node_modules", "@quicktask", "core", "package.json")
    );
    appendStage(stages, "activation", "pass", "extension package metadata resolved");

    const adapterModulePath = join(extractDir, "extension", "dist", "qtAdapter.js");
    const { handleQtChatPrompt, createVsCodeQtRuntime } = await import(
      pathToFileURL(adapterModulePath).href
    );
    const tasksDir = join(tempRoot, "vscode-tasks");
    const runtime = createVsCodeQtRuntime({ tasksDir });
    const createResult = handleQtChatPrompt("summarize make bullets", runtime).result;
    assert.equal(createResult.code, "qt:create:created");
    const runResult = handleQtChatPrompt("/qt/summarize Team meeting notes", runtime).result;
    assert.equal(runResult.code, "qt:run:executed");
    appendStage(stages, "command", "pass", "create/run commands succeeded");
  } catch (error) {
    appendStage(
      stages,
      stages.length === 0 ? "install" : stages.length === 1 ? "activation" : "command",
      "fail",
      error instanceof Error ? error.message : "unknown error"
    );
  }
  return { host: "vscode", stages };
}

async function validateOpenClawHost(assetsDir, version, tempRoot) {
  const stages = [];
  try {
    const { openclaw } = resolveArtifactNames(assetsDir, version);
    const openclawPath = join(assetsDir, openclaw);
    const extractDir = join(tempRoot, "openclaw-tgz");
    mkdirSync(extractDir, { recursive: true });
    run("tar", ["-xzf", openclawPath, "-C", extractDir], process.cwd());
    appendStage(stages, "install", "pass", `extracted ${openclaw}`);

    const packageJson = JSON.parse(
      readFileSync(join(extractDir, "package", "package.json"), "utf8")
    );
    assert.equal(packageJson.name, "quicktask-openclaw");
    normalizeExtractedCoreEntrypoints(
      join(extractDir, "package", "node_modules", "@quicktask", "core", "package.json")
    );
    appendStage(stages, "activation", "pass", "plugin package metadata resolved");

    const registrationPath = join(extractDir, "package", "dist", "index.js");
    const { registerQuickTask } = await import(pathToFileURL(registrationPath).href);
    const runtime = registerQuickTask(join(tempRoot, "openclaw-tasks"));
    const createResult = runtime.runQt("triage classify bugs").result;
    assert.equal(createResult.code, "qt:create:created");
    const runResult = runtime.runQt("/qt/triage Bug 42").result;
    assert.equal(runResult.code, "qt:run:executed");
    appendStage(stages, "command", "pass", "create/run commands succeeded");
  } catch (error) {
    appendStage(
      stages,
      stages.length === 0 ? "install" : stages.length === 1 ? "activation" : "command",
      "fail",
      error instanceof Error ? error.message : "unknown error"
    );
  }
  return { host: "openclaw", stages };
}

export async function validateHostInstall({ assetsDir = "artifacts", version, host = "all" } = {}) {
  const tempRoot = mkdtempSync(join(tmpdir(), "quicktask-host-install-validate-"));
  try {
    const reports = [];
    if (host === "all" || host === "vscode") {
      reports.push(await validateVsixHost(assetsDir, version, tempRoot));
    }
    if (host === "all" || host === "openclaw") {
      reports.push(await validateOpenClawHost(assetsDir, version, tempRoot));
    }
    return reports;
  } finally {
    rmSync(tempRoot, { recursive: true, force: true });
  }
}

export async function main() {
  const assetsDir = getArg("--assets-dir") ?? "artifacts";
  const version =
    getArg("--version") ?? JSON.parse(readFileSync("packages/core/package.json", "utf8")).version;
  const host = getArg("--host") ?? "all";
  const reports = await validateHostInstall({ assetsDir, version, host });
  const failures = [];
  for (const report of reports) {
    for (const stage of report.stages) {
      const line = `${report.host} stage=${stage.stage} status=${stage.status} message=${stage.message}`;
      console.log(`host-install-validate: ${line}`);
      if (stage.status !== "pass") {
        failures.push(line);
      }
    }
  }
  if (failures.length > 0) {
    console.error("host-install-validate: host validation failures detected");
    process.exit(1);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
