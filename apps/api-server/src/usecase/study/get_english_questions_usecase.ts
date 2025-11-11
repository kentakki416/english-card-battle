import { ERROR } from '../../../constant'
import { Result, Success, Failure, ServerError, EnglishStudyError } from '../../../types'
import { EnglishWord } from '../../domain/entity/english_word'
import { IEnglishWordRepository } from '../../adapter/interface/repository/ienglish_word_repository'
import { ILogger } from '../../infrastructure/log/logger'

/**
 * 英語問題取得ユースケース
 * 
 * 役割:
 * - ランダムに10個の英単語問題を取得
 * - 問題数の検証
 */
export class GetEnglishQuestionsUsecase {
  private static readonly QUESTION_COUNT = 10

  constructor(
    private englishWordRepository: IEnglishWordRepository,
    private logger: ILogger
  ) {}

  async execute(): Promise<Result<EnglishWord[], ServerError | EnglishStudyError>> {
    try {
      // ランダムに10個の英単語を取得
      const wordsResult = await this.englishWordRepository.findRandom(
        GetEnglishQuestionsUsecase.QUESTION_COUNT
      )

      if (wordsResult.isFailure()) {
        this.logger.error(new Error(`Failed to get questions: ${wordsResult.error.message}`))
        return wordsResult
      }

      const words = wordsResult.value

      // 問題数の検証
      if (words.length < GetEnglishQuestionsUsecase.QUESTION_COUNT) {
        this.logger.error(
          new Error(`Insufficient questions: ${words.length}/${GetEnglishQuestionsUsecase.QUESTION_COUNT}`)
        )
        return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INSUFFICIENT_QUESTIONS)
      }

      this.logger.info(`Successfully retrieved ${words.length} questions`)
      return new Success(words)
    } catch (error) {
      this.logger.error(new Error(`Unexpected error in GetEnglishQuestionsUsecase: ${error}`))
      return new Failure(ERROR.SERVER_ERRORS.SERVER_ERROR)
    }
  }
}

