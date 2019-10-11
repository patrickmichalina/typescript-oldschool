import { IConfig } from './config'
import { Application } from 'express'
import { Server, createServer } from 'http'
import { reader } from 'typescript-monads'
import { createExpressApplication } from './app'
import * as throng from 'throng'

const serverListen = (cfg: IConfig) => () => console.info(`Server listening for requests on port ${cfg.PORT}.`)

const createApplicationServer =
  (app: Application) =>
    reader<IConfig, Server>(config =>
      createServer(app).listen(config.PORT, serverListen(config)))

const spawnServer = (config: IConfig) =>
  createExpressApplication
    .flatMap(createApplicationServer)
    .run(config)

export const spawnServerCluster = reader<IConfig, any>(config =>
  config.NODE_DEBUG
    ? spawnServer(config)
    : throng(config.CLUSTERED_WORKERS, () => spawnServer(config)))
