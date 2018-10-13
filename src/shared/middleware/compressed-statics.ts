import { Response, Request, NextFunction } from 'express'

export const compressedStaticExtensionsMiddleware =
  (req: Request, _res: Response, next: NextFunction) => {
    // tslint:disable-next-line:no-object-mutation
    req.url = req.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg)$/, '/$1.$2')
    next()
  }
