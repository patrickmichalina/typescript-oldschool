import * as express from 'express'
import { homeModule } from './home/home.module'
import { aboutModule } from './about/about.module'
import { addToEngine } from './shared/util/add-to-engine'
import { localsMiddleware } from './shared/middleware/locals'
import { reader } from 'typescript-monads'
import { IConfig } from './config'

export const createApplication = () => reader<IConfig, express.Application>(config => {
  const app = express()

  app.disable('x-powered-by')
  app.set('view engine', 'pug')
  app.set('views', 'src')

  app.use(express.static('.dist/.public'))
  app.use(localsMiddleware({
    basedir: '.dist/.public',
    loaderConfig: config.EXTERANL_JS_DEPEPENDENCIES
  }))

  const addModuleToOurApp = addToEngine(app)

  addModuleToOurApp(homeModule)
  addModuleToOurApp(aboutModule)

  return app
})
