import { Router } from 'express'

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
   * Googleログインエンドポイント
   */
  private _setupGoogleLogin() {
    this._router.post('/login/google', async (req, res) => {
      const authContainer = this._container.getAuthContainer()
      const controller = authContainer.getGoogleLoginController()
      
      // リクエストボディをパース
      const loginRequest: Controller.LoginRequest = {
        accessToken: req.body.accessToken
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
    })
  }

  /**
   * ルーターを返す
   */
  public getRouter(): Router {
    return this._router
  }
}
