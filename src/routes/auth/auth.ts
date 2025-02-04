import express, { NextFunction, Request, Response } from 'express';
import { randomBytes } from 'crypto';

import { validateBody } from '../../middlewares/validate-body';
import { serviceRegister } from '../../service-register';
import { LoginRequestDto } from './dtos/login-request.dto';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from './dtos/user-response.dto';

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

    res.cookie('session_token', sessionId, {
        httpOnly: true,
        secure: false, // TODO must be true for production
        sameSite: 'strict',
        maxAge: sessionLiveTime,
    });

    res.json({ data: plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true }) });
});
