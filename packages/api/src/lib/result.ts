// This file is a simple result type that is used to return a value or an error
// It is used to simplify the code and make it more readable
// Instead of adding a library I decided to implement it myself to show my understanding of the concept

type Ok<T> = {
  ok: true
  value: T
}

type Err<E> = {
  ok: false
  error: E
}

type Result<T, E> = Ok<T> | Err<E>

function ok(): Result<void, never>
function ok<T>(value: T): Result<T, never>

function ok<T>(value?: T): Result<T extends undefined ? void : T, never> {
  return {
    ok: true,
    value: (value === undefined ? undefined : value) as T extends undefined ? void : T,
  }
}

const err = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
})

export { err, ok, type Result }
