import assert from "node:assert/strict";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { resolveLocalTemplatePack, validateTemplatePackManifest } from "../dist/templatePacks.js";

test("validateTemplatePackManifest accepts valid v1 manifest", () => {
  const result = validateTemplatePackManifest({
    version: 1,
    name: "basic",
    templates: [{ taskName: "summary", file: "summary.md" }]
  });
  assert.equal(result.ok, true);
  assert.equal(result.errors.length, 0);
});

test("resolveLocalTemplatePack reads templates relative to manifest", () => {
  const root = mkdtempSync(path.join(os.tmpdir(), "quicktask-pack-test-"));
  try {
    writeFileSync(path.join(root, "summary.md"), "# summary\n\n- Goal: summarize", "utf8");
    writeFileSync(
      path.join(root, "manifest.json"),
      JSON.stringify(
        {
          version: 1,
          name: "basic",
          templates: [{ taskName: "summary", file: "summary.md" }]
        },
        null,
        2
      ),
      "utf8"
    );
    const result = resolveLocalTemplatePack(path.join(root, "manifest.json"));
    assert.equal(result.ok, true);
    assert.equal(result.resolved?.templates.length, 1);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
