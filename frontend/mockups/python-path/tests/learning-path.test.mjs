import test from 'node:test'
import assert from 'node:assert/strict'
import { patternModules } from '../content/catalog.js'
import { lessons } from '../content/index.js'
import { patternLearningOrder, orderForLearning } from '../content/learningPath.js'
import { blind75Questions, leetCodePracticeLessons } from '../content/blind75Practice.js'
import { pickNext, blankProgress } from '../progress.js'

test('learning sequence includes every pattern after its declared prerequisites', () => {
  assert.equal(new Set(patternLearningOrder).size, patternModules.length)
  assert.deepEqual(new Set(patternLearningOrder), new Set(patternModules.map(item => item.id)))
  for (const pattern of patternModules) {
    for (const prerequisite of pattern.requires_modules) assert.ok(patternLearningOrder.indexOf(prerequisite) < patternLearningOrder.indexOf(pattern.id), `${pattern.id} needs ${prerequisite} first`)
  }
})

test('library and practice progression follow the same path without changing the 75 problem IDs', () => {
  const original = lessons.filter(item => item.track === 'blind75')
  const snapshot = original.map(item => item.id)
  assert.deepEqual(orderForLearning(original).map(item => item.id), blind75Questions.map(item => item.id))
  assert.deepEqual(original.map(item => item.id), snapshot, 'Ordering does not mutate the original inventory')
  assert.deepEqual(new Set(blind75Questions.map(item => item.id)), new Set(snapshot))
  assert.deepEqual([...new Set(blind75Questions.map(item => item.unit))], patternLearningOrder)
  assert.deepEqual([...new Set(leetCodePracticeLessons.map(item => item.libraryId ?? item.id))], blind75Questions.map(item => item.id))
  const full = leetCodePracticeLessons.filter(item => item.track === 'blind75')
  for (let index = 0; index < full.length - 1; index++) assert.equal(pickNext(full, full[index].id, blankProgress()).id, full[index + 1].id)
})
