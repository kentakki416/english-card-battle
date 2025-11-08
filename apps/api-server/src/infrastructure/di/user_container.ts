// import type { ILogger } from '../../adapter/interface/ilogger'
// import type { Db } from 'mongodb'

// /**
//  * ユーザーモジュール専用DIコンテナ
//  * 
//  * 役割:
//  * - ユーザー関連の依存関係のみを管理
//  * - ユーザー機能の独立性を保つ
//  * - テスト時のユーザー機能の分離を容易にする
//  * 
//  * 将来の実装例:
//  * - UserRepository
//  * - UserUsecase
//  * - UserController
//  * - UserSerializer
//  */
// export class UserContainer {
//   private _logger: ILogger
//   private _db: Db | null

//   constructor(logger: ILogger, db: Db | null) {
//     this._logger = logger
//     this._db = db
//     // TODO: ユーザー関連の依存関係を初期化
//   }

//   /**
//    * ロガーインスタンスを取得
//    */
//   getLogger(): ILogger {
//     return this._logger
//   }

//   /**
//    * データベースインスタンスを取得
//    */
//   getDb(): Db | null {
//     return this._db
//   }

//   // TODO: ユーザー関連のメソッドを追加
//   // getUserRepository(): UserRepository
//   // getUserUsecase(): UserUsecase
//   // getUserController(): UserController
// } 
