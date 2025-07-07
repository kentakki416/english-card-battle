// import type { Controller } from '../../../../types'
// import type { SignupUsecase } from '../../../usecase/auth/signup_usecase'
// import type { ILogger } from '../../interface/ilogger'
// import type { SignupSerializer } from '../../serializer/auth/signup_serializer'
// import { UserError, UserErrorHandler } from '../../../../types'

// export class SignupController {
//   private _signupUsecase: SignupUsecase
//   private _serializer: SignupSerializer
//   private _logger: ILogger

//   constructor(signupUsecase: SignupUsecase, serializer: SignupSerializer, logger: ILogger) {
//     this._signupUsecase = signupUsecase
//     this._serializer = serializer
//     this._logger = logger
//   }

//   public async execute(body: Controller.SignupRequest, apiToken: string) {
//     try {
//       const user = await this._signupUsecase.exucute(body, apiToken)
//       return this._serializer.execute(user, apiToken)
//     } catch(error) {
//       this._logger.error(new Error(`Failed to signup exexute body: ${body}`))
//       return this._serializer.error(error as Error)
//     }
//   }

//   async handle(request: SignupControllerRequest) {
//     const result = await this.signupUseCase.execute(request)

//     if (result.isSuccess()) {
//       return {
//         success: true,
//         user: result.value.user,
//         token: result.value.token,
//       }
//     } else {
//       // errorCodeによるエラーハンドリング
//       const error = result.error
//       const category = UserErrorHandler.categorizeByErrorCode(error)
      
//       // エラーログ出力
//       this.logger[UserErrorHandler.getLogLevel(error)](`Signup failed: ${error.errorCode}`, {
//         error: error,
//         category: category,
//         request: request
//       })

//       // HTTPレスポンスの生成
//       return {
//         success: false,
//         error: {
//           type: error.type,
//           message: error.message,
//           errorCode: error.errorCode,
//           statusCode: error.statusCode
//         }
//       }
//     }
//   }
// }
