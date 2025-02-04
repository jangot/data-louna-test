import express, { Response, Request, NextFunction, raw } from 'express';
import { validateBody } from '../../middlewares/validate-body';
import { CreateUserDto } from './dtos/create-user.dto';
import { generateValidationResponse } from '../../validators/generate-validation-response';
import { UpdateUserDto } from './dtos/update-user.dto';
import { getAuthMiddleware } from '../../middlewares/auth';
import { plainToInstance } from 'class-transformer';
import { UserResponseDto } from '../auth/dtos/user-response.dto';
import { serviceRegister } from '../../service-register';

export const usersRouter = express.Router();

type CreateUserRequest = Request<{}, {}, CreateUserDto>;

usersRouter.get('/me', getAuthMiddleware(), async (req: Request, res: Response, next: NextFunction) =>  {
    res.json({ data: plainToInstance(UserResponseDto, req.user, {excludeExtraneousValues: true }) });
});

usersRouter.post('/', validateBody(CreateUserDto), async (req: CreateUserRequest, res: Response, next: NextFunction) =>  {
  const { username } = req.body;
  if (await serviceRegister.usersService.isUserNameExists(username)) {
    res.status(403);
    res.send(generateValidationResponse([{ property: 'username', constraints: { duplication: 'Already exists' } }]));
    return;
  }

  const newUser = await serviceRegister.usersService.addUser(req.body);

  res.send({ username, id: newUser.id });
});

type UpdateUserRequest = Request<{}, {}, UpdateUserDto>;
usersRouter.post('/:id',
    getAuthMiddleware(),
    validateBody(UpdateUserDto),
    async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
        const { password } = req.body;

        await serviceRegister.usersService.setNewPassword(req.user.id, password);

        res.json({ data: plainToInstance(UserResponseDto, req.user, { excludeExtraneousValues: true }) });
    });
