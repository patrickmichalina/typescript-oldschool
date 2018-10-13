import * as express from 'express'
import { homeModule } from './home/home.module'
import { aboutModule } from './about/about.module'
import { addToEngine } from './shared/util/add-to-engine'
import { localsMiddleware } from './shared/middleware/locals'
import { reader } from 'typescript-monads'
import { IConfig } from './config'
import { compressedStaticExtensionsMiddleware } from './shared/middleware/compressed-statics'
import { join } from 'path'

export const createApplication = () => reader<IConfig, express.Application>(config => {
  const app = express()
  const staticify = require('staticify')(join('.dist', '.public'), { includeAll: true })

  app.disable('x-powered-by')
  app.set('view engine', 'pug')
  app.set('views', 'src')

  app.use(compressedStaticExtensionsMiddleware)
  app.use(staticify.middleware)
  app.use(localsMiddleware({
    basedir: '.dist/.public',
    static: staticify.getVersionedPath,
    loaderConfig: config.EXTERANL_JS_DEPEPENDENCIES
  }))

  const addModuleToOurApp = addToEngine(app)

  addModuleToOurApp(homeModule)
  addModuleToOurApp(aboutModule)

  return app
})
