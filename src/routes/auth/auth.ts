import express, { NextFunction, Request, Response } from 'express';
import { randomBytes } from 'crypto';

import { validateBody } from '../../middlewares/validate-body';
import { usersService } from '../../services/users.service';
import { LoginDto } from './dtos/login.dto';
import { serviceRegister } from '../../service-register';

export const authRouter = express.Router();

type CreateUserRequest = Request<{}, {}, LoginDto>;

authRouter.post('/login', validateBody(LoginDto), async (req: CreateUserRequest, res: Response, next: NextFunction) =>  {
    const { username, password } = req.body;

    const user = await usersService.getUserByLoginAndPassword(username, password);

    if (!user) {
        res.status(404);
        res.send({ message: 'Wrong user or password' });

        return;
    }

    const sessionId = randomBytes(32).toString('hex');
    await serviceRegister.sessionStorage.saveSession(sessionId, user);

    res.cookie('session_token', sessionId, {
        httpOnly: true,
        secure: false, // TODO must be true for production
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60 * 24,
    });

    res.json({ data: user });
});
