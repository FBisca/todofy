import { describe, expect, test, vi } from 'vitest'
import { z } from 'zod'
import { parseSchema, parseSchemaQuery } from '../schema-parser.js'

function createRequest(body: () => Promise<unknown>) {
  const req = new Request('http://localhost', { method: 'POST' })
  vi.spyOn(req, 'json').mockImplementation(body)
  return req
}

describe('parseSchema', () => {
  const schema = z.object({ name: z.string(), age: z.number() })

  test('parses valid JSON and schema', async () => {
    const req = createRequest(async () => ({ name: 'Alice', age: 30 }))
    const result = await parseSchema(req, schema)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual({ name: 'Alice', age: 30 })
    }
  })

  test('returns schema-invalid for invalid schema', async () => {
    const req = createRequest(async () => ({ name: 'Alice', age: 'not-a-number' }))
    const result = await parseSchema(req, schema)

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

    const result = await parseSchema(req, schema)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('invalid-json')
      expect(result.error.message).toBe('Invalid JSON')
    }
  })
})

describe('parseSchemaQuery', () => {
  const schema = z.object({ name: z.string(), age: z.coerce.number() })

  test('parses valid query params', () => {
    const params = new URLSearchParams({ name: 'Bob', age: '42' })
    const result = parseSchemaQuery(params, schema)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual({ name: 'Bob', age: 42 })
    }
  })

  test('returns schema-invalid for invalid query param', () => {
    const params = new URLSearchParams({ name: 'Bob', age: 'not-a-number' })
    const result = parseSchemaQuery(params, schema)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('schema-invalid')
      if (result.error.type === 'schema-invalid') {
        expect(result.error.issues.length).toBeGreaterThan(0)
      }
    }
  })

  test('returns schema-invalid for missing required param', () => {
    const params = new URLSearchParams({ age: '30' })
    const result = parseSchemaQuery(params, schema)

    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.error.type).toBe('schema-invalid')
    }
  })

  test('parses with optional field', () => {
    const optSchema = z.object({ name: z.string().optional(), age: z.coerce.number() })
    const params = new URLSearchParams({ age: '55' })
    const result = parseSchemaQuery(params, optSchema)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual({ age: 55 })
    }
  })

  test('parses should retain types', () => {
    const optSchema = z.object({ name: z.string(), age: z.coerce.number() })
    const params = new URLSearchParams({ name: 'John', age: '55' })
    const result = parseSchemaQuery(params, optSchema)

    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.value).toEqual({ name: 'John', age: 55 })
      expect(typeof result.value.age).toBe('number')
      expect(typeof result.value.name).toBe('string')
    }
  })
})
