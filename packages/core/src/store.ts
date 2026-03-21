import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

import type { TaskTemplate } from './types.js'

const TASKS_DIR_ENV_VAR = 'QUICKTASK_TASKS_DIR'

export type FileTaskStore = {
  tasksDir: string
}

export type CreateFileTaskStoreOptions = {
  tasksDir?: string
  repoRoot?: string
}

function normalizeTaskSlug(taskName: string): string {
  return taskName
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function taskNameToFilename(taskName: string): string {
  const slug = normalizeTaskSlug(taskName)
  if (!slug) {
    throw new Error('Task name must include at least one letter or number.')
  }

  return `${slug}.md`
}

function resolveTasksDir(options: CreateFileTaskStoreOptions = {}): string {
  if (options.tasksDir?.trim()) {
    return path.resolve(options.tasksDir)
  }

  const envTasksDir = process.env[TASKS_DIR_ENV_VAR]?.trim()
  if (envTasksDir) {
    return path.resolve(envTasksDir)
  }

  return path.resolve(options.repoRoot ?? process.cwd(), 'tasks')
}

function getTemplatePath(store: FileTaskStore, taskName: string): string | undefined {
  try {
    return path.join(store.tasksDir, taskNameToFilename(taskName))
  } catch {
    return undefined
  }
}

export function createFileTaskStore(options: CreateFileTaskStoreOptions = {}): FileTaskStore {
  return {
    tasksDir: resolveTasksDir(options)
  }
}

export function getTaskTemplate(store: FileTaskStore, taskName: string): TaskTemplate | undefined {
  const cleanTaskName = taskName.trim()
  if (!cleanTaskName) {
    return undefined
  }

  const templatePath = getTemplatePath(store, cleanTaskName)
  if (!templatePath || !existsSync(templatePath)) {
    return undefined
  }

  const filename = path.basename(templatePath)
  let body: string
  try {
    body = readFileSync(templatePath, 'utf8')
  } catch (error) {
    throw new Error(
      `Failed to read task template ${filename}: ${error instanceof Error ? error.message : 'unknown error'}`
    )
  }

  return {
    taskName: cleanTaskName,
    filename,
    body
  }
}

export function saveTaskTemplate(store: FileTaskStore, template: TaskTemplate): TaskTemplate {
  const cleanTaskName = template.taskName.trim()
  const filename = taskNameToFilename(cleanTaskName)
  const templatePath = path.join(store.tasksDir, filename)

  mkdirSync(store.tasksDir, { recursive: true })
  const tempPath = `${templatePath}.${process.pid}.${Date.now()}.tmp`

  try {
    writeFileSync(tempPath, template.body, 'utf8')
    renameSync(tempPath, templatePath)
  } catch (error) {
    rmSync(tempPath, { force: true })
    throw new Error(
      `Failed to save task template ${filename}: ${error instanceof Error ? error.message : 'unknown error'}`
    )
  }

  return {
    ...template,
    taskName: cleanTaskName,
    filename
  }
}
