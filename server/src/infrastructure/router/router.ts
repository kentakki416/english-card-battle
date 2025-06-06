import { Router } from 'express'
import type { Db } from 'mongodb'

import { AuthRouter } from './auth_router'
import type { IDbClient } from '../../adapter/interface/idb_client'
import type { PinoLogger } from '../log/pino/logger'

export class ExpressRouter {
  private _router: Router
  private _dbClient: IDbClient
  private _db: Db | null
  private _logger: PinoLogger
  private _apiToken: string

  constructor(dbClient: IDbClient, logger: PinoLogger, apiToken: string) {
    this._router = Router()
    this._dbClient = dbClient
    this._db = this._dbClient.getDb(process.env.DB_NAME || 'chat-app')
    this._logger = logger
    this._apiToken = apiToken
    this._setupRoutes()
  }

  /**
   * ルーティングを設定
   */
  private _setupRoutes() {
    this._router.get('/', (_, res) => {
      res.send('Hello World')
    })
    const authRouter = new AuthRouter(this._router, this._db, this._logger, this._apiToken)
    this._router.use('/api', authRouter.getRouter())
  }

  /**
   * ルーターを返す
   */
  public getRouter(): Router {
    return this._router
  }
}
