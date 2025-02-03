import express, { Response, Request, NextFunction } from 'express';

export const indexRouter = express.Router();

indexRouter.get('/', (req: Request, res: Response, next: NextFunction) =>  {
  res.render('index', { title: 'Hello' });
});
