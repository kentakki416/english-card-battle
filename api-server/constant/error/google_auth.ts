/**
 * Google認証関連のエラー定義
 */
export const GOOGLE_AUTH_ERRORS = {
  INVALID_TOKEN: {
    type: 'INVALID_TOKEN' as const,
    message: '無効なトークンです',
    statusCode: 401,
    errorCode: 3000
  },
  TOKEN_EXPIRED: {
    type: 'TOKEN_EXPIRED' as const,
    message: 'トークンの有効期限が切れています',
    statusCode: 401,
    errorCode: 3001
  },
  NETWORK_ERROR: {
    type: 'NETWORK_ERROR' as const,
    message: 'Googleサーバーとの通信エラーが発生しました',
    statusCode: 500,
    errorCode: 3002
  },
  GOOGLE_SERVER_ERROR: {
    type: 'GOOGLE_SERVER_ERROR' as const,
    message: 'Googleサーバーでエラーが発生しました',
    statusCode: 500,
    errorCode: 3003
  }
} as const
