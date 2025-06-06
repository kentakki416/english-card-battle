import express from 'express'
import { pinoHttp } from 'pino-http'

import type { IDbClient } from '../../adapter/interface/idb_client'
import type { PinoLogger } from '../log/pino/logger'
import { ExpressRouter } from '../router/router'
import { ApiTokenGenerator } from '../middleware/api_token' 

export class ExpressServer {
  private _app: express.Express
  private _port: number
  private _dbClient: IDbClient
  private _logger: PinoLogger
  private _apiToken: ApiTokenGenerator

  constructor(port: number, dbClient: IDbClient, logger: PinoLogger, apiToken: ApiTokenGenerator) {
    this._app = express()
    this._port = port
    this._dbClient = dbClient
    this._logger = logger
    this._apiToken = apiToken
  }

  /**
   * サーバーの起動
   */
  public start() {
    try {
      this._app.use(express.json()) // JSONをパースするミドルウェア
      this._app.use(express.urlencoded({ extended: true })) // URLエンコードされたデータをパースするミドルウェア
      this._app.use(pinoHttp({ logger: this._logger.getLogger() })) // HTTPリクエスト・レスポンスのロギング

      const apiToken = this._apiToken.generateApiToken()
      // TODO: ここでAPIトークンをログに追加する

      // ルーティングの設定
      const router = new ExpressRouter(this._dbClient, this._logger, apiToken)
      this._app.use('/api',router.getRouter())

      this._app.listen(this._port, () => {
        this._logger.info(`Server is running on http://localhost:${this._port}`)
      })
    } catch (error) {
      this._logger.error(new Error(`Failed to start server: ${error}`))
      process.exit(1)
    }
  }
}
