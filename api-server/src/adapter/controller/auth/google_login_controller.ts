import { Controller } from '../../../../types'
import { GoogleLoginSerializer } from '../../serializer/auth/google_login_serializer'
import { GoogleLoginUsecase } from '../../../usecase/auth/google_login_usecase'
import { ILogger } from '../../../infrastructure/log/logger'


export class GoogleLoginController {
  private _googleLoginUsecase: GoogleLoginUsecase
  private _logger: ILogger
  private _serializer: GoogleLoginSerializer

  constructor(
    googleLoginUsecase: GoogleLoginUsecase,
    serializer: GoogleLoginSerializer,
    logger: ILogger
  ) {
    this._googleLoginUsecase = googleLoginUsecase
    this._serializer = serializer
    this._logger = logger
  }

  /**
   * Googleログイン処理
   */
  async execute(req: Controller.LoginRequest): Promise<Controller.Response<Controller.GoogleLoginResponse | Controller.GoogleLoginErrorResponse>> {
    const result = await this._googleLoginUsecase.execute(req)

    if (result.isFailure()) {
      if (result.error.statusCode === 500) {
        this._logger.error(new Error(`Google login failed: ${result.error.errorCode}`))
        return this._serializer.serverError(result.error)
      } else {
        this._logger.error(new Error(`Google login failed: ${result.error.errorCode}`))
        return this._serializer.applicationError(result.error)
      }
    }

    return this._serializer.success(result.value)
  }
} 
