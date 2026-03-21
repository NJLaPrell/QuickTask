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

    assert.equal(result.kind, 'help')
    assert.equal(result.code, 'qt:help')
    assert.deepEqual(result.usage, [
      '/qt',
      '/qt [task] [instructions]',
      '/qt/[task] [input]',
      '/qt improve [task] [input]'
    ])
  } finally {
    cleanup()
  }
})

test('returns task-not-found when running an unknown task', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const result = runtime.handle('/qt/does-not-exist example input')

    assert.equal(result.kind, 'not_found')
    assert.equal(result.code, 'qt:run:not-found')
    assert.equal(result.taskName, 'does-not-exist')
    assert.equal(result.message, 'No template exists yet for does-not-exist.')
  } finally {
    cleanup()
  }
})

test('create then run returns template and user input', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const created = runtime.handle('/qt summarize produce concise bullets')
    assert.equal(created.kind, 'created')
    assert.equal(created.code, 'qt:create:created')
    assert.equal(created.filename, 'summarize.md')
    assert.match(created.templateBody, /- Goal: produce concise bullets/)

    const result = runtime.handle('/qt/summarize Team sync notes')
    assert.equal(result.kind, 'run_executed')
    assert.equal(result.code, 'qt:run:executed')
    assert.equal(result.taskName, 'summarize')
    assert.match(result.templateBody, /- Goal: produce concise bullets/)
    assert.equal(result.userInput, 'Team sync notes')
  } finally {
    cleanup()
  }
})

test('run supports minimal input with empty user input', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    runtime.handle('/qt summarize produce concise bullets')
    const result = runtime.handle('/qt/summarize')

    assert.equal(result.kind, 'run_executed')
    assert.equal(result.code, 'qt:run:executed')
    assert.equal(result.userInput, '')
  } finally {
    cleanup()
  }
})

test('create returns clarification when instructions are missing', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const result = runtime.handle('/qt summarize')
    assert.equal(result.kind, 'clarification')
    assert.equal(result.code, 'qt:create:clarify')
    assert.equal(result.taskName, 'summarize')
    assert.equal(result.usage, '/qt summarize [instructions]')
    assert.equal(result.message, 'Please provide instructions for summarize.')
  } finally {
    cleanup()
  }
})

test('create does not overwrite an existing task', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    runtime.handle('/qt summarize first version')
    const secondCreate = runtime.handle('/qt summarize second version')

    assert.equal(secondCreate.kind, 'already_exists')
    assert.equal(secondCreate.code, 'qt:create:already-exists')
    assert.equal(secondCreate.taskName, 'summarize')
    assert.match(secondCreate.message, /A template already exists for summarize\./)

    const runResult = runtime.handle('/qt/summarize sample input')
    assert.match(runResult.templateBody, /- Goal: first version/)
    assert.doesNotMatch(runResult.templateBody, /- Goal: second version/)
  } finally {
    cleanup()
  }
})

test('improve returns old and proposed templates for existing task', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    runtime.handle('/qt summarize produce concise bullets')

    const result = runtime.handle('/qt improve summarize emphasize owners')
    assert.equal(result.kind, 'improve_proposed')
    assert.equal(result.code, 'qt:improve:proposed')
    assert.equal(result.taskName, 'summarize')
    assert.match(result.proposalId, /^[a-f0-9]{12}$/)
    assert.equal(result.source, 'explicit')
    assert.match(result.oldTemplate, /# summarize/)
    assert.match(result.proposedTemplate, /Improvement note for summarize: emphasize owners/)
  } finally {
    cleanup()
  }
})

test('improve without user input uses inferred proposal source', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    runtime.handle('/qt summarize produce concise bullets')
    const result = runtime.handle('/qt improve summarize')

    assert.equal(result.kind, 'improve_proposed')
    assert.equal(result.source, 'inferred')
    assert.match(result.proposedTemplate, /refine this template to better handle explicit user input\./)
  } finally {
    cleanup()
  }
})

test('improve lifecycle records action states by proposal id', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    runtime.handle('/qt summarize produce concise bullets')
    const proposalResult = runtime.handle('/qt improve summarize emphasize owners')
    assert.equal(proposalResult.kind, 'improve_proposed')
    const proposalId = proposalResult.proposalId

    const acceptResult = runtime.handle(`/qt improve accept summarize ${proposalId}`)
    assert.equal(acceptResult.kind, 'improve_action')
    assert.equal(acceptResult.code, 'qt:improve:accept:applied')
    assert.equal(acceptResult.status, 'accepted')
    assert.match(acceptResult.message, /accepted and applied/)

    const runAfterAccept = runtime.handle('/qt/summarize follow-up input')
    assert.equal(runAfterAccept.kind, 'run_executed')
    assert.match(runAfterAccept.templateBody, /Improvement note for summarize: emphasize owners/)

    const repeatAccept = runtime.handle(`/qt improve accept summarize ${proposalId}`)
    assert.equal(repeatAccept.kind, 'improve_action')
    assert.equal(repeatAccept.code, 'qt:improve:already-finalized')
    assert.equal(repeatAccept.status, 'accepted')
  } finally {
    cleanup()
  }
})

test('improve lifecycle handles proposal not found', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const result = runtime.handle('/qt improve abandon summarize does-not-exist')
    assert.equal(result.kind, 'not_found')
    assert.equal(result.code, 'qt:improve:proposal-not-found')
    assert.equal(result.taskName, 'summarize')
  } finally {
    cleanup()
  }
})

test('improve reject and abandon do not apply template changes', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    runtime.handle('/qt summarize baseline instructions')
    const rejectProposal = runtime.handle('/qt improve summarize add rejection change')
    assert.equal(rejectProposal.kind, 'improve_proposed')
    runtime.handle(`/qt improve reject summarize ${rejectProposal.proposalId}`)

    const abandonProposal = runtime.handle('/qt improve summarize add abandon change')
    assert.equal(abandonProposal.kind, 'improve_proposed')
    runtime.handle(`/qt improve abandon summarize ${abandonProposal.proposalId}`)

    const runResult = runtime.handle('/qt/summarize verify unchanged')
    assert.equal(runResult.kind, 'run_executed')
    assert.match(runResult.templateBody, /baseline instructions/)
    assert.doesNotMatch(runResult.templateBody, /add rejection change/)
    assert.doesNotMatch(runResult.templateBody, /add abandon change/)
  } finally {
    cleanup()
  }
})

test('improve handles missing tasks cleanly', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const result = runtime.handle('/qt improve missing-task make it better')
    assert.equal(result.kind, 'not_found')
    assert.equal(result.code, 'qt:improve:not-found')
    assert.equal(result.taskName, 'missing-task')
    assert.equal(result.message, 'No template exists yet for missing-task.')
  } finally {
    cleanup()
  }
})

test('returns structured response for incomplete improve command', () => {
  const { runtime, cleanup } = createRuntimeForTest()
  try {
    const result = runtime.handle('/qt improve')

    assert.equal(result.kind, 'incomplete')
    assert.equal(result.code, 'qt:incomplete')
    assert.equal(result.usage, '/qt improve [task] [input]')
    assert.equal(result.message, 'Missing required input. Usage: /qt improve [task] [input]')
  } finally {
    cleanup()
  }
})
