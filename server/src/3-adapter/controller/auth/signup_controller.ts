import type { Controller } from '../../../../types'
import type { SignupUsecase } from '../../../2-usecase/auth/signup_usecase'
import type { ILogger } from '../../interface/ilogger'
import type { SignupSerializer } from '../../serializer/auth/signup_serializer'

export class SignupController {
  private _signupUsecase: SignupUsecase
  private _serializer: SignupSerializer
  private _logger: ILogger

  constructor(signupUsecase: SignupUsecase, serializer: SignupSerializer, logger: ILogger) {
    this._signupUsecase = signupUsecase
    this._serializer = serializer
    this._logger = logger
  }

  public async execute(body: Controller.SignupRequest, apiToken: string) {
    try {
      console.log(apiToken)
      const user = await this._signupUsecase.exucute(body, apiToken)
      return this._serializer.execute(user, apiToken)
    } catch(error) {
      this._logger.error(new Error(`Failed to signup exexute body: ${body}`))
      return this._serializer.error(error as Error)
    }
  }
}
