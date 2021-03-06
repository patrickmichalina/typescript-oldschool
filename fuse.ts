import { argv } from 'yargs'
import { fusebox, sparky } from 'fuse-box'
import { IMaybe, maybe } from 'typescript-monads'
import { ServerLauncher } from 'fuse-box/user-handler/ServerLauncher'
import { UserHandler } from 'fuse-box/user-handler/UserHandler'
import { compressStatic } from './tools/compress'
import { spawn, ChildProcess } from 'child_process'

const argToBool = (arg: string) => argv[arg] ? true : false

class BuildContext {
  readonly minify = argToBool('minify')
  readonly lint = argToBool('lint')
  readonly prod = argToBool('prod')
  readonly serve = argToBool('serve')
  readonly watch = argToBool('watch')
  readonly pwa = argToBool('pwa')
  serverRef: IMaybe<ServerLauncher> = maybe()
  setServerRef(val?: ServerLauncher) {
    this.serverRef = maybe(val)
  }
  readonly killServer = () => this.serverRef.tapSome(ref => {
    ref.kill()
    this.setServerRef()
  })
  readonly devServerPort = 4200
  readonly fusebox = {
    server: fusebox({
      logging: { level: 'disabled' },
      cache: { enabled: true, FTL: true, root: '.fusebox' },
      target: 'server',
      entry: 'src/server.ts',
      devServer: false,
      hmr: false,
      useSingleBundle: this.prod,
      dependencies: this.prod
        ? { ignorePackages: ['throng', 'helmet'], ignoreAllExternal: false }
        : {}
    }),
    serveHandler: (handler: UserHandler) => {
      if (this.serve) {
        this.killServer()
        handler.onComplete(complete => {
          this.setServerRef(complete.server)
          if (!this.prod) {
            exec('assets').then(() => { // TODO: this might slow things down in huge projects
              complete.server.handleEntry({ nodeArgs: [], scriptArgs: [] })
            })
          }
        })
      }
    }
  }
}

const { task, exec, rm, src } = sparky(BuildContext)

task('assets.compress', async ctx => {
  return await compressStatic(['dist/wwwroot']).catch(err => {
    console.log(err)
    process.exit(-1)
  })
})

task('assets.copy', ctx => Promise.all([
  src('./src/wwwroot/**/*.!(ts)').dest('./dist/wwwroot', 'wwwroot').exec(),
  src('./src/views/**/*.*').dest('./dist/views', 'views').exec(),
]))

task('assets', ctx => Promise.all([
  exec('assets.copy')
]).then((() => ctx.pwa ? exec('pwa.sw') : Promise.resolve())))

task('build', ctx => exec('tsc').then(() => ctx.prod ? exec('build.prod') : exec('build.dev')))
task('build.dev', ctx => ctx.fusebox.server.runDev(ctx.fusebox.serveHandler))
task('build.prod', ctx => exec('assets')
  .then(() => exec('build.prod.server'))
  .then(() => exec('assets.compress'))
  .then(() => {
    if (ctx.serve && ctx.prod) {
      // assets.compress Promise is not working!
      ctx.serverRef.tapSome(a => a.handleEntry())
    }
  }))

task('build.prod.server', ctx => ctx.fusebox.server.runProd({
  handler: ctx.fusebox.serveHandler
}))

task('tsc', ctx => {
  if (ctx.watch) {
    return new Promise<ChildProcess>((resolve, _reject) => {
      const child = spawn('node_modules/.bin/tsc', ['-p', 'src/tsconfig.json', '-w'])
      child.addListener('exit', () => {
        resolve(child)
      })
      child.stderr && child.stderr.on('data', msg => {
        console.log(msg.toString())
        resolve(child)
      })
      child.addListener('error', err => {
        console.error(err)
      })
    })
  } else {
    const prom1 = new Promise((resolve, reject) => {
      const child = spawn('node_modules/.bin/tsc', ['-p', 'src/wwwroot/js/tsconfig.json'])

      if (child.stderr) {
        child.stderr.on('data', err => reject(err.toString()))
      }
      child.on('exit', resolve)
      child.on('error', reject)
    })

    const prom2 = new Promise((resolve, reject) => {
      const child = spawn('node_modules/.bin/tsc', ['-p', 'src/wwwroot/js/tsconfig.json', '-outDir', 'dist/wwwroot/js'])

      if (child.stderr) {
        child.stderr.on('data', err => reject(err.toString()))
      }
      child.on('exit', resolve)
      child.on('error', reject)
    })

    return Promise.all([prom1, prom2])
  }
})

task('pwa.sw', ctx => {
  require('workbox-build')
    .generateSW({
      swDest: `dist/wwwroot/sw.js`,
      globDirectory: 'dist/wwwroot',
      globPatterns: ['**\/*.{js,css,ico,png,json}'],
      modifyURLPrefix: {
        'css/': '/static/css/',
        'js/': '/static/js/',
        'img/': '/static/img/',
        'icons/': '/static/icons/',
        'manifest.json': '/manifest.json'
      },
      runtimeCaching: [
        {
          urlPattern: /https:\/\/unpkg.com\//,
          handler: 'cacheFirst',
          options: {
            cacheName: 'external-static-resources',
            cacheableResponse: { statuses: [0, 200] },
            expiration: {
              maxEntries: 20,
            }
          }
        },
        {
          urlPattern: /\.(?:js|css|json|png|svg|jpeg|jpg)$/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'static-resources'
          }
        },
        {
          urlPattern: /\/(.+)\/([^\./]+)*$/gm,
          handler: 'networkFirst',
          options: {
            cacheName: 'pages'
          }
        }
      ]
    })
})


task('default', ctx => {
  rm('dist')

  process.on('exit', ctx.killServer)

  return exec('build')
})
