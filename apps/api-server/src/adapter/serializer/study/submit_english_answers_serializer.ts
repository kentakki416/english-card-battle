import { CONSTANT } from '../../../../constant'
import { ServerError, EnglishStudyError } from '../../../../types'
import { Controller } from '../../../../types'
import { SubmitAnswersResponse } from '../../../usecase/study/submit_english_answers_usecase'

/**
 * 英語回答送信シリアライザー
 * 
 * 役割:
 * - リクエストのパース
 * - レスポンスのシリアライズ
 * - エラーレスポンスの生成
 */
export class SubmitEnglishAnswersSerializer {
  /**
   * リクエストボディをパース
   * クライアント側で正解判定済みの結果を受け取る
   */
  static parseRequest(body: unknown): Controller.SubmitEnglishAnswersRequest | null {
    if (!body || typeof body !== 'object') {
      return null
    }

    const requestBody = body as Record<string, unknown>
    
    if (typeof requestBody.userId !== 'string') {
      return null
    }

    if (!Array.isArray(requestBody.results)) {
      return null
    }

    // resultsの各要素を検証
    for (const result of requestBody.results) {
      if (!result || typeof result !== 'object') {
        return null
      }
      const resultObj = result as Record<string, unknown>
      if (
        typeof resultObj.questionId !== 'string' ||
        typeof resultObj.word !== 'string' ||
        typeof resultObj.isCorrect !== 'boolean' ||
        typeof resultObj.selectedAnswer !== 'string' ||
        typeof resultObj.correctAnswer !== 'string'
      ) {
        return null
      }
    }

    return {
      userId: requestBody.userId,
      results: requestBody.results as {
        questionId: string
        word: string
        isCorrect: boolean
        selectedAnswer: string
        correctAnswer: string
      }[]
    }
  }

  /**
   * 正常系のレスポンスを生成
   */
  success(data: SubmitAnswersResponse): Controller.Response<Controller.SubmitEnglishAnswersResponse> {
    const responseData: Controller.SubmitEnglishAnswersResponse = {
      results: data.results.map(result => ({
        questionId: result.questionId,
        word: result.word,
        isCorrect: result.isCorrect,
        correctAnswer: result.correctAnswer,
        selectedAnswer: result.selectedAnswer
      })),
      score: data.score,
      totalQuestions: data.totalQuestions
    }
    
    return {
      status: CONSTANT.SUCCESS,
      data: responseData,
      responsedAt: new Date()
    }
  }

  /**
   * アプリケーションエラーのレスポンス
   */
  applicationError(error: EnglishStudyError | ServerError): Controller.Response<Controller.EnglishStudyErrorResponse> {
    return {
      status: error.statusCode,
      errorCode: error.errorCode,
      message: error.message,
      responsedAt: new Date()
    }
  }

  /**
   * サーバーエラーのレスポンス
   */
  serverError(error: ServerError | EnglishStudyError): Controller.Response<Controller.EnglishStudyErrorResponse> {
    return {
      status: error.statusCode,
      errorCode: error.errorCode,
      message: error.message,
      responsedAt: new Date()
    }
  }
}

