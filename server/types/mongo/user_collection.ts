import { ObjectId } from 'mongodb'

import { ProviderType } from '../domain/user'

/**
 * 【DB】 Userのスキーマ
 */
export type UserCollection = {
  _id: ObjectId | string
  userId: number
  provider: {
    type: ProviderType
    id: string
    name: string
    email: string
    picture?: string
  }
  createdAt: Date
  updatedAt: Date
}
