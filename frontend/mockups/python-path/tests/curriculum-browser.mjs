import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { lessons } from '../content/index.js'
import { blind75Questions, leetCodePracticeLessons, stepsForQuestion } from '../content/blind75Practice.js'
import { STORAGE_KEY } from '../progress.js'
import { lessonsForScope } from '../practiceStore.js'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE ?? '@playwright/test')
const base = process.env.SAMPLE_BASE_URL ?? 'http://127.0.0.1:4319/'
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] })
  await context.addInitScript(() => localStorage.setItem('synlab_interview_recall_v1', 'KEEP-ARCHIVED-ANSWERS'))
  const page = await context.newPage()
  const errors = [], requests = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('request', request => requests.push(request.url()))
  await page.goto(base, { waitUntil: 'networkidle' })
  const panel = page.locator('#site-panel-practice')
  const prompt = panel.getByRole('region', { name: 'Exercise instructions', exact: true })
  const library = panel.getByRole('region', { name: 'Full questions list', exact: true })
  await library.getByText('0/75 practiced', { exact: true }).waitFor()
  assert.equal(await page.title(), 'SyntaxLab')
  assert.equal(await page.getByRole('navigation', { name: 'Layout comparison' }).count(), 0)
  assert.equal(await page.getByRole('tab', { name: 'LeetCode Patterns', exact: true }).getAttribute('aria-selected'), 'true')
  assert.equal(await page.getByRole('tab', { name: 'Python for LeetCode', exact: true }).count(), 0)
  for (const question of blind75Questions) {
    // The accordion remounts with the selected pattern so its selected group stays open.
    let button = library.locator('.question-item').filter({ hasText: `${question.problemId}. ${question.title}` })
    if (!await button.isVisible()) {
      const group = library.locator('.MuiAccordion-root').filter({ hasText: `${question.problemId}. ${question.title}` })
      await group.locator('.MuiAccordionSummary-root').click()
    }
    await button.click()
    await prompt.getByRole('heading', { name: `${question.problemId}. ${question.title}`, exact: true }).waitFor()
    const parts = stepsForQuestion(question.problemId)
    const original = prompt.getByRole('region', { name: 'Original problem', exact: true })
    await original.getByText(parts[0].originalProblem.statement, { exact: true }).waitFor()
    assert.equal(await original.getByRole('link').getAttribute('href'), question.url)
    const nav = prompt.getByRole('navigation', { name: 'Question parts', exact: true })
    await nav.locator('button[aria-expanded]').click()
    const options = nav.getByRole('group', { name: 'Available parts', exact: true })
    assert.equal(await options.getByRole('button').count(), parts.length)
    await options.getByRole('button', { name: parts.at(-1).title, exact: true }).click()
    const task = prompt.getByRole('region', { name: 'Your task', exact: true })
    const expectedTask = parts.at(-1).prompt === parts[0].originalProblem.statement
      ? 'Implement the full problem in the editor. Keep the provided class and method names.'
      : parts.at(-1).prompt
    assert.ok((await task.innerText()).includes(expectedTask), `Full task for LC ${question.problemId}`)
    await prompt.getByRole('region', { name: 'Why this works', exact: true }).waitFor()
  }
  assert.equal(await library.locator('.question-item').count(), 75)
  assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).progress.attempts.length, STORAGE_KEY), 0)
  assert.ok(!requests.some(url => /\/api\//.test(url)), 'The public practice route needs no legacy question API')
  console.log('PASS: normal public route, 75 original-first questions, all part selectors, pattern groups, full tasks and no navigation credit.')

  // Exercise the actual built worker under browser Python, rather than a native substitute.
  const workerPath = await page.evaluate(() => performance.getEntriesByType('resource').map(item => item.name).find(url => /\/python\.worker-[^/]+\.js/.test(url)))
  assert.ok(workerPath, 'Built Python worker was requested')
  const outcomes = await page.evaluate(async ({ exercises, workerPath }) => {
    const worker = new Worker(workerPath, { type: 'module' })
    const receive = (timeout, label) => new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error(`Timed out: ${label}`)), timeout)
      worker.onmessage = ({ data }) => { clearTimeout(timer); resolve(data) }
      worker.onerror = error => { clearTimeout(timer); reject(new Error(error.message)) }
    })
    try {
      const ready = await receive(90000, 'Pyodide initialization')
      if (ready.type !== 'ready') throw new Error(JSON.stringify(ready))
      const results = []
      for (const [id, exercise] of exercises.entries()) {
        const response = receive(10000, exercise.id)
        worker.postMessage({ type: 'run', id, exercise, files: exercise.solutionFiles })
        const data = await response
        results.push({ id: exercise.id, passed: data.result?.passed === true, checks: data.result?.checks })
      }
      return results
    } finally { worker.terminate() }
  }, { exercises: [...lessonsForScope(lessons, 'basics'), ...leetCodePracticeLessons], workerPath })
  writeFileSync(new URL('../.cache/curriculum-browser-report.json', import.meta.url), JSON.stringify(outcomes, null, 2))
  assert.deepEqual(outcomes.filter(item => !item.passed), [])
  assert.equal(outcomes.length, 266)
  assert.equal(await page.evaluate(() => localStorage.getItem('synlab_interview_recall_v1')), 'KEEP-ARCHIVED-ANSWERS')
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/curriculum-mobile.png', import.meta.url)), fullPage: true })
  assert.deepEqual(errors, [])
  console.log(`PASS: ${outcomes.length} solutions in browser Pyodide (104 Basics including optional projects + 162 LeetCode parts), preserved archived storage and mobile width.`)
  await context.close()
} finally { await browser.close() }
