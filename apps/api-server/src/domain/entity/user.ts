import { ERROR } from '../../../constant'
import { Domain, Result, Success, Failure, UserError } from '../../../types'

export class User {
  /** DB用のユーザーID */
  private _id = ''
  /** アプリケーション用のユーザーID */
  private readonly _userId: number
  /** プロバイダー情報 */
  private readonly _provider: Domain.ProviderUserInfo
  /** 作成日時 */
  private readonly _createdAt: Date
  /** 更新日時 */
  private _updatedAt: Date

  private constructor(
    userId: number,
    provider: Domain.ProviderUserInfo,
    createdAt: Date = new Date()
  ) {
    this._userId = userId
    this._provider = provider
    this._createdAt = createdAt
    this._updatedAt = createdAt
  }

  public get id() {
    return this._id
  }

  public get userId() {
    return this._userId
  }

  public get provider() {
    return this._provider
  }

  public get createdAt() {
    return this._createdAt
  }

  public get updatedAt() {
    return this._updatedAt
  }

  public get providerInfo(): Domain.ProviderUserInfo {
    return this._provider
  }

  public get googleName(): string {
    return this._provider.google.name
  }

  public get googleEmail(): string {
    return this._provider.google.email
  }

  public get googleProfilePic(): string | undefined {
    return this._provider.google.picture
  }

  public get googleId(): string {
    return this._provider.google.id
  }

  public updateTimestamp(): void {
    this._updatedAt = new Date()
  }

  /**
   * プロバイダー情報から新規ユーザーを作成
   * UseCase層で使用
   */
  static createFromProvider(providerInfo: Domain.ProviderUserInfo): Result<User, UserError> {
    // ビジネスルールの適用
    const validationResult = userBusinessRule.validateProviderInfo(providerInfo)
    if (validationResult.isFailure()) {
      return validationResult
    }
    
    const userId = Math.floor(Math.random() * 1000)
    const user = new User(userId, providerInfo)
    return new Success(user)
  }

  /**
   * プロバイダー情報から既存ユーザーを作成（既存ユーザーID指定）
   * UseCase層で使用
   */
  static createFromProviderWithId(userId: number, providerInfo: Domain.ProviderUserInfo): Result<User, UserError> {
    // ビジネスルールの適用
    const validationResult = userBusinessRule.validateProviderInfo(providerInfo)
    if (validationResult.isFailure()) {
      return validationResult
    }
    
    const user = new User(userId, providerInfo)
    return new Success(user)
  }

  /**
   * DBから復元するためのStatic Factory Method
   * Infrastructure層で使用
   */
  static restoreFromDb(
    userId: number,
    providerInfo: Domain.ProviderUserInfo,
    createdAt: Date
  ): Result<User, UserError> {

    const validationResult = userBusinessRule.validateProviderInfo(providerInfo)
    if (validationResult.isFailure()) {
      return validationResult
    }
    
    const user = new User(userId, providerInfo, createdAt)
    return new Success(user)
  }
}

/**
 * ユーザーのビジネスルール
 */
export const userBusinessRule = {
  /**
   * プロバイダー情報のビジネスルールチェック
   */
  validateProviderInfo: (providerInfo: Domain.ProviderUserInfo): Result<Domain.ProviderUserInfo, UserError> => {
    const nameResult = userBusinessRule.checkNameLength(providerInfo.google.name)
    if (nameResult.isFailure()) {
      return nameResult
    }

    const emailResult = userBusinessRule.checkEmailFormat(providerInfo.google.email)
    if (emailResult.isFailure()) {
      return emailResult
    }

    return new Success(providerInfo)
  },
  /**
   * ユーザー名の長さチェック（プロバイダー名から）
   */
  checkNameLength: (name: string): Result<string, UserError> => {
    if (name.length >= 1 && name.length <= 50) {
      return new Success(name)
    }
    return new Failure(ERROR.USER_ERRORS.INVALID_NAME_LENGTH)
  },
  /**
   * メールアドレスの形式チェック
   */
  checkEmailFormat: (email: string): Result<string, UserError> => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (emailRegex.test(email)) {
      return new Success(email)
    }
    return new Failure(ERROR.USER_ERRORS.INVALID_EMAIL_FORMAT)
  },
}
