import { z } from 'zod'

/**
 * Google認証関連のエラータイプ
 */
export const GoogleAuthErrorTypes = {
  INVALID_TOKEN: 'INVALID_TOKEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  NETWORK_ERROR: 'NETWORK_ERROR',
  GOOGLE_SERVER_ERROR: 'GOOGLE_SERVER_ERROR'
} as const

/**
 * Google認証関連のエラー定義（サーバー側で使用）
 */
export const GOOGLE_AUTH_ERRORS = {
  INVALID_TOKEN: {
    type: GoogleAuthErrorTypes.INVALID_TOKEN,
    message: '無効なトークンです',
    statusCode: 401,
    errorCode: 3000
  },
  TOKEN_EXPIRED: {
    type: GoogleAuthErrorTypes.TOKEN_EXPIRED,
    message: 'トークンの有効期限が切れています',
    statusCode: 401,
    errorCode: 3001
  },
  NETWORK_ERROR: {
    type: GoogleAuthErrorTypes.NETWORK_ERROR,
    message: 'Googleサーバーとの通信エラーが発生しました',
    statusCode: 500,
    errorCode: 3002
  },
  GOOGLE_SERVER_ERROR: {
    type: GoogleAuthErrorTypes.GOOGLE_SERVER_ERROR,
    message: 'Googleサーバーでエラーが発生しました',
    statusCode: 500,
    errorCode: 3003
  }
} as const

/**
 * Google認証エラーのZodスキーマ（バリデーション用）
 */
export const GoogleAuthErrorSchema = z.object({
  type: z.enum([
    GoogleAuthErrorTypes.INVALID_TOKEN,
    GoogleAuthErrorTypes.TOKEN_EXPIRED,
    GoogleAuthErrorTypes.NETWORK_ERROR,
    GoogleAuthErrorTypes.GOOGLE_SERVER_ERROR
  ]),
  message: z.string(),
  statusCode: z.number(),
  errorCode: z.number()
})

/**
 * Google認証エラーの型
 */
export type GoogleAuthError = z.infer<typeof GoogleAuthErrorSchema>

