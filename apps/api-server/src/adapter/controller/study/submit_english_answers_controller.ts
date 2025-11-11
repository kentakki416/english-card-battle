import { Controller } from '../../../../types'
import { ILogger } from '../../../infrastructure/log/logger'
import { SubmitEnglishAnswersUsecase } from '../../../usecase/study/submit_english_answers_usecase'
import { SubmitEnglishAnswersSerializer } from '../../serializer/study/submit_english_answers_serializer'

/**
 * 英語回答送信コントローラー
 * 
 * 役割:
 * - リクエストの受け取り
 * - Usecaseの呼び出し
 * - エラーハンドリング
 */
export class SubmitEnglishAnswersController {
  private _submitEnglishAnswersUsecase: SubmitEnglishAnswersUsecase
  private _logger: ILogger
  private _serializer: SubmitEnglishAnswersSerializer

  constructor(
    submitEnglishAnswersUsecase: SubmitEnglishAnswersUsecase,
    serializer: SubmitEnglishAnswersSerializer,
    logger: ILogger
  ) {
    this._submitEnglishAnswersUsecase = submitEnglishAnswersUsecase
    this._serializer = serializer
    this._logger = logger
  }

  /**
   * 英語回答送信処理
   */
  async execute(
    req: Controller.SubmitEnglishAnswersRequest
  ): Promise<Controller.Response<Controller.SubmitEnglishAnswersResponse | Controller.EnglishStudyErrorResponse>> {
    const result = await this._submitEnglishAnswersUsecase.execute(req)

    if (result.isFailure()) {
      if (result.error.statusCode === 500) {
        this._logger.error(new Error(`Submit answers failed: ${result.error.errorCode}`))
        return this._serializer.serverError(result.error)
      } else {
        this._logger.error(new Error(`Submit answers failed: ${result.error.errorCode}`))
        return this._serializer.applicationError(result.error)
      }
    }

    return this._serializer.success(result.value)
  }
}

