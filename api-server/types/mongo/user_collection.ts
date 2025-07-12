import { ObjectId } from 'mongodb'

/**
 * 【DB】 Userのスキーマ
 */
export type UserCollection = {
  _id: ObjectId | string
  userId: number
  provider: {
    google: {
      id: string
      name: string
      email: string
      picture?: string  
    }
  }
  createdAt: Date
  updatedAt: Date
}
