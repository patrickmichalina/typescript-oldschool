import { RequestHandler } from "express"

export interface AppModuleHandler {
  readonly [key: string]: RequestHandler
}

interface AppModuleDictionary {
  readonly get: AppModuleHandler
  readonly post: AppModuleHandler
  readonly [key: string]: AppModuleHandler
}

export type AppModule = Partial<AppModuleDictionary>