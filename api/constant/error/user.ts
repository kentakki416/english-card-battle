/**
 * ユーザー関連のエラー定義
 */
export const USER_ERRORS = {
  INVALID_NAME_LENGTH: {
    type: 'INVALID_NAME_LENGTH',
    message: 'ユーザー名は1文字以上50文字以下である必要があります',
    statusCode: 400,
    errorCode: 1000
  },
  INVALID_EMAIL_FORMAT: {
    type: 'INVALID_EMAIL_FORMAT',
    message: 'メールアドレスの形式が正しくありません',
    statusCode: 400,
    errorCode: 1001,
  },
  PROVIDER_TYPE_MISMATCH: {
    type: 'PROVIDER_TYPE_MISMATCH',
    message: 'プロバイダータイプは変更できません',
    statusCode: 400,
    errorCode: 1002,
  },
  USER_NOT_FOUND: {
    type: 'USER_NOT_FOUND' as const,
    message: 'ユーザーが見つかりません',
    statusCode: 404,
    errorCode: 1003,
  }
} as const
