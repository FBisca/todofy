import react from '@vitejs/plugin-react'
import { loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true, // This is needed by @testing-library to be cleaned up after each test
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    coverage: {
      include: ['src/**/*'],
      exclude: ['src/**/*.stories.{js,jsx,ts,tsx}', '**/*.d.ts'],
      reporter: ['html'],
    },
    environmentMatchGlobs: [
      ['**/*.{test,spec}.tsx', 'jsdom'],
      ['**/*.{test,spec}.ts', 'jsdom'],
    ],
    setupFiles: ['./vitest-setup.tsx'],
    env: loadEnv('', process.cwd(), ''),
  },
})
