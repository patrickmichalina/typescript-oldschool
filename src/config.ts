import { StringDictionary } from './shared/interfaces/data-structures'
import { maybe } from 'typescript-monads'
import * as manifest from './shared/manifest.json'
import { join } from 'path'

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
}

export const STANDARD_CONFIG: IConfig = {
  NODE_DEBUG: true,
  PORT: maybe(process.env.PORT).map(p => +p).valueOr(5000),
  CLUSTERED_WORKERS: 1,
  DIST_FOLDER: join('.dist', '.public'),
  MANIFEST: manifest,
  MANIFEST_CACHE_CONTROL: 'public, max-age=86400, s-max-age=86400',
  EXTERANL_JS_DEPEPENDENCIES: {
    map: {
      'most': 'https://unpkg.com/most@1.7.3/dist/most.min.js',
      'typescript-monads': 'https://unpkg.com/typescript-monads@3.10.0/index.min.js'
    }
  }
}
