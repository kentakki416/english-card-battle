import type { Router } from 'express'
import type { Db } from 'mongodb'

import { CONSTANT } from '../../../constant'
import type { SignupResponse } from '../../../types/controller'
import { SignupUsecase } from '../../usecase/auth/signup_usecase'
import { SignupController } from '../../adapter/controller/auth/signup_controller'
import type { ILogger } from '../../adapter/interface/ilogger'
import { SignupSerializer } from '../../adapter/serializer/auth/signup_serializer'
import { UserRepository } from '../db/mongo/repository/user_repository'
import { InMemoryUserRepository } from '../db/inMemory/user_repository'
import { Hash } from '../util/hash'
import { Jwt } from '../util/token'

export class AuthRouter {
  private _router: Router
  private _db: Db | null
  private _logger: ILogger
  private _apiToken: string
  constructor(router: Router, db: Db | null, logger: ILogger, apiToken: string) {
    this._router = router
    this._db = db
    this._logger = logger
    this._apiToken = apiToken
    this._setupRoutes()
  }

  /**
   * 認証系のルーティングを設定
   */
  private _setupRoutes() {
    this._router.post('/auth/signup', async (req, res) => {
      const hash = new Hash()
      const jwt = new Jwt()
      
      // 環境に応じてリポジトリを切り替え
      const userRepo = this._db 
        ? new UserRepository(this._db, this._logger)
        : new InMemoryUserRepository()
      
      const signupUsecase = new SignupUsecase(userRepo, this._logger,hash)
      const serializer = new SignupSerializer()
      const controller = new SignupController(signupUsecase, serializer, this._logger)
      const response = await controller.execute(req.body, this._apiToken)

      if (response.status === CONSTANT.STATUS_CODE.SUCCESS) {
        const successResponse = response as { status: typeof CONSTANT.STATUS_CODE.SUCCESS, data: SignupResponse, token?: string, responsedAt: Date }
        // JWTの生成
        const token = jwt.generateToken(String(successResponse.data.id))

        // クッキーにJWTを設定
        res.cookie('jwt', token, {
          maxAge: 15 * 24 * 60 * 60 * 1000, // ms
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
