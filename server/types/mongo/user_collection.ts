import type { ObjectId } from 'mongodb'

/**
 * 【DB】 Userのスキーマ
 */
export type UserCollection = {
  _id: ObjectId | string
  name: string
  gender: string
  password: string
  profilePic: string
}
