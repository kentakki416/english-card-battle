import { Controller } from '../../../../types'
import { ILogger } from '../../../infrastructure/log/logger'
import { GetEnglishQuestionsUsecase } from '../../../usecase/study/get_english_questions_usecase'
import { GetEnglishQuestionsSerializer } from '../../serializer/study/get_english_questions_serializer'

/**
 * 英語問題取得コントローラー
 * 
 * 役割:
 * - リクエストの受け取り
 * - Usecaseの呼び出し
 * - エラーハンドリング
 */
export class GetEnglishQuestionsController {
  private _getEnglishQuestionsUsecase: GetEnglishQuestionsUsecase
  private _logger: ILogger
  private _serializer: GetEnglishQuestionsSerializer

  constructor(
    getEnglishQuestionsUsecase: GetEnglishQuestionsUsecase,
    serializer: GetEnglishQuestionsSerializer,
    logger: ILogger
  ) {
    this._getEnglishQuestionsUsecase = getEnglishQuestionsUsecase
    this._serializer = serializer
    this._logger = logger
  }

  /**
   * 英語問題取得処理
   */
  async execute(): Promise<Controller.Response<Controller.GetEnglishQuestionsResponse | Controller.EnglishStudyErrorResponse>> {
    const result = await this._getEnglishQuestionsUsecase.execute()

    if (result.isFailure()) {
      if (result.error.statusCode === 500) {
        this._logger.error(new Error(`Get questions failed: ${result.error.errorCode}`))
        return this._serializer.serverError(result.error)
      } else {
        this._logger.error(new Error(`Get questions failed: ${result.error.errorCode}`))
        return this._serializer.applicationError(result.error)
      }
    }

    return this._serializer.success(result.value)
  }
}

