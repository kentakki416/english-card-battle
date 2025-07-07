import { Db } from 'mongodb'

import { IDbClient } from '../../adapter/interface/idb_client'
import { ILogger } from '../../adapter/interface/ilogger'
import { ApiTokenGenerator } from '../middleware/api_token'

import { AuthContainer } from './auth_container'
// import { UserContainer } from './user_container'
// import { StudyContainer } from './study_container'
// import { BattleContainer } from './battle_container'

/**
 * メイン依存関係注入コンテナ (Main Dependency Injection Container)
 * 
 * 役割:
 * 1. アプリケーション全体の共通依存関係を管理
 * 2. 各モジュール専用DIコンテナの管理
 * 3. データベース接続とロガーの管理
 * 4. 共通ミドルウェアの管理
 * 
 * 責任:
 * - データベース接続の管理
 * - 共通ミドルウェアの初期化と管理
 * - 各モジュールコンテナの生成と管理
 * - 設定値の管理
 * 
 * 設計方針:
 * - 共通の依存関係のみを管理
 * - モジュール固有の依存関係は各モジュールコンテナに委譲
 * - スケーラブルな構造を維持
 */
export class DIContainer {
  private _dbClient: IDbClient
  private _db: Db
  private _logger: ILogger
  private _apiToken: ApiTokenGenerator
  
  // 各モジュールコンテナ
  private _authContainer: AuthContainer
  // private _userContainer: UserContainer
  // private _studyContainer: StudyContainer
  // private _battleContainer: BattleContainer

  constructor(dbClient: IDbClient, logger: ILogger) {
    this._dbClient = dbClient
    this._db = this._dbClient.getDb(process.env.DB_NAME || 'chat-app')
    this._logger = logger
    this._apiToken = new ApiTokenGenerator()
    
    // 各モジュールコンテナを初期化
    this._authContainer = new AuthContainer(this._logger, this._db)
    // this._userContainer = new UserContainer(this._logger, this._db)
    // this._studyContainer = new StudyContainer(this._logger, this._db)
    // this._battleContainer = new BattleContainer(this._logger, this._db)
  }

  /**
   * データベースインスタンスを取得
   */
  getDb(): Db | null {
    return this._db
  }

  /**
   * ロガーインスタンスを取得
   */
  getLogger(): ILogger {
    return this._logger
  }

  /**
   * APIトークンを取得
   */
  getApiToken(): string {
    return this._apiToken.generateApiToken()
  }

  /**
   * データベースクライアントを取得
   */
  getDbClient(): IDbClient {
    return this._dbClient
  }



  /**
   * 認証モジュールコンテナを取得
   */
  getAuthContainer(): AuthContainer {
    return this._authContainer
  }

  // /**
  //  * ユーザーモジュールコンテナを取得
  //  */
  // getUserContainer(): UserContainer {
  //   return this._userContainer
  // }

  // /**
  //  * 学習モジュールコンテナを取得
  //  */
  // getStudyContainer(): StudyContainer {
  //   return this._studyContainer
  // }

  // /**
  //  * バトルモジュールコンテナを取得
  //  */
  // getBattleContainer(): BattleContainer {
  //   return this._battleContainer
  // }
} 
