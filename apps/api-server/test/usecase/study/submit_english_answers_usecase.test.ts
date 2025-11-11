import { SubmitEnglishAnswersUsecase } from '../../../src/usecase/study/submit_english_answers_usecase'
import { IStudyHistoryRepository } from '../../../src/adapter/interface/repository/istudy_history_repository'
import { ILogger } from '../../../src/infrastructure/log/logger'
import { Success, Failure } from '../../../types'
import { ERROR } from '../../../constant'

describe('SubmitEnglishAnswersUsecase', () => {
  let mockHistoryRepository: jest.Mocked<IStudyHistoryRepository>
  let mockLogger: jest.Mocked<ILogger>
  let usecase: SubmitEnglishAnswersUsecase

  beforeEach(() => {
    mockHistoryRepository = {
      save: jest.fn(),
      bulkSave: jest.fn(),
      findByUserId: jest.fn()
    }

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    }

    usecase = new SubmitEnglishAnswersUsecase(
      mockHistoryRepository,
      mockLogger
    )
  })

  describe('【正常系】', () => {
    test('全問正解の場合、スコアが正しく計算される', async () => {
      // Arrange
      mockHistoryRepository.bulkSave.mockResolvedValue(new Success([]))

      const request = {
        userId: 'user123',
        results: [
          {
            questionId: 'id1',
            word: 'deploy',
            isCorrect: true,
            selectedAnswer: 'デプロイする',
            correctAnswer: 'デプロイする'
          },
          {
            questionId: 'id2',
            word: 'commit',
            isCorrect: true,
            selectedAnswer: 'コミットする',
            correctAnswer: 'コミットする'
          }
        ]
      }

      // Act
      const result = await usecase.execute(request)

      // Assert
      expect(result.isSuccess()).toBe(true)
      expect(result.value.score).toBe(2)
      expect(result.value.totalQuestions).toBe(2)
      expect(result.value.results).toHaveLength(2)
      expect(result.value.results[0].isCorrect).toBe(true)
      expect(result.value.results[1].isCorrect).toBe(true)
      expect(mockHistoryRepository.bulkSave).toHaveBeenCalled()
    })

    test('一部不正解の場合、スコアが正しく計算される', async () => {
      // Arrange
      mockHistoryRepository.bulkSave.mockResolvedValue(new Success([]))

      const request = {
        userId: 'user123',
        results: [
          {
            questionId: 'id1',
            word: 'deploy',
            isCorrect: true,
            selectedAnswer: 'デプロイする',
            correctAnswer: 'デプロイする'
          },
          {
            questionId: 'id2',
            word: 'commit',
            isCorrect: false,
            selectedAnswer: '削除する',
            correctAnswer: 'コミットする'
          }
        ]
      }

      // Act
      const result = await usecase.execute(request)

      // Assert
      expect(result.isSuccess()).toBe(true)
      expect(result.value.score).toBe(1)
      expect(result.value.totalQuestions).toBe(2)
      expect(result.value.results[0].isCorrect).toBe(true)
      expect(result.value.results[1].isCorrect).toBe(false)
    })
  })

  describe('【異常系】', () => {
    test('結果が空の場合はエラー', async () => {
      // Arrange
      const request = {
        userId: 'user123',
        results: []
      }

      // Act
      const result = await usecase.execute(request)

      // Assert
      expect(result.isFailure()).toBe(true)
      expect(result.error).toBe(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER_COUNT)
      expect(mockLogger.error).toHaveBeenCalled()
    })

    test('履歴保存に失敗した場合はエラー', async () => {
      // Arrange
      mockHistoryRepository.bulkSave.mockResolvedValue(
        new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
      )

      const request = {
        userId: 'user123',
        results: [
          {
            questionId: 'id1',
            word: 'deploy',
            isCorrect: true,
            selectedAnswer: 'デプロイする',
            correctAnswer: 'デプロイする'
          }
        ]
      }

      // Act
      const result = await usecase.execute(request)

      // Assert
      expect(result.isFailure()).toBe(true)
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})

