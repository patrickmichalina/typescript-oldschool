import { Response, Request, NextFunction } from 'express'

export const localsMiddleware = (options = {} as any) => (_req: Request, res: Response, next: NextFunction) => {
  // tslint:disable-next-line:no-object-mutation
  res.locals = {
    ...res.locals,
    ...options
  }
  next()
}
