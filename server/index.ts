import { MongoClient } from './src/4-infrastructure/db/mongo/client'
import { PinoLogger } from './src/4-infrastructure/log/pino/logger'
import { ApiTokenGenerator } from './src/4-infrastructure/middleware/api_token'
import { ExpressServer } from './src/4-infrastructure/server/server'

(async() => {
  const apiPort = 8080
  const pinoLogger = new PinoLogger()
  const mongoClient = new MongoClient(pinoLogger)
  await mongoClient.connect()
  const apiToken = new ApiTokenGenerator()
  const apiServer = new ExpressServer(apiPort, mongoClient, pinoLogger, apiToken)
  apiServer.start()
})()
