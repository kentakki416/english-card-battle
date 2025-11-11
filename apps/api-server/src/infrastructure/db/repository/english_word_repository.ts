import { ObjectId, Collection, Db } from 'mongodb'

import { ERROR } from '../../../../constant'
import { Result, Success, Failure, ServerError, EnglishStudyError } from '../../../../types'
import { EnglishWordCollection } from '../../../../types/mongo'
import { EnglishWord } from '../../../domain/entity/english_word'
import { IEnglishWordRepository } from '../../../adapter/interface/repository/ienglish_word_repository'
import { ILogger } from '../../log/logger'

/**
 * EnglishWordリポジトリの実装
 */
export class EnglishWordRepository implements IEnglishWordRepository {
  private _collection: Collection<EnglishWordCollection>
  private _logger: ILogger

  constructor(db: Db, logger: ILogger) {
    this._collection = db.collection('EnglishWord')
    this._logger = logger
  }

  /**
   * ランダムにN個の英単語を取得
   */
  async findRandom(count: number): Promise<Result<EnglishWord[], ServerError | EnglishStudyError>> {
    try {
      const wordDocs = await this._collection
        .aggregate([{ $sample: { size: count } }])
        .toArray()

      if (wordDocs.length < count) {
        this._logger.warn(`Requested ${count} words, but only ${wordDocs.length} available`)
        return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INSUFFICIENT_QUESTIONS)
      }

      const words: EnglishWord[] = []
      for (const doc of wordDocs) {
        const wordResult = EnglishWord.restoreFromDb(
          doc._id.toString(),
          doc.word,
          doc.correctAnswer,
          doc.choices,
          doc.difficulty,
          doc.category,
          doc.createdAt
        )

        if (wordResult.isFailure()) {
          this._logger.error(new Error(`Failed to restore word: ${wordResult.error.message}`))
          return wordResult
        }

        words.push(wordResult.value)
      }

      return new Success(words)
    } catch (error) {
      this._logger.error(new Error(`Database error in findRandom: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
    }
  }

  /**
   * IDで英単語を取得
   */
  async findById(id: string): Promise<Result<EnglishWord | null, ServerError | EnglishStudyError>> {
    try {
      const wordDoc = await this._collection.findOne({ _id: new ObjectId(id) })

      if (!wordDoc) {
        this._logger.info(`Word not found: ${id}`)
        return new Success(null)
      }

      const wordResult = EnglishWord.restoreFromDb(
        wordDoc._id.toString(),
        wordDoc.word,
        wordDoc.correctAnswer,
        wordDoc.choices,
        wordDoc.difficulty,
        wordDoc.category,
        wordDoc.createdAt
      )

      if (wordResult.isFailure()) {
        this._logger.error(new Error(`Failed to restore word: ${wordResult.error.message}`))
        return wordResult
      }

      return new Success(wordResult.value)
    } catch (error) {
      this._logger.error(new Error(`Database error in findById: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
    }
  }

  /**
   * 英単語を保存
   */
  async save(word: EnglishWord): Promise<Result<EnglishWord, ServerError | EnglishStudyError>> {
    try {
      const wordId = new ObjectId()

      await this._collection.insertOne({
        _id: wordId,
        word: word.word,
        correctAnswer: word.correctAnswer,
        choices: word.choices,
        difficulty: word.difficulty,
        category: word.category,
        createdAt: word.createdAt
      })

      this._logger.info(`Word saved: ${word.word}`)
      return new Success(word)
    } catch (error) {
      this._logger.error(new Error(`Database error in save: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
    }
  }

  /**
   * 英単語を一括保存
   */
  async bulkSave(words: EnglishWord[]): Promise<Result<EnglishWord[], ServerError | EnglishStudyError>> {
    try {
      const bulkOps = words.map(word => ({
        insertOne: {
          document: {
            _id: new ObjectId(),
            word: word.word,
            correctAnswer: word.correctAnswer,
            choices: word.choices,
            difficulty: word.difficulty,
            category: word.category,
            createdAt: word.createdAt
          }
        }
      }))

      await this._collection.bulkWrite(bulkOps)
      this._logger.info(`Bulk saved ${words.length} words`)
      return new Success(words)
    } catch (error) {
      this._logger.error(new Error(`Database error in bulkSave: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.DATABASE_ERROR)
    }
  }
}

