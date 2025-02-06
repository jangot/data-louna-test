import express, { Response, Request, NextFunction } from 'express';

export const indexRouter = express.Router();

indexRouter.get('/', (req: Request, res: Response, next: NextFunction) =>  {
  console.log(req.user)
  res.render('index', { title: 'Hello', user: req.user });
});
