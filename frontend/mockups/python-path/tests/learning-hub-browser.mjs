import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
import { pythonTopics } from '../learning/pythonGuide.js'
import { patternModules } from '../content/catalog.js'
import { patternLearningOrder } from '../content/learningPath.js'
import { patternGuide } from '../content/patternGuide.js'
import { STORAGE_KEY } from '../progress.js'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE ?? '@playwright/test')
const base = process.env.SAMPLE_BASE_URL ?? 'http://127.0.0.1:4319/'
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, permissions: ['clipboard-read', 'clipboard-write'] })
  await context.addInitScript(() => { if (!localStorage.getItem('synlab_interview_recall_v1')) localStorage.setItem('synlab_interview_recall_v1', 'KEEP-INTERVIEW-ANSWERS') })
  const page = await context.newPage()
  const errors = [], requests = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('request', request => requests.push(request.url()))
  await page.goto(`${base}?sample=sliding-window#learn`, { waitUntil: 'networkidle' })
  const hub = page.locator('#site-panel-learn')
  await hub.getByRole('heading', { name: 'Learning Python', exact: true }).waitFor()
  assert.equal(await hub.getByText('Read · understand · try it', { exact: true }).count(), 0)
  const sourceLink = hub.getByRole('link', { name: "Based on Python's official documentation", exact: true })
  assert.equal(await sourceLink.count(), 1)
  const headingBounds = await hub.getByRole('heading', { name: 'Learning Python', exact: true }).boundingBox()
  const sourceBounds = await sourceLink.boundingBox()
  assert.ok(sourceBounds.x > headingBounds.x + headingBounds.width && sourceBounds.y < headingBounds.y + headingBounds.height, 'Documentation credit sits beside the title on desktop')
  await hub.getByRole('heading', { name: 'Leetcode Pattern Breakdowns', exact: true }).waitFor()
  assert.equal(await hub.getByRole('region', { name: 'A few Python fun facts', exact: true }).getByRole('listitem').count(), 4)
  assert.equal(requests.filter(url => /api\/questions|pyodide|python\.worker|editor\.worker/.test(url)).length, 0, 'Reading Hub does not start the coding runtime')
  assert.equal(await page.getByRole('heading', { name: 'Software engineering interview reference', exact: true }).count(), 0)
  const lesson = hub.getByRole('article', { name: 'Python lesson', exact: true })
  const topics = hub.getByRole('navigation', { name: 'Python topics', exact: true })
  for (const item of pythonTopics) {
    await topics.getByRole('button').nth(pythonTopics.indexOf(item)).click()
    await lesson.getByRole('heading', { name: item.title, exact: true }).waitFor()
    assert.equal((await lesson.locator('pre').first().innerText()).trim(), item.code.trim())
    assert.equal((await lesson.locator('pre').nth(1).innerText()).trim(), item.output.trim())
    assert.equal(await lesson.getByRole('link', { name: /Python documentation/ }).getAttribute('href'), item.source)
    const left = await topics.boundingBox(), right = await lesson.boundingBox()
    assert.ok(Math.abs(left.y - right.y) < 2 && Math.abs(left.height - right.height) < 2, `${item.id}: topic and lesson cards align at both edges`)
  }
  assert.equal(await lesson.getByRole('button', { name: /Next topic/ }).isDisabled(), true)
  await topics.getByRole('button').first().click()
  await lesson.getByRole('button', { name: /Next topic/ }).click()
  await lesson.getByRole('heading', { name: pythonTopics[1].title, exact: true }).waitFor()
  await lesson.getByRole('button', { name: 'Previous topic', exact: true }).click()
  await lesson.getByRole('heading', { name: pythonTopics[0].title, exact: true }).waitFor()
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/learning-hub-desktop.png', import.meta.url)) })

  const patternSelect = hub.getByRole('combobox', { name: /Choose a pattern/ })
  for (const [index, id] of patternLearningOrder.entries()) {
    await patternSelect.click()
    await page.getByRole('option', { name: `${index + 1}. ${patternModules.find(item => item.id === id).title}`, exact: true }).click()
    await hub.getByRole('heading', { name: patternGuide[id][0], exact: true }).waitFor()
    const picture = hub.getByRole('region', { name: 'Pattern illustration', exact: true })
    assert.ok((await picture.innerText()).trim().length > 10, `${id} has a visible explanation/diagram`)
    const walkthrough = hub.getByRole('region', { name: 'Worked pattern example', exact: true })
    assert.equal(await walkthrough.getByRole('listitem').count(), 3)
    if (id === 'P06') {
      await picture.getByRole('button', { name: 'Next move', exact: true }).click()
      await picture.getByText(/window ab is still unique/).waitFor()
      await picture.screenshot({ path: fileURLToPath(new URL('../.cache/learning-hub-window.png', import.meta.url)) })
      await hub.locator('#hub-patterns').screenshot({ path: fileURLToPath(new URL('../.cache/learning-hub-pattern-breakdown.png', import.meta.url)) })
    }
  }
  await hub.getByRole('button', { name: 'Python quirks', exact: true }).click()
  await hub.getByRole('heading', { name: 'Python Quirks', exact: true }).waitFor()
  assert.ok(page.url().endsWith('#learn'), 'In-page navigation keeps the site section selected')
  assert.equal(await page.evaluate(() => localStorage.getItem('synlab_interview_recall_v1')), 'KEEP-INTERVIEW-ANSWERS')
  await page.setViewportSize({ width: 390, height: 844 })
  const topicSelect = hub.getByRole('combobox', { name: /Choose a Python topic/ })
  await topicSelect.click()
  await page.getByRole('option', { name: '12. Write a function', exact: true }).click()
  await page.getByRole('listbox').waitFor({ state: 'hidden' })
  // Let the portal exit transition finish before capturing a full-page image.
  await page.waitForTimeout(350)
  await lesson.getByRole('heading', { name: 'Write a function', exact: true }).waitFor()
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  for (const [index, id] of patternLearningOrder.entries()) {
    await patternSelect.click()
    await page.getByRole('option', { name: `${index + 1}. ${patternModules.find(item => item.id === id).title}`, exact: true }).click()
    await page.getByRole('listbox').waitFor({ state: 'hidden' })
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${id} fits a phone screen`)
  }
  await page.waitForTimeout(350)
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/learning-hub-mobile.png', import.meta.url)), fullPage: true })
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click()
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/learning-hub-dark.png', import.meta.url)) })
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click()

  // Reading the guide must not replace practice drafts owned by the shared store.
  await page.getByRole('tab', { name: 'Python Basics', exact: true }).click()
  const basics = page.locator('#site-panel-python')
  await basics.locator('.monaco-editor').waitFor({ timeout: 65000 })
  assert.equal(await basics.getByRole('heading', { name: 'Python Basics', exact: true }).count(), 0)
  assert.equal(await basics.getByText(/this session|Ctrl\/Cmd/).count(), 0)
  const questionList = basics.getByRole('region', { name: 'Full questions list', exact: true })
  await questionList.getByText('Questions', { exact: false }).waitFor()
  await questionList.getByText(/\d+\/98 practiced/).waitFor()
  assert.equal(await basics.getByText(/grouped by respective pattern/).count(), 0)
  await page.getByRole('tab', { name: 'LeetCode Patterns', exact: true }).click()
  const practice = page.locator('#site-panel-practice')
  await practice.locator('.monaco-editor').waitFor({ timeout: 65000 })
  const code = 'def add_character(counts, char):\n    # preserved draft\n    pass'
  await practice.locator('.monaco-editor').click()
  await page.keyboard.press('ControlOrMeta+A')
  await page.evaluate(value => navigator.clipboard.writeText(value), code)
  await page.keyboard.press('ControlOrMeta+V')
  await page.waitForFunction(({ key, code }) => JSON.parse(localStorage.getItem(key) ?? '{}').drafts?.['sw-count-character']?.['main.py']?.trim() === code.trim(), { key: STORAGE_KEY, code })
  const before = await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY)
  await page.getByRole('tab', { name: 'Learning Hub', exact: true }).click()
  await lesson.getByRole('heading', { name: 'Write a function', exact: true }).waitFor()
  assert.equal(await page.evaluate(key => localStorage.getItem(key), STORAGE_KEY), before)
  await page.goto(`${base}?sample=sliding-window#interview`, { waitUntil: 'networkidle' })
  await page.locator('#site-panel-learn').getByRole('heading', { name: 'Learning Python', exact: true }).waitFor()
  assert.equal(await page.evaluate(() => localStorage.getItem('synlab_interview_recall_v1')), 'KEEP-INTERVIEW-ANSWERS')
  assert.deepEqual(errors, [])
  await context.close()
  console.log('PASS: 21 guide topics/code outputs, all 15 pattern visuals, interactive window, mobile selectors, in-page navigation, themes, cold loading without coding downloads, preserved practice/interview data and legacy-link alias.')
} finally { await browser.close() }
