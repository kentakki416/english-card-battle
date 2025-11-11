import { ObjectId } from 'mongodb'

/**
 * StudyHistoryコレクションのドキュメント型定義
 */
export interface StudyHistoryCollection {
  _id: ObjectId
  userId: string
  questionId: string
  word: string
  isCorrect: boolean
  selectedAnswer: string
  correctAnswer: string
  studiedAt: Date
}

