import { err, ok, Result } from '@repo/api/lib/result'
import z, { ZodDiscriminatedUnion, ZodEffects, ZodObject, ZodRawShape, ZodUnion } from 'zod'

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

/**
 * This function is used to parse the request body and return a result
 * it takes the advantage of the zod library to validate the request body
 * and return an inferred type result object with the parsed data or an error
 *
 * @param request - The request object
 * @param schema - The schema to parse the request body against
 * @returns A result object with the parsed data or an error
 */
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
