import test from 'node:test'
import assert from 'node:assert/strict'
import { lessons } from '../content/index.js'
import { patternModules } from '../content/catalog.js'
import { patternGuide } from '../content/patternGuide.js'
import { createPracticeStore, lessonsForScope, selectedForScope } from '../practiceStore.js'
import { blankProgress, normalizeBackup, recordAttempt, STORAGE_KEY } from '../progress.js'
import { categories, referenceTopics, filterReference, httpCodes } from '../interview/referenceSheet.js'
import { references } from '../interview/sources.js'
import { layoutFromSearch } from '../layoutContext.js'

test('only explicit comparison links change the normal study layout', () => {
  assert.equal(layoutFromSearch(''), 'island')
  assert.equal(layoutFromSearch('?layout=unexpected'), 'island')
  assert.equal(layoutFromSearch('?layout=island'), 'island')
  assert.equal(layoutFromSearch('?layout=flow'), 'flow')
  assert.equal(layoutFromSearch('?other=flow'), 'island')
})

test('basics and algorithm lessons are disjoint and preserve the entire inventory', () => {
  const basics = lessonsForScope(lessons, 'basics'), algorithms = lessonsForScope(lessons, 'algorithms')
  assert.equal(basics.length + algorithms.length, lessons.length)
  assert.equal(new Set([...basics, ...algorithms].map(item => item.id)).size, lessons.length)
  for (const id of ['string', 'assign', 'method', 'class-counter']) assert.ok(basics.some(item => item.id === id))
  for (const id of ['heap', 'node', 'memo', 'factorial']) assert.ok(algorithms.some(item => item.id === id))
  assert.ok(!basics.some(item => ['patterns', 'blind75'].includes(item.track)))
})

test('old backups retain both tracks while restoring a valid section selection', () => {
  const basics = lessonsForScope(lessons, 'basics'), algorithms = lessonsForScope(lessons, 'algorithms')
  const original = { version: 1, kind: 'python-path', selectedId: algorithms[0].id, progress: blankProgress(), drafts: { assign: { 'main.py': 'retries=3' }, [algorithms[0].id]: algorithms[0].solutionFiles }, notes: {} }
  const restored = normalizeBackup(original, lessons)
  assert.deepEqual(restored.drafts, original.drafts)
  assert.ok(basics.includes(selectedForScope(restored, basics, 'basics')))
  restored.selections = { basics: 'string', algorithms: algorithms[0].id }
  const again = normalizeBackup(restored, lessons)
  assert.equal(selectedForScope(again, basics, 'basics').id, 'string')
  assert.equal(selectedForScope(again, algorithms, 'algorithms').id, algorithms[0].id)
})

test('two mounted sections update one current store without losing drafts or attempts', () => {
  const values = new Map(), store = createPracticeStore(() => ({ getItem: key => values.get(key), setItem: (key, value) => values.set(key, value) }), lessons)
  const first = store.getSnapshot()
  assert.equal(store.getSnapshot(), first)
  let notified = 0
  const unsubscribe = store.subscribe(() => notified++)
  const algorithm = lessons.find(item => item.track === 'patterns')
  store.setData(current => ({ ...current, drafts: { ...current.drafts, assign: { 'main.py': 'retries=3' } }, progress: recordAttempt(current.progress, lessons[0], { id: 'basic', passed: true }) }))
  store.setData(current => ({ ...current, drafts: { ...current.drafts, [algorithm.id]: algorithm.solutionFiles }, progress: recordAttempt(current.progress, algorithm, { id: 'pattern', passed: true }) }))
  store.flush()
  const saved = JSON.parse(values.get(STORAGE_KEY))
  assert.equal(saved.drafts.assign['main.py'], 'retries=3')
  assert.deepEqual(saved.drafts[algorithm.id], algorithm.solutionFiles)
  assert.equal(saved.progress.attempts.length, 2)
  assert.equal(notified, 2)
  unsubscribe()
})

test('unreadable stored work is not overwritten until the user resumes saving', () => {
  let saved = 'PRIVATE-UNREADABLE-DATA'
  const store = createPracticeStore(() => ({ getItem: () => saved, setItem: (_, value) => { saved = value } }), lessons)
  assert.equal(store.getSnapshot().saving, false)
  store.setData(current => ({ ...current, notes: { assign: 'new note' } }))
  store.flush()
  assert.equal(saved, 'PRIVATE-UNREADABLE-DATA')
  store.resumeSaving()
  assert.equal(JSON.parse(saved).notes.assign, 'new note')
})

test('legacy selection and imported selection survive an update in the other section', () => {
  const old = { version: 1, kind: 'python-path', selectedId: 'string', progress: blankProgress(), drafts: {}, notes: {} }
  const store = createPracticeStore(() => ({ getItem: () => JSON.stringify(old), setItem() {} }), lessons)
  assert.equal(store.getSnapshot().data.selections.basics, 'string')
  const algorithm = lessons.find(item => item.track === 'patterns')
  store.setData(current => ({ ...current, selectedId: algorithm.id, selections: { ...current.selections, algorithms: algorithm.id } }))
  assert.equal(store.getSnapshot().data.selections.basics, 'string')
  const generationBeforeImport = store.getSnapshot().replacement
  store.setData({ ...old, selectedId: 'method' })
  assert.equal(store.getSnapshot().data.selections.basics, 'method')
  assert.equal(store.getSnapshot().replacement, generationBeforeImport + 1, 'An in-flight result from before the replacement must be distinguishable')
  store.flush()
})

test('storage failures pause saving but retain in-memory work', () => {
  const store = createPracticeStore(() => ({ getItem: () => null, setItem() { throw new Error('quota') } }), lessons)
  store.setData(current => ({ ...current, notes: { assign: 'keep me' } }))
  store.flush()
  assert.equal(store.getSnapshot().saving, false)
  assert.match(store.getSnapshot().error, /may be lost when this page closes/)
  assert.equal(store.getSnapshot().data.notes.assign, 'keep me')
})

test('every pattern module has recognition, example, reasoning and a pitfall', () => {
  assert.equal(patternModules.length, 15)
  for (const module of patternModules) {
    const guide = patternGuide[module.id]
    assert.equal(guide.length, 5)
    assert.ok(guide[0].length > 0)
    assert.ok(guide.slice(1).every(value => value.length > 8))
  }
})

test('reference topics have concise examples, valid categories and primary sources', () => {
  const ids = new Set(categories.map(([id]) => id))
  assert.equal(new Set(referenceTopics.map(topic => topic.id)).size, referenceTopics.length)
  for (const topic of referenceTopics) {
    assert.ok(ids.has(topic.category), topic.id)
    assert.ok(topic.summary && topic.example, topic.id)
    for (const id of topic.sources) assert.ok(references[id], id)
  }
  assert.ok(filterReference('sql joins').some(topic => topic.id === 'joins'))
  assert.ok(filterReference('cache', 'design').some(topic => topic.id === 'caching'))
  assert.equal(filterReference('NONEXISTENT-TOPIC').length, 0)
  assert.ok(httpCodes.some(([code, , text]) => code === 401 && /authentication/.test(text)))
  assert.ok(httpCodes.some(([code]) => code === 429))
})
