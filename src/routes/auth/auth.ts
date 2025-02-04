import express, { NextFunction, Request, Response } from 'express';
import { randomBytes } from 'crypto';

import { validateBody } from '../../middlewares/validate-body';
import { serviceRegister } from '../../service-register';
import { LoginRequestDto } from './dtos/login-request.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';
import { SESSION_COOKIE_NAME, SESSION_TIME_SECONDS } from '../../constants';

export const authRouter = express.Router();

type CreateUserRequest = Request<{}, {}, LoginRequestDto>;

authRouter.post('/login', validateBody(LoginRequestDto), async (req: CreateUserRequest, res: Response, next: NextFunction) =>  {
    const { username, password } = req.body;

    const user = await serviceRegister.usersService.getUserByLoginAndPassword(username, password);

    if (!user) {
        res.status(404);
        res.send({ message: 'Wrong user or password' });

        return;
    }

    const sessionId = randomBytes(32).toString('hex');
    await serviceRegister.sessionStorage.saveSession(sessionId, user, SESSION_TIME_SECONDS);

    res.cookie(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: false, // TODO must be true for production
        sameSite: 'strict',
        maxAge: SESSION_TIME_SECONDS * 1000,
    });

    res.json({ data: plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }) });
});

authRouter.get('/logout', async (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies[SESSION_COOKIE_NAME]) {
        await serviceRegister.sessionStorage.clearSession(req.cookies[SESSION_COOKIE_NAME]);
        res.clearCookie(SESSION_COOKIE_NAME)
    }

    res.redirect('/')
})
