import { InMemoryUserRepository } from '../../../../src/infrastructure/db/inMemory/user_repository'
import { createMockUser } from '../../../utils/test-helper'

describe('InMemoryUserRepository', () => {
  let repository: InMemoryUserRepository

  beforeEach(() => {
    repository = new InMemoryUserRepository()
  })

  describe('【正常系】', () => {
    test('ユーザーを保存できる', async () => {
      // Arrange
      const user = createMockUser('1', 'testuser')

      // Act
      await repository.save(user)

      // Assert
      const savedUser = await repository.findOne({ name: 'testuser' })
      expect(savedUser).toEqual(user)
    })

    test('ユーザーを検索できる', async () => {
      // Arrange
      const user1 = createMockUser('1', 'user1')
      const user2 = createMockUser('2', 'user2')
      await repository.save(user1)
      await repository.save(user2)

      // Act
      const foundUser = await repository.findOne({ name: 'user1' })

      // Assert
      expect(foundUser).toEqual(user1)
    })

    test('存在しないユーザーを検索した場合nullが返る', async () => {
      // Act
      const foundUser = await repository.findOne({ name: 'nonexistent' })

      // Assert
      expect(foundUser).toBeNull()
    })

    test('部分的な条件で検索できる', async () => {
      // Arrange
      const user = createMockUser('1', 'testuser')
      await repository.save(user)

      // Act
      const foundUser = await repository.findOne({ gender: 'male' })

      // Assert
      expect(foundUser).toEqual(user)
    })
  })
}) 
