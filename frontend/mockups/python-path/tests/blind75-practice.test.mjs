import test from 'node:test'
import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { blind75Questions, slidingWindowSteps, leetCodePracticeLessons, stepsForQuestion } from '../content/blind75Practice.js'
import { problemIndex, patternModules } from '../content/catalog.js'
import { savedLessonInventory } from '../content/savedLessonInventory.js'

test('exactly 75 canonical questions, grouped by existing patterns, without helper entries', () => {
  assert.equal(blind75Questions.length, 75)
  assert.equal(new Set(blind75Questions.map(item => item.problemId)).size, 75)
  for (const item of blind75Questions) {
    const canonical = problemIndex.find(problem => problem.id === item.problemId)
    assert.equal(item.title, canonical.title)
    assert.equal(item.unit, canonical.module_id)
    assert.ok(patternModules.some(pattern => pattern.id === item.unit))
  }
})

test('one Blind 75 question owns four lettered steps, ending in the canonical interface', () => {
  assert.deepEqual(slidingWindowSteps.map(item => item.stepLetter), ['a', 'b', 'c', 'd'])
  for (const item of slidingWindowSteps) {
    assert.equal(item.libraryId, 'b75-3')
    assert.equal(item.questionTitle, 'Longest Substring Without Repeating Characters')
    assert.ok(item.checkpoint && item.checkpointAnswer)
  }
  assert.match(slidingWindowSteps[3].initialFiles['main.py'], /class Solution/)
  assert.equal(leetCodePracticeLessons.length, 162)
  assert.equal(new Set(leetCodePracticeLessons.map(item => item.id)).size, 162)
  assert.ok(!leetCodePracticeLessons.some(item => ['sw-first-window', 'sw-at-most-k'].includes(item.id)))
  assert.ok(savedLessonInventory.some(item => item.id === 'sw-first-window'), 'Old drafts remain recognized')
})

test('every canonical question has original context, focused preparation and the full graded task', () => {
  for (const question of blind75Questions) {
    const parts = stepsForQuestion(question.problemId)
    assert.ok(parts.length >= 2)
    assert.equal(parts.at(-1).id, question.id)
    assert.match(parts.at(-1).initialFiles['main.py'], /class (Solution|Codec|Trie|WordDictionary|MedianFinder)/)
    assert.ok(question.originalProblem.statement && question.originalProblem.example)
    assert.equal(question.originalProblem.source, question.url)
    assert.ok(question.checkpointAnswer)
    for (const [index, part] of parts.entries()) {
      assert.equal(part.stepLetter, String.fromCharCode(97 + index))
      assert.equal(part.libraryId, question.id)
      assert.ok(part.checkpointAnswer)
      assert.ok(savedLessonInventory.some(saved => saved.id === part.id))
    }
  }
})

mkdirSync(new URL('../.cache/', import.meta.url), { recursive: true })
writeFileSync(new URL('../.cache/blind75-practice.json', import.meta.url), JSON.stringify(leetCodePracticeLessons))
