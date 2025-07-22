type Ok<T> = {
  ok: true
  value: T
}

type Err<E> = {
  ok: false
  error: E
}

export type Result<T, E> = Ok<T> | Err<E>

export function ok(): Result<void, never>
export function ok<T>(value: T): Result<T, never>

export function ok<T>(value?: T): Result<T extends undefined ? void : T, never> {
  return {
    ok: true,
    value: (value === undefined ? undefined : value) as T extends undefined ? void : T,
  }
}

export const err = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
})
