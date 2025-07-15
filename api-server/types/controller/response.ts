import { CONSTANT } from "../../constant"

/**
 * レスポンスの共通型
 */
export type Response<T> = {
  status: typeof CONSTANT.STATUS_CODE.SUCCESS
  data: T
  token?: string
  responsedAt: Date
} | {
  status:number
  errorCode: number
  message: string
  responsedAt: Date
}
