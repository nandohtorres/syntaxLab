import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = dirname(fileURLToPath(import.meta.url))
const frontend = resolve(root, '../..')
const dependencies = [
  resolve(frontend, 'node_modules'),
  resolve(frontend, '../../synlab/frontend/node_modules'),
].find(path => existsSync(resolve(path, 'vite/package.json')))

if (!dependencies) throw new Error('Install the existing frontend dependencies first.')

export default {
  root,
  cacheDir: resolve(root, '.cache/vite-preview'),
  optimizeDeps: {
    exclude: ['monaco-editor'],
    include: [
      'react', 'react-dom/client', '@mui/material', '@monaco-editor/react',
      ...['TerminalRounded', 'ArrowForwardRounded', 'PlayArrowRounded',
        'RestartAltRounded', 'LightbulbOutlined', 'CheckRounded',
        'ChevronRightRounded', 'CodeRounded', 'StopRounded']
        .map(name => `@mui/icons-material/${name}`),
    ],
  },
  resolve: {
    alias: Object.fromEntries([
      'react', 'react-dom', '@mui/material', '@mui/icons-material',
      '@emotion/react', '@emotion/styled', '@monaco-editor/react', 'monaco-editor',
    ].map(name => [name, resolve(dependencies, name)])),
  },
  server: {
    host: '127.0.0.1',
    port: 4315,
    strictPort: true,
    fs: { allow: [root, dependencies, resolve(root, '../../../docs')] },
  },
  build: { outDir: 'dist', target: 'es2022' },
}
