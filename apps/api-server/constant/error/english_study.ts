import { EnglishStudyError } from '../../types'

/**
 * 英語学習機能のエラー定義
 */
export const ENGLISH_STUDY_ERRORS: Record<string, EnglishStudyError> = {
  /**
   * 問題が見つからない
   */
  QUESTION_NOT_FOUND: {
    errorCode: 4001,
    message: '指定された問題が見つかりません',
    statusCode: 404
  },

  /**
   * 無効な回答
   */
  INVALID_ANSWER: {
    errorCode: 4002,
    message: '無効な回答です',
    statusCode: 400
  },

  /**
   * 問題数が不足
   */
  INSUFFICIENT_QUESTIONS: {
    errorCode: 4003,
    message: 'データベースに十分な問題が存在しません',
    statusCode: 500
  },

  /**
   * 回答数が不正
   */
  INVALID_ANSWER_COUNT: {
    errorCode: 4004,
    message: '回答数が問題数と一致しません',
    statusCode: 400
  },

  /**
   * 問題IDが不正
   */
  INVALID_QUESTION_ID: {
    errorCode: 4005,
    message: '問題IDが不正です',
    statusCode: 400
  }
}

