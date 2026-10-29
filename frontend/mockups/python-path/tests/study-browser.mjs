import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { lessons } from '../content/index.js'
import { STORAGE_KEY } from '../progress.js'
import { lessonsForScope } from '../practiceStore.js'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE ?? '@playwright/test')
const base = process.env.SITE_BASE_URL ?? 'http://127.0.0.1:4317/'
const questions = JSON.parse(readFileSync(new URL('../../../../backend/src/main/resources/questions.json', import.meta.url), 'utf8'))
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
  const errors = [], requests = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('request', request => requests.push(request.url()))
  await page.route('**/api/questions', route => route.fulfill({ json: questions }))
  async function selectSection(name) {
    const id = { 'Python Basics': 'python', 'LeetCode Python': 'practice', 'Interview prep': 'interview' }[name]
    await page.getByRole('tab', { name, exact: true }).click()
    await page.locator('#site-panel-' + id).waitFor({ state: 'visible' })
  }
  await page.goto(base + '#interview', { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Software engineering interview reference' }).waitFor()
  assert.equal(requests.filter(url => /api\/questions|pyodide|python\.worker|editorRuntime/.test(url)).length, 0)
  assert.equal(await page.getByRole('tab', { name: /Rapid drills|Study sheet/ }).count(), 0)
  await page.evaluate(() => localStorage.setItem('synlab_interview_recall_v1', 'KEEP-OLD-ANSWERS'))
  await page.getByLabel('Search interview topics').fill('401')
  await page.getByText('HTTP status quick lookup', { exact: true }).waitFor()
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click()
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#site-panel-interview article')).backgroundColor === 'rgb(255, 255, 255)')
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click()
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#site-panel-interview article')).backgroundColor !== 'rgb(255, 255, 255)')
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click()
  await page.getByRole('button', { name: 'SQL & data', exact: true }).click()
  await page.getByLabel('Search interview topics').fill('joins')
  await page.getByRole('heading', { name: 'Join rows without losing the unmatched ones' }).waitFor()
  assert.equal(await page.getByRole('heading', { name: 'Classes, objects and methods' }).count(), 0)
  await page.getByLabel('Search interview topics').fill('NO-MATCH-EXISTS')
  await page.getByText(/No matching topics/).waitFor()
  await page.getByRole('button', { name: 'Clear filters', exact: true }).click()
  const pattern = lessons.find(item => item.track === 'patterns')
  await page.evaluate(({ key, id, files }) => localStorage.setItem(key, JSON.stringify({ version: 1, kind: 'python-path', selectedId: 'assign', progress: { version: 1, attempts: [], records: {}, skills: {} }, drafts: { [id]: files }, notes: {} })), { key: STORAGE_KEY, id: pattern.id, files: pattern.solutionFiles })
  await selectSection('Python Basics')
  const basics = page.locator('#site-panel-python')
  await basics.getByText('Python ready', { exact: true }).waitFor({ timeout: 65000 })
  assert.equal(await basics.getByText('Blind 75', { exact: true }).count(), 0)
  async function write(panel, code) {
    await panel.locator('.monaco-editor').first().click()
    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.insertText(code)
  }
  await write(basics, 'retries = "3"')
  await basics.getByRole('button', { name: 'Run code', exact: true }).click()
  await basics.getByText('One more adjustment', { exact: true }).waitFor()
  await write(basics, 'retries = 3')
  await page.keyboard.press('ControlOrMeta+Enter')
  await basics.getByText('That works. Nice rep.', { exact: true }).waitFor()
  const next = basics.getByRole('button', { name: /^Next rep/ })
  const runBox = await basics.getByRole('button', { name: 'Run code', exact: true }).boundingBox()
  const nextBox = await next.boundingBox()
  assert.ok(Math.abs(runBox.y - nextBox.y) < 10, 'Run and Next share the compact action row')
  await page.keyboard.press('ControlOrMeta+Shift+Enter')
  await basics.getByRole('heading', { name: 'Make the output visible.' }).waitFor()
  await write(basics, 'print("unsaved draft")')
  await selectSection('LeetCode Python')
  await page.getByRole('tab', { name: '15 patterns & problems', exact: true }).click()
  const algorithms = page.locator('#leetcode-patterns-panel')
  await algorithms.getByRole('heading', { name: pattern.title }).waitFor()
  await algorithms.getByText('Python ready', { exact: true }).waitFor({ timeout: 65000 })
  await algorithms.getByRole('region', { name: 'Pattern guide', exact: true }).waitFor()
  await algorithms.getByRole('button', { name: 'Run code', exact: true }).click()
  await algorithms.getByText('That works. Nice rep.', { exact: true }).waitFor()
  await selectSection('Python Basics')
  await basics.getByRole('heading', { name: 'Make the output visible.' }).waitFor()
  assert.ok((await basics.locator('.monaco-editor').innerText()).includes('unsaved'))
  await page.waitForTimeout(450)
  const saved = await page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY)
  assert.equal(saved.progress.records.assign.successes, 1)
  assert.equal(saved.progress.records[pattern.id].successes, 1)
  assert.equal(saved.drafts.print['main.py'], 'print("unsaved draft")')
  assert.deepEqual(saved.drafts[pattern.id], pattern.solutionFiles)
  await page.reload({ waitUntil: 'networkidle' })
  await basics.getByRole('heading', { name: 'Make the output visible.' }).waitFor()
  assert.equal(await page.evaluate(() => localStorage.getItem('synlab_interview_recall_v1')), 'KEEP-OLD-ANSWERS')
  await selectSection('LeetCode Python')
  await page.getByRole('heading', { name: 'Build fluency, one rep at a time.' }).waitFor()
  const original = page.locator('#leetcode-syntax-panel')
  await original.getByRole('button', { name: 'Run', exact: true }).waitFor({ state: 'visible' })
  await page.waitForFunction(() => [...document.querySelectorAll('#leetcode-syntax-panel button')].some(button => button.textContent.trim() === 'Run' && !button.disabled))
  const first = questions[0]
  await write(original, first.starterCode + '\n' + first.answer)
  await original.getByRole('button', { name: 'Run', exact: true }).click()
  await page.waitForFunction(id => JSON.parse(localStorage.getItem('synlab_progress') ?? '{}')[id] === true, first.id)
  console.log('PASS: original API-backed exercise still executes and saves its original progress key')
  for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 720 }, { width: 1280, height: 500 }]) {
    await page.setViewportSize(viewport)
    for (const section of ['Python Basics', 'Interview prep', 'LeetCode Python']) {
      await selectSection(section)
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${section}: ${viewport.width}px`)
    }
  }
  await page.setViewportSize({ width: 1440, height: 900 })
  await selectSection('Python Basics')
  await basics.getByRole('heading', { name: 'Make the output visible.' }).waitFor()
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/study-basics-desktop.png', import.meta.url)), fullPage: true })
  await selectSection('Interview prep')
  await page.getByRole('heading', { name: 'Software engineering interview reference' }).waitFor()
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/study-reference-desktop.png', import.meta.url)), fullPage: false })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/study-reference-mobile.png', import.meta.url)), fullPage: false })
  await selectSection('LeetCode Python')
  await page.getByRole('tab', { name: '15 patterns & problems', exact: true }).click()
  await algorithms.getByText('Python ready', { exact: true }).waitFor({ timeout: 65000 })
  await selectSection('Python Basics')
  for (const name of ['Export backup', 'Import backup']) assert.equal(await basics.getByRole('button', { name, exact: true }).count(), 0)
  const broken = await browser.newPage()
  await broken.route('**/api/questions', route => route.abort())
  await broken.goto(base, { waitUntil: 'networkidle' })
  await broken.getByRole('tab', { name: 'Interview prep', exact: true }).click()
  await broken.getByRole('heading', { name: 'Software engineering interview reference' }).waitFor()
  await broken.route('**/assets/python.worker-*', route => route.abort())
  await broken.getByRole('tab', { name: 'Python Basics', exact: true }).click()
  await broken.getByText('Python could not load', { exact: true }).waitFor()
  await broken.getByRole('button', { name: 'Retry loading', exact: true }).waitFor()
  await broken.close()
  assert.deepEqual(errors, [])
  console.log('PASS: reference-only cold loading, search/categories, old answers preserved, keyboard drills, cross-section drafts/progress, reload, mobile/short screens and dependency-failure navigation')

  const workerFile = readdirSync(new URL('../../../dist/assets/', import.meta.url)).find(name => /^python\.worker-.*\.js$/.test(name))
  const results = await page.evaluate(async ({ exercises, workerUrl }) => {
    const worker = new Worker(workerUrl, { type: 'module' })
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Worker startup timed out')), 65000)
      worker.onmessage = ({ data }) => { clearTimeout(timeout); data.type === 'ready' ? resolve() : reject(new Error(data.type)) }
      worker.onerror = reject
    })
    const results = []
    for (const [id, exercise] of exercises.entries()) {
      const result = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error(exercise.id)), 7000)
        worker.onmessage = ({ data }) => { clearTimeout(timeout); resolve(data) }
        worker.postMessage({ type: 'run', id, exercise, files: exercise.solutionFiles })
      })
      if (!result.result?.passed) results.push({ id: exercise.id, detail: result.result })
    }
    worker.terminate()
    return results
  }, { exercises: lessons, workerUrl: '/assets/' + workerFile })
  assert.deepEqual(results, [])
  console.log(`PASS: all ${lessons.length} authored solutions in the compiled production Pyodide worker; ${lessonsForScope(lessons, 'basics').length} Basics / ${lessonsForScope(lessons, 'algorithms').length} algorithm exercises`)
} finally { await browser.close() }
