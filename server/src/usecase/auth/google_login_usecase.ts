import { ERROR } from '../../../constant'
import { Result, Success, Failure, Controller, Domain, ServerError, UserError, GoogleAuthError } from '../../../types'
import { IGoogleAuth } from '../../adapter/interface/igoogle_auth'
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
    private googleAuth: IGoogleAuth,
    private userRepository: IUserRepository,
    private logger: ILogger,
    private tokenService: IToken
  ) {}

  async execute(request: Controller.LoginRequest): Promise<Result<{user: User, token: string},  ServerError | UserError | GoogleAuthError>> {
    try {
      this.logger.info('Google login process started')

      const googleResult = await this.googleAuth.verifyToken(request.accessToken)
      if (googleResult.isFailure()) {
        this.logger.error(new Error(`Google OAuth verification failed: ${googleResult.error.message}`))
        return googleResult
      }

      const googleUserInfo = googleResult.value
      this.logger.info(`Google OAuth verification successful for: ${googleUserInfo.email}`)

      const providerInfo: Domain.ProviderUserInfo = {
        type: 'google',
        id: googleUserInfo.id,
        name: googleUserInfo.name,
        email: googleUserInfo.email,
        picture: googleUserInfo.picture
      }

      const existingUserResult = await this.userRepository.findOne({ 'provider.id': googleUserInfo.id })

      let user: User
      if (existingUserResult.isFailure()) {
        // データベースエラーの場合
        this.logger.error(new Error(`Database error: ${existingUserResult.error.message}`))
        return existingUserResult
      }

      if (existingUserResult.value === null) {
        // ユーザーが見つからない場合、新規作成
        this.logger.info(`Creating new user for Google account: ${googleUserInfo.email}`)
        
        const createUserResult = User.createFromProvider(providerInfo)
        if (createUserResult.isFailure()) {
          this.logger.error(new Error(`User creation failed: ${createUserResult.error.message}`))
          return new Failure(createUserResult.error)
        }

        const saveResult = await this.userRepository.save(createUserResult.value)
        if (saveResult.isFailure()) {
          this.logger.error(new Error(`User save failed: ${saveResult.error.message}`))
          return new Failure(saveResult.error)
        }

        user = saveResult.value
        this.logger.info(`New user created: ${user.name}`)
      } else {
        // 既存ユーザーの場合
        user = existingUserResult.value
        this.logger.info(`Existing user found: ${user.name}`)
        
        // プロバイダー情報が更新されている可能性があるため、更新を試行
        const updateUserResult = user.updateProviderInfo(providerInfo)
        if (updateUserResult.isSuccess()) {
          const updateResult = await this.userRepository.update(updateUserResult.value)
          if (updateResult.isSuccess()) {
            user = updateResult.value
            this.logger.info(`User information updated: ${user.name}`)
          }
        }
      }

      // 4. JWTトークンの生成
      const token = this.tokenService.generateToken(String(user.userId))

      this.logger.info(`Google login successful for user: ${user.name}`)

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
