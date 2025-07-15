import { MongoClient as MongoClientType } from "mongodb"

import { createMockLogger } from "../utils/test-helper"

let mongoClient: MongoClientType
let testDbName: string

/**
 * テスト用MongoDBセットアップ
 */
export const setupTestDatabase = async () => {
  const logger = createMockLogger()
  const mongoUri = process.env.TEST_MONGO_URI || "mongodb://root:password@localhost:27017"
  testDbName = "test_db"
  
  mongoClient = new MongoClientType(mongoUri)
  
  // MongoDB接続
  await mongoClient.connect()
  
  return {
    mongoClient,
    logger,
    db: mongoClient.db(testDbName)
  }
}

/**
 * テスト用データベースクリーンアップ
 */
export const cleanupTestDatabase = async () => {
  if (mongoClient) {
    // テストデータベース全体をクリア
    const db = mongoClient.db(testDbName)
    const collections = await db.listCollections().toArray()
    
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({})
    }
    
    await mongoClient.close()
  }
}

/**
 * テスト用データベース初期化（各テストケース前）
 */
export const resetTestDatabase = async () => {
  if (mongoClient) {
    const db = mongoClient.db(testDbName)
    const collections = await db.listCollections().toArray()
    
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({})
    }
  }
} 
