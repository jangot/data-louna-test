import express, { NextFunction, Request, Response } from 'express';
import { randomBytes } from 'crypto';

import { validateBody } from '../../middlewares/validate-body';
import { serviceRegister } from '../../service-register';
import { LoginRequestDto } from './dtos/login-request.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';
import { SESSION_COOKIE_NAME } from '../../constants';

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

    const sessionLiveTime = 1000 * 60 * 60 * 24;

    const sessionId = randomBytes(32).toString('hex');
    await serviceRegister.sessionStorage.saveSession(sessionId, user, sessionLiveTime);

    res.cookie(SESSION_COOKIE_NAME, sessionId, {
        httpOnly: true,
        secure: false, // TODO must be true for production
        sameSite: 'strict',
        maxAge: sessionLiveTime,
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
