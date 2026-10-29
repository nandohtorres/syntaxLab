import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { slidingWindowSteps, blind75Questions } from '../content/blind75Practice.js'
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
  await page.goto(`${base}?sample=sliding-window#practice`, { waitUntil: 'networkidle' })
  const panel = page.locator('#site-panel-practice')
  const editor = panel.getByRole('region', { name: 'Code workspace', exact: true })
  const skip = editor.getByRole('button', { name: /^Skip question/ })
  const run = editor.getByRole('button', { name: 'Run code', exact: true })
  await run.waitFor()
  await page.waitForFunction(() => [...document.querySelectorAll('#site-panel-practice button')].some(button => button.textContent.trim() === 'Run code' && !button.disabled), null, { timeout: 65000 })
  assert.equal(await skip.isEnabled(), true)
  assert.equal(await editor.getByRole('button', { name: /^Next/ }).count(), 0)
  assert.equal(await panel.getByRole('button', { name: 'Skip for now', exact: true }).count(), 0)
  const skipBox = await skip.boundingBox(), runBox = await run.boundingBox()
  assert.ok(Math.abs(skipBox.y - runBox.y) < 2, 'Skip is inside the editor action row beside Run')

  async function store() { return page.evaluate(key => JSON.parse(localStorage.getItem(key)), STORAGE_KEY) }
  await skip.click()
  await page.waitForFunction(({ key, ids }) => {
    const value = JSON.parse(localStorage.getItem(key))
    return value?.selections?.['sliding-window'] && !ids.includes(value.selections['sliding-window'])
  }, { key: STORAGE_KEY, ids: slidingWindowSteps.map(step => step.id) })
  assert.equal((await store()).progress.attempts.length, 0, 'Skipping the parent question earns no attempt or credit')

  const library = panel.getByRole('region', { name: 'Full questions list', exact: true })
  const target = blind75Questions.find(question => question.problemId === 3)
  const question = library.getByRole('button').filter({ hasText: `3. ${target.title}` })
  if (!await question.isVisible()) await library.getByRole('button', { name: /Sliding Window/ }).click()
  await question.click()
  await skip.waitFor()
  async function write(code, root = editor) {
    await root.locator('.monaco-editor').click()
    await page.keyboard.press('ControlOrMeta+A')
    await page.evaluate(value => navigator.clipboard.writeText(value), code)
    await page.keyboard.press('ControlOrMeta+V')
  }
  await write('def add_character(counts, char):\n    pass')
  await run.click()
  await panel.getByText('One more adjustment', { exact: true }).waitFor()
  assert.equal(await skip.isEnabled(), true)
  assert.equal((await store()).progress.records[slidingWindowSteps[0].id]?.successes ?? 0, 0)

  await write(slidingWindowSteps[0].solutionFiles['main.py'])
  await run.click()
  const next = editor.getByRole('button', { name: /^Next part/ })
  await next.waitFor()
  assert.equal(await skip.count(), 0)
  await page.waitForFunction(({ key, id }) => JSON.parse(localStorage.getItem(key))?.progress?.records?.[id]?.successes === 1, { key: STORAGE_KEY, id: slidingWindowSteps[0].id })
  await editor.screenshot({ path: fileURLToPath(new URL('../.cache/editor-actions-passed.png', import.meta.url)) })
  await editor.getByRole('button', { name: 'Back to code', exact: true }).click()
  await write(slidingWindowSteps[0].solutionFiles['main.py'] + '\n# edited after the pass')
  await skip.waitFor()
  assert.equal(await next.count(), 0, 'Edited code needs a new passing run before Next returns')
  await run.click()
  await next.waitFor()
  assert.equal((await store()).progress.records[slidingWindowSteps[0].id].successes, 1, 'Rerunning does not double-credit the same visit')
  await next.click()
  await skip.waitFor()
  assert.equal((await store()).progress.records[slidingWindowSteps[1].id]?.successes ?? 0, 0)

  await page.getByRole('tab', { name: 'Python Basics', exact: true }).click()
  const basics = page.locator('#site-panel-python')
  const basicsEditor = basics.getByRole('region', { name: 'Code workspace', exact: true })
  const basicsSkip = basicsEditor.getByRole('button', { name: /^Skip exercise/ })
  await basicsSkip.waitFor()
  await basicsSkip.click()
  await basicsEditor.getByRole('button', { name: /^Skip exercise/ }).waitFor()
  assert.equal(Object.keys((await store()).progress.records).filter(id => id !== slidingWindowSteps[0].id).length, 0)
  await page.setViewportSize({ width: 390, height: 844 })
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  await basicsEditor.screenshot({ path: fileURLToPath(new URL('../.cache/editor-actions-mobile.png', import.meta.url)) })
  assert.deepEqual(errors, [])
  console.log('PASS: inline Skip/Run, whole-question skip without credit, failed/pass/edit transitions, no double credit, Next part reset, Basics skip and mobile layout.')
  await context.close()
} finally { await browser.close() }
