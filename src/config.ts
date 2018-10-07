import { config as loadLocalEnvironmentVariables } from 'dotenv'
import { StringDictionary } from './shared/interfaces/data-structures'

loadLocalEnvironmentVariables()

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
  PORT: 5000,
  CLUSTERED_WORKERS: 1,
  NODE_DEBUG: true,
  EXTERANL_JS_DEPEPENDENCIES: {
    map: {
      'most': 'https://unpkg.com/most@1.7.3/dist/most.min.js',
      'typescript-monads': 'https://unpkg.com/typescript-monads@3.4.1/index.min.js'
    }
  }
}
