import { NextFunction, Request, Response } from 'express';
import { serviceRegister } from '../service-register';
import { UserModel } from '../models/user.model';

// @TODO fix the time to AuthorizationRequest some how
declare module 'express-serve-static-core' {
    interface Request {
        user: UserModel;
    }
}

export function getAuthMiddleware(): (req: Request, res: any, next: (error?: any) => void) => void {
    return async function authMiddleware(req: Request, res: Response, next: NextFunction) {
        const user = await serviceRegister.sessionStorage.getUserBySessionId(req.cookies.session);
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = user;
        next();
    };
}
