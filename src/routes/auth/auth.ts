import express, { Response, Request, NextFunction } from 'express';

export const authRouter = express.Router();

authRouter.get('/login', (req: Request, res: Response, next: NextFunction) =>  {
    res.render('login', { title: 'Login' });
});

authRouter.get('/signup', (req: Request, res: Response, next: NextFunction) =>  {
    res.render('signup', { title: 'Signup' });
});
