import { ERROR } from "../../constant"

/**
 * サーバー関連のエラー型
 */
export type ServerError = typeof ERROR.SERVER_ERRORS[keyof typeof ERROR.SERVER_ERRORS] 
