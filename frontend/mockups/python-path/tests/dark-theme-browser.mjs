import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'

const require = createRequire(import.meta.url)
const { chromium } = require(process.env.PLAYWRIGHT_PACKAGE ?? '@playwright/test')
const base = process.env.SAMPLE_BASE_URL ?? 'http://127.0.0.1:4319/'
const browser = await chromium.launch({ headless: true })
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto(`${base}#learn`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).waitFor()
  assert.equal(await page.locator('body').evaluate(element => getComputedStyle(element).backgroundColor), 'rgb(240, 244, 250)', 'Normal entry still starts light')
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click()
  await page.waitForFunction(() => getComputedStyle(document.body).backgroundColor === 'rgb(29, 32, 37)')
  for (const name of ['Python Basics', 'LeetCode Patterns', 'Learning Hub']) {
    const tab = page.getByRole('tab', { name, exact: true })
    assert.equal(await tab.evaluate(element => getComputedStyle(element).fontSize), '15px')
    assert.equal(await tab.evaluate(element => getComputedStyle(element).minHeight), '54px')
  }
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click()
  await page.getByRole('tab', { name: 'LeetCode Patterns', exact: true }).click()
  const panel = page.locator('#site-panel-practice')
  const editor = panel.locator('.monaco-editor').first()
  await editor.waitFor({ timeout: 65000 })
  await page.waitForFunction(() => [...document.querySelectorAll('#site-panel-practice button')].some(button => button.textContent.trim() === 'Run code' && !button.disabled), null, { timeout: 65000 })
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/release-light.png', import.meta.url)) })
  await page.getByRole('button', { name: 'Switch to dark mode', exact: true }).click()
  await panel.getByRole('button', { name: 'Use dark editor', exact: true }).click()
  await page.waitForFunction(() => getComputedStyle(document.querySelector('#site-panel-practice .monaco-editor')).backgroundColor === 'rgb(37, 42, 49)')
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/release-dark.png', import.meta.url)) })
  await page.getByRole('tab', { name: 'Python Basics', exact: true }).click()
  await page.locator('#site-panel-python .monaco-editor').waitFor({ timeout: 65000 })
  assert.equal(await page.locator('#site-panel-python').getByRole('button', { name: 'Use light editor', exact: true }).count(), 1, 'Editors share the selected dark palette')
  await page.setViewportSize({ width: 390, height: 844 })
  for (const name of ['Python Basics', 'LeetCode Patterns', 'Learning Hub']) {
    await page.getByRole('tab', { name, exact: true }).click()
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${name} fits a phone`)
  }
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/release-dark-mobile.png', import.meta.url)), fullPage: true })
  await page.getByRole('button', { name: 'Switch to light mode', exact: true }).click()
  await page.waitForFunction(() => getComputedStyle(document.body).backgroundColor === 'rgb(240, 244, 250)')
  assert.deepEqual(errors, [])
  await context.close()
  console.log('PASS: normal light entry, Graphite without query parameters, tab styles, shared editor palette, all three mobile sections and light-mode recovery.')
} finally { await browser.close() }
