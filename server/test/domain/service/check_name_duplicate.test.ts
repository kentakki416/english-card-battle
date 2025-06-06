import { describe } from 'node:test'
import  { IUserRepository } from '../../../src/3-adapter/interface/repository/iuser_repository'
import { UserDomainService } from '../../../src/1-domain/service/user/check_name_duplicate'

describe(__filename, () => {
  let userRepo: jest.Mocked<Pick<IUserRepository, 'findOne'>>
  let userDomainService: UserDomainService

  beforeEach(() => {
    userRepo = {
      findOne: jest.fn(),
    }
    userDomainService = new UserDomainService(userRepo as unknown as IUserRepository)
  })
  describe('【正常系】', () => {
    test('ユーザー名が重複していない場合,trueが買える', async () => {

    })
  })
})
