import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/live-proxy': {
        target: 'https://api.thaistock2d.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/live-proxy/, '/live'),
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: './src/tests/setup.ts',
  },
})
