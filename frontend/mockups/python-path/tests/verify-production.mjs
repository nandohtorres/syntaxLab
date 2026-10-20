import { readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const base = process.env.SITE_BASE_URL ?? 'http://127.0.0.1:4316/'
const worker = readdirSync(new URL('../../../dist/assets/', import.meta.url)).find(name => /^python\.worker-.*\.js$/.test(name))
if (!worker) throw new Error('Build the production frontend before checking it.')
for (const [script, route] of [['site-browser.mjs', ''], ['browser.mjs', '#python'], ['interview-browser.mjs', '#interview']]) {
  const result = spawnSync(process.execPath, [fileURLToPath(new URL(script, import.meta.url))], {
    stdio: 'inherit',
    env: { ...process.env, SITE_BASE_URL: base, PRACTICE_BASE_URL: base + route, PYTHON_WORKER_URL: '/assets/' + worker },
  })
  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}
