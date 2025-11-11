import { Db } from 'mongodb'

import { GoogleLoginController } from '../../adapter/controller/auth/google_login_controller'
import { GetEnglishQuestionsController } from '../../adapter/controller/study/get_english_questions_controller'
import { SubmitEnglishAnswersController } from '../../adapter/controller/study/submit_english_answers_controller'
import { GoogleLoginSerializer } from '../../adapter/serializer/auth/google_login_serializer'
import { GetEnglishQuestionsSerializer } from '../../adapter/serializer/study/get_english_questions_serializer'
import { SubmitEnglishAnswersSerializer } from '../../adapter/serializer/study/submit_english_answers_serializer'
import { GoogleLoginUsecase } from '../../usecase/auth/google_login_usecase'
import { GetEnglishQuestionsUsecase } from '../../usecase/study/get_english_questions_usecase'
import { SubmitEnglishAnswersUsecase } from '../../usecase/study/submit_english_answers_usecase'
import { IDbClient } from '../db/client'
import { UserRepository } from '../db/repository/user_repository'
import { EnglishWordRepository } from '../db/repository/english_word_repository'
import { StudyHistoryRepository } from '../db/repository/study_history_repository'
import { ILogger } from '../log/logger'
import { ApiTokenGenerator } from '../middleware/api_token'
import { Hash } from '../util/hash'
import { Jwt } from '../util/jwt'

/**
 * メイン依存関係注入コンテナ (Main Dependency Injection Container)
 * 
 * 役割:
 * - アプリケーション全体の依存関係を一元管理
 * - サーバー起動時にすべてのインスタンスを初期化
 * - 各ルーターから直接必要なインスタンスを取得可能
 * 
 * 設計方針:
 * - フラットな構造で依存関係を管理
 * - モジュール別の中間コンテナを排除し、シンプルに保つ
 * - シングルトンパターンで効率的なインスタンス管理
 */
export class DIContainer {
  // インフラ層
  private _dbClient: IDbClient
  private _db: Db
  private _logger: ILogger
  private _apiToken: ApiTokenGenerator
  
  // ユーティリティ
  private _hash: Hash
  private _jwt: Jwt
  
  // リポジトリ層
  private _userRepository: UserRepository
  private _englishWordRepository: EnglishWordRepository
  private _studyHistoryRepository: StudyHistoryRepository
  
  // ユースケース層
  private _googleLoginUsecase: GoogleLoginUsecase
  private _getEnglishQuestionsUsecase: GetEnglishQuestionsUsecase
  private _submitEnglishAnswersUsecase: SubmitEnglishAnswersUsecase
  
  // コントローラー層
  private _googleLoginController: GoogleLoginController
  private _getEnglishQuestionsController: GetEnglishQuestionsController
  private _submitEnglishAnswersController: SubmitEnglishAnswersController
  
  // シリアライザー層
  private _googleLoginSerializer: GoogleLoginSerializer
  private _getEnglishQuestionsSerializer: GetEnglishQuestionsSerializer
  private _submitEnglishAnswersSerializer: SubmitEnglishAnswersSerializer

