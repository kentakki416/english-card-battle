import * as mongo from 'mongodb'

import type { IDbClient } from '../../../adapter/interface/idb_client'
import type { ILogger } from '../../../adapter/interface/ilogger'

export class MongoClient implements IDbClient {
  private _client: mongo.MongoClient
  private _logger: ILogger

  constructor(logger: ILogger) {
    let mongoURI = 'mongodb://root:password@localhost:27017'
    if (process.env.NODE_ENV === 'dev') {
      // TODO: 適切なURIを設定
      mongoURI = 'mongodb://root:password@localhost:27017'
    } else if (process.env.NODE_ENV === 'prd') {
      // TODO: 適切なURIを設定
      mongoURI = 'mongodb://root:password@localhost:27017'
    }

    this._client = new mongo.MongoClient(mongoURI)
    this._logger = logger
  }

  /**
   * MongoDBとの接続（リトライ回数は５回、５秒間隔）
   */
  public async connect() {
    const maxRetry = 5
    for (let i = 0; i < maxRetry; i++) {
      try {
        console.log('aaaa')
        await this._client.connect()
        this._logger.info('MongoDB connected')
        break
      } catch(error) {
        this._logger.error(error as Error)
        if (i === maxRetry - 1) {
          this._logger.error(new Error('MongoDB connection retry limit exceeded'))
          process.exit(1)
        }
        // 5秒待ってリトライ
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }

  /**
   * MognoDBとの接続を切断
   */
  public async close() {
    try {
      await this._client.close()
      this._logger.info('MongoDB disconnected')
    } catch (error) {
      this._logger.error(error as Error)
    }
  }

  /**
   * DBを返す
   * ex.) getDB('test') => testデータベースを返す
   */
  public getDb(dbName: string) {
    return this._client.db(dbName)
  }

  /**
   * クライアントを返す
   */
  public get client() {
    return this._client
  }
}
