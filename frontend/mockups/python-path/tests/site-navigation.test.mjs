import test from 'node:test'
import assert from 'node:assert/strict'
import { sectionFromHash } from '../../../src/utils/siteSections.js'

test('existing root and unknown links open original practice', () => {
  assert.equal(sectionFromHash(''), 'practice')
  assert.equal(sectionFromHash('#unknown'), 'practice')
  assert.equal(sectionFromHash('#practice'), 'practice')
})
test('new sections use direct reloadable links without server routes', () => {
  assert.equal(sectionFromHash('#python'), 'python')
  assert.equal(sectionFromHash('#interview'), 'interview')
})
