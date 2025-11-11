import { SubmitEnglishAnswersController } from '../../../../src/adapter/controller/study/submit_english_answers_controller'
import { SubmitEnglishAnswersUsecase, SubmitAnswersResponse } from '../../../../src/usecase/study/submit_english_answers_usecase'
import { SubmitEnglishAnswersSerializer } from '../../../../src/adapter/serializer/study/submit_english_answers_serializer'
import { ILogger } from '../../../../src/infrastructure/log/logger'
import { Controller, Success, Failure } from '../../../../types'
import { ERROR } from '../../../../constant'

describe('SubmitEnglishAnswersController', () => {
  let mockUsecase: jest.Mocked<SubmitEnglishAnswersUsecase>
  let mockSerializer: SubmitEnglishAnswersSerializer
  let mockLogger: jest.Mocked<ILogger>
  let controller: SubmitEnglishAnswersController

  beforeEach(() => {
    mockUsecase = {
      execute: jest.fn()
    } as unknown as jest.Mocked<SubmitEnglishAnswersUsecase>

    mockSerializer = new SubmitEnglishAnswersSerializer()

    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn()
    }

    controller = new SubmitEnglishAnswersController(
      mockUsecase,
      mockSerializer,
      mockLogger
    )
  })

  describe('【正常系】', () => {
    test('回答送信が成功する', async () => {
      // Arrange
      const request: Controller.SubmitEnglishAnswersRequest = {
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

      const usecaseResponse: SubmitAnswersResponse = {
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
        ],
        score: 2,
        totalQuestions: 2
      }

      mockUsecase.execute.mockResolvedValue(new Success(usecaseResponse))

      // Act
      const response = await controller.execute(request)

      // Assert
      expect(response.status).toBe(200)
      expect(response.data).toBeDefined()
      expect(response.data.score).toBe(2)
      expect(response.data.totalQuestions).toBe(2)
      expect(response.data.results).toHaveLength(2)
      expect(mockUsecase.execute).toHaveBeenCalledWith(request)
    })

    test('一部不正解の回答が正しく処理される', async () => {
      // Arrange
      const request: Controller.SubmitEnglishAnswersRequest = {
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

      const usecaseResponse: SubmitAnswersResponse = {
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
        ],
        score: 1,
        totalQuestions: 2
      }

      mockUsecase.execute.mockResolvedValue(new Success(usecaseResponse))

      // Act
      const response = await controller.execute(request)

      // Assert
      expect(response.status).toBe(200)
      expect(response.data.score).toBe(1)
      expect(response.data.results[0].isCorrect).toBe(true)
      expect(response.data.results[1].isCorrect).toBe(false)
    })
  })

  describe('【異常系】', () => {
    test('結果が空の場合はエラー', async () => {
      // Arrange
      const request: Controller.SubmitEnglishAnswersRequest = {
        userId: 'user123',
        results: []
      }

      mockUsecase.execute.mockResolvedValue(
        new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER_COUNT)
      )

      // Act
      const response = await controller.execute(request)

      // Assert
      expect(response.status).toBe(400)
      expect(response.errorCode).toBeDefined()
      expect(mockLogger.error).toHaveBeenCalled()
    })

    test('サーバーエラーが返される', async () => {
      // Arrange
      const request: Controller.SubmitEnglishAnswersRequest = {
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

      mockUsecase.execute.mockResolvedValue(
        new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
      )

      // Act
      const response = await controller.execute(request)

      // Assert
      expect(response.status).toBe(500)
      expect(response.errorCode).toBeDefined()
      expect(mockLogger.error).toHaveBeenCalled()
    })
  })
})

