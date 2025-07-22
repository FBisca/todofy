import { describe, expect, test, vi } from 'vitest'
import { z } from 'zod'
import { json } from '../schema-parser.js'

function createRequest(body: () => Promise<unknown>) {
  const req = new Request('http://localhost', { method: 'POST' })
  vi.spyOn(req, 'json').mockImplementation(body)
  return req
}

describe('schema-parser', () => {
  const schema = z.object({ name: z.string(), age: z.number() })

  test('parses valid JSON and schema', async () => {
    const req = createRequest(async () => ({ name: 'Alice', age: 30 }))
    const result = await json(req, schema)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual({ name: 'Alice', age: 30 })
    }
  })

  test('returns schema-invalid for invalid schema', async () => {
    const req = createRequest(async () => ({ name: 'Alice', age: 'not-a-number' }))
    const result = await json(req, schema)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('schema-invalid')
      if (result.error.type === 'schema-invalid') {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    }
  })

  test('returns invalid-json for invalid JSON', async () => {
    const req = createRequest(async () => {
      throw new Error('Invalid JSON')
    })

    const result = await json(req, schema)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('invalid-json')
      expect(result.error.message).toBe('Invalid JSON')
    }
  })
})
