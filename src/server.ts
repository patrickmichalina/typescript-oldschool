import { createServer, Server } from 'http'
import { reader } from 'typescript-monads'
import { createApplication } from './app'
import { Application } from 'express'
import { IConfig, STANDARD_CONFIG } from './config'
import * as throng from 'throng'

const serverListen = (config: IConfig) => () => {
  console.info('\n')
  console.info('Application server listening on port:', config.PORT)
}

export const spawnCluster =
  (config: IConfig) =>
    config.NODE_DEBUG
      ? spawnApplication()
      : throng(config.CLUSTERED_WORKERS, spawnApplication)

const createApplicationServer =
  (app: Application) =>
    reader<IConfig, Server>(config =>
      createServer(app).listen(config.PORT, serverListen(config)))

const spawnApplication = () =>
  createApplication()
    .flatMap(createApplicationServer)
    .run(STANDARD_CONFIG)
