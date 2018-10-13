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
  const addModuleToOurApp = addToEngine(app)
  const staticify = require('staticify')(join('.dist', '.public'), { includeAll: true })
  const expressStaticGzip = require('express-static-gzip')
  const minifyHTML = require('express-minify-html')

  app.disable('x-powered-by')
  app.set('view engine', 'pug')
  app.set('views', 'src')

  const staticCompSettings = {
    enableBrotli: true,
    orderPreference: ['br', 'gzip']
    // maxAge: config.IS_LOCAL_DEV ? '0' : '7d'
  }

  app.use(compressedStaticExtensionsMiddleware)
  app.use('/js', expressStaticGzip('.dist/.public/js', staticCompSettings))
  app.use('/css', expressStaticGzip('.dist/.public/css', staticCompSettings))
  app.use(staticify.middleware)
  app.use(localsMiddleware({
    basedir: '.dist/.public',
    static: staticify.getVersionedPath,
    loaderConfig: config.EXTERANL_JS_DEPEPENDENCIES
  }))

  app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
      removeComments: true,
      collapseWhitespace: true,
      collapseBooleanAttributes: true,
      removeAttributeQuotes: true,
      removeEmptyAttributes: true,
      minifyJS: true
    }
  }))

  addModuleToOurApp(homeModule)
  addModuleToOurApp(aboutModule)

  return app
})
