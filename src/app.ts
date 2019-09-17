import * as express from 'express'
import * as cookies from 'cookie-parser'
import * as compression from 'compression'
import { json, urlencoded } from 'body-parser'
import { reader } from 'typescript-monads'
import { IConfig } from './config'
import { resolve } from 'path'
import { sslRedirect } from './ssl'

export const createExpressApplication = reader<IConfig, express.Application>(config => {
  const app = express()
  const publicDir = resolve(config.DIST_FOLDER)
  const expressStaticGzip = require('express-static-gzip')
  const pino = require('express-pino-logger')

  if (config.HTTP_LOGS_ENABLED) app.use(pino())

  app.use(sslRedirect)
  app.use(urlencoded({ extended: true }))
  app.use(json())
  app.use(cookies())
  app.disable('x-powered-by')
  app.set('view engine', 'pug')
  app.set('views', resolve(config.DIST_FOLDER, config.VIEWS_ROOT))

  const settings = {
    enableBrotli: true,
    fallthrough: false,
    orderPreference: ['br', 'gzip'] as ReadonlyArray<string>,
    setHeaders: (res: express.Response, _reqUrl: string) => {
      res.setHeader('Cache-Control',
        config.NODE_DEBUG
          ? 'no-store'
          : `public, max-age=31536000, s-maxage=31536000`
      )
    }
  }

  // static assets
  // app.get('/favicon.ico', expressStaticGzip(publicDir + '/assets', settings))
  // app.get('/manifest.json', expressStaticGzip(publicDir + '/assets', settings))
  app.use('/static', expressStaticGzip(publicDir + '/wwwroot', settings))

  app.use(compression())

  // page routes
  app.get('/', (req: express.Request, res: express.Response) => res.render('home', { req, res }))
  app.get('/about', (req: express.Request, res: express.Response) => res.render('about', { req, res }))

  // various 404
  app.use((req, res) => {
    res.status(404)

    res.format({
      html: () => {
        res.render('shared/404', { url: req.url })
      },
      json: () => {
        res.json({ error: 'Not found' })
      },
      default: () => {
        res.type('txt').send('Not found')
      }
    })
  })

  return app
})
