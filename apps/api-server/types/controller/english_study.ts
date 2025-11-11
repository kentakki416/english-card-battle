/**
 * 英語学習関連のコントローラー型定義
 */

/**
 * 英語問題取得リクエスト
 */
export type GetEnglishQuestionsRequest = {
  userId: string
}

/**
 * 英語問題取得レスポンス
 */
export type GetEnglishQuestionsResponse = {
  questions: {
    questionId: string
    word: string
    choices: string[]
    correctAnswer: string // クライアント側で判定するため正解も送信
  }[]
}

/**
 * 英語回答送信リクエスト
 * クライアント側で正解判定済みの結果を送信
 */
export type SubmitEnglishAnswersRequest = {
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
 * 英語回答送信レスポンス
 */
export type SubmitEnglishAnswersResponse = {
  results: {
    questionId: string
    word: string
    isCorrect: boolean
    correctAnswer: string
    selectedAnswer: string
  }[]
  score: number
  totalQuestions: number
}

/**
 * 英語学習エラーレスポンス
 */
export type EnglishStudyErrorResponse = {
  status: number
  message: string
  errorCode?: number
  responsedAt: Date
}

