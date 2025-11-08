import { CONSTANT } from '../../../../constant'
import { UserError, ServerError, GoogleAuthError } from '../../../../types'
import { Controller } from '../../../../types'
import { User } from '../../../domain/entity/user'

/**
 * Googleログインシリアライザー
 */
export class GoogleLoginSerializer {
  /**
   * リクエストボディをパース
   */
  static parseRequest(body: unknown): Controller.GoogleLoginRequest | null {
    if (!body || typeof body !== 'object') {
      return null
    }

    const requestBody = body as Record<string, unknown>
    
    if (typeof requestBody.accessToken !== 'string') {
      return null
    }

    return {
      accessToken: requestBody.accessToken
    }
  }

  /**
   * レスポンスをシリアライズ
   */
  static serializeResponse(response: Controller.GoogleLoginResponse): string {
    return JSON.stringify(response)
  }

  /**
   * エラーレスポンスをシリアライズ
   */
  static serializeError(message: string, statusCode: number = 400): string {
    return JSON.stringify({
      error: {
        message,
        statusCode
      }
    })
  }

  /**
   * 正常系のレスポンスを生成
   * Result型から受け取った値をレスポンスに整形
   */
  success(data: { user: User, token: string }): Controller.Response<Controller.GoogleLoginResponse> {
    const responseData: Controller.GoogleLoginResponse = {
      user: {
        id: String(data.user.id),
        name: data.user.googleName,
        email: data.user.googleEmail,
        profilePic: data.user.googleProfilePic,
        providerType: 'google',
        providerId: data.user.googleId,
        createdAt: new Date(data.user.createdAt).toISOString(),
        updatedAt: new Date(data.user.updatedAt).toISOString()
      },
      token: data.token
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
  applicationError(error: UserError | GoogleAuthError | ServerError): Controller.Response<Controller.GoogleLoginErrorResponse> {
    return {
      status: error.statusCode,
      errorCode: error.errorCode,
      message: error.message,
      responsedAt: new Date(),
    }
  }

  /**
   * サーバーエラーのレスポンス
   */
  serverError(error: ServerError | UserError | GoogleAuthError): Controller.Response<Controller.GoogleLoginErrorResponse> {
    return {
      status: error.statusCode,
      errorCode: error.errorCode,
      message: error.message,
      responsedAt: new Date(),
    }
  }
} 
