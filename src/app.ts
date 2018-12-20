import { homeModule } from './home/home.module'
import { aboutModule } from './about/about.module'
import { addToEngine } from './shared/util/add-to-engine'
import { localsMiddleware } from './shared/middleware/locals'
import { reader } from 'typescript-monads'
import { IConfig } from './config'
import { compressedStaticExtensionsMiddleware } from './shared/middleware/compressed-statics'
import { readFileSync } from 'fs'
import * as express from 'express'

export const createApplication = () => reader<IConfig, express.Application>(config => {
  const app = express()
  const basedir = config.DIST_FOLDER
  const addModuleToOurApp = addToEngine(app)
  const staticify = require('staticify')(basedir, { includeAll: true })
  const expressStaticGzip = require('express-static-gzip')
  const minifyHTML = require('express-minify-html')
  const compression = require('compression')
  
  app.disable('x-powered-by')
  app.set('view engine', 'pug')
  app.set('views', 'src')

  const staticCompSettings = {
    enableBrotli: true,
    orderPreference: ['br', 'gzip'] as ReadonlyArray<string>
    // maxAge: config.IS_LOCAL_DEV ? '0' : '7d'
  }

  app.use(compressedStaticExtensionsMiddleware)
  app.get('/manifest.json', (_, res) => {
    res.setHeader('Cache-Control', config.MANIFEST_CACHE_CONTROL)
    res.json(config.MANIFEST)
    res.end()
  })
  app.use('/sw.js', expressStaticGzip(basedir, staticCompSettings))
  app.use('/js', expressStaticGzip(basedir + '/js', staticCompSettings))
  app.use('/css', expressStaticGzip(basedir + '/css', staticCompSettings))
  app.use(staticify.middleware)
  app.use(localsMiddleware({
    global: {
      basedir,
      static: staticify.getVersionedPath,
      loaderConfig: config.EXTERANL_JS_DEPEPENDENCIES,
      metaElements: [{
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }] as ReadonlyArray<any>,
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
