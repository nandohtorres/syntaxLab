import { copyFileSync, mkdirSync, readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const frontend = fileURLToPath(new URL('../', import.meta.url))
const output = path.join(frontend, 'mockups/python-path/.cache', process.argv.includes('--sample') ? 'sliding-window-sample' : 'layout-demos')
const relative = path.relative(frontend, output)
if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Preview output must stay in the frontend workspace')
const result = spawnSync(process.execPath, [path.join(frontend, 'node_modules/vite/bin/vite.js'), 'build', '--outDir', output], { cwd: frontend, stdio: 'inherit', windowsHide: true })
if (result.error) throw result.error
if (result.status !== 0) process.exit(result.status ?? 1)
const bank = fileURLToPath(new URL('../../backend/src/main/resources/questions.json', import.meta.url))
if (!Array.isArray(JSON.parse(readFileSync(bank, 'utf8')))) throw new Error('Expected the authored question array')
mkdirSync(output, { recursive: true })
copyFileSync(bank, path.join(output, 'layout-preview-questions.json'))
console.log('Built both local layouts with the unchanged authored question bank. Normal frontend/dist was preserved.')
