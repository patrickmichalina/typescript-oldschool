import { maybe } from 'typescript-monads'
import { resolve } from 'path'

export interface IServerAppConfig {
  readonly PORT: number
  // readonly NODE_DEBUG: boolean
  readonly WORKERS: number
  readonly ROOT_DIR: string
  readonly IS_LOCAL_DEV: boolean
  readonly TEMPLATE_VIEW_DIR: string
}

const maybeEmpty = (str?: string) => str === '' ? maybe<string>() : maybe(str) 
const argsContains = (key: string) => process.argv.some(a => a === key)

export const getStandardServerConfig = (): IServerAppConfig => {
  const DEFAULT_PORT = 5000
  const DEFAULT_WORKER_COUNT = 1
  const IS_LOCAL_DEV = argsContains('dev') ? true : false
  const ROOT_DIR = IS_LOCAL_DEV ? 'src' : '.dist'
  const TEMPLATE_VIEW_DIR = resolve(ROOT_DIR, 'dist')
  
  return {
    ROOT_DIR,
    IS_LOCAL_DEV,
    TEMPLATE_VIEW_DIR,
    PORT: maybeEmpty(process.env.PORT).map(env => +env).valueOr(DEFAULT_PORT),
    WORKERS: maybeEmpty(process.env.WEB_CONCURRENCY).map(env => +env).valueOr(DEFAULT_WORKER_COUNT),
  }
}