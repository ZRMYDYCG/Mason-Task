import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { defineConfig as defineVitestConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  ...defineVitestConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      coverage: {
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: ['**/node_modules/**', '**/__tests__/**', '**/*.types.ts'],
        thresholds: {
          lines: 80,
          functions: 80,
          branches: 80,
        },
      },
    },
  }),
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
