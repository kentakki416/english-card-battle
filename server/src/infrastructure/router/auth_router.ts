import { Router } from 'express'

import { CONSTANT } from '../../../constant'
import { Controller } from '../../../types'
import { DIContainer } from '../di/container'
import { AuthMiddleware, AuthenticatedRequest } from '../middleware/auth_middleware'

export class AuthRouter {
  private _router: Router
  private _container: DIContainer
  private _authMiddleware: AuthMiddleware

  constructor(router: Router, container: DIContainer) {
    this._router = router
    this._container = container
    this._authMiddleware = new AuthMiddleware()
    this._setupRoutes()
  }

  /**
   * 認証系のルーティングを設定
   */
  private _setupRoutes() {
    this._setupGoogleLogin()
  }

  /**
   * Googleログインエンドポイント
   */
  private _setupGoogleLogin() {
    // Google認証middlewareを適用
    this._router.post('/google/login', this._authMiddleware.verifyGoogleAuth(), async (req: AuthenticatedRequest, res) => {
      try {
        // ユーザー情報の存在確認
        if (!req.user) {
          return res.status(401).json({ error: 'User information not found' })
        }

        const authContainer = this._container.getAuthContainer()
        const controller = authContainer.getGoogleLoginController()
        
        // 検証済みユーザー情報を使用
        const loginRequest: Controller.LoginRequest = {
          userId: req.user.id,
          email: req.user.email,
          name: req.user.name,
          picture: req.user.picture
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
        return
      } catch {
        return res.status(500).json({ error: 'Internal server error' })
      }
    })
  }

  /**
   * ルーターを返す
   */
  public getRouter(): Router {
    return this._router
  }
}
