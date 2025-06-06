import type { Db } from 'mongodb'

export interface IDbClient {
  connect(): Promise<void>
  getDb(dbName: string): Db | null
  close(): Promise<void>
} 
