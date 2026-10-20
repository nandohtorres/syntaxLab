import { createRequire } from 'node:module'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import assert from 'node:assert/strict'
const require = createRequire(import.meta.url)
const { chromium, expect } = require(process.env.PLAYWRIGHT_PACKAGE ?? 'C:/Users/ferna/cursor projects/side-projects/archibrief-cleanup-codex/frontend/node_modules/@playwright/test')
const questions = JSON.parse(readFileSync(new URL('../../../../backend/src/main/resources/questions.json', import.meta.url)))
const base = process.env.SITE_BASE_URL ?? 'http://127.0.0.1:4316/'
const browser = await chromium.launch({ headless: true })
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1060 } })
  const errors = [], assetsFailed = [], apiRequests = [], cdn = []
  page.on('pageerror', error => errors.push(error.message))
  page.on('response', response => { if (response.url().includes('/assets/') && !response.ok()) assetsFailed.push(response.url()) })
  page.on('request', request => { if (request.url().includes('/api/questions')) apiRequests.push(request.url()); if (request.url().includes('jsdelivr.net')) cdn.push(request.url()) })
  await page.route('**/api/questions', route => route.fulfill({ json: questions, headers: { 'access-control-allow-origin': '*' } }))
  await page.goto(base + '#interview', { waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Understand it. Explain it. Repeat it.' }).waitFor()
  assert.deepEqual(apiRequests, [], 'Interview direct link must not fetch the question API')
  assert.deepEqual(cdn, [], 'Interview direct link must not load Pyodide')
  await page.getByRole('button', { name: 'Start practice', exact: true }).click()
  async function write(text) {
    await page.locator('.monaco-editor:visible').first().click()
    await page.keyboard.press('ControlOrMeta+A')
    await page.keyboard.insertText(text)
  }
  await write('PHP runs on the server; the browser renders the HTML.')
  await expect(page.getByRole('button', { name: 'Check my recall', exact: true })).toBeEnabled()
  await page.getByRole('tab', { name: 'Python Path', exact: true }).click()
  await page.getByRole('heading', { name: 'Give a value a name.' }).waitFor()
  await page.getByText('Python ready', { exact: true }).waitFor({ timeout: 65000 })
  await write('retries = 3')
  await page.getByRole('button', { name: 'Run code', exact: true }).click()
  await page.getByText('That works. Nice rep.', { exact: true }).waitFor()
  await page.getByRole('tab', { name: 'Interview prep', exact: true }).click()
  await page.getByRole('heading', { name: 'Understand it. Explain it. Repeat it.' }).waitFor()
  await expect.poll(async () => (await page.locator('.monaco-editor:visible .view-lines').innerText()).replace(/\u00a0/g, ' ')).toContain('PHP runs on the server')
  await page.getByRole('tab', { name: 'Original practice', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Run', exact: true })).toBeEnabled({ timeout: 65000 })
  assert.ok(apiRequests.length > 0)
  const first = [...questions].sort((a, b) => a.order - b.order)[0]
  await write(first.starterCode + '\n' + first.answer)
  await expect.poll(async () => (await page.locator('.monaco-editor:visible .view-lines').innerText()).replace(/\u00a0/g, ' ')).toContain(first.answer.split('\n')[0])
  await page.getByRole('button', { name: 'Run', exact: true }).click()
  await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('synlab_progress') ?? '{}'))).toHaveProperty(String(first.id), true)
  await page.getByRole('tab', { name: 'Python Path', exact: true }).click()
  await page.getByText('That works. Nice rep.', { exact: true }).waitFor()
  await page.reload({ waitUntil: 'networkidle' })
  await page.getByRole('heading', { name: 'Give a value a name.' }).waitFor()
  await page.getByText('Python ready', { exact: true }).waitFor({ timeout: 65000 })
  assert.equal(await page.evaluate(id => JSON.parse(localStorage.getItem('synlab_progress'))[id], first.id), true)
  await page.setViewportSize({ width: 390, height: 844 })
  for (const name of ['Interview prep', 'Python Path', 'Original practice']) {
    await page.getByRole('tab', { name, exact: true }).click()
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true)
  }
  await page.screenshot({ path: fileURLToPath(new URL('../.cache/site-mobile.png', import.meta.url)), fullPage: true })
  const offline = await browser.newPage()
  await offline.route('**/api/questions', route => route.abort())
  await offline.goto(base, { waitUntil: 'networkidle' })
  await offline.getByRole('tab', { name: 'Interview prep', exact: true }).click()
  await offline.getByRole('heading', { name: 'Understand it. Explain it. Repeat it.' }).waitFor()
  await offline.close()
  assert.deepEqual(errors, [])
  assert.deepEqual(assetsFailed, [])
  console.log('PASS: production navigation/direct links, lazy API/runtime loading, original and new Python execution, draft retention across tabs, reload, isolated progress, mobile navigation and API-failure escape.')
} finally { await browser.close() }
