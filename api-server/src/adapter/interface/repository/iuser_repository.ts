import { Filter } from "mongodb"

import { Result } from "../../../../types"
import { UserError, ServerError } from "../../../../types/error"
import { UserCollection } from "../../../../types/mongo"
import { User } from "../../../domain/entity/user"

export interface IUserRepository {
  findOne: (condition: Filter<UserCollection>) => Promise<Result<User | null, UserError | ServerError>>
  save: (user: User) => Promise<Result<User, UserError | ServerError>>
  update: (user: User) => Promise<Result<User, UserError | ServerError>>
}
