import assert from 'node:assert/strict'
import { mkdtempSync, readFileSync, rmSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { createFileTaskStore, getTaskTemplate, saveTaskTemplate } from '../dist/store.js'

function withTempStoreDir() {
  const tasksDir = mkdtempSync(path.join(os.tmpdir(), 'quicktask-store-'))
  return {
    store: createFileTaskStore({ tasksDir }),
    cleanup: () => rmSync(tasksDir, { recursive: true, force: true })
  }
}

test('saves and loads a template by logical task name', () => {
  const { store, cleanup } = withTempStoreDir()
  const template = {
    taskName: 'summarize',
    filename: 'summarize.md',
    body: '# summarize'
  }

  try {
    const saved = saveTaskTemplate(store, template)
    assert.deepEqual(saved, template)
    assert.deepEqual(getTaskTemplate(store, 'summarize'), template)
  } finally {
    cleanup()
  }
})

test('task lookup normalizes case, spaces, and symbols', () => {
  const { store, cleanup } = withTempStoreDir()
  const template = {
    taskName: 'Bug_Triage!!',
    filename: 'bug-triage.md',
    body: '# Bug Triage'
  }

  try {
    saveTaskTemplate(store, template)
    const loaded = getTaskTemplate(store, '  BUG triage  ')
    assert.equal(loaded?.filename, 'bug-triage.md')
    assert.equal(loaded?.body, template.body)
  } finally {
    cleanup()
  }
})

test('returns undefined for missing task', () => {
  const { store, cleanup } = withTempStoreDir()
  try {
    assert.equal(getTaskTemplate(store, 'missing-task'), undefined)
  } finally {
    cleanup()
  }
})

test('overwrite writes updated content to disk', () => {
  const { store, cleanup } = withTempStoreDir()
  const first = {
    taskName: 'summarize',
    filename: 'summarize.md',
    body: '# summarize\nfirst version'
  }
  const second = {
    taskName: 'summarize',
    filename: 'summarize.md',
    body: '# summarize\nsecond version'
  }

  try {
    saveTaskTemplate(store, first)
    saveTaskTemplate(store, second)

    const filePath = path.join(store.tasksDir, 'summarize.md')
    assert.equal(readFileSync(filePath, 'utf8'), second.body)
    assert.deepEqual(getTaskTemplate(store, 'summarize'), second)
  } finally {
    cleanup()
  }
})
