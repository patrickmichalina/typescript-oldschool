import * as express from 'express'
import { homeModule } from './home/home.module'
import { aboutModule } from './about/about.module'
import { addToEngine } from './shared/util/add-to-engine'
import { localsMiddleware } from './shared/middleware/locals'
import { reader } from 'typescript-monads'
import { IConfig } from './config'
import { compressedStaticExtensionsMiddleware } from './shared/middleware/compressed-statics'
import { join } from 'path'
import { readFileSync } from 'fs'

export const createApplication = () => reader<IConfig, express.Application>(config => {
  const app = express()
  const addModuleToOurApp = addToEngine(app)
  const staticify = require('staticify')(join('.dist', '.public'), { includeAll: true })
  const expressStaticGzip = require('express-static-gzip')
  const minifyHTML = require('express-minify-html')
  const compression = require('compression')

  app.disable('x-powered-by')
  app.set('view engine', 'pug')
  app.set('views', 'src')

  const staticCompSettings = {
    enableBrotli: true,
    orderPreference: ['br', 'gzip']
    // maxAge: config.IS_LOCAL_DEV ? '0' : '7d'
  }

  app.use(compressedStaticExtensionsMiddleware)
  app.use('/sw.js', expressStaticGzip('.dist/.public', staticCompSettings))
  app.use('/js', expressStaticGzip('.dist/.public/js', staticCompSettings))
  app.use('/css', expressStaticGzip('.dist/.public/css', staticCompSettings))
  app.use(staticify.middleware)
  app.use(localsMiddleware({
    global: {
      basedir: '.dist/.public',
      static: staticify.getVersionedPath,
      loaderConfig: config.EXTERANL_JS_DEPEPENDENCIES,
      metaElements: [{
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }],
      styles: {
        inline: { 
          core: readFileSync('.dist/.public/css/shared/styles/global.style.css', 'utf-8')
        },
        linked: { }
      },
      scripts: {
        inline: { },
        linked: { }
      }
    }
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

  app.use(compression())

  addModuleToOurApp(homeModule)
  addModuleToOurApp(aboutModule)

  return app
})
