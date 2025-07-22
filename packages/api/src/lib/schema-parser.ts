import z, { ZodDiscriminatedUnion, ZodEffects, ZodObject, ZodRawShape, ZodUnion } from 'zod'
import { err, ok, Result } from './result.js'

type AnySchema =
  | ZodObject<ZodRawShape>
  | ZodEffects<ZodObject<ZodRawShape>>
  | ZodUnion<[ZodObject<ZodRawShape>, ...ZodObject<ZodRawShape>[]]>
  | ZodDiscriminatedUnion<string, ZodObject<ZodRawShape>[]>

type InvalidJsonError = {
  type: 'invalid-json'
  message: string
  cause: unknown
}

type SchemaInvalidError = {
  type: 'schema-invalid'
  message: string
  issues: z.ZodIssue[]
}

type ParserError = InvalidJsonError | SchemaInvalidError

async function parseSchema<T extends AnySchema>(request: Request, schema: T): Promise<Result<z.infer<T>, ParserError>> {
  try {
    const body = (await request.json()) as T
    const result = schema.safeParse(body)

    if (!result.success) {
      return err({
        type: 'schema-invalid',
        message: result.error.message,
        issues: result.error.issues,
      })
    }

    return ok(result.data)
  } catch (error) {
    return err({
      type: 'invalid-json',
      message: error instanceof Error ? error.message : 'Unknown error',
      cause: error,
    })
  }
}

export { parseSchema }
