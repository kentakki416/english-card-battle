import { Db } from 'mongodb'

export interface IDbClient {
  connect(): Promise<void>
  getDb(dbName: string): Db
  close(): Promise<void>
} 
