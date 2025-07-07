import express from 'express'
import { pinoHttp } from 'pino-http'

import { DIContainer } from '../di/container'
import { PinoLogger } from '../log/pino/logger'
import { CorsMiddleware } from '../middleware/cors'
import { ExpressRouter } from '../router/router'

export class ExpressServer {
  private _app: express.Express
  private _port: number
  private _container: DIContainer
  private _logger: PinoLogger
  private _corsMiddleware: CorsMiddleware
  private _router: ExpressRouter

  constructor(port: number, container: DIContainer, logger: PinoLogger) {
    this._app = express()
    this._port = port
    this._logger = logger
    this._container = container
    this._corsMiddleware = container.setupCorsMiddleware(this._app)
    this._router = new ExpressRouter(this._container)
  }

  /**
   * サーバーの起動
   */
  public start() {
    try {
      this._corsMiddleware.useCors() // CORS設定
      
      this._app.use(express.json()) // JSONをパースするミドルウェア
      this._app.use(express.urlencoded({ extended: true })) // URLエンコードされたデータをパースするミドルウェア
      this._app.use(pinoHttp({ logger: this._logger.getLogger() })) // HTTPリクエスト・レスポンスのロギング

      // ルーティングの設定
      this._app.use(this._router.getRouter())

      // サーバーの起動
      this._app.listen(this._port, () => {
        this._logger.info(`Server is running on http://localhost:${this._port}`)
      })
    } catch (error) {
      // TODO: このままではサーバー止まっちゃう？
      this._logger.error(new Error(`Failed to start server: ${error}`))
      process.exit(1)
    }
  }
}
