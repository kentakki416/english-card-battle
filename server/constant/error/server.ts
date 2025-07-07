/**
 * サーバー関連のエラー定義
 */
export const SERVER_ERRORS = {
  DATABASE_ERROR: {
    type: 'DATABASE_ERROR' as const,
    message: 'データベースでエラーが発生しました',
    statusCode: 500,
    errorCode: 100
  },
  SERVER_ERROR: {
    type: 'SERVER_ERROR' as const,
    message: 'サーバーでエラーが発生しました',
    statusCode: 500,
    errorCode: 101
  }
} as const
