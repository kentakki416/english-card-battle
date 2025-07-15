import { MongoClient } from "./infrastructure/db/mongo/client"
import { DIContainer } from "./infrastructure/di/container"
import { PinoLogger } from "./infrastructure/log/pino/logger"
import { ExpressServer } from "./infrastructure/server/server"

(async() => {
  const apiPort = 8080

  const pinoLogger = new PinoLogger()
  
  const dbClient = new MongoClient(pinoLogger)
  await dbClient.connect()

  const diContainer = new DIContainer(dbClient, pinoLogger)

  const apiServer = new ExpressServer(apiPort, diContainer, pinoLogger)
  apiServer.start()
})()
