import assert from 'node:assert/strict'
import test from 'node:test'

import { createInMemoryTaskStore, getTaskTemplate, saveTaskTemplate } from '../dist/store.js'

test('saves and loads a template by logical task name', () => {
  const store = createInMemoryTaskStore()
  const template = {
    taskName: 'summarize',
    filename: 'summarize.md',
    body: '# summarize'
  }

  saveTaskTemplate(store, template)
  assert.deepEqual(getTaskTemplate(store, 'summarize'), template)
})

test('task lookup is case-insensitive and trims whitespace', () => {
  const store = createInMemoryTaskStore()
  const template = {
    taskName: 'Bug Triage',
    filename: 'bug-triage.md',
    body: '# Bug Triage'
  }

  saveTaskTemplate(store, template)
  assert.deepEqual(getTaskTemplate(store, '  bug triage  '), template)
})

test('returns undefined for missing task', () => {
  const store = createInMemoryTaskStore()
  assert.equal(getTaskTemplate(store, 'missing-task'), undefined)
})
