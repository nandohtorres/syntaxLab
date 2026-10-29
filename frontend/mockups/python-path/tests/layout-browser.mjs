import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE ?? '@playwright/test')
const base = process.env.LAYOUT_BASE_URL ?? 'http://127.0.0.1:4318/'
const questions = JSON.parse(readFileSync(new URL('../../../../backend/src/main/resources/questions.json', import.meta.url), 'utf8')).sort((a, b) => a.order - b.order)
const browser = await chromium.launch({ headless: true })
try {
  for (const layout of ['island', 'flow']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    const page = await context.newPage()
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    async function section(name, id) {
      await page.getByRole('tab', { name, exact: true }).click()
      await page.locator('#site-panel-' + id).waitFor({ state: 'visible' })
      await page.waitForTimeout(250)
    }
    async function capture(name, fullPage = false) {
      await page.screenshot({ path: fileURLToPath(new URL(`../.cache/layout-${layout}-${name}.png`, import.meta.url)), fullPage })
    }
    async function write(panel, code) {
      await panel.locator('.monaco-editor').first().click()
      await page.keyboard.press('ControlOrMeta+A')
      await page.keyboard.insertText(code)
    }
    async function geometry(panel) {
      const instructions = await panel.getByRole('region', { name: 'Exercise instructions', exact: true }).boundingBox()
      const editor = await panel.getByRole('region', { name: 'Code workspace', exact: true }).boundingBox()
      if (layout === 'island') assert.ok(instructions.x + instructions.width <= editor.x + 1, 'Island instructions sit beside the editor')
      else assert.ok(instructions.y + instructions.height <= editor.y + 1 && Math.abs(instructions.x - editor.x) < 2, 'Open layout stacks prompt above editor')
      const run = await panel.getByRole('button', { name: 'Run code', exact: true }).boundingBox()
      assert.ok(run.width > 40 && run.height > 25)
      if (layout === 'island') assert.ok(run.y + run.height <= 1000, 'Island Run stays in the viewport')
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
    }
    await page.goto(`${base}?layout=${layout}#python`, { waitUntil: 'networkidle' })
    const basics = page.locator('#site-panel-python')
    await basics.getByText('Python ready', { exact: true }).waitFor({ timeout: 65000 })
    await basics.getByRole('heading', { name: 'Give a value a name.', exact: true }).waitFor()
    await geometry(basics)
    await capture('basics')
    await write(basics, 'retries = "3"')
    await basics.getByRole('button', { name: 'Run code', exact: true }).click()
    await basics.getByText('One more adjustment', { exact: true }).waitFor()
    await write(basics, 'retries = 3')
    await page.keyboard.press('ControlOrMeta+Enter')
    await basics.getByText('That works. Nice rep.', { exact: true }).waitFor()
    await page.keyboard.press('ControlOrMeta+Shift+Enter')
    await basics.getByRole('heading', { name: 'Make the output visible.', exact: true }).waitFor()
    await write(basics, 'print("draft for comparison")')

    await section('LeetCode Python', 'practice')
    const original = page.locator('#leetcode-syntax-panel')
    await original.getByRole('heading', { name: questions[0].title, exact: true }).waitFor()
    await page.waitForFunction(() => [...document.querySelectorAll('#leetcode-syntax-panel button')].some(button => button.textContent.trim() === 'Run code' && !button.disabled))
    await geometry(original)
    await capture('leetcode')
    await write(original, questions[0].starterCode + '\n' + questions[0].answer)
    await page.keyboard.press('ControlOrMeta+Enter')
    await page.waitForFunction(id => JSON.parse(localStorage.getItem('synlab_progress') ?? '{}')[id] === true, questions[0].id)
    await original.getByRole('button', { name: /^Next rep/ }).click()
    await original.getByRole('heading', { name: questions[1].title, exact: true }).waitFor()
    await page.getByRole('tab', { name: '15 patterns & problems', exact: true }).click()
    const patterns = page.locator('#leetcode-patterns-panel')
    await patterns.getByRole('heading', { name: 'Count what you have seen.', exact: true }).waitFor()
    await patterns.getByText('Python ready', { exact: true }).waitFor({ timeout: 65000 })
    await patterns.getByRole('region', { name: 'Pattern guide', exact: true }).waitFor()
    await geometry(patterns)
    await capture('patterns')

    await section('Interview prep', 'interview')
    await page.getByRole('heading', { name: 'Software engineering interview reference', exact: true }).waitFor()
    assert.ok(await page.evaluate(() => document.documentElement.scrollHeight > innerHeight + 500), 'Interview remains a scrolling reference')
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight))
    await page.getByText('Technical corrections & scope notes', { exact: true }).scrollIntoViewIfNeeded()
    await page.evaluate(() => window.scrollTo(0, 0))
    await capture('interview')
    await page.getByLabel('Search interview topics').fill('SQL joins')
    await page.getByRole('heading', { name: 'Join rows without losing the unmatched ones', exact: true }).waitFor()
    await page.getByRole('button', { name: 'Clear filters', exact: true }).click()

    for (const viewport of [{ width: 390, height: 844 }, { width: 1280, height: 720 }, { width: 1280, height: 500 }]) {
      await page.setViewportSize(viewport)
      for (const [name, id] of [['Python Basics', 'python'], ['Interview prep', 'interview'], ['LeetCode Python', 'practice']]) {
        await section(name, id)
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${layout}/${id}/${viewport.width}`)
      }
      if (viewport.width === 390) {
        await section('Python Basics', 'python')
        await capture('mobile-basics', true)
        await section('Interview prep', 'interview')
        await capture('mobile-interview')
      }
    }
    await page.setViewportSize({ width: 1440, height: 1000 })
    await section('Python Basics', 'python')
    await basics.getByRole('heading', { name: 'Make the output visible.', exact: true }).waitFor()
    const target = layout === 'island' ? 'flow' : 'island'
    await page.getByRole('link', { name: target === 'island' ? 'A - Floating island' : 'B - Open practice', exact: true }).click()
    await page.locator(`[data-layout-demo="${target}"]`).waitFor()
    await page.locator('#site-panel-python').getByRole('heading', { name: 'Make the output visible.', exact: true }).waitFor()
    await page.waitForFunction(() => document.querySelector('#site-panel-python .monaco-editor')?.innerText.replace(/\u00a0/g, ' ').includes('draft for comparison'))
    assert.equal(await page.evaluate(() => JSON.parse(localStorage.getItem('synlab_python_path_v1')).drafts.print['main.py']), 'print("draft for comparison")')
    assert.equal(new URL(page.url()).hash, '#python')
    assert.deepEqual(errors, [])
    console.log(`PASS ${layout}: consistent Basics/original/pattern layouts, execution and keyboard Next, scrollable reference, mobile/short screens, and switching designs with retained work`)
    await context.close()
  }
} finally { await browser.close() }
