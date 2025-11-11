import { Result, ServerError, EnglishStudyError } from '../../../../types'
import { EnglishWord } from '../../../domain/entity/english_word'

/**
 * EnglishWordリポジトリのインターフェース
 */
export interface IEnglishWordRepository {
  /**
   * ランダムにN個の英単語を取得
   */
  findRandom(count: number): Promise<Result<EnglishWord[], ServerError | EnglishStudyError>>
  
  /**
   * IDで英単語を取得
   */
  findById(id: string): Promise<Result<EnglishWord | null, ServerError | EnglishStudyError>>
  
  /**
   * 英単語を保存
   */
  save(word: EnglishWord): Promise<Result<EnglishWord, ServerError | EnglishStudyError>>
  
  /**
   * 英単語を一括保存
   */
  bulkSave(words: EnglishWord[]): Promise<Result<EnglishWord[], ServerError | EnglishStudyError>>
}

