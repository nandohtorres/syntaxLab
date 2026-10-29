import { createRequire } from 'node:module'
import assert from 'node:assert/strict'
import { blind75Questions, stepsForQuestion } from '../content/blind75Practice.js'
import { STORAGE_KEY } from '../progress.js'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE ?? '@playwright/test')
const base = process.env.SAMPLE_BASE_URL ?? 'http://127.0.0.1:4319/'
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await context.newPage()
  await page.goto(base, { waitUntil: 'networkidle' })
  const panel = page.locator('#site-panel-practice')
  const library = panel.getByRole('region', { name: 'Full questions list', exact: true })
  const editor = panel.getByRole('region', { name: 'Code workspace', exact: true })
  const prompt = panel.getByRole('region', { name: 'Exercise instructions', exact: true })
  const run = editor.getByRole('button', { name: 'Run code', exact: true })
  async function ready() {
    await page.waitForFunction(() => [...document.querySelectorAll('#site-panel-practice button')].some(button => button.textContent.trim() === 'Run code' && !button.disabled), null, { timeout: 90000 })
  }
  async function write(code) {
    await editor.locator('.monaco-editor').click()
    await page.keyboard.press('ControlOrMeta+A')
    await page.evaluate(value => navigator.clipboard.writeText(value), code)
    await page.keyboard.press('ControlOrMeta+V')
  }
  async function pass(exercise) {
    await write(exercise.solutionFiles['main.py'])
    await run.click()
    await panel.getByText('That works. Nice rep.', { exact: true }).waitFor()
  }
  await ready()
  const first = blind75Questions[0], parts = stepsForQuestion(first.problemId)
  await pass(parts[0])
  await library.getByText('0/75 practiced', { exact: true }).waitFor()
  await editor.getByRole('button', { name: /^Next part/ }).click()
  await pass(parts.at(-1))
  await library.getByText('1/75 practiced', { exact: true }).waitFor()
  await editor.getByRole('button', { name: /^Next question/ }).click()
  await editor.getByRole('button', { name: /^Skip question/ }).click()
  await library.getByText('1/75 practiced', { exact: true }).waitFor()
  await page.waitForFunction(({ key, id }) => JSON.parse(localStorage.getItem(key) ?? '{}').progress?.records?.[id]?.successes === 1, { key: STORAGE_KEY, id: first.id })
  await page.reload({ waitUntil: 'networkidle' })
  await library.getByText('1/75 practiced', { exact: true }).waitFor()
  await ready()
  await write('while True:\n    pass')
  await run.click()
  await editor.getByRole('button', { name: 'Stop', exact: true }).click()
  await panel.getByText('Run stopped', { exact: true }).waitFor()
  await ready()
  assert.equal(await page.evaluate(key => JSON.parse(localStorage.getItem(key)).progress.attempts.length, STORAGE_KEY), 2)

  for (const id of [424, 76]) {
    const question = blind75Questions.find(item => item.problemId === id)
    const button = library.locator('.question-item').filter({ hasText: `${id}. ${question.title}` })
    if (!await button.isVisible()) await library.getByRole('button', { name: /Sliding Window/ }).click()
    await button.click()
    const visual = prompt.getByRole('region', { name: 'Visual example', exact: true })
    const status = visual.getByRole('status')
    if (id === 76) {
      assert.match(await status.innerText(), /Incomplete coverage/)
      assert.doesNotMatch(await status.innerText(), /Invalid.*shrink/)
    }
    for (let step = 0; step < 3; step++) await visual.getByRole('button', { name: 'Next move', exact: true }).click()
    assert.match(await status.innerText(), id === 76 ? /Coverage complete/ : /Invalid.*shrink/)
  }
  await context.close()
  console.log('PASS: warm-up earns no question credit, full task earns one, Next/Skip/reload preserve counts, Stop recovers without an attempt, and replacement/coverage visuals give the right action.')
} finally { await browser.close() }
