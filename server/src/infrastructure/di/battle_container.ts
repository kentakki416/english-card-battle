// import type { ILogger } from '../../adapter/interface/ilogger'
// import type { Db } from 'mongodb'

// /**
//  * バトルモジュール専用DIコンテナ
//  * 
//  * 役割:
//  * - バトル関連の依存関係のみを管理
//  * - バトル機能の独立性を保つ
//  * - テスト時のバトル機能の分離を容易にする
//  * 
//  * 将来の実装例:
//  * - BattleRepository
//  * - BattleUsecase
//  * - BattleController
//  * - BattleSerializer
//  */
// export class BattleContainer {
//   private _logger: ILogger
//   private _db: Db | null

//   constructor(logger: ILogger, db: Db | null) {
//     this._logger = logger
//     this._db = db
//     // TODO: バトル関連の依存関係を初期化
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

//   // TODO: バトル関連のメソッドを追加
//   // getBattleRepository(): BattleRepository
//   // getBattleUsecase(): BattleUsecase
//   // getBattleController(): BattleController
// } 
