import type { User } from '../../../domain/entity/user'

export interface IUserRepository {
  findOne: (condition: Partial<User>) => Promise<User | null>
  save: (user: User) => Promise<void>
}