  constructor(dbClient: IDbClient, logger: ILogger) {
    this._dbClient = dbClient
    this._db = this._dbClient.getDb(process.env.DB_NAME || 'chat-app')
    this._logger = logger
    
    // インフラ層の初期化
    this._apiToken = new ApiTokenGenerator()
    this._hash = new Hash()
    this._jwt = new Jwt()
    
    // リポジトリ層の初期化
    this._userRepository = new UserRepository(this._db, this._logger)
    this._englishWordRepository = new EnglishWordRepository(this._db, this._logger)
    this._studyHistoryRepository = new StudyHistoryRepository(this._db, this._logger)
    
    // シリアライザー層の初期化
    this._googleLoginSerializer = new GoogleLoginSerializer()
    this._getEnglishQuestionsSerializer = new GetEnglishQuestionsSerializer()
    this._submitEnglishAnswersSerializer = new SubmitEnglishAnswersSerializer()
    
    // ユースケース層の初期化
    this._googleLoginUsecase = new GoogleLoginUsecase(
      this._userRepository,
      this._logger,
      this._jwt
    )
    this._getEnglishQuestionsUsecase = new GetEnglishQuestionsUsecase(
      this._englishWordRepository,
      this._logger
    )
    this._submitEnglishAnswersUsecase = new SubmitEnglishAnswersUsecase(
      this._studyHistoryRepository,
      this._logger
    )
    
    // コントローラー層の初期化
    this._googleLoginController = new GoogleLoginController(
      this._googleLoginUsecase,
      this._googleLoginSerializer,
      this._logger
    )
    this._getEnglishQuestionsController = new GetEnglishQuestionsController(
      this._getEnglishQuestionsUsecase,
      this._getEnglishQuestionsSerializer,
      this._logger
    )
    this._submitEnglishAnswersController = new SubmitEnglishAnswersController(
      this._submitEnglishAnswersUsecase,
      this._submitEnglishAnswersSerializer,
      this._logger
    )
  }

  // ========================================
  // インフラ層のGetter
  // ========================================

  /**
   * データベースインスタンスを取得
   */
  getDb(): Db {
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

  // ========================================
  // ユーティリティのGetter
  // ========================================

  /**
   * Hashインスタンスを取得
   */
  getHash(): Hash {
    return this._hash
  }

  /**
   * JWTインスタンスを取得
   */
  getJwt(): Jwt {
    return this._jwt
  }

  // ========================================
  // リポジトリ層のGetter
  // ========================================

  /**
   * ユーザーリポジトリを取得
   */
  getUserRepository(): UserRepository {
    return this._userRepository
  }

  /**
   * 英単語リポジトリを取得
   */
  getEnglishWordRepository(): EnglishWordRepository {
    return this._englishWordRepository
  }

  /**
   * 学習履歴リポジトリを取得
   */
  getStudyHistoryRepository(): StudyHistoryRepository {
    return this._studyHistoryRepository
  }

  // ========================================
  // ユースケース層のGetter
  // ========================================

  /**
   * Googleログインユースケースを取得
   */
  getGoogleLoginUsecase(): GoogleLoginUsecase {
    return this._googleLoginUsecase
  }

  /**
   * 英語問題取得ユースケースを取得
   */
  getGetEnglishQuestionsUsecase(): GetEnglishQuestionsUsecase {
    return this._getEnglishQuestionsUsecase
  }

  /**
   * 英語回答送信ユースケースを取得
   */
  getSubmitEnglishAnswersUsecase(): SubmitEnglishAnswersUsecase {
    return this._submitEnglishAnswersUsecase
  }

  // ========================================
  // コントローラー層のGetter
  // ========================================

  /**
   * Googleログインコントローラーを取得
   */
  getGoogleLoginController(): GoogleLoginController {
    return this._googleLoginController
  }

  /**
   * 英語問題取得コントローラーを取得
   */
  getGetEnglishQuestionsController(): GetEnglishQuestionsController {
    return this._getEnglishQuestionsController
  }

  /**
   * 英語回答送信コントローラーを取得
   */
  getSubmitEnglishAnswersController(): SubmitEnglishAnswersController {
    return this._submitEnglishAnswersController
  }

  // ========================================
  // シリアライザー層のGetter
  // ========================================

  /**
   * Googleログインシリアライザーを取得
   */
  getGoogleLoginSerializer(): GoogleLoginSerializer {
    return this._googleLoginSerializer
  }

  /**
   * 英語問題取得シリアライザーを取得
   */
  getGetEnglishQuestionsSerializer(): GetEnglishQuestionsSerializer {
    return this._getEnglishQuestionsSerializer
  }

  /**
   * 英語回答送信シリアライザーを取得
   */
  getSubmitEnglishAnswersSerializer(): SubmitEnglishAnswersSerializer {
    return this._submitEnglishAnswersSerializer
  }
}

