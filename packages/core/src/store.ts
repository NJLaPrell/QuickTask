import {
  closeSync,
  existsSync,
  mkdirSync,
  openSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  statSync,
  unlinkSync,
  writeFileSync
} from "node:fs";
import path from "node:path";

import type { TaskTemplate } from "./types.js";

const TASKS_DIR_ENV_VAR = "QUICKTASK_TASKS_DIR";
const CURRENT_TEMPLATE_FORMAT_VERSION = 1;
const STALE_TEMPLATE_LOCK_AGE_MS = 5 * 60 * 1000;
const CORRUPT_BACKUP_RETENTION_LIMIT = 25;

export type FileTaskStore = {
  tasksDir: string;
};

export type TaskStoreHealth = {
  tasksDir: string;
  writable: boolean;
  taskCount: number;
  storageError?: string;
};

export type CreateFileTaskStoreOptions = {
  tasksDir?: string;
  repoRoot?: string;
};

type DecodedTemplate = {
  version: number;
  body: string;
};

function normalizeTaskSlug(taskName: string): string {
  return taskName
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function taskNameToFilename(taskName: string): string {
  const slug = normalizeTaskSlug(taskName);
  if (!slug) {
    throw new Error("Task name must include at least one letter or number.");
  }

  return `${slug}.md`;
}

function resolveTasksDir(options: CreateFileTaskStoreOptions = {}): string {
  if (options.tasksDir?.trim()) {
    return path.resolve(options.tasksDir);
  }

  const envTasksDir = process.env[TASKS_DIR_ENV_VAR]?.trim();
  if (envTasksDir) {
    return path.resolve(envTasksDir);
  }

  return path.resolve(options.repoRoot ?? process.cwd(), "tasks");
}

function getTemplatePath(store: FileTaskStore, taskName: string): string | undefined {
  try {
    return path.join(store.tasksDir, taskNameToFilename(taskName));
  } catch {
    return undefined;
  }
}

function decodeTemplateContent(content: string): DecodedTemplate {
  if (!content.startsWith("---\n")) {
    return { version: 0, body: content };
  }

  const endOfMetadata = content.indexOf("\n---\n");
  if (endOfMetadata === -1) {
    throw new Error("Template metadata is malformed.");
  }

  const metadataBlock = content.slice(4, endOfMetadata);
  const body = content.slice(endOfMetadata + "\n---\n".length);
  const metadata = new Map<string, string>();

  for (const line of metadataBlock.split("\n")) {
    const separator = line.indexOf(":");
    if (separator === -1) {
      continue;
    }
    const key = line.slice(0, separator).trim();
    const value = line.slice(separator + 1).trim();
    metadata.set(key, value);
  }

  const version = Number(metadata.get("quicktaskVersion"));
  if (!Number.isFinite(version)) {
    throw new Error("Template metadata is missing a valid quicktaskVersion.");
  }
  if (version > CURRENT_TEMPLATE_FORMAT_VERSION) {
    throw new Error(`Template format version ${version} is not supported.`);
  }

  return { version, body };
}

function encodeTemplateContent(taskName: string, body: string): string {
  return [
    "---",
    `quicktaskVersion: ${CURRENT_TEMPLATE_FORMAT_VERSION}`,
    `taskName: ${taskName}`,
    "---",
    body
  ].join("\n");
}

function quarantineCorruptTemplate(templatePath: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupPath = `${templatePath}.corrupt.${timestamp}.bak`;
  renameSync(templatePath, backupPath);
  return backupPath;
}

function isTemplateWriteLockStale(lockPath: string): boolean {
  try {
    const lockStats = statSync(lockPath);
    return Date.now() - lockStats.mtimeMs >= STALE_TEMPLATE_LOCK_AGE_MS;
  } catch {
    return false;
  }
}

function acquireTemplateWriteLock(templatePath: string): () => void {
  const lockPath = `${templatePath}.lock`;
  let lockFd: number;
  try {
    lockFd = openSync(lockPath, "wx");
  } catch (error) {
    const isAlreadyLocked =
      typeof error === "object" && error !== null && "code" in error && error.code === "EEXIST";
    if (!isAlreadyLocked) {
      throw error;
    }

    if (isTemplateWriteLockStale(lockPath)) {
      rmSync(lockPath, { force: true });
      try {
        lockFd = openSync(lockPath, "wx");
      } catch (retryError) {
        if (
          typeof retryError === "object" &&
          retryError !== null &&
          "code" in retryError &&
          retryError.code === "EEXIST"
        ) {
          throw new Error(`Concurrent write in progress for ${path.basename(templatePath)}.`);
        }
        throw retryError;
      }
    } else {
      throw new Error(`Concurrent write in progress for ${path.basename(templatePath)}.`);
    }
  }

  return () => {
    try {
      closeSync(lockFd);
    } finally {
      rmSync(lockPath, { force: true });
    }
  };
}

function listCorruptBackupFiles(tasksDir: string): string[] {
  if (!existsSync(tasksDir)) {
    return [];
  }
  return readdirSync(tasksDir)
    .filter((entry) => entry.includes(".corrupt.") && entry.endsWith(".bak"))
    .map((entry) => path.join(tasksDir, entry));
}

function cleanupCorruptBackups(tasksDir: string): void {
  const backups = listCorruptBackupFiles(tasksDir)
    .map((backupPath) => {
      try {
        return {
          backupPath,
          mtimeMs: statSync(backupPath).mtimeMs
        };
      } catch {
        return undefined;
      }
    })
    .filter((entry): entry is { backupPath: string; mtimeMs: number } => Boolean(entry))
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (backups.length <= CORRUPT_BACKUP_RETENTION_LIMIT) {
    return;
  }

  for (const stale of backups.slice(CORRUPT_BACKUP_RETENTION_LIMIT)) {
    rmSync(stale.backupPath, { force: true });
  }
}

export function createFileTaskStore(options: CreateFileTaskStoreOptions = {}): FileTaskStore {
  return {
    tasksDir: resolveTasksDir(options)
  };
}

export function getTaskTemplate(store: FileTaskStore, taskName: string): TaskTemplate | undefined {
  cleanupCorruptBackups(store.tasksDir);
  const cleanTaskName = taskName.trim();
  if (!cleanTaskName) {
    return undefined;
  }

  const templatePath = getTemplatePath(store, cleanTaskName);
  if (!templatePath || !existsSync(templatePath)) {
    return undefined;
  }

  const filename = path.basename(templatePath);
  let body: string;
  try {
    body = readFileSync(templatePath, "utf8");
  } catch (error) {
    throw new Error(
      `Failed to read task template ${filename}: ${error instanceof Error ? error.message : "unknown error"}`
    );
  }

  try {
    const decoded = decodeTemplateContent(body);
    return {
      taskName: cleanTaskName,
      filename,
      body: decoded.body
    };
  } catch (error) {
    const backupPath = quarantineCorruptTemplate(templatePath);
    throw new Error(
      `Template ${filename} is corrupted and was moved to ${path.basename(backupPath)}: ${
        error instanceof Error ? error.message : "unknown error"
      }`
    );
  }
}

export function saveTaskTemplate(store: FileTaskStore, template: TaskTemplate): TaskTemplate {
  cleanupCorruptBackups(store.tasksDir);
  const cleanTaskName = template.taskName.trim();
  const filename = taskNameToFilename(cleanTaskName);
  const templatePath = path.join(store.tasksDir, filename);

  mkdirSync(store.tasksDir, { recursive: true });
  const releaseLock = acquireTemplateWriteLock(templatePath);
  const tempPath = `${templatePath}.${process.pid}.${Date.now()}.tmp`;

  try {
    writeFileSync(tempPath, encodeTemplateContent(cleanTaskName, template.body), "utf8");
    renameSync(tempPath, templatePath);
  } catch (error) {
    rmSync(tempPath, { force: true });
    throw new Error(
      `Failed to save task template ${filename}: ${error instanceof Error ? error.message : "unknown error"}`
    );
  } finally {
    releaseLock();
  }

  return {
    ...template,
    taskName: cleanTaskName,
    filename
  };
}

export function listTaskNames(store: FileTaskStore): string[] {
  cleanupCorruptBackups(store.tasksDir);
  if (!existsSync(store.tasksDir)) {
    return [];
  }

  const entries = readdirSync(store.tasksDir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => entry.name.slice(0, -3))
    .sort((a, b) => a.localeCompare(b));
}

export function checkTaskStoreHealth(store: FileTaskStore): TaskStoreHealth {
  cleanupCorruptBackups(store.tasksDir);
  const health: TaskStoreHealth = {
    tasksDir: store.tasksDir,
    writable: false,
    taskCount: 0
  };

  try {
    mkdirSync(store.tasksDir, { recursive: true });
    health.taskCount = listTaskNames(store).length;

    const probePath = path.join(
      store.tasksDir,
      `.qt-doctor-write-check-${process.pid}-${Date.now()}`
    );
    writeFileSync(probePath, "ok", "utf8");
    unlinkSync(probePath);
    health.writable = true;
  } catch (error) {
    health.storageError = error instanceof Error ? error.message : "unknown storage error";
  }

  return health;
}
