import express from 'express'
import { ILogger } from '../log/logger'

/**
 * エラーハンドリングミドルウェア
 */
export class ErrorHandlerMiddleware {
  private _logger: ILogger

  constructor(logger: ILogger) {
    this._logger = logger
  }

  /**
   * エラーハンドリングミドルウェアを設定
   */
  public errorHandler() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return (error: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      // エラーをログに記録
      this._logger.error(new Error(`Unhandled error: ${error.message}`))
      if (error.stack) {
        this._logger.error(new Error(error.stack))
      }

      // クライアントには汎用的なエラーメッセージを返す
      res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      })
    }
  }

  /**
   * 404エラーハンドリング
   */
  public notFoundHandler() {
    return (req: express.Request, res: express.Response) => {
      this._logger.error(new Error(`Not found API: ${req.method} ${req.path}`))
      res.status(404).json({
        success: false,
        error: 'Not found API',
        message: `Route ${req.method} ${req.path} not found`
      })
    }
  }
} 
