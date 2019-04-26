import { StringDictionary } from './shared/interfaces/data-structures'
import { maybe } from 'typescript-monads'
import { join } from 'path'
import * as MANIFEST from './shared/manifest.json'

interface SystemJsConfig {
  readonly map: StringDictionary
}

export interface IConfig {
  readonly PORT: number
  readonly NODE_DEBUG: boolean
  readonly CLUSTERED_WORKERS: number
  readonly EXTERANL_JS_DEPEPENDENCIES: SystemJsConfig
  readonly DIST_FOLDER: string
  readonly MANIFEST_CACHE_CONTROL: string
  readonly MANIFEST: any
  readonly APP_VERSION: string
}

export const STANDARD_CONFIG: IConfig = {
  APP_VERSION: maybe(process.env.SOURCE_VERSION).valueOr('local-dev'),
  NODE_DEBUG: maybe(process.env.NODE_ENV).filter(a => a === 'production').map(a => false).valueOr(true),
  PORT: maybe(process.env.PORT).map(p => +p).valueOr(5000),
  CLUSTERED_WORKERS: 1,
  DIST_FOLDER: join('.dist', 'wwwroot'),
  MANIFEST,
  MANIFEST_CACHE_CONTROL: 'public, max-age=86400, s-max-age=86400',
  EXTERANL_JS_DEPEPENDENCIES: {
    map: {
      'most': 'https://unpkg.com/most@1.7.3/dist/most.min.js',
      'typescript-monads': 'https://unpkg.com/typescript-monads@3.12.0/index.min.js'
    }
  }
}
