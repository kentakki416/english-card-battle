import { IUserRepository } from "../../../adapter/interface/repository/iuser_repository"

export class UserDomainService {
  private _userRepo: IUserRepository

  constructor(userRepository: IUserRepository) {
    this._userRepo = userRepository
  }

  /**
   * ユーザー名が重複していないかのチェック（DBに保存するときだけで良い）
   */
  public async checkNameDuplicate(name: string) {
    const existUser = await this._userRepo.findOne({ name })
    return existUser ? false : true
  }
}
