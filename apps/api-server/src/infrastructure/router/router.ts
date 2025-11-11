import { Router } from 'express'

import { AuthRouter } from './auth_router'
import { StudyRouter } from './study_router'
import { DIContainer } from '../di/di_container'


export class ExpressRouter {
  private _router: Router
  private _container: DIContainer

  constructor(container: DIContainer) {
    this._router = Router()
    this._container = container
    this._setupRoutes()
  }

  /**
   * ルーティングを設定
   */
  private _setupRoutes() {
    // ルートエンドポイント
    this._router.get('/', (_, res) => {
      res.send('Hello World')
    })
    
    // Auth API
    const authRouter = new AuthRouter(this._router, this._container)
    this._router.use('/auth', authRouter.getRouter())
    
    // Study API
    const studyRouter = new StudyRouter(this._router, this._container)
    this._router.use('/study', studyRouter.getRouter())
  }

  /**
   * ルーターを返す
   */
  public getRouter(): Router {
    return this._router
  }
}
