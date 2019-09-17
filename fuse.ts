import { argv } from 'yargs'
import { fusebox, sparky } from 'fuse-box'
import { IMaybe, maybe } from 'typescript-monads'
import { ServerLauncher } from 'fuse-box/user-handler/ServerLauncher'
import { UserHandler } from 'fuse-box/user-handler/UserHandler'

const argToBool = (arg: string) => argv[arg] ? true : false

class BuildContext {
  minify = argToBool('minify')
  lint = argToBool('lint')
  prod = argToBool('prod')
  serve = argToBool('serve')
  watch = argToBool('watch')
  pwa = argToBool('pwa')
  serverRef: IMaybe<ServerLauncher> = maybe()
  setServerRef(val?: ServerLauncher) {
    this.serverRef = maybe(val)
  }
  killServer = () => this.serverRef.tapSome(ref => {
    ref.kill()
    this.setServerRef()
  })
  devServerPort = 4200
  ngServerPort = 4201
  fusebox = {
    server: fusebox({
      target: 'server',
      entry: 'src/server.ts',
      devServer: false,
      dependencies: this.prod
        ? { ignorePackages: [], ignoreAllExternal: false }
        : {}
    }),
    serveHandler: (handler: UserHandler) => {
      if (this.serve) {
        this.killServer()
        handler.onComplete(complete => {
          this.setServerRef(complete.server)
          if (!this.prod) {
            const scriptArgs = this.watch ? [`--port=${this.ngServerPort}`] : []
            complete.server.handleEntry({ nodeArgs: [], scriptArgs })
          }
        })
      }
    }
  }
}

const { task, exec, rm, src } = sparky(BuildContext)

task('assets.copy', ctx => Promise.all([
  src('./src/assets/**/*.*').dest('./dist/wwwroot/assets', 'assets').exec(),
  src('./src/views/**/*.*').dest('./dist/views', 'views').exec(),
]))

task('assets', ctx => Promise.all([
  exec('assets.copy')
]))

task('build', ctx => exec('assets').then(() => ctx.prod ? exec('build.prod') : exec('build.dev')))
task('build.dev', ctx => ctx.fusebox.server.runDev(ctx.fusebox.serveHandler))

task('default', ctx => {
  rm('dist')

  process.on('exit', ctx.killServer)

  return exec('build')
})
