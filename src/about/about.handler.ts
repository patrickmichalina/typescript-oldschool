import { Request, Response, NextFunction } from 'express'

export const getAboutHandler =
  (_req: Request, res: Response, _next: NextFunction) =>
    res.render('about/about.view.pug')
