import assert from 'node:assert/strict'
import test from 'node:test'

import { createQtRuntime } from '../dist/runtime.js'

test('returns help for /qt', () => {
  const runtime = createQtRuntime()
  const result = runtime.handle('/qt')

  assert.equal(result.title, 'QuickTask Help')
  assert.match(result.message, /Use \/qt to view help/)
})

test('returns task-not-found when running an unknown task', () => {
  const runtime = createQtRuntime()
  const result = runtime.handle('/qt/does-not-exist example input')

  assert.equal(result.title, 'Task Not Found')
  assert.equal(result.message, 'No template exists yet for does-not-exist.')
})

test('create then run returns template and user input', () => {
  const runtime = createQtRuntime()
  runtime.handle('/qt summarize produce concise bullets')

  const result = runtime.handle('/qt/summarize Team sync notes')
  assert.equal(result.title, 'Run summarize')
  assert.match(result.message, /Template:/)
  assert.match(result.message, /User input:\nTeam sync notes/)
})

test('improve returns old and proposed templates for existing task', () => {
  const runtime = createQtRuntime()
  runtime.handle('/qt summarize produce concise bullets')

  const result = runtime.handle('/qt improve summarize emphasize owners')
  assert.equal(result.title, 'Improve summarize')
  assert.match(result.message, /Old template:/)
  assert.match(result.message, /Proposed template:/)
  assert.match(result.message, /Improvement note for summarize: emphasize owners/)
})

test('returns structured response for incomplete improve command', () => {
  const runtime = createQtRuntime()
  const result = runtime.handle('/qt improve')

  assert.equal(result.title, 'Incomplete Command')
  assert.equal(result.message, 'Missing required input. Usage: /qt improve [task] [input]')
})
