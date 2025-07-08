import { ERROR } from '../../../constant'
import { Result, Success, Failure, Controller, Domain, ServerError, UserError, GoogleAuthError } from '../../../types'
import { ILogger } from '../../adapter/interface/ilogger'
import { IToken } from '../../adapter/interface/itoken'
import { IUserRepository } from '../../adapter/interface/repository/iuser_repository'
import { User } from '../../domain/entity/user'

export type GoogleLoginError = GoogleAuthError | UserError | ServerError

/**
 * Googleログインユースケース
 * 
 * 役割:
 * - Googleログインの認証処理
 * - 既存ユーザーの検索と新規作成
 * - JWTトークンの生成
 * 
 */
export class GoogleLoginUsecase {
  constructor(
    private userRepository: IUserRepository,
    private logger: ILogger,
    private tokenService: IToken
  ) {}

  async execute(request: Controller.LoginRequest): Promise<Result<{user: User, token: string},  ServerError | UserError | GoogleAuthError>> {
    try {
      // 既存ユーザーの取得
      const userResult = await this.userRepository.findOne({
        'provider.google.id': request.userId,
        'provider.google.email': request.email
      })

      if (userResult.isFailure()) {
        this.logger.error(new Error(`Database error: ${userResult.error.message}`))
        return userResult
      }

      let user: User | null = userResult.value ?? null

      // ユーザーが見つからない場合、新規作成
      if (userResult.value === null) {
        const providerInfo: Domain.ProviderUserInfo = {
          google: {
            id: request.userId,
            name: request.name,
            email: request.email,
            picture: request.picture
          }
        }
        
        const createUserResult = User.createFromProvider(providerInfo)
        if (createUserResult.isFailure()) {
          this.logger.error(new Error(`User creation failed: ${createUserResult.error.message}`))
          return createUserResult
        }

        const saveResult = await this.userRepository.save(createUserResult.value)
        if (saveResult.isFailure()) {
          this.logger.error(new Error(`User save failed: ${saveResult.error.message}`))
          return saveResult
        }

        user = saveResult.value
        this.logger.info(`New user created: ${user.googleName}`)
      } else {
        user = userResult.value
      }

      // 4. JWTトークンの生成
      const token = this.tokenService.generateToken(String(user.id))

      this.logger.info(`Google login successful for user: ${user.googleName}`)

      return new Success({
        user,
        token
      })
    } catch (error) {
      this.logger.error(new Error(`Unexpected error in Google login: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.SERVER_ERROR)
    }
  }
} 
