import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
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
      '@': path.resolve(__dirname, './src'),
      '@practice': path.resolve(__dirname, './mockups/python-path'),
    },
  },
  server: {
    port: 3000,
  },
  build: {
    sourcemap: 'hidden',
  },
})
