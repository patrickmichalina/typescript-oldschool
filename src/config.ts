import { config as loadLocalEnvironmentVariables } from 'dotenv'

loadLocalEnvironmentVariables()

export interface IConfig {
  readonly PORT: number
  readonly NODE_DEBUG: boolean
  readonly CLUSTERED_WORKERS: number
}

export const STANDARD_CONFIG: IConfig = {
  PORT: 5000,
  CLUSTERED_WORKERS: 1,
  NODE_DEBUG: true
}
