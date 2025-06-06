import { SignupUsecase } from '../../src/usecase/auth/signup_usecase'
import { SignupController } from '../../src/adapter/controller/auth/signup_controller'
import { SignupSerializer } from '../../src/adapter/serializer/auth/signup_serializer'
import { InMemoryUserRepository } from '../../src/infrastructure/db/inMemory/user_repository'
import { Hash } from '../../src/infrastructure/util/hash'
import { CONSTANT } from '../../constant'
import { createMockLogger, createSignupRequestBody } from '../utils/test-helper'

describe('Auth E2E Tests', () => {
  let userRepository: InMemoryUserRepository
  let logger: ReturnType<typeof createMockLogger>
  let hash: Hash
  let signupUsecase: SignupUsecase
  let serializer: SignupSerializer
  let controller: SignupController

  beforeEach(() => {
    userRepository = new InMemoryUserRepository()
    logger = createMockLogger()
    hash = new Hash()
    signupUsecase = new SignupUsecase(userRepository, logger, hash)
    serializer = new SignupSerializer()
    controller = new SignupController(signupUsecase, serializer, logger)
  })

  describe('【サインアップフロー】', () => {
    test('完全なサインアップフローが正常に動作する', async () => {
      // Arrange
      const requestBody = createSignupRequestBody({
        name: 'e2euser',
        password: 'password123',
        confirmPassword: 'password123',
        gender: 'female'
      })

      // Act
      const response = await controller.execute(requestBody, 'test-api-token')

      // Assert
      expect(response.status).toBe(CONSTANT.STATUS_CODE.SUCCESS)
      
      if ('data' in response) {
        const data = response.data as { id: string; name: string; gender: string; profilePic: string }
        expect(data.name).toBe('e2euser')
        expect(data.gender).toBe('female')
        expect(data.profilePic).toContain('e2euser')
        expect(data.id).toBe('test-api-token')
      }

      // リポジトリにユーザーが保存されていることを確認
      const savedUser = await userRepository.findOne({ name: 'e2euser' })
      expect(savedUser).not.toBeNull()
      expect(savedUser?.name).toBe('e2euser')
    })

    test('重複したユーザー名でサインアップしようとするとエラーになる', async () => {
      // Arrange
      const requestBody = createSignupRequestBody({ name: 'dupuser' })
      
      // 最初のユーザーを作成
      await controller.execute(requestBody, 'api-token-1')

      // Act - 同じ名前で再度作成しようとする
      const response = await controller.execute(requestBody, 'api-token-2')

      // Assert
      expect(response.status).toBe(CONSTANT.STATUS_CODE.SERVER_ERROR)
      if ('message' in response) {
        expect(response.message).toBe('ユーザー名が重複しています')
      }
    })

    test('無効なパスワードでサインアップしようとするとエラーになる', async () => {
      // Arrange
      const requestBody = createSignupRequestBody({
        password: '123', // 5文字未満
        confirmPassword: '123'
      })

      // Act
      const response = await controller.execute(requestBody, 'api-token')

      // Assert
      expect(response.status).toBe(CONSTANT.STATUS_CODE.SERVER_ERROR)
      if ('message' in response) {
        expect(response.message).toBe('パスワードは5文字以上12文字以下である必要があります')
      }
    })

    test('パスワード確認が一致しない場合エラーになる', async () => {
      // Arrange
      const requestBody = createSignupRequestBody({
        password: 'password123',
        confirmPassword: 'different123'
      })

      // Act
      const response = await controller.execute(requestBody, 'api-token')

      // Assert
      expect(response.status).toBe(CONSTANT.STATUS_CODE.SERVER_ERROR)
      if ('message' in response) {
        expect(response.message).toBe('パスワードが一致しません')
      }
    })
  })
}) 
