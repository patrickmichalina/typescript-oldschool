import { Request, Response, NextFunction } from 'express'

export const getIndexHandler =
  (_req: Request, res: Response, _next: NextFunction) =>
    res.render('home/view')

