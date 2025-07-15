import { ERROR } from "../../constant"

/**
 * ユーザー関連のエラー型
 */
export type UserError = typeof ERROR.USER_ERRORS[keyof typeof ERROR.USER_ERRORS]
