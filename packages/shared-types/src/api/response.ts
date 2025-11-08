import { z } from 'zod'

/**
 * ステータスコード定数
 */
export const STATUS_CODE = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const

/**
 * 成功レスポンスのスキーマ
 */
export const SuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.literal(STATUS_CODE.SUCCESS),
    data: dataSchema,
    token: z.string().optional(),
    responsedAt: z.date()
  })

/**
 * エラーレスポンスのスキーマ
 */
export const ErrorResponseSchema = z.object({
  status: z.number(),
  errorCode: z.number(),
  message: z.string(),
  responsedAt: z.date()
})

/**
 * APIレスポンスの型（成功またはエラー）
 */
export type Response<T> = 
  | {
      status: typeof STATUS_CODE.SUCCESS
      data: T
      token?: string
      responsedAt: Date
    }
  | {
      status: number
      errorCode: number
      message: string
      responsedAt: Date
    }

