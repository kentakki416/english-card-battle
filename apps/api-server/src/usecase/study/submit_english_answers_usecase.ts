import { ObjectId } from 'mongodb'

import { ERROR } from '../../../constant'
import { Result, Success, Failure, ServerError, EnglishStudyError } from '../../../types'
import { StudyHistory } from '../../domain/entity/study_history'
import { IStudyHistoryRepository } from '../../adapter/interface/repository/istudy_history_repository'
import { ILogger } from '../../infrastructure/log/logger'

/**
 * 回答送信リクエストの型
 * クライアント側で正解判定済みの結果を受け取る
 */
export interface SubmitAnswersRequest {
  userId: string
  results: {
    questionId: string
    word: string
    isCorrect: boolean
    selectedAnswer: string
    correctAnswer: string
  }[]
}

/**
 * 回答結果の型
 */
export interface AnswerResult {
  questionId: string
  word: string
  isCorrect: boolean
  selectedAnswer: string
  correctAnswer: string
}

/**
 * レスポンスの型
 */
export interface SubmitAnswersResponse {
  results: AnswerResult[]
  score: number
  totalQuestions: number
}

/**
 * 英語回答送信ユースケース
 * 
 * 役割:
 * - クライアント側で判定済みの結果を受け取る
 * - 学習履歴の保存
 * - スコアの計算（検証のため）
 * 
 * 注意: 正解判定はクライアント側で実施済み
 */
export class SubmitEnglishAnswersUsecase {
  constructor(
    private studyHistoryRepository: IStudyHistoryRepository,
    private logger: ILogger
  ) {}

  async execute(
    request: SubmitAnswersRequest
  ): Promise<Result<SubmitAnswersResponse, ServerError | EnglishStudyError>> {
    try {
      const { userId, results } = request

      // 結果の検証
      if (!results || results.length === 0) {
        this.logger.error(new Error('No results provided'))
        return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER_COUNT)
      }

      const histories: StudyHistory[] = []
      let correctCount = 0

      // クライアント側で判定済みの結果を処理
      for (const result of results) {
        const { questionId, word, isCorrect, selectedAnswer, correctAnswer } = result

        if (isCorrect) {
          correctCount++
        }

        // 学習履歴を作成
        const historyResult = StudyHistory.create(
          new ObjectId().toString(),
          userId,
          questionId,
          word,
          isCorrect,
          selectedAnswer,
          correctAnswer
        )

        if (historyResult.isFailure()) {
          this.logger.error(new Error(`Failed to create history: ${historyResult.error.message}`))
          return historyResult
        }

        histories.push(historyResult.value)
      }

      // 学習履歴を一括保存
      const saveResult = await this.studyHistoryRepository.bulkSave(histories)
      if (saveResult.isFailure()) {
        this.logger.error(new Error(`Failed to save histories: ${saveResult.error.message}`))
        return saveResult
      }

      const totalQuestions = results.length
      this.logger.info(`User ${userId} scored ${correctCount}/${totalQuestions}`)

      return new Success({
        results: results.map(r => ({
          questionId: r.questionId,
          word: r.word,
          isCorrect: r.isCorrect,
          selectedAnswer: r.selectedAnswer,
          correctAnswer: r.correctAnswer
        })),
        score: correctCount,
        totalQuestions
      })
    } catch (error) {
      this.logger.error(new Error(`Unexpected error in SubmitEnglishAnswersUsecase: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.SERVER_ERROR)
    }
  }
}

