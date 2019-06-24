import { homeModule } from './home/home.module'
import { aboutModule } from './about/about.module'
import { addToEngine } from './shared/util/add-to-engine'
import { localsMiddleware } from './shared/middleware/locals'
import { reader } from 'typescript-monads'
import { IConfig } from './config'
import { compressedStaticExtensionsMiddleware } from './shared/middleware/compressed-statics'
import { readFileSync, readFile } from 'fs'
import { resolve } from 'path'
import * as express from 'express'
import * as compression from 'compression'

export const createApplication = () => reader<IConfig, express.Application>(config => {
  const app = express()
  const basedir = config.DIST_FOLDER
  const addModuleToOurApp = addToEngine(app)
  const staticify = require('staticify')(basedir, { includeAll: true })
  const expressStaticGzip = require('express-static-gzip')
  const minifyHTML = require('express-minify-html')

  app.disable('x-powered-by')
  app.set('view engine', 'pug')
  app.set('views', 'src')

  const staticCompSettings = {
    enableBrotli: true,
    orderPreference: ['br', 'gzip'] as ReadonlyArray<string>,
    maxAge: config.NODE_DEBUG ? '0' : '7d'
  }

  app.use(compressedStaticExtensionsMiddleware)
  app.get('/manifest.json', (_req, res) => {
    res.setHeader('Cache-Control', config.MANIFEST_CACHE_CONTROL)
    res.json(config.MANIFEST)
    res.end()
  })
  app.use('/favicon.ico', (_, res) => {
    readFile(resolve(basedir, 'img/favicon.ico'), (err, buffer) => {
      // tslint:disable-next-line:no-if-statement
      if (err) {
        res.sendStatus(404)
        res.end()
      } else {
        res.setHeader('Content-Type', 'image/x-icon')
        res.setHeader('Content-Length', buffer.length)
        res.write(buffer)
        res.end()
      }
    })
  })
  app.use('/sw.js', expressStaticGzip(basedir, staticCompSettings))
  app.use('/assets', expressStaticGzip(basedir, staticCompSettings))
  app.use(staticify.middleware)
  app.use(localsMiddleware({
    global: {
      appVersion: config.APP_VERSION,
      basedir,
      static: staticify.getVersionedPath,
      loaderConfig: config.EXTERANL_JS_DEPEPENDENCIES,
      manifest: config.MANIFEST,
      metaElements: [{
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0'
      }] as ReadonlyArray<any>,
      styles: {
        inline: {
          core: readFileSync('.dist/wwwroot/css/shared/styles/global.style.css', 'utf-8')
        },
        linked: {}
      },
      scripts: {
        inline: {},
        linked: {}
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
      minifyJS: false
    }
  }))

  app.use(compression())

  addModuleToOurApp(homeModule)
  addModuleToOurApp(aboutModule)

  return app
})
