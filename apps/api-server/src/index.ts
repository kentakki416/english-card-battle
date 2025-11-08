import { MongoClient } from './infrastructure/db/client'
import { DIContainer } from './infrastructure/di/di_container'
import { PinoLogger } from './infrastructure/log/logger'
import { ExpressServer } from './infrastructure/server/server'

(async() => {
  const apiPort = 8080

  const pinoLogger = new PinoLogger()
  
  const dbClient = new MongoClient(pinoLogger)
  await dbClient.connect()

  const diContainer = new DIContainer(dbClient, pinoLogger)

  const apiServer = new ExpressServer(apiPort, diContainer, pinoLogger)
  apiServer.start()
})()
