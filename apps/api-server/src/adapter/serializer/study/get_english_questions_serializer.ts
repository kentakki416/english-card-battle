import { CONSTANT } from '../../../../constant'
import { ServerError, EnglishStudyError } from '../../../../types'
import { Controller } from '../../../../types'
import { EnglishWord } from '../../../domain/entity/english_word'

/**
 * 英語問題取得シリアライザー
 * 
 * 役割:
 * - レスポンスのシリアライズ
 * - エラーレスポンスの生成
 */
export class GetEnglishQuestionsSerializer {
  /**
   * 正常系のレスポンスを生成
   * クライアント側で正解判定を行うため、正解も含めて返す
   */
  success(words: EnglishWord[]): Controller.Response<Controller.GetEnglishQuestionsResponse> {
    const responseData: Controller.GetEnglishQuestionsResponse = {
      questions: words.map(word => ({
        questionId: word.id,
        word: word.word,
        choices: word.choices,
        correctAnswer: word.correctAnswer // クライアント側で判定するため正解も送信
      }))
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

