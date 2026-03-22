import assert from "node:assert/strict";
import {
  existsSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  utimesSync,
  writeFileSync
} from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  createFileTaskStore,
  getTaskTemplate,
  listTaskNames,
  saveTaskTemplate
} from "../dist/store.js";

function withTempStoreDir() {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), "quicktask-store-"));
  return {
    store: createFileTaskStore({ tasksDir }),
    cleanup: () => rmSync(tasksDir, { recursive: true, force: true })
  };
}

test("saves and loads a template by logical task name", () => {
  const { store, cleanup } = withTempStoreDir();
  const template = {
    taskName: "summarize",
    filename: "summarize.md",
    body: "# summarize"
  };

  try {
    const saved = saveTaskTemplate(store, template);
    assert.deepEqual(saved, template);
    assert.deepEqual(getTaskTemplate(store, "summarize"), template);
  } finally {
    cleanup();
  }
});

test("task lookup normalizes case, spaces, and symbols", () => {
  const { store, cleanup } = withTempStoreDir();
  const template = {
    taskName: "Bug_Triage!!",
    filename: "bug-triage.md",
    body: "# Bug Triage"
  };

  try {
    saveTaskTemplate(store, template);
    const loaded = getTaskTemplate(store, "  BUG triage  ");
    assert.equal(loaded?.filename, "bug-triage.md");
    assert.equal(loaded?.body, template.body);
  } finally {
    cleanup();
  }
});

test("returns undefined for missing task", () => {
  const { store, cleanup } = withTempStoreDir();
  try {
    assert.equal(getTaskTemplate(store, "missing-task"), undefined);
  } finally {
    cleanup();
  }
});

test("overwrite writes updated content to disk", () => {
  const { store, cleanup } = withTempStoreDir();
  const first = {
    taskName: "summarize",
    filename: "summarize.md",
    body: "# summarize\nfirst version"
  };
  const second = {
    taskName: "summarize",
    filename: "summarize.md",
    body: "# summarize\nsecond version"
  };

  try {
    saveTaskTemplate(store, first);
    saveTaskTemplate(store, second);

    const filePath = path.join(store.tasksDir, "summarize.md");
    const onDisk = readFileSync(filePath, "utf8");
    assert.match(onDisk, /^---\nquicktaskVersion: 1\ntaskName: summarize\n---\n/);
    assert.match(onDisk, /# summarize\nsecond version/);
    assert.deepEqual(getTaskTemplate(store, "summarize"), second);
  } finally {
    cleanup();
  }
});

test("fails fast when a concurrent write lock exists", () => {
  const { store, cleanup } = withTempStoreDir();
  const template = {
    taskName: "summarize",
    filename: "summarize.md",
    body: "# summarize\nlocked write"
  };

  try {
    const lockPath = path.join(store.tasksDir, "summarize.md.lock");
    writeFileSync(lockPath, `${process.pid}`, "utf8");

    assert.throws(() => saveTaskTemplate(store, template), /Concurrent write in progress/);
    assert.equal(getTaskTemplate(store, "summarize"), undefined);
  } finally {
    cleanup();
  }
});

test("recovers stale write lock and saves template", () => {
  const { store, cleanup } = withTempStoreDir();
  const template = {
    taskName: "summarize",
    filename: "summarize.md",
    body: "# summarize\nrecovered write"
  };

  try {
    const lockPath = path.join(store.tasksDir, "summarize.md.lock");
    writeFileSync(lockPath, `${process.pid}`, "utf8");
    const staleSeconds = Math.floor((Date.now() - 10 * 60 * 1000) / 1000);
    utimesSync(lockPath, staleSeconds, staleSeconds);

    const saved = saveTaskTemplate(store, template);
    assert.deepEqual(saved, template);
    assert.deepEqual(getTaskTemplate(store, "summarize"), template);
    assert.equal(existsSync(lockPath), false);
  } finally {
    cleanup();
  }
});

test("reads legacy unversioned template files", () => {
  const { store, cleanup } = withTempStoreDir();
  try {
    const filePath = path.join(store.tasksDir, "legacy.md");
    writeFileSync(filePath, "# legacy\nold-format", "utf8");

    const loaded = getTaskTemplate(store, "legacy");
    assert.equal(loaded?.filename, "legacy.md");
    assert.equal(loaded?.body, "# legacy\nold-format");
  } finally {
    cleanup();
  }
});

test("quarantines corrupted template files deterministically", () => {
  const { store, cleanup } = withTempStoreDir();
  try {
    const filePath = path.join(store.tasksDir, "broken.md");
    writeFileSync(filePath, "---\nquicktaskVersion: not-a-number\n---\n# broken", "utf8");

    assert.throws(() => getTaskTemplate(store, "broken"), /is corrupted and was moved to/);
    const files = readdirSync(store.tasksDir);
    assert.ok(
      files.some((entry) => entry.startsWith("broken.md.corrupt.") && entry.endsWith(".bak"))
    );
    assert.ok(!files.includes("broken.md"));
  } finally {
    cleanup();
  }
});

test("retains only recent corrupt backups to prevent unbounded growth", () => {
  const { store, cleanup } = withTempStoreDir();
  try {
    for (let index = 0; index < 30; index += 1) {
      const filePath = path.join(store.tasksDir, `broken-${index}.md`);
      writeFileSync(filePath, "---\nquicktaskVersion: nope\n---\n# broken", "utf8");
      assert.throws(
        () => getTaskTemplate(store, `broken-${index}`),
        /is corrupted and was moved to/
      );
    }

    listTaskNames(store);
    const corruptBackups = readdirSync(store.tasksDir).filter(
      (entry) => entry.includes(".corrupt.") && entry.endsWith(".bak")
    );
    assert.ok(corruptBackups.length <= 25);
  } finally {
    cleanup();
  }
});
