import { ObjectId, Collection, Db, Filter } from 'mongodb'

import { ERROR } from '../../../../../constant'
import { Domain, Result, Success, Failure, UserError, ServerError } from '../../../../../types'
import { UserCollection } from '../../../../../types/mongo'
import { ILogger } from '../../../../adapter/interface/ilogger'
import { IUserRepository } from '../../../../adapter/interface/repository/iuser_repository'
import { User } from '../../../../domain/entity/user'

export class UserRepository implements IUserRepository {
  private _collection: Collection<UserCollection>
  private _logger: ILogger
  constructor(db: Db, logger: ILogger) {
    this._collection = db.collection('User')
    this._logger = logger
  }

  /**
   * ユーザー情報を取得
   */
  public async findOne(condition: Filter<UserCollection>): Promise<Result<User | null, UserError | ServerError>> {
    try {
      const userDoc = await this._collection.findOne(condition)
      
      if (!userDoc || Object.keys(userDoc).length === 0 ) {
        this._logger.info(`User not found: ${JSON.stringify(condition)}`)
        return new Success(null)
      }
      
      const providerInfo: Domain.ProviderUserInfo = {
        type: userDoc.provider.type,
        id: userDoc.provider.id,
        name: userDoc.provider.name,
        email: userDoc.provider.email,
        picture: userDoc.provider.picture
      }
      
      const userResult = User.restoreFromDb(
        userDoc.userId,
        providerInfo,
        userDoc.createdAt
      )

      if (userResult.isFailure()) {
        this._logger.error(new Error(`User restoration failed: ${userResult.error.errorCode}`))
        return userResult
      }

      return new Success(userResult.value)
    } catch (error) {
      this._logger.error(new Error(`Database error in findOne: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
    }
  }

  /**
   * ユーザー情報を保存
   */
  public async save(user: User): Promise<Result<User, UserError | ServerError>> {
    const userId = new ObjectId()
    const now = new Date()
    
    await this._collection.insertOne({
      _id: userId,
      userId: user.userId,
      provider: {
        type: user.provider.type,
        id: user.provider.id,
        name: user.provider.name,
        email: user.provider.email,
        picture: user.provider.picture
      },
      createdAt: user.createdAt,
      updatedAt: now
    })
    
    return new Success(user)
  }

  /**
   * ユーザー情報を更新
   */
  public async update(user: User): Promise<Result<User, UserError | ServerError>> {
    const now = new Date()
    
    await this._collection.updateOne(
      { userId: user.userId },
      {
        $set: {
          provider: {
            type: user.provider.type,
            id: user.provider.id,
            name: user.provider.name,
            email: user.provider.email,
            picture: user.provider.picture
          },
          updatedAt: now
        }
      }
    )
    
    return new Success(user)
  }
}
