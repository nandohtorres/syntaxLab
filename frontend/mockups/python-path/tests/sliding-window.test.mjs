import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { lessons } from '../content/index.js'
import { slidingWindowSample as sample } from '../content/slidingWindowSample.js'
import { savedLessonInventory } from '../content/savedLessonInventory.js'
import { blankProgress, normalizeBackup, recordAttempt } from '../progress.js'
import { layoutFromSearch, isSlidingWindowSample } from '../layoutContext.js'
import { exerciseFileTools } from '../exerciseFeatures.js'

test('the approved island is the default and the focused sample stays opt-in', () => {
  assert.equal(isSlidingWindowSample('?sample=sliding-window'), true)
  assert.equal(layoutFromSearch('?sample=sliding-window&layout=flow'), 'island')
  assert.equal(layoutFromSearch('?sample=unknown'), 'island')
  assert.equal(layoutFromSearch(''), 'island')
})

test('six connected exercises preserve the existing inventory', () => {
  assert.equal(lessons.length, 221)
  assert.equal(sample.length, 6)
  assert.equal(new Set(savedLessonInventory.map(item => item.id)).size, savedLessonInventory.length)
  for (const item of [...lessons, ...sample]) assert.ok(savedLessonInventory.some(saved => saved.id === item.id))
  assert.deepEqual(sample.map(item => item.stage), ['Fixed-size window', 'Fixed-size window', 'Fixed-size window', 'Variable-size window', 'Variable-size window', 'Recognize and transfer'])
  for (const item of sample) {
    assert.ok(!lessons.some(existing => existing.id === item.id))
    assert.ok(item.checkpoint && item.checkpointAnswer && item.note && item.hints.length >= 2 && item.checks.length >= 3)
  }
  assert.deepEqual(sample.map(item => `${item.questionNumber}${item.stepLetter}`), ['1a', '1b', '1c', '2a', '2b', '3a'])
})

test('file controls follow authored file requirements and explicit overrides', () => {
  for (const item of sample) assert.deepEqual(exerciseFileTools(item), { add: false, save: false })
  assert.deepEqual(exerciseFileTools(lessons.find(item => item.id === 'assign')), { add: false, save: false })
  assert.deepEqual(exerciseFileTools(lessons.find(item => item.id === 'import')), { add: true, save: true })
  assert.deepEqual(exerciseFileTools(lessons.find(item => item.id === 'main-guard')), { add: true, save: true })
  assert.deepEqual(exerciseFileTools(lessons.find(item => item.id === 'file-read')), { add: false, save: true })
  assert.deepEqual(exerciseFileTools({ ...sample[0], allowExtraFiles: true, allowFileDownload: true }), { add: true, save: true })
})

test('backup roundtrip preserves sample progress alongside prior drafts', () => {
  const exercise = sample[4]
  const backup = { kind: 'python-path', version: 1, selectedId: exercise.id, selections: { basics: 'assign', 'sliding-window': exercise.id }, drafts: { assign: { 'main.py': 'retries = 3' }, [exercise.id]: exercise.solutionFiles }, notes: { [exercise.id]: 'Shrink until valid' }, progress: recordAttempt(blankProgress(), exercise, { id: 'sample-rep', passed: true }) }
  const restored = normalizeBackup(JSON.parse(JSON.stringify(backup)), savedLessonInventory)
  assert.deepEqual(restored.drafts, backup.drafts)
  assert.deepEqual(restored.selections, backup.selections)
  assert.equal(restored.notes[exercise.id], backup.notes[exercise.id])
  assert.equal(restored.progress.records[exercise.id].successes, 1)
})

mkdirSync(new URL('../.cache/', import.meta.url), { recursive: true })
writeFileSync(new URL('../.cache/sliding-window-lessons.json', import.meta.url), JSON.stringify(sample))
