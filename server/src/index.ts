import { MongoClient } from './infrastructure/db/mongo/client'
import { InMemoryClient } from './infrastructure/db/inMemory/client'
import { PinoLogger } from './infrastructure/log/pino/logger'
import { ApiTokenGenerator } from './infrastructure/middleware/api_token'
import { ExpressServer } from './infrastructure/server/server'

(async() => {
  const apiPort = 8080
  const pinoLogger = new PinoLogger()
  
  // 環境変数に応じてデータベースクライアントを切り替え
  const env = process.env.NODE_ENV || 'dev'
  const dbClient = env === 'dev' 
    ? new InMemoryClient(pinoLogger)
    : new MongoClient(pinoLogger)
  
  await dbClient.connect()
  const apiToken = new ApiTokenGenerator()
  const apiServer = new ExpressServer(apiPort, dbClient, pinoLogger, apiToken)
  apiServer.start()
})()
