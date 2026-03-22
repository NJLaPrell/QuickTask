#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

export function parseExpectedPnpmVersion(packageJsonContent) {
  const rootPackageJson = JSON.parse(packageJsonContent);
  const packageManager = String(rootPackageJson.packageManager ?? "");
  const packageManagerMatch = packageManager.match(/^pnpm@(.+)$/);
  if (!packageManagerMatch) {
    return {
      ok: false,
      error: "package-manager-check: package.json#packageManager must be set to pnpm@<version>."
    };
  }
  return {
    ok: true,
    version: packageManagerMatch[1]
  };
}

export function checkWorkflowPnpmConsistency(workflowContentsByPath, expectedVersion) {
  const findings = [];

  for (const [fullPath, content] of Object.entries(workflowContentsByPath)) {
    const hasPnpmSetup = content.includes("pnpm/action-setup@");
    if (!hasPnpmSetup) {
      continue;
    }

    const hasExpectedVersion = content.includes(`version: ${expectedVersion}`);
    if (!hasExpectedVersion) {
      findings.push(
        `${fullPath} uses pnpm/action-setup but does not set version: ${expectedVersion} from package.json#packageManager`
      );
    }
  }

  return findings;
}

export function main() {
  const parsed = parseExpectedPnpmVersion(readFileSync("package.json", "utf8"));
  if (!parsed.ok) {
    console.error(parsed.error);
    process.exit(1);
  }

  const expectedVersion = parsed.version;
  const workflowsDir = ".github/workflows";
  const workflowFiles = readdirSync(workflowsDir).filter((entry) => entry.endsWith(".yml"));
  const workflowContentsByPath = {};
  for (const workflowFile of workflowFiles) {
    const fullPath = join(workflowsDir, workflowFile);
    workflowContentsByPath[fullPath] = readFileSync(fullPath, "utf8");
  }

  const findings = checkWorkflowPnpmConsistency(workflowContentsByPath, expectedVersion);
  if (findings.length > 0) {
    console.error("package-manager-check: found configuration drift:");
    for (const finding of findings) {
      console.error(`- ${finding}`);
    }
    process.exit(1);
  }

  console.log(`package-manager-check: pnpm version is consistent (${expectedVersion})`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
