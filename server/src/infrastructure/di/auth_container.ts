import { Db } from 'mongodb'

import { GoogleLoginController } from '../../adapter/controller/auth/google_login_controller'
import { ILogger } from '../../adapter/interface/ilogger'
import { GoogleLoginSerializer } from '../../adapter/serializer/auth/google_login_serializer'
import { GoogleLoginUsecase } from '../../usecase/auth/google_login_usecase'
import { UserRepository } from '../db/mongo/repository/user_repository'
import { Hash } from '../util/hash'
import { Jwt } from '../util/jwt'

/**
 * 認証モジュール専用DIコンテナ
 * 
 * 役割:
 * - 認証関連の依存関係のみを管理
 * - 認証機能の独立性を保つ
 * - テスト時の認証機能の分離を容易にする
 * 
 * このパターンを他のモジュール（User、Study、Battle）にも適用することで、
 * メインのDIContainerの肥大化を防ぐことができます。
 */
export class AuthContainer {
  private _logger: ILogger
  private _db: Db
  private _hash: Hash
  private _jwt: Jwt
  private _userRepository: UserRepository
  private _googleLoginUsecase: GoogleLoginUsecase
  private _googleLoginController: GoogleLoginController
  private _googleLoginSerializer: GoogleLoginSerializer

  constructor(logger: ILogger, db: Db) {
    this._logger = logger
    this._db = db
    this._hash = new Hash()
    this._jwt = new Jwt()
    this._userRepository = new UserRepository(this._db, this._logger)
    this._googleLoginUsecase = new GoogleLoginUsecase(this._userRepository, this._logger, this._jwt)
    this._googleLoginSerializer = new GoogleLoginSerializer()
    this._googleLoginController = new GoogleLoginController(this._googleLoginUsecase, this._googleLoginSerializer, this._logger)
  }

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

  /**
   * ユーザーリポジトリを取得
   */
  getUserRepository(): UserRepository {
    return this._userRepository
  }

  /**
   * Googleログインユースケースを取得
   */
  getGoogleLoginUsecase(): GoogleLoginUsecase {
    return this._googleLoginUsecase
  }

  /**
   * Googleログインコントローラーを取得
   */
  getGoogleLoginController(): GoogleLoginController {
    return this._googleLoginController
  }

  /**
   * Googleログインシリアライザーを取得
   */
  getGoogleLoginSerializer(): GoogleLoginSerializer {
    return this._googleLoginSerializer
  }
} 
