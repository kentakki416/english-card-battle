import type { Db } from 'mongodb'

import type { IDbClient } from '../../../adapter/interface/idb_client'
import type { ILogger } from '../../../adapter/interface/ilogger'

export class InMemoryClient implements IDbClient {
  private _logger: ILogger

  constructor(logger: ILogger) {
    this._logger = logger
  }

  /**
   * in-memoryなので接続処理は不要
   */
  public async connect(): Promise<void> {
    this._logger.info('InMemory client connected (no external connection)')
  }

  /**
   * in-memoryなので切断処理は不要
   */
  public async close(): Promise<void> {
    this._logger.info('InMemory client closed (no external connection)')
  }

  /**
   * dev環境ではDBを使わないためnullを返す
   */
  public getDb(_dbName: string): Db | null {
    return null
  }
} 
