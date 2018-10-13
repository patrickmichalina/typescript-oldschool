import { StringDictionary } from './shared/interfaces/data-structures'

interface SystemJsConfig {
  readonly map: StringDictionary
}

export interface IConfig {
  readonly PORT: number
  readonly NODE_DEBUG: boolean
  readonly CLUSTERED_WORKERS: number
  readonly EXTERANL_JS_DEPEPENDENCIES: SystemJsConfig
}

export const STANDARD_CONFIG: IConfig = {
  NODE_DEBUG: true,
  PORT: 5000,
  CLUSTERED_WORKERS: 1,
  EXTERANL_JS_DEPEPENDENCIES: {
    map: {
      'most': 'https://unpkg.com/most@1.7.3/dist/most.min.js',
      'typescript-monads': 'https://unpkg.com/typescript-monads@3.5.0/index.min.js'
    }
  }
}
