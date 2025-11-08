import { z } from 'zod'

/**
 * ユーザー関連のエラータイプ
 */
export const UserErrorTypes = {
  INVALID_NAME_LENGTH: 'INVALID_NAME_LENGTH',
  INVALID_EMAIL_FORMAT: 'INVALID_EMAIL_FORMAT',
  PROVIDER_TYPE_MISMATCH: 'PROVIDER_TYPE_MISMATCH',
  USER_NOT_FOUND: 'USER_NOT_FOUND'
} as const

/**
 * ユーザー関連のエラー定義（サーバー側で使用）
 */
export const USER_ERRORS = {
  INVALID_NAME_LENGTH: {
    type: UserErrorTypes.INVALID_NAME_LENGTH,
    message: 'ユーザー名は1文字以上50文字以下である必要があります',
    statusCode: 400,
    errorCode: 1000
  },
  INVALID_EMAIL_FORMAT: {
    type: UserErrorTypes.INVALID_EMAIL_FORMAT,
    message: 'メールアドレスの形式が正しくありません',
    statusCode: 400,
    errorCode: 1001
  },
  PROVIDER_TYPE_MISMATCH: {
    type: UserErrorTypes.PROVIDER_TYPE_MISMATCH,
    message: 'プロバイダータイプは変更できません',
    statusCode: 400,
    errorCode: 1002
  },
  USER_NOT_FOUND: {
    type: UserErrorTypes.USER_NOT_FOUND,
    message: 'ユーザーが見つかりません',
    statusCode: 404,
    errorCode: 1003
  }
} as const

/**
 * ユーザーエラーのZodスキーマ（バリデーション用）
 */
export const UserErrorSchema = z.object({
  type: z.enum([
    UserErrorTypes.INVALID_NAME_LENGTH,
    UserErrorTypes.INVALID_EMAIL_FORMAT,
    UserErrorTypes.PROVIDER_TYPE_MISMATCH,
    UserErrorTypes.USER_NOT_FOUND
  ]),
  message: z.string(),
  statusCode: z.number(),
  errorCode: z.number()
})

/**
 * ユーザーエラーの型
 */
export type UserError = z.infer<typeof UserErrorSchema>

