import { ERROR } from "../../constant"

/**
 * Google認証関連のエラー型
 */
export type GoogleAuthError = typeof ERROR.GOOGLE_AUTH_ERRORS[keyof typeof ERROR.GOOGLE_AUTH_ERRORS] 
