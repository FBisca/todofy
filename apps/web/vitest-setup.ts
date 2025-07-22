import '@testing-library/jest-dom/vitest'

import { vi } from 'vitest'
import failOnConsole from 'vitest-fail-on-console'

failOnConsole({
  shouldFailOnDebug: true,
  shouldFailOnError: true,
  shouldFailOnInfo: true,
  shouldFailOnLog: false,
  shouldFailOnWarn: true,
})

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
const testCache = <T extends Function>(func: T) => func

vi.mock('react', async () => {
  const originalModule = await vi.importActual('react')
  return {
    ...originalModule,
    cache: testCache,
  }
})

vi.mock('server-only', () => {
  return {
    // mock server-only module
  }
})
