#!/usr/bin/env node

import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const rootPackageJson = JSON.parse(readFileSync("package.json", "utf8"));
const packageManager = String(rootPackageJson.packageManager ?? "");
const packageManagerMatch = packageManager.match(/^pnpm@(.+)$/);

if (!packageManagerMatch) {
  console.error(
    "package-manager-check: package.json#packageManager must be set to pnpm@<version>."
  );
  process.exit(1);
}

const expectedVersion = packageManagerMatch[1];
const workflowsDir = ".github/workflows";
const workflowFiles = readdirSync(workflowsDir).filter((entry) => entry.endsWith(".yml"));
const findings = [];

for (const workflowFile of workflowFiles) {
  const fullPath = join(workflowsDir, workflowFile);
  const content = readFileSync(fullPath, "utf8");
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

if (findings.length > 0) {
  console.error("package-manager-check: found configuration drift:");
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`package-manager-check: pnpm version is consistent (${expectedVersion})`);
