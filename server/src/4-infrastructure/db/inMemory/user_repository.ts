import type { User } from '../../../1-domain/entity/user'
import type { IUserRepository } from '../../../3-adapter/interface/repository/iuser_repository'


export class InMemoryUserRepository implements IUserRepository {
  public DB: {
    [id: number]: User
  }

  constructor() {
    this.DB = {}
  }

  public async save(user: User) {
    this.DB[user.userId] = user
  }

  public async findOne(condition: Partial<User>) {
    const user = Object.values(this.DB).filter((user) => { return this._matchesCondition(user, condition)})
    return user[0] || null
  }

  private _matchesCondition(user: User, condition: Partial<User>) {
    for (const key in condition) {
      if (condition[key as keyof User] !== undefined && condition[key as keyof User] !== user[key as keyof User]) {
        return false
      }
    }
    return true
  }
}
