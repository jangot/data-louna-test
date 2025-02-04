import express, { Response, Request, NextFunction } from 'express';

export const authPagesRouter = express.Router();

authPagesRouter.get('/login', (req: Request, res: Response, next: NextFunction) =>  {
    res.render('login', { title: 'Login' });
});

authPagesRouter.get('/signup', (req: Request, res: Response, next: NextFunction) =>  {
    res.render('signup', { title: 'Signup' });
});

authPagesRouter.get('/settings', (req: Request, res: Response, next: NextFunction) =>  {
    res.render('settings', { title: 'Signup' });
});
