/**
 * プロジェクト共通のResult型
 */
export type Result<T, E = Error> = Success<T> | Failure<E>

/**
 * 成功時のResult
 */
export class Success<T> {
  readonly _tag = 'Success' as const

  constructor(readonly value: T) {}

  isSuccess(): this is Success<T> {
    return true
  }

  isFailure(): this is Failure<never> {
    return false
  }
}

/**
 * 失敗時のResult
 */
export class Failure<E> {
  readonly _tag = 'Failure' as const

  constructor(readonly error: E) {}

  isSuccess(): this is Success<never> {
    return false
  }

  isFailure(): this is Failure<E> {
    return true
  }
}
