import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { lessons } from '../content/index.js'
import { slidingWindowSteps } from '../content/blind75Practice.js'
import { STORAGE_KEY } from '../progress.js'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE ?? '@playwright/test')
const base = process.env.SAMPLE_BASE_URL ?? 'http://127.0.0.1:4319/'
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}#python`, { waitUntil: 'networkidle' })
  let panel = page.locator('#site-panel-python')
  const celebration = () => panel.getByRole('region', { name: 'Practice celebration', exact: true })
  const store = () => page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? '{}'), STORAGE_KEY)
  async function write(code) {
    await panel.locator('.monaco-editor').click()
    await page.keyboard.press('ControlOrMeta+A')
    await page.evaluate(value => navigator.clipboard.writeText(value), code)
    await page.keyboard.press('ControlOrMeta+V')
  }
  async function ready() {
    await page.waitForFunction(() => [...document.querySelectorAll('[role="tabpanel"]:not([hidden]) button')].some(button => button.textContent.trim() === 'Run code' && !button.disabled), null, { timeout: 90000 })
  }
  async function pass(exercise) {
    await ready()
    await write(exercise.solutionFiles['main.py'])
    await panel.getByRole('button', { name: 'Run code', exact: true }).click()
    await celebration().waitFor()
    await page.waitForFunction(({ key, id }) => JSON.parse(localStorage.getItem(key) ?? '{}').progress?.records?.[id]?.successes === 1, { key: STORAGE_KEY, id: exercise.id })
  }
  await ready()
  assert.equal(await celebration().count(), 0)
  await write('retries = "3"')
  await panel.getByRole('button', { name: 'Run code', exact: true }).click()
  await panel.getByText('One more adjustment', { exact: true }).waitFor()
  assert.equal(await celebration().count(), 0, 'A failed submission has no celebration')
  const assign = lessons.find(item => item.id === 'assign')
  await pass(assign)
  await celebration().getByRole('button', { name: 'Choose Lightning', exact: true }).click()
  const charge = celebration().getByRole('button', { name: 'Charge celebration', exact: true })
  await charge.focus()
  for (let i = 0; i < 5; i++) await page.keyboard.press('Enter')
  assert.equal(await celebration().getByRole('progressbar').getAttribute('aria-valuenow'), '83')
  assert.equal((await store()).selections.basics, 'assign')
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/celebration-desktop.png', import.meta.url)) })
  await page.keyboard.press('Enter')
  await celebration().waitFor({ state: 'hidden' })
  await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).selections.basics !== 'assign', STORAGE_KEY)
  assert.equal((await store()).progress.records.assign.successes, 1)
  assert.equal(Object.keys((await store()).progress.records).length, 1, 'Tapping earns no additional credit')

  const nextId = (await store()).selections.basics
  assert.equal(nextId, 'print', 'Completion advances exactly one exercise')
  await pass(lessons.find(item => item.id === nextId))
  assert.equal(await celebration().getByRole('button', { name: 'Choose Lightning', exact: true }).getAttribute('aria-pressed'), 'true')
  await celebration().getByRole('button', { name: 'Back to code', exact: true }).click()
  await write('# edited after passing\n' + lessons.find(item => item.id === nextId).solutionFiles['main.py'])
  assert.equal(await celebration().count(), 0)
  await panel.getByRole('button', { name: /^Skip exercise/ }).waitFor()

  await page.goto(`${base}?sample=sliding-window#practice`, { waitUntil: 'networkidle' })
  panel = page.locator('#site-panel-practice')
  await pass(slidingWindowSteps[0])
  assert.equal(await celebration().getByRole('button', { name: 'Choose Lightning', exact: true }).getAttribute('aria-pressed'), 'true', 'Choice survives reload and section changes')
  await page.setViewportSize({ width: 390, height: 844 })
  await panel.getByRole('button', { name: 'Use dark editor', exact: true }).click()
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await celebration().screenshot({ path: fileURLToPath(new URL('../.cache/celebration-mobile-dark.png', import.meta.url)) })
  // Cancel immediately after the final tap: no stale completion may navigate later.
  const selectionBeforeCancel = (await store()).selections['sliding-window']
  await celebration().evaluate(element => {
    const button = element.querySelector('button[aria-label="Charge celebration"]')
    for (let i = 0; i < 9; i++) button.click()
    const back = Array.from(element.querySelectorAll('button')).find(item => item.textContent === 'Back to code')
    back.click()
  })
  await page.waitForTimeout(650)
  assert.equal((await store()).selections['sliding-window'], selectionBeforeCancel)
  await panel.getByRole('button', { name: /^Next part/ }).click()
  await celebration().waitFor({ state: 'hidden' })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await pass(slidingWindowSteps[1])
  await celebration().getByRole('button', { name: 'Choose Seedling', exact: true }).click()
  const grow = celebration().getByRole('button', { name: 'Grow celebration', exact: true })
  assert.equal(await grow.locator('span[aria-hidden]').evaluate(element => getComputedStyle(element).animationName), 'none')
  await grow.focus()
  for (let i = 0; i < 6; i++) await page.keyboard.press('Space')
  await celebration().waitFor({ state: 'hidden' })
  await page.waitForFunction(({ key, id }) => JSON.parse(localStorage.getItem(key)).selections['sliding-window'] === id, { key: STORAGE_KEY, id: slidingWindowSteps[2].id })
  assert.equal((await store()).progress.records[slidingWindowSteps[1].id].successes, 1)
  assert.deepEqual(errors, [])
  console.log('PASS: failure gating, six mouse/keyboard taps, exactly one advance, no tap credit, saved symbols across sections/reload, return/edit, cancellation, direct Next, dark mobile and reduced motion.')
  await context.close()
} finally { await browser.close() }
