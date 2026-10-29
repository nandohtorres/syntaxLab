import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'node:url'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    sentryVitePlugin({
      org: 'fernandotorresproject',
      project: 'syntaxlab',
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@practice': fileURLToPath(new URL('./mockups/python-path', import.meta.url)),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    sourcemap: 'hidden',
  },
})
