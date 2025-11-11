import { GetEnglishQuestionsController } from '../../../../src/adapter/controller/study/get_english_questions_controller'
import { GetEnglishQuestionsUsecase } from '../../../../src/usecase/study/get_english_questions_usecase'
import { GetEnglishQuestionsSerializer } from '../../../../src/adapter/serializer/study/get_english_questions_serializer'
import { EnglishWord } from '../../../../src/domain/entity/english_word'
import { ILogger } from '../../../../src/infrastructure/log/logger'
import { Success, Failure } from '../../../../types'
import { ERROR } from '../../../../constant'

describe('GetEnglishQuestionsController', () => {
  let mockUsecase: jest.Mocked<GetEnglishQuestionsUsecase>
  let mockSerializer: GetEnglishQuestionsSerializer
  let mockLogger: jest.Mocked<ILogger>
  let controller: GetEnglishQuestionsController

  beforeEach(() => {
    mockUsecase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<GetEnglishQuestionsUsecase>

    mockSerializer = new GetEnglishQuestionsSerializer()

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    }

    controller = new GetEnglishQuestionsController(
      mockUsecase,
      mockSerializer,
      mockLogger
    )
  })

  describe('【正常系】', () => {
    test('問題取得が成功する', async () => {
      // Arrange
      const mockWords: EnglishWord[] = []
      for (let i = 0; i < 10; i++) {
        const wordResult = EnglishWord.create(
          `id${i}`,
          `word${i}`,
          `answer${i}`,
          [`answer${i}`, 'wrong1', 'wrong2', 'wrong3'],
          3,
          'development'
        )
        mockWords.push(wordResult.value)
      }

      mockUsecase.execute.mockResolvedValue(new Success(mockWords))

      // Act
      const response = await controller.execute()

      // Assert
      expect(response.status).toBe(200)
      expect(response.data).toBeDefined()
      expect(response.data.questions).toHaveLength(10)
      expect(response.data.questions[0].correctAnswer).toBeDefined() // 正解が含まれていることを確認
      expect(mockUsecase.execute).toHaveBeenCalled()
    })
  })

  describe('【異常系】', () => {
    test('問題数不足エラーが返される', async () => {
      // Arrange
      mockUsecase.execute.mockResolvedValue(
        new Failure(ERROR.ENGLISH_STUDY_ERRORS.INSUFFICIENT_QUESTIONS)
      )

      // Act
      const response = await controller.execute()

      // Assert
      expect(response.status).toBe(500)
      expect(response.errorCode).toBeDefined()
      expect(mockLogger.error).toHaveBeenCalled()
    })

    test('サーバーエラーが返される', async () => {
      // Arrange
      mockUsecase.execute.mockResolvedValue(
        new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
      )

      // Act
      const response = await controller.execute()

      // Assert
      expect(response.status).toBe(500)
      expect(response.errorCode).toBeDefined()
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})

