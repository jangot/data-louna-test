import express, { Response, Request, NextFunction } from 'express';
import { getForbidAuthorizedPageMiddleware, getPageAuthMiddleware } from '../../middlewares/auth';

export const authPagesRouter = express.Router();

authPagesRouter.get('/login', getForbidAuthorizedPageMiddleware(), (req: Request, res: Response, next: NextFunction) =>  {
    res.render('login', { title: 'Login' });
});

authPagesRouter.get('/signup', getForbidAuthorizedPageMiddleware(), (req: Request, res: Response, next: NextFunction) =>  {
    res.render('signup', { title: 'Signup' });
});

authPagesRouter.get('/settings', getPageAuthMiddleware(), (req: Request, res: Response, next: NextFunction) =>  {
    res.render('settings', { title: 'Settings' });
});
