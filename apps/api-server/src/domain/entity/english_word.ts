import { ERROR } from '../../../constant'
import { Result, Success, Failure, EnglishStudyError } from '../../../types'

/**
 * 英単語エンティティ
 * 
 * 役割:
 * - 英単語のドメインオブジェクト
 * - ビジネスルールの保持
 * - 不変性の保証
 */
export class EnglishWord {
  /** MongoDB ObjectID（文字列） */
  private _id: string
  /** 英単語 */
  private readonly _word: string
  /** 正解の日本語訳 */
  private readonly _correctAnswer: string
  /** 選択肢（正解を含む） */
  private readonly _choices: string[]
  /** 難易度（1-5） */
  private readonly _difficulty: number
  /** カテゴリ */
  private readonly _category: string
  /** 作成日時 */
  private readonly _createdAt: Date

  private constructor(
    id: string,
    word: string,
    correctAnswer: string,
    choices: string[],
    difficulty: number = 3,
    category: string = 'general',
    createdAt: Date = new Date()
  ) {
    this._id = id
    this._word = word
    this._correctAnswer = correctAnswer
    this._choices = choices
    this._difficulty = difficulty
    this._category = category
    this._createdAt = createdAt
  }

  // Getters
  public get id(): string {
    return this._id
  }

  public get word(): string {
    return this._word
  }

  public get correctAnswer(): string {
    return this._correctAnswer
  }

  public get choices(): string[] {
    return [...this._choices] // 不変性を保つためコピーを返す
  }

  public get difficulty(): number {
    return this._difficulty
  }

  public get category(): string {
    return this._category
  }

  public get createdAt(): Date {
    return this._createdAt
  }

  /**
   * 回答が正解かどうかを判定
   */
  public isCorrectAnswer(answer: string): boolean {
    return this._correctAnswer === answer
  }

  /**
   * 新しい英単語を作成
   * UseCase層やシーディングで使用
   */
  static create(
    id: string,
    word: string,
    correctAnswer: string,
    choices: string[],
    difficulty: number = 3,
    category: string = 'general'
  ): Result<EnglishWord, EnglishStudyError> {
    const validationResult = englishWordBusinessRule.validate(
      word,
      correctAnswer,
      choices,
      difficulty
    )
    
    if (validationResult.isFailure()) {
      return validationResult
    }

    const englishWord = new EnglishWord(
      id,
      word,
      correctAnswer,
      choices,
      difficulty,
      category
    )
    
    return new Success(englishWord)
  }

  /**
   * DBから復元するためのStatic Factory Method
   * Infrastructure層（Repository）で使用
   */
  static restoreFromDb(
    id: string,
    word: string,
    correctAnswer: string,
    choices: string[],
    difficulty: number,
    category: string,
    createdAt: Date
  ): Result<EnglishWord, EnglishStudyError> {
    const validationResult = englishWordBusinessRule.validate(
      word,
      correctAnswer,
      choices,
      difficulty
    )
    
    if (validationResult.isFailure()) {
      return validationResult
    }

    const englishWord = new EnglishWord(
      id,
      word,
      correctAnswer,
      choices,
      difficulty,
      category,
      createdAt
    )
    
    return new Success(englishWord)
  }
}

/**
 * 英単語のビジネスルール
 */
export const englishWordBusinessRule = {
  /**
   * 英単語の総合的なバリデーション
   */
  validate: (
    word: string,
    correctAnswer: string,
    choices: string[],
    difficulty: number
  ): Result<void, EnglishStudyError> => {
    const wordResult = englishWordBusinessRule.validateWord(word)
    if (wordResult.isFailure()) {
      return wordResult
    }

    const answerResult = englishWordBusinessRule.validateAnswer(correctAnswer)
    if (answerResult.isFailure()) {
      return answerResult
    }

    const choicesResult = englishWordBusinessRule.validateChoices(choices, correctAnswer)
    if (choicesResult.isFailure()) {
      return choicesResult
    }

    const difficultyResult = englishWordBusinessRule.validateDifficulty(difficulty)
    if (difficultyResult.isFailure()) {
      return difficultyResult
    }

    return new Success(undefined)
  },

  /**
   * 英単語のバリデーション
   */
  validateWord: (word: string): Result<void, EnglishStudyError> => {
    if (!word || word.trim().length === 0) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }
    if (word.length > 100) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }
    return new Success(undefined)
  },

  /**
   * 正解のバリデーション
   */
  validateAnswer: (answer: string): Result<void, EnglishStudyError> => {
    if (!answer || answer.trim().length === 0) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }
    return new Success(undefined)
  },

  /**
   * 選択肢のバリデーション
   */
  validateChoices: (choices: string[], correctAnswer: string): Result<void, EnglishStudyError> => {
    if (!choices || choices.length < 2) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }
    
    // 正解が選択肢に含まれているか確認
    if (!choices.includes(correctAnswer)) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }

    // 選択肢に重複がないか確認
    const uniqueChoices = new Set(choices)
    if (uniqueChoices.size !== choices.length) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }

    return new Success(undefined)
  },

  /**
   * 難易度のバリデーション
   */
  validateDifficulty: (difficulty: number): Result<void, EnglishStudyError> => {
    if (difficulty < 1 || difficulty > 5) {
      return new Failure(ERROR.ENGLISH_STUDY_ERRORS.INVALID_ANSWER)
    }
    return new Success(undefined)
  }
}

