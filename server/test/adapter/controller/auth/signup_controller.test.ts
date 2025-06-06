import { SignupController } from '../../../../src/adapter/controller/auth/signup_controller'
import { SignupUsecase } from '../../../../src/usecase/auth/signup_usecase'
import { SignupSerializer } from '../../../../src/adapter/serializer/auth/signup_serializer'
import { CONSTANT } from '../../../../constant'
import { 
  createMockLogger, 
  createSignupRequestBody,
  createMockUser 
} from '../../../utils/test-helper'

// モック化
jest.mock('../../../../src/usecase/auth/signup_usecase')
jest.mock('../../../../src/adapter/serializer/auth/signup_serializer')

describe('SignupController', () => {
  let mockSignupUsecase: jest.Mocked<SignupUsecase>
  let mockSerializer: jest.Mocked<SignupSerializer>
  let logger: ReturnType<typeof createMockLogger>
  let controller: SignupController

  beforeEach(() => {
    mockSignupUsecase = {
      exucute: jest.fn(),
    } as unknown as jest.Mocked<SignupUsecase>

    mockSerializer = {
      execute: jest.fn(),
      error: jest.fn(),
    } as unknown as jest.Mocked<SignupSerializer>

    logger = createMockLogger()
    controller = new SignupController(mockSignupUsecase, mockSerializer, logger)
  })

  describe('【正常系】', () => {
    test('正常なリクエストで成功レスポンスが返る', async () => {
      // Arrange
      const requestBody = createSignupRequestBody()
      const mockUser = createMockUser('1', requestBody.name)
      const mockResponse = {
        status: CONSTANT.STATUS_CODE.SUCCESS,
        data: { 
          id: '1', 
          name: 'testuser',
          gender: 'male',
          profilePic: 'http://example.com/profile.jpg'
        },
        responsedAt: new Date(),
      }

      mockSignupUsecase.exucute.mockResolvedValue(mockUser)
      mockSerializer.execute.mockReturnValue(mockResponse)

      // Act
      const result = await controller.execute(requestBody, 'api-token')

      // Assert
      expect(result.status).toBe(CONSTANT.STATUS_CODE.SUCCESS)
      expect(mockSignupUsecase.exucute).toHaveBeenCalledWith(requestBody, 'api-token')
      expect(mockSerializer.execute).toHaveBeenCalledWith(mockUser, 'api-token')
    })
  })

  describe('【異常系】', () => {
    test('ユースケースでエラーが発生した場合、エラーレスポンスが返る', async () => {
      // Arrange
      const requestBody = createSignupRequestBody()
      const error = new Error('パスワードが一致しません')
      const errorResponse = {
        status: CONSTANT.STATUS_CODE.SERVER_ERROR,
        message: 'パスワードが一致しません',
        responsedAt: new Date(),
      }
      
      mockSignupUsecase.exucute.mockRejectedValue(error)
      mockSerializer.error.mockReturnValue(errorResponse)

      // Act
      const result = await controller.execute(requestBody, 'api-token')

      // Assert
      expect(result.status).toBe(CONSTANT.STATUS_CODE.SERVER_ERROR)
      expect(mockSerializer.error).toHaveBeenCalledWith(error)
      expect(logger.error).toHaveBeenCalled()
    })
  })
}) 
