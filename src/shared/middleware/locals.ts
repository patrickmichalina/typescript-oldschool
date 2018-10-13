import { Response, Request, NextFunction } from 'express'
import { join } from 'path'

const staticify = require('staticify')(join('.dist', '.public'))
// const staticifyCdn = (cdn?: string) => (str: string) => cdn ? `${cdn}${staticify.getVersionedPath(str)}` : staticify.getVersionedPath(str)

export const localsMiddleware =
  (options = {} as any) =>
    (_req: Request, res: Response, next: NextFunction) => {
      // tslint:disable-next-line:no-object-mutation
      res.locals = {
        ...res.locals,
        ...options,
        static: staticify.getVersionedPath
      }
      next()
    }
