import { NextFunction, Request, Response } from 'express';
import { serviceRegister } from '../service-register';
import { UserModel } from '../models/user.model';
import { SESSION_COOKIE_NAME } from '../constants';

interface RequestUser extends UserModel {
    balance?: number;
}

// @TODO fix the time to AuthorizationRequest some how
declare module 'express-serve-static-core' {
    interface Request {
        user: RequestUser;
    }
}

export function setUserMiddleware(): (req: Request, res: any, next: (error?: any) => void) => void {
    return async function authMiddleware(req: Request, res: Response, next: NextFunction) {
        const user = await serviceRegister.sessionStorage.getUserBySessionId(req.cookies[SESSION_COOKIE_NAME] || '');
        if (user) {
            req.user = user;
            req.user.balance = await serviceRegister.usersService.getBalance(user.id);
        }

        next();
    };
}

export function getAuthMiddleware(): (req: Request, res: any, next: (error?: any) => void) => void {
    return async function authMiddleware(req: Request, res: Response, next: NextFunction) {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    };
}

export function getPageAuthMiddleware(): (req: Request, res: any, next: (error?: any) => void) => void {
    return async function authMiddleware(req: Request, res: Response, next: NextFunction) {
        const user = await serviceRegister.sessionStorage.getUserBySessionId(req.cookies[SESSION_COOKIE_NAME] || '');
        if (!user) {
            res.redirect('/auth/login');
            return
        }

        req.user = user;
        next();
    };
}

export function getForbidAuthorizedPageMiddleware(): (req: Request, res: any, next: (error?: any) => void) => void {
    return async function authMiddleware(req: Request, res: Response, next: NextFunction) {
        if (req.user) {
            res.redirect('/auth/settings');
            return
        }

        next();
    };
}
