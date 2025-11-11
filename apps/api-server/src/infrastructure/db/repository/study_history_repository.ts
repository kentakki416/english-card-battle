import { ObjectId, Collection, Db } from 'mongodb'

import { ERROR } from '../../../../constant'
import { Result, Success, Failure, ServerError, EnglishStudyError } from '../../../../types'
import { StudyHistoryCollection } from '../../../../types/mongo'
import { StudyHistory } from '../../../domain/entity/study_history'
import { IStudyHistoryRepository } from '../../../adapter/interface/repository/istudy_history_repository'
import { ILogger } from '../../log/logger'

/**
 * StudyHistoryリポジトリの実装
 */
export class StudyHistoryRepository implements IStudyHistoryRepository {
  private _collection: Collection<StudyHistoryCollection>
  private _logger: ILogger

  constructor(db: Db, logger: ILogger) {
    this._collection = db.collection('StudyHistory')
    this._logger = logger
  }

  /**
   * 学習履歴を保存
   */
  async save(history: StudyHistory): Promise<Result<StudyHistory, ServerError | EnglishStudyError>> {
    try {
      const historyId = new ObjectId()

      await this._collection.insertOne({
        _id: historyId,
        userId: history.userId,
        questionId: history.questionId,
        word: history.word,
        isCorrect: history.isCorrect,
        selectedAnswer: history.selectedAnswer,
        correctAnswer: history.correctAnswer,
        studiedAt: history.studiedAt
      })

      this._logger.info(`Study history saved for user: ${history.userId}`)
      return new Success(history)
    } catch (error) {
      this._logger.error(new Error(`Database error in save: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
    }
  }

  /**
   * 学習履歴を一括保存
   */
  async bulkSave(histories: StudyHistory[]): Promise<Result<StudyHistory[], ServerError | EnglishStudyError>> {
    try {
      const bulkOps = histories.map(history => ({
        insertOne: {
          document: {
            _id: new ObjectId(),
            userId: history.userId,
            questionId: history.questionId,
            word: history.word,
            isCorrect: history.isCorrect,
            selectedAnswer: history.selectedAnswer,
            correctAnswer: history.correctAnswer,
            studiedAt: history.studiedAt
          }
        }
      }))

      await this._collection.bulkWrite(bulkOps)
      this._logger.info(`Bulk saved ${histories.length} study histories`)
      return new Success(histories)
    } catch (error) {
      this._logger.error(new Error(`Database error in bulkSave: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
    }
  }

  /**
   * ユーザーIDで学習履歴を取得
   */
  async findByUserId(
    userId: string,
    limit: number = 100
  ): Promise<Result<StudyHistory[], ServerError | EnglishStudyError>> {
    try {
      const historyDocs = await this._collection
        .find({ userId })
        .sort({ studiedAt: -1 })
        .limit(limit)
        .toArray()

      const histories: StudyHistory[] = []
      for (const doc of historyDocs) {
        const historyResult = StudyHistory.restoreFromDb(
          doc._id.toString(),
          doc.userId,
          doc.questionId,
          doc.word,
          doc.isCorrect,
          doc.selectedAnswer,
          doc.correctAnswer,
          doc.studiedAt
        )

        if (historyResult.isFailure()) {
          this._logger.error(new Error(`Failed to restore history: ${historyResult.error.message}`))
          return historyResult
        }

        histories.push(historyResult.value)
      }

      return new Success(histories)
    } catch (error) {
      this._logger.error(new Error(`Database error in findByUserId: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
    }
  }
}

