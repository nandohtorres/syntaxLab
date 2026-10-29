import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { transform } from '../../../node_modules/esbuild/lib/main.js'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { partLayoutFromSearch, partLayouts } from '../partLayouts.js'

// Use the same installed JSX compiler as the app; no additional test dependency.
mkdirSync(new URL('../.cache/', import.meta.url), { recursive: true })
for (const name of ['QuestionBreakdown', 'OriginalProblem', 'LessonSection']) {
  const source = readFileSync(new URL(`../${name}.jsx`, import.meta.url), 'utf8')
  const compiled = await transform(source, { loader: 'jsx', jsx: 'automatic', format: 'esm' })
  const code = compiled.code.replaceAll('./OriginalProblem.jsx', './OriginalProblem-test.mjs').replaceAll('./LessonSection.jsx', './LessonSection-test.mjs')
  writeFileSync(new URL(`../.cache/${name}-test.mjs`, import.meta.url), code)
}
const output = new URL('../.cache/QuestionBreakdown-test.mjs', import.meta.url)
const { default: QuestionBreakdown } = await import(output.href)

test('only supported navigation preview values are accepted', () => {
  assert.equal(partLayoutFromSearch(''), 'outline')
  assert.equal(partLayoutFromSearch('?parts=unknown'), 'outline')
  for (const layout of partLayouts) assert.equal(partLayoutFromSearch(`?parts=${layout.id}`), layout.id)
})

test('all three navigators handle one, two, seven and twenty-eight parts', () => {
  for (const count of [1, 2, 7, 28]) {
    const lessons = Array.from({ length: count }, (_, index) => ({ id: `part-${index}`, title: `Practice operation ${index + 1}`, problemId: 3, questionTitle: 'Canonical problem', stepLetter: index + 1 }))
    for (const { id: layout } of partLayouts) {
      const markup = renderToStaticMarkup(React.createElement(QuestionBreakdown, { exercise: lessons.at(-1), lessons, choose() {}, layout }, React.createElement('p', null, 'Active task content')))
      assert.ok(markup.includes(`data-parts-layout="${layout}"`))
      assert.ok(markup.includes('Active task content'))
      assert.ok(!markup.includes('undefined'))
      if (layout === 'guided') assert.ok(markup.includes(`Part ${count} of ${count}`))
      else for (const item of lessons) assert.ok(markup.includes(item.title), `${layout}/${count}: ${item.title}`)
    }
  }
})
