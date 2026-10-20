import test from 'node:test'
import assert from 'node:assert/strict'
import { drills, topics } from '../interview/content.js'
import { corrections, references } from '../interview/sources.js'
import { blankRecall, rateRecall, restoreRecall } from '../interview/recall.js'
import { normalizeBackup, dueLessons } from '../progress.js'

test('source topics are ordered; all drills have usable self-check criteria and references', () => {
  assert.equal(topics.length, 29)
  assert.equal(drills.length, 66)
  assert.equal(new Set(drills.map(item => item.id)).size, drills.length)
  assert.deepEqual([...topics].map(item => item.level), [...topics].map(item => item.level).sort())
  for (const item of drills) {
    assert.ok(item.prompt && item.answer && item.criteria.length >= 2 && item.origin)
    for (const source of item.sources) assert.ok(references[source], source)
  }
  for (const [, , , sources] of corrections) for (const source of sources) assert.ok(references[source])
})
test('recall requires an answer; a miss is due and duplicate ratings do not inflate records', () => {
  const exercise = { ...drills[0], version: 1 }
  assert.throws(() => rateRecall(blankRecall(), exercise, { answer: ' ', id: 'a' }))
  const event = { id: 'a', answer: 'on the server', remembered: false, helped: false }
  const state = rateRecall(blankRecall(), exercise, event, 1000)
  const repeated = rateRecall(state, exercise, event, 1000)
  assert.equal(repeated.progress.records[exercise.id].failures, 1)
  assert.equal(dueLessons([exercise], state.progress, 1000).length, 1)
})
test('helped recall is saved as assistance, not independent evidence', () => {
  const state = rateRecall(blankRecall(), drills[0], { id: 'helped', answer: 'server', remembered: true, helped: true }, 1000)
  assert.equal(state.progress.records[drills[0].id].independent, 0)
  assert.equal(state.progress.records[drills[0].id].dueAt, 601000)
  assert.equal(restoreRecall(state).drafts[drills[0].id]['answer.txt'], 'server')
})
test('section backups cannot overwrite the other section accidentally', () => {
  const interview = blankRecall()
  assert.throws(() => normalizeBackup(interview, [{ id: 'python', entry: 'main.py', skillId: 'python' }]), /different practice section/)
  assert.throws(() => restoreRecall({ ...interview, kind: 'python-path' }), /Interview Recall/)
})
