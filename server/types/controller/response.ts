import { CONSTANT } from '../../constant'

/**
 * レスポンスの共通型
 */
export type Response<T> = {
  status: typeof CONSTANT.STATUS_CODE.SUCCESS
  data: T
  token?: string
  responsedAt: Date
} | {
  status:
  | typeof CONSTANT.STATUS_CODE.BAD_REQUEST
  | typeof CONSTANT.STATUS_CODE.NOT_FOUND
  | typeof CONSTANT.STATUS_CODE.SERVER_ERROR
  message: string
  responsedAt: Date
}
