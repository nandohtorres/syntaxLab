import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { lessons } from '../content/index.js'
const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE ?? '@playwright/test')
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1060 }, permissions: ['clipboard-read', 'clipboard-write'] })
  const errors = []
  page.on('pageerror', error => { errors.push(error.message); console.log('Page error:', error.stack) })
  await page.goto(process.env.PRACTICE_BASE_URL ?? 'http://127.0.0.1:4315/', { waitUntil: 'networkidle' })
  await page.getByText('Python ready', { exact: true }).waitFor({ timeout: 65000 })
  console.log('UI runtime ready; checking all authored solutions')
  const outcomes = await page.evaluate(async ({ exercises, workerUrl }) => {
    const worker = new Worker(workerUrl, { type: 'module' })
    await new Promise((resolve, reject) => {
      const timeout = setTimeout(() => reject(new Error('Worker initialization timed out')), 65000)
      worker.onmessage = ({ data }) => { clearTimeout(timeout); data.type === 'ready' ? resolve() : reject(new Error(JSON.stringify(data))) }
      worker.onerror = reject
    })
    const results = []
    for (const [index, exercise] of exercises.entries()) {
      const data = await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error(`Exercise timed out: ${exercise.id}`)), 6000)
        worker.onmessage = event => { clearTimeout(timeout); resolve(event.data) }
        worker.postMessage({ type: 'run', id: index, exercise, files: exercise.solutionFiles })
      })
      results.push({ id: exercise.id, passed: data.result?.passed ?? false, detail: data.result?.message ?? data.type })
    }
    worker.terminate()
    return results
  }, { exercises: lessons, workerUrl: process.env.PYTHON_WORKER_URL ?? '/python.worker.js' })
  writeFileSync(new URL('../.cache/browser-content-report.json', import.meta.url), JSON.stringify(outcomes, null, 2))
  assert.deepEqual(outcomes.filter(item => !item.passed), [], 'All reference solutions must pass real Pyodide')
  async function write(code) {
    await page.locator('.monaco-editor').first().click()
    await page.keyboard.press('ControlOrMeta+A')
    await page.evaluate(value => navigator.clipboard.writeText(value), code)
    await page.keyboard.press('ControlOrMeta+V')
  }
  async function run(code, pass) {
    await write(code)
    await page.getByRole('button', { name: 'Run code', exact: true }).click()
    await page.getByText(pass ? 'That works. Nice rep.' : 'One more adjustment', { exact: true }).waitFor({ timeout: 15000 })
  }
  await run('retries = "3"', false)
  await run('retries = 3', true)
  assert.equal(await page.getByText(`1/${lessons.length} practiced`, { exact: false }).count(), 1)
  await page.getByRole('button', { name: 'Next rep →' }).click()
  await page.getByRole('heading', { name: 'Make the output visible.' }).waitFor()
  await page.getByRole('button', { name: 'Browse exercises', exact: true }).click()
  await page.getByLabel('Search title, unit or track').fill('Use another Python file.')
  await page.getByRole('button', { name: /Use another Python file/ }).first().click()
  await page.getByText('File tools', { exact: true }).click()
  await page.getByRole('button', { name: '+ File', exact: true }).click()
  await page.getByLabel('File name', { exact: true }).fill('../bad.py')
  await page.getByRole('button', { name: 'Create file', exact: true }).click()
  await page.getByText(/Use a relative name such as/).waitFor()
  await page.getByLabel('File name', { exact: true }).fill('helpers.py')
  await page.getByRole('button', { name: 'Create file', exact: true }).click()
  await write('def double(value):\n    return value * 2\n')
  await page.getByRole('tab', { name: 'main.py', exact: true }).click()
  await run('from helpers import double\nanswer = double(3)', true)
  await page.waitForTimeout(500)
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByText('Python ready', { exact: true }).waitFor({ timeout: 65000 })
  await page.getByRole('tab', { name: 'helpers.py', exact: true }).waitFor()
  await page.getByRole('button', { name: 'Need a hint?' }).click()
  await page.getByRole('button', { name: 'Show worked solution' }).click()
  await page.getByRole('button', { name: 'Hide worked solution' }).waitFor()
  for (const name of ['Export backup', 'Import backup']) assert.equal(await page.getByRole('button', { name, exact: true }).count(), 0)
  await write('while True:\n    pass')
  await page.getByRole('button', { name: 'Run code', exact: true }).click()
  await page.getByRole('button', { name: 'Stop', exact: true }).click()
  await page.getByText('Run stopped', { exact: true }).waitFor()
  await page.getByText('Python ready', { exact: true }).waitFor({ timeout: 65000 })
  await page.screenshot({ path: fileURLToPath(new URL('../preview-desktop.png', import.meta.url)), fullPage: true })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.getByRole('button', { name: 'Learning path', exact: true }).click()
  await page.getByRole('button', { name: 'Browse all exercises', exact: true }).last().waitFor()
  await page.keyboard.press('Escape')
  await page.screenshot({ path: fileURLToPath(new URL('../preview-mobile.png', import.meta.url)), fullPage: true })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  assert.deepEqual(errors, [])
  console.log(`PASS: ${outcomes.length} exercises in real Pyodide; editor, wrong/correct answer, next, search, multi-file creation/import, draft reload, hints, removed backup/review controls, stop/recovery and mobile navigation.`)
} finally { await browser.close() }
