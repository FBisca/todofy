import { loadEnv } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    include: ['**/*.{test,spec}.{js,ts}'],
    coverage: {
      include: ['src/**/*'],
      exclude: ['**/*.d.ts'],
      reporter: ['html'],
    },
    env: loadEnv('', process.cwd(), ''),
  },
})
