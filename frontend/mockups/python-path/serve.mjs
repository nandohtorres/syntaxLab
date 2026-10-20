import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const frontend = resolve(root, '../..')
const cli = [
  resolve(frontend, 'node_modules/vite/bin/vite.js'),
  resolve(frontend, '../../synlab/frontend/node_modules/vite/bin/vite.js'),
].find(existsSync)
if (!cli) throw new Error('Install the existing frontend dependencies first.')

const child = spawn(process.execPath, [
  cli, '--config', resolve(root, 'vite.config.mjs'), '--configLoader', 'runner',
  ...process.argv.slice(2),
], { cwd: root, stdio: 'inherit' })
child.on('exit', code => { process.exitCode = code ?? 1 })
