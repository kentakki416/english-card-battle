import { z } from 'zod'

/**
 * ===== Get English Questions API =====
 */

/**
 * 英語問題取得リクエストスキーマ
 */
export const GetEnglishQuestionsRequestSchema = z.object({
  userId: z.string()
})

/**
 * 英語問題取得レスポンススキーマ
 */
export const GetEnglishQuestionsResponseSchema = z.object({
  questions: z.array(z.object({
    questionId: z.string(),
    word: z.string(),
    choices: z.array(z.string()),
    correctAnswer: z.string() // クライアント側で判定するため正解も送信
  }))
})

/**
 * 型推論
 */
export type GetEnglishQuestionsRequest = z.infer<typeof GetEnglishQuestionsRequestSchema>
export type GetEnglishQuestionsResponse = z.infer<typeof GetEnglishQuestionsResponseSchema>

/**
 * ===== Submit English Answers API =====
 */

/**
 * 回答送信リクエストスキーマ
 * クライアント側で正解判定済みの結果を送信
 */
export const SubmitEnglishAnswersRequestSchema = z.object({
  userId: z.string(),
  results: z.array(z.object({
    questionId: z.string(),
    word: z.string(),
    isCorrect: z.boolean(),
    selectedAnswer: z.string(),
    correctAnswer: z.string()
  }))
})

/**
 * 回答結果レスポンススキーマ
 */
export const SubmitEnglishAnswersResponseSchema = z.object({
  results: z.array(z.object({
    questionId: z.string(),
    word: z.string(),
    isCorrect: z.boolean(),
    correctAnswer: z.string(),
    selectedAnswer: z.string()
  })),
  score: z.number(),
  totalQuestions: z.number()
})

/**
 * 型推論
 */
export type SubmitEnglishAnswersRequest = z.infer<typeof SubmitEnglishAnswersRequestSchema>
export type SubmitEnglishAnswersResponse = z.infer<typeof SubmitEnglishAnswersResponseSchema>

/**
 * ===== Error Response =====
 */

/**
 * 英語学習エラーレスポンススキーマ
 */
export const EnglishStudyErrorResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  errorCode: z.number().optional(),
  responsedAt: z.date()
})

/**
 * 型推論
 */
export type EnglishStudyErrorResponse = z.infer<typeof EnglishStudyErrorResponseSchema>

