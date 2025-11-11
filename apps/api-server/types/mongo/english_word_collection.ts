import { ObjectId } from 'mongodb'

/**
 * EnglishWordコレクションのドキュメント型定義
 */
export interface EnglishWordCollection {
  _id: ObjectId
  word: string
  correctAnswer: string
  choices: string[]
  difficulty: number
  category: string
  createdAt: Date
}

