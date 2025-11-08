import pino from 'pino'

export interface ILogger {
  debug(message: string, ...args: unknown[]): void
  info(message: string, ...args: unknown[]): void
  warn(message: string, ...args: unknown[]): void
  error(err: Error, message?: string, ...args: unknown[]): void
}


export class PinoLogger implements ILogger {
  private _logger: pino.Logger

  constructor() {
    const level = process.env.PINO_LOG_LEVEL || 'debug'
    const targets = this._getTargets()
    const option: pino.LoggerOptions = {
      level,
      timestamp: pino.stdTimeFunctions.isoTime, // Pinoの標準タイムスタンプ関数を使用
      transport: {
        targets
      }
    }

    // インスタンス化
    this._logger = pino(option)
  }

  /**
   * ログ出力先を取得する
   */
  private _getTargets() {
    const env = process.env.NODE_ENV
    if (env === 'prd') {
      return [
        {
          level: 'error',
          target: 'pino/file',
          options: { destination: `${__dirname}/error.log`, mkdir: true }
        },
        {
          target: 'pino/file',
          options: { destination: `${__dirname}/combined.log`, mkdir: true }
        }
      ]
    } else {
      return [{
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }]
    }
  }

  public getLogger(): pino.Logger {
    return this._logger.child({
      formatters: {
        level: (label: string): { level: string } => {
          return { level: label.toUpperCase() }
        }
      }
    })
  }

  public debug(message: string, ...args: unknown[]): void {
    if (args.length > 0) {
      this._logger.debug({ args }, message)
    } else {
      this._logger.debug(message)
    }
  }

  public info(message: string, ...args: unknown[]): void {
    if (args.length > 0) {
      this._logger.info({ args }, message)
    } else {
      this._logger.info(message)
    }
  }

  public warn(message: string, ...args: unknown[]): void {
    if (args.length > 0) {
      this._logger.warn({ args }, message)
    } else {
      this._logger.warn(message)
    }
  }

  public error(err: Error, message?: string, ...args: unknown[]): void {
    const errorObj = {
      error: err.message,
      stack: err.stack,
      ...(args.length > 0 && { args })
    }
    if (message) {
      this._logger.error(errorObj, `${message}\n${err.stack}`)
    } else {
      this._logger.error(errorObj, `${err.message}\n${err.stack}`)
    }
  }
}
