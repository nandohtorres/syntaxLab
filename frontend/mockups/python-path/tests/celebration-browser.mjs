import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { lessons } from '../content/index.js'
import { slidingWindowSteps } from '../content/blind75Practice.js'
import { STORAGE_KEY } from '../progress.js'
import { STREAK_STORAGE_KEY } from '../streakStore.js'

// Pass flow: an inline pass bar under the editor (never covering code), a focused Next button,
// "tap your code to launch it", the first-try streak and the reduced-motion fade.
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
  const passBar = () => panel.getByText(/^✓ Passed · \d+\/\d+ checks$/)
  const store = () => page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? '{}'), STORAGE_KEY)
  const launchLayer = () => page.evaluate(() => document.querySelectorAll('body > div[style*="z-index: 2000"]').length)
  async function write(code) {
    await panel.locator('.cm-content').first().click()
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
    await passBar().waitFor()
    await page.waitForFunction(({ key, id }) => JSON.parse(localStorage.getItem(key) ?? '{}').progress?.records?.[id]?.successes === 1, { key: STORAGE_KEY, id: exercise.id })
  }

  await ready()
  await write('retries = "3"')
  await panel.getByRole('button', { name: 'Run code', exact: true }).click()
  await panel.locator('[role="status"]').filter({ hasText: 'Value of retries' }).waitFor()
  assert.equal(await passBar().count(), 0, 'A failed submission has no pass bar')
  const assign = lessons.find(item => item.id === 'assign')
  await pass(assign)
  assert.match(await page.evaluate(() => document.activeElement?.textContent ?? ''), /^Next exercise/, 'Next is focused after a pass')
  assert.equal(await page.evaluate(key => localStorage.getItem(key), STREAK_STORAGE_KEY), null, 'A pass after a miss does not start a streak')
  // Tap the code: the characters launch, then exactly one exercise advance.
  await panel.locator('.cm-content').first().click()
  await page.waitForTimeout(200)
  assert.ok(await launchLayer() > 0, 'Characters are launched as separate pieces')
  await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).selections.basics !== 'assign', STORAGE_KEY)
  await page.waitForTimeout(400)
  assert.equal(await launchLayer(), 0, 'The launch layer is removed')
  const nextId = (await store()).selections.basics
  assert.equal(nextId, 'print', 'Launch advances exactly one exercise')
  assert.equal(Object.keys((await store()).progress.records).length, 1, 'Launching earns no additional credit')
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/pass-desktop.png', import.meta.url)) })

  // A first-try pass starts the streak; Ctrl+Shift+Enter still advances without the launch.
  await pass(lessons.find(item => item.id === nextId))
  await panel.getByText(/ 1 streak$/).waitFor()
  await panel.locator('.cm-content').first().focus()
  await page.keyboard.press('ControlOrMeta+Shift+Enter')
  await page.waitForFunction(key => JSON.parse(localStorage.getItem(key)).selections.basics !== 'print', STORAGE_KEY)
  assert.equal(await launchLayer(), 0)

  // Reduced motion: a quick fade instead of flying characters.
  await page.goto(`${base}?sample=sliding-window#practice`, { waitUntil: 'networkidle' })
  panel = page.locator('#site-panel-practice')
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await pass(slidingWindowSteps[0])
  await panel.locator('.cm-content').first().click()
  await page.waitForTimeout(100)
  assert.equal(await launchLayer(), 0, 'No flying characters with reduced motion')
  await page.waitForFunction(({ key, id }) => JSON.parse(localStorage.getItem(key)).selections['sliding-window'] === id, { key: STORAGE_KEY, id: slidingWindowSteps[1].id })
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  assert.deepEqual(errors, [])
  console.log('PASS: pass bar under the editor, focused Next, tap-to-launch advances once without extra credit, first-try streak, keyboard Next and reduced-motion fade.')
  await context.close()
} finally { await browser.close() }
