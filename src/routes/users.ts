import express, { Response, Request, NextFunction } from 'express';

export const usersRouter = express.Router();

usersRouter.get('/', (req: Request, res: Response, next: NextFunction) =>  {
  res.send('respond with a resource');
});
