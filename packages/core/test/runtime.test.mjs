import assert from 'node:assert/strict'
import { mkdtempSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { createQtRuntime } from '../dist/runtime.js'
import { createFileTaskStore } from '../dist/store.js'

function createRuntimeForTest() {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), 'quicktask-runtime-'))
  return {
    runtime: createQtRuntime(createFileTaskStore({ tasksDir })),
    cleanup: () => rmSync(tasksDir, { recursive: true, force: true })
  }
}

test('returns help for /qt', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const result = runtime.handle('/qt')

    assert.equal(result.title, 'QuickTask Help')
    assert.match(result.message, /Use \/qt to view help/)
  } finally {
    cleanup()
  }
})

test('returns task-not-found when running an unknown task', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const result = runtime.handle('/qt/does-not-exist example input')

    assert.equal(result.title, '[qt:run:not-found] Task Not Found')
    assert.equal(result.message, 'No template exists yet for does-not-exist.')
  } finally {
    cleanup()
  }
})

test('create then run returns template and user input', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const created = runtime.handle('/qt summarize produce concise bullets')
    assert.equal(created.title, '[qt:create:created] Created summarize.md')
    assert.match(created.message, /- Goal: produce concise bullets/)

    const result = runtime.handle('/qt/summarize Team sync notes')
    assert.equal(result.title, '[qt:run:executed] Run summarize')
    assert.match(result.message, /Template:/)
    assert.match(result.message, /User input:\nTeam sync notes/)
  } finally {
    cleanup()
  }
})

test('run supports minimal input with empty user input', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    runtime.handle('/qt summarize produce concise bullets')
    const result = runtime.handle('/qt/summarize')

    assert.equal(result.title, '[qt:run:executed] Run summarize')
    assert.match(result.message, /User input:\n$/)
  } finally {
    cleanup()
  }
})

test('create returns clarification when instructions are missing', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const result = runtime.handle('/qt summarize')
    assert.equal(result.title, '[qt:create:clarify] Clarification Needed')
    assert.equal(
      result.message,
      'Please provide instructions for summarize. Usage: /qt summarize [instructions]'
    )
  } finally {
    cleanup()
  }
})

test('create does not overwrite an existing task', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    runtime.handle('/qt summarize first version')
    const secondCreate = runtime.handle('/qt summarize second version')

    assert.equal(secondCreate.title, '[qt:create:already-exists] Task Already Exists')
    assert.match(secondCreate.message, /A template already exists for summarize\./)

    const runResult = runtime.handle('/qt/summarize sample input')
    assert.match(runResult.message, /- Goal: first version/)
    assert.doesNotMatch(runResult.message, /- Goal: second version/)
  } finally {
    cleanup()
  }
})

test('improve returns old and proposed templates for existing task', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    runtime.handle('/qt summarize produce concise bullets')

    const result = runtime.handle('/qt improve summarize emphasize owners')
    assert.equal(result.title, '[qt:improve:proposed] Improve summarize')
    assert.match(result.message, /Proposal ID: [a-f0-9]{12}/)
    assert.match(result.message, /Source: explicit/)
    assert.match(result.message, /Old template:/)
    assert.match(result.message, /Proposed template:/)
    assert.match(result.message, /Improvement note for summarize: emphasize owners/)
  } finally {
    cleanup()
  }
})

test('improve without user input uses inferred proposal source', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    runtime.handle('/qt summarize produce concise bullets')
    const result = runtime.handle('/qt improve summarize')

    assert.equal(result.title, '[qt:improve:proposed] Improve summarize')
    assert.match(result.message, /Source: inferred/)
    assert.match(
      result.message,
      /Improvement note for summarize: refine this template to better handle explicit user input\./
    )
  } finally {
    cleanup()
  }
})

test('improve handles missing tasks cleanly', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const result = runtime.handle('/qt improve missing-task make it better')
    assert.equal(result.title, '[qt:improve:not-found] Task Not Found')
    assert.equal(result.message, 'No template exists yet for missing-task.')
  } finally {
    cleanup()
  }
})

test('returns structured response for incomplete improve command', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const result = runtime.handle('/qt improve')

    assert.equal(result.title, 'Incomplete Command')
    assert.equal(result.message, 'Missing required input. Usage: /qt improve [task] [input]')
  } finally {
    cleanup()
  }
})
