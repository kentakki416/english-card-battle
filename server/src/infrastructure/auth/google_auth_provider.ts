import { OAuth2Client } from 'google-auth-library'
import { google } from 'googleapis'

import { Result, Success, Failure, GoogleAuthError, UserError, ServerError } from '../../../types'
import { ERROR } from '../../../constant'
import { IGoogleAuth, GoogleUserInfo } from '../../adapter/interface/igoogle_auth'
import { ILogger } from '../../adapter/interface/ilogger'

export class GoogleAuthProvider implements IGoogleAuth {
  private readonly oauth2Client: OAuth2Client

  constructor(private logger: ILogger) {
    // Google OAuth2クライアントの初期化
    this.oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    )
  }

  /**
   * Google OAuthトークンの検証
   * @param accessToken Google OAuthトークン
   * @returns Googleユーザー情報
   */
  async verifyToken(accessToken: string): Promise<Result<GoogleUserInfo, UserError | ServerError | GoogleAuthError>> {
    try {
      this.logger.info('Google OAuth token verification started')
      
      // トークンの基本検証
      if (!accessToken || accessToken.trim().length === 0) {
        this.logger.warn('Empty access token provided')
        return new Failure(ERROR.GOOGLE_AUTH_ERRORS.INVALID_TOKEN)
      }

      // アクセストークンを設定
      this.oauth2Client.setCredentials({
        access_token: accessToken
      })

      const oauth2 = google.oauth2({
        version: 'v2',
        auth: this.oauth2Client
      })

      // Google OAuth2 APIを使用してユーザー情報を取得
      const response = await oauth2.userinfo.get()

      const userInfo: GoogleUserInfo = {
        id: response.data.id!,
        email: response.data.email!,
        name: response.data.name!,
        picture: response.data.picture || undefined
      }

      this.logger.info(`Google OAuth verification successful for user: ${userInfo.email}`)
      return new Success(userInfo)

    } catch (error) {
      return this.handleGoogleApiError(error)
    }
  }



  /**
   * Google APIエラーの処理
   */
  private handleGoogleApiError(error: unknown): Failure<UserError | ServerError | GoogleAuthError> {
    if (error instanceof Error) {
      this.logger.error(new Error(`Google API error: ${error.message}`))

      // トークン関連エラー（UserError）
      if (error.message.includes('invalid_token') || error.message.includes('401')) {
        return new Failure(ERROR.GOOGLE_AUTH_ERRORS.INVALID_TOKEN)
      }

      if (error.message.includes('expired') || error.message.includes('token_expired')) {
        return new Failure(ERROR.GOOGLE_AUTH_ERRORS.TOKEN_EXPIRED)
      }

      // ネットワークエラー（ServerError）
      if (error.message.includes('network') || error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
        return new Failure(ERROR.GOOGLE_AUTH_ERRORS.NETWORK_ERROR)
      }

      // Googleサーバーエラー（ServerError）
      if (error.message.includes('500') || error.message.includes('503') || error.message.includes('quota')) {
        return new Failure(ERROR.GOOGLE_AUTH_ERRORS.GOOGLE_SERVER_ERROR)
      }

      // その他のエラーはGoogleサーバーエラーとして扱う
      return new Failure(ERROR.GOOGLE_AUTH_ERRORS.GOOGLE_SERVER_ERROR)
    }

    // 予期しないエラー
    this.logger.error(new Error('Unexpected error during Google OAuth verification'))
    return new Failure(ERROR.GOOGLE_AUTH_ERRORS.GOOGLE_SERVER_ERROR)
  }
} 
