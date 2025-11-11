import { Result, ServerError, EnglishStudyError } from '../../../../types'
import { StudyHistory } from '../../../domain/entity/study_history'

/**
 * StudyHistoryリポジトリのインターフェース
 */
export interface IStudyHistoryRepository {
  /**
   * 学習履歴を保存
   */
  save(history: StudyHistory): Promise<Result<StudyHistory, ServerError | EnglishStudyError>>
  
  /**
   * 学習履歴を一括保存
   */
  bulkSave(histories: StudyHistory[]): Promise<Result<StudyHistory[], ServerError | EnglishStudyError>>
  
  /**
   * ユーザーIDで学習履歴を取得
   */
  findByUserId(userId: string, limit?: number): Promise<Result<StudyHistory[], ServerError | EnglishStudyError>>
}

