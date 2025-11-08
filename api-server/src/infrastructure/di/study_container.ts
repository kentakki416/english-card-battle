// import type { ILogger } from '../../adapter/interface/ilogger'
// import type { Db } from 'mongodb'

// /**
//  * 学習モジュール専用DIコンテナ
//  * 
//  * 役割:
//  * - 学習関連の依存関係のみを管理
//  * - 学習機能の独立性を保つ
//  * - テスト時の学習機能の分離を容易にする
//  * 
//  * 将来の実装例:
//  * - StudyRepository
//  * - StudyUsecase
//  * - StudyController
//  * - StudySerializer
//  */
// export class StudyContainer {
//   private _logger: ILogger
//   private _db: Db | null

//   constructor(logger: ILogger, db: Db | null) {
//     this._logger = logger
//     this._db = db
//     // TODO: 学習関連の依存関係を初期化
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

//   // TODO: 学習関連のメソッドを追加
//   // getStudyRepository(): StudyRepository
//   // getStudyUsecase(): StudyUsecase
//   // getStudyController(): StudyController
// } 
