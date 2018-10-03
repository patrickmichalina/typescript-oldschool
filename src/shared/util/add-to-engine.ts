import { maybe } from 'typescript-monads'
import { Application } from 'express'
import { AppModule } from '../interfaces/app-module.interface'

export const addToEngine =
  (app: Application) =>
    (mod: AppModule) => {
      Object
        .keys(mod)
        .map(methodKey => {
          return Object
            .keys(mod[methodKey] || {})
            .reduce((_acc, pathKey) => {
              return {
                methodKey,
                pathKey
              }
            }, {})
        }).forEach((z: any) => {
          maybe(mod[z.methodKey])
            .tapSome(moduleHandler => {
              (app as any)[z.methodKey](z.pathKey, moduleHandler[z.pathKey])
            })
        })
    }
