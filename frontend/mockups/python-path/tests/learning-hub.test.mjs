import test from 'node:test'
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { pythonFacts, pythonQuirks, pythonTopics } from '../learning/pythonGuide.js'
import { patternLearningOrder } from '../content/learningPath.js'
import { patternGuide } from '../content/patternGuide.js'
import { referenceTopics, httpCodes } from '../../../../archives/interview-prep/source/python-path/interview/referenceSheet.js'

test('Python lessons progress from values to reusable code and link official documentation', () => {
  assert.equal(new Set(pythonTopics.map(item => item.id)).size, pythonTopics.length)
  assert.equal(pythonTopics[0].id, 'variables')
  for (const id of ['types', 'strings', 'lists', 'tuples', 'dictionaries', 'sets', 'functions', 'methods', 'classes', 'generators']) assert.ok(pythonTopics.some(item => item.id === id))
  for (const item of [...pythonTopics, ...pythonQuirks]) {
    assert.ok(item.code && item.output && (item.summary || item.text))
    assert.equal(new URL(item.source).hostname, 'docs.python.org')
  }
  for (const fact of pythonFacts) assert.ok(['docs.python.org', 'www.python.org'].includes(new URL(fact.source).hostname))
  assert.equal(patternLearningOrder.length, 15)
  for (const id of patternLearningOrder) assert.ok(patternGuide[id])
})

test('Interview Prep archive preserves its source bytes and portable authored data', () => {
  const root = new URL('../../../../', import.meta.url)
  const manifest = JSON.parse(readFileSync(new URL('archives/interview-prep/manifest.json', root), 'utf8'))
  for (const item of manifest.files) {
    const bytes = readFileSync(new URL(item.archived, root))
    assert.equal(bytes.length, item.bytes)
    assert.equal(createHash('sha256').update(bytes).digest('hex'), item.sha256, item.archived)
  }
  const data = JSON.parse(readFileSync(new URL('archives/interview-prep/data/interview-content.json', root), 'utf8'))
  assert.deepEqual(data.referenceTopics, referenceTopics)
  assert.deepEqual(data.httpCodes, httpCodes)
  assert.equal(data.referenceTopics.length, 36)
  assert.equal(data.topics.length, 29)
  assert.equal(data.drills.length, 66)
  assert.equal(Object.keys(data.references).length, 40)
})

mkdirSync(new URL('../.cache/', import.meta.url), { recursive: true })
writeFileSync(new URL('../.cache/hub-python-examples.json', import.meta.url), JSON.stringify([...pythonTopics, ...pythonQuirks]))
