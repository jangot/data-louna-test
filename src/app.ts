import createError, { HttpError } from 'http-errors';
import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';

import { indexRouter } from './routes';
import { usersRouter } from './routes/users/users';
import { authPagesRouter } from './routes/auth/auth-pages';
import { authRouter } from './routes/auth/auth';

export const app = express();

(async () => {
  // view engine setup
  app.set('views', path.join(__dirname, '../views'));
  app.set('view engine', 'ejs');

  app.use(logger('dev'));
  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
  app.use(express.static(path.join(__dirname, '../public')));

  app.use('/', indexRouter);
  app.use('/auth', authPagesRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/users', usersRouter);

  app.use((req: Request, res: Response, next: NextFunction) => {
    next(createError(404));
  });

// error handler
  app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if (/\/api\//.test(req.url)) {
      res.json({ error: err.message })
    } else {
      res.render('error');
    }
  });
})()

