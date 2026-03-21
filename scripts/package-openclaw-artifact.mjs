#!/usr/bin/env node

import { cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(scriptDir, "..");
const openclawDir = join(repoRoot, "packages", "openclaw-plugin");
const coreDir = join(repoRoot, "packages", "core");

const openclawPkg = JSON.parse(readFileSync(join(openclawDir, "package.json"), "utf8"));
const corePkg = JSON.parse(readFileSync(join(coreDir, "package.json"), "utf8"));

const openclawDist = join(openclawDir, "dist");
const coreDist = join(coreDir, "dist");
if (!existsSync(openclawDist)) {
  console.error("package-openclaw: openclaw dist/ is missing. Run build first.");
  process.exit(1);
}
if (!existsSync(coreDist)) {
  console.error("package-openclaw: core dist/ is missing. Run workspace build first.");
  process.exit(1);
}

const stagingRoot = join(repoRoot, ".tmp", "openclaw-artifact");
const packageRoot = join(stagingRoot, "package");
rmSync(stagingRoot, { recursive: true, force: true });
mkdirSync(join(packageRoot, "node_modules", "@quicktask"), { recursive: true });
mkdirSync(join(repoRoot, "artifacts"), { recursive: true });

cpSync(openclawDist, join(packageRoot, "dist"), { recursive: true });
cpSync(coreDist, join(packageRoot, "node_modules", "@quicktask", "core", "dist"), {
  recursive: true
});

writeFileSync(
  join(packageRoot, "package.json"),
  `${JSON.stringify(
    {
      name: openclawPkg.name,
      version: openclawPkg.version,
      type: "module",
      private: true,
      main: openclawPkg.main,
      dependencies: {
        "@quicktask/core": corePkg.version
      }
    },
    null,
    2
  )}\n`,
  "utf8"
);

writeFileSync(
  join(packageRoot, "node_modules", "@quicktask", "core", "package.json"),
  `${JSON.stringify(
    {
      name: corePkg.name,
      version: corePkg.version,
      type: "module",
      main: "dist/index.js",
      types: "dist/index.d.ts"
    },
    null,
    2
  )}\n`,
  "utf8"
);

const outputName = `quicktask-openclaw-v${openclawPkg.version}.tgz`;
const outputPath = join(repoRoot, "artifacts", outputName);

const tarResult = spawnSync("tar", ["-czf", outputPath, "-C", stagingRoot, "package"], {
  encoding: "utf8"
});

if (tarResult.status !== 0) {
  console.error(
    `package-openclaw: tar failed\n${tarResult.stdout ?? ""}${tarResult.stderr ?? ""}`.trim()
  );
  process.exit(1);
}

console.log(`package-openclaw: wrote artifacts/${outputName}`);
