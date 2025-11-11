import { ERROR } from '../../../constant'
import { Result, Success, Failure, EnglishStudyError } from '../../../types'

/**
 * 学習履歴エンティティ
 * 
 * 役割:
 * - 学習履歴のドメインオブジェクト
 * - ユーザーの回答記録を管理
 * - 不変性の保証
 */
export class StudyHistory {
  /** MongoDB ObjectID（文字列） */
  private _id: string
  /** ユーザーID */
  private readonly _userId: string
  /** 問題ID */
  private readonly _questionId: string
  /** 英単語 */
  private readonly _word: string
  /** 正解かどうか */
  private readonly _isCorrect: boolean
  /** 選択した回答 */
  private readonly _selectedAnswer: string
  /** 正解 */
  private readonly _correctAnswer: string
  /** 学習日時 */
  private readonly _studiedAt: Date

  private constructor(
    id: string,
    userId: string,
    questionId: string,
    word: string,
    isCorrect: boolean,
    selectedAnswer: string,
    correctAnswer: string,
    studiedAt: Date = new Date()
  ) {
    this._id = id
    this._userId = userId
    this._questionId = questionId
    this._word = word
    this._isCorrect = isCorrect
    this._selectedAnswer = selectedAnswer
    this._correctAnswer = correctAnswer
    this._studiedAt = studiedAt
  }

  // Getters
  public get id(): string {
    return this._id
  }

  public get userId(): string {
    return this._userId
  }

  public get questionId(): string {
    return this._questionId
  }

  public get word(): string {
    return this._word
  }

  public get isCorrect(): boolean {
    return this._isCorrect
  }

  public get selectedAnswer(): string {
    return this._selectedAnswer
  }

  public get correctAnswer(): string {
    return this._correctAnswer
  }

  public get studiedAt(): Date {
    return this._studiedAt
  }

  /**
   * 新しい学習履歴を作成
   * UseCase層で使用
   */
  static create(
    id: string,
    userId: string,
    questionId: string,
    word: string,
    isCorrect: boolean,
    selectedAnswer: string,
    correctAnswer: string
  ): Result<StudyHistory, EnglishStudyError> {
    const validationResult = studyHistoryBusinessRule.validate(
      userId,
      questionId,
      word,
      selectedAnswer,
      correctAnswer
    )
    
    if (validationResult.isFailure()) {
      return validationResult
    }

    const studyHistory = new StudyHistory(
      id,
      userId,
      questionId,
      word,
      isCorrect,
      selectedAnswer,
      correctAnswer
    )
    
    return new Success(studyHistory)
  }

  /**
   * DBから復元するためのStatic Factory Method
   * Infrastructure層（Repository）で使用
   */
  static restoreFromDb(
    id: string,
    userId: string,
    questionId: string,
    word: string,
    isCorrect: boolean,
    selectedAnswer: string,
    correctAnswer: string,
    studiedAt: Date
  ): Result<StudyHistory, EnglishStudyError> {
    const validationResult = studyHistoryBusinessRule.validate(
      userId,
      questionId,
      word,
      selectedAnswer,
      correctAnswer
    )
    
    if (validationResult.isFailure()) {
      return validationResult
    }

    const studyHistory = new StudyHistory(
      id,
      userId,
      questionId,
      word,
      isCorrect,
      selectedAnswer,
      correctAnswer,
      studiedAt
    )
    
    return new Success(studyHistory)
  }
}

/**
 * 学習履歴のビジネスルール
 */
export const studyHistoryBusinessRule = {
  /**
   * 学習履歴の総合的なバリデーション
   */
  validate: (
    userId: string,
    questionId: string,
    word: string,
    selectedAnswer: string,
    correctAnswer: string
  ): Result<void, EnglishStudyError> => {
    if (!userId || userId.trim().length === 0) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }

    if (!questionId || questionId.trim().length === 0) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_QUESTION_ID)
    }

    if (!word || word.trim().length === 0) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }

    if (!selectedAnswer || selectedAnswer.trim().length === 0) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }

    if (!correctAnswer || correctAnswer.trim().length === 0) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }

    return new Success(undefined)
  }
}

