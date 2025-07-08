import { Router } from 'express'
import jwt from 'jsonwebtoken'

import { CONSTANT } from '../../../constant'
import { Controller } from '../../../types'
import { DIContainer } from '../di/container'

export class AuthRouter {
  private _router: Router
  private _container: DIContainer

  constructor(router: Router, container: DIContainer) {
    this._router = router
    this._container = container
    this._setupRoutes()
  }

  /**
   * 認証系のルーティングを設定
   */
  private _setupRoutes() {
    this._setupGoogleLogin()
  }

  /**
   * NextAuth.jsのセッショントークンを検証
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private verifyNextAuthSession(token: string): any {
    try {
      // NextAuth.jsのセッショントークンを検証
      // 注意: これはNextAuth.jsのJWEを復号化する必要がある
      // 実際の実装では、NextAuth.jsのライブラリを使用するか、
      // 共有シークレットを使用して検証する
      return jwt.verify(token, process.env.NEXTAUTH_SECRET || '')
    } catch {
      throw new Error('Invalid session token')
    }
  }

  /**
   * Googleログインエンドポイント
   */
  private _setupGoogleLogin() {
    this._router.post('/google/login', async (req, res) => {
      try {
        // NextAuth.jsのセッショントークンを取得
        const sessionToken = req.headers.authorization?.replace('Bearer ', '')
        
        if (!sessionToken) {
          return res.status(401).json({ error: 'Session token required' })
        }

        // セッショントークンを検証
        const session = this.verifyNextAuthSession(sessionToken)
        
        if (!session?.accessToken) {
          return res.status(401).json({ error: 'Valid Google session required' })
        }

        // Google APIでユーザー情報を検証
        const googleUser = await this.verifyGoogleUser(session.accessToken)
        
        const authContainer = this._container.getAuthContainer()
        const controller = authContainer.getGoogleLoginController()
        
        // 検証済みのユーザー情報を使用
        const loginRequest: Controller.LoginRequest = {
          userId: googleUser.id,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture
        }
        
        const response = await controller.execute(loginRequest)

        // 成功時はJWTをクッキーに設定
        if (response.status === CONSTANT.STATUS_CODE.SUCCESS && 'data' in response && 'token' in response.data) {
          res.cookie('jwt', response.data.token, {
            maxAge: 15 * 24 * 60 * 60 * 1000, // 15日
            httpOnly: true, // XSS対策
            sameSite: 'strict', // CSRF対策
          })
        }

        res.status(response.status).send(response)
        
      } catch {
        res.status(401).json({ error: 'Authentication failed' })
      }
    })
  }

  /**
   * Google APIでユーザー情報を検証
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private async verifyGoogleUser(accessToken: string): Promise<any> {
    const response = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`)
    
    if (!response.ok) {
      throw new Error('Invalid Google token')
    }
    
    return response.json()
  }

  /**
   * ルーターを返す
   */
  public getRouter(): Router {
    return this._router
  }
}
