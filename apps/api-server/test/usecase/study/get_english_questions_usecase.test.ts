import { GetEnglishQuestionsUsecase } from '../../../src/usecase/study/get_english_questions_usecase'
import { EnglishWord } from '../../../src/domain/entity/english_word'
import { IEnglishWordRepository } from '../../../src/adapter/interface/repository/ienglish_word_repository'
import { ILogger } from '../../../src/infrastructure/log/logger'
import { Success, Failure } from '../../../types'
import { ERROR } from '../../../constant'

describe('GetEnglishQuestionsUsecase', () => {
  let mockRepository: jest.Mocked<IEnglishWordRepository>
  let mockLogger: jest.Mocked<ILogger>
  let usecase: GetEnglishQuestionsUsecase

  beforeEach(() => {
    mockRepository = {
      findRandom: jest.fn(),
      findById: jest.fn(),
      save: jest.fn(),
      bulkSave: jest.fn()
    }

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    }

    usecase = new GetEnglishQuestionsUsecase(mockRepository, mockLogger)
  })

  describe('【正常系】', () => {
    test('10個の問題が正常に取得できる', async () => {
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

      mockRepository.findRandom.mockResolvedValue(new Success(mockWords))

      // Act
      const result = await usecase.execute()

      // Assert
      expect(result.isSuccess()).toBe(true)
      expect(result.value).toHaveLength(10)
      expect(mockRepository.findRandom).toHaveBeenCalledWith(10)
      expect(mockLogger.info).toHaveBeenCalled()
    })
  })

  describe('【異常系】', () => {
    test('問題が10個未満の場合はエラー', async () => {
      // Arrange
      const mockWords: EnglishWord[] = []
      for (let i = 0; i < 5; i++) {
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

      mockRepository.findRandom.mockResolvedValue(
        new Failure(ERROR.ENGLISH_STUDY_ERRORS.INSUFFICIENT_QUESTIONS)
      )

      // Act
      const result = await usecase.execute()

      // Assert
      expect(result.isFailure()).toBe(true)
      expect(result.error).toBe(ERROR.ENGLISH_STUDY_ERRORS.INSUFFICIENT_QUESTIONS)
      expect(mockLogger.error).toHaveBeenCalled()
    })

    test('リポジトリでエラーが発生した場合はエラー', async () => {
      // Arrange
      mockRepository.findRandom.mockResolvedValue(
        new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
      )

      // Act
      const result = await usecase.execute()

      // Assert
      expect(result.isFailure()).toBe(true)
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})

