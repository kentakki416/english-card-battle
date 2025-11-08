import { z } from 'zod'

/**
 * サーバー関連のエラータイプ
 */
export const ServerErrorTypes = {
  DATABASE_ERROR: 'DATABASE_ERROR',
  SERVER_ERROR: 'SERVER_ERROR'
} as const

/**
 * サーバー関連のエラー定義（サーバー側で使用）
 */
export const SERVER_ERRORS = {
  DATABASE_ERROR: {
    type: ServerErrorTypes.DATABASE_ERROR,
    message: 'データベースでエラーが発生しました',
    statusCode: 500,
    errorCode: 100
  },
  SERVER_ERROR: {
    type: ServerErrorTypes.SERVER_ERROR,
    message: 'サーバーでエラーが発生しました',
    statusCode: 500,
    errorCode: 101
  }
} as const

/**
 * サーバーエラーのZodスキーマ（バリデーション用）
 */
export const ServerErrorSchema = z.object({
  type: z.enum([
    ServerErrorTypes.DATABASE_ERROR,
    ServerErrorTypes.SERVER_ERROR
  ]),
  message: z.string(),
  statusCode: z.number(),
  errorCode: z.number()
})

/**
 * サーバーエラーの型
 */
export type ServerError = z.infer<typeof ServerErrorSchema>

