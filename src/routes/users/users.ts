import express, { Response, Request, NextFunction, raw } from 'express';
import { StatusCodes } from 'http-status-codes';
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
    res.status(StatusCodes.BAD_REQUEST);
    res.send(generateValidationResponse([{ property: 'username', constraints: { duplication: 'Already exists' } }]));
    return;
  }

  const newUser = await serviceRegister.usersService.addUser(req.body);

  res.send({ username, id: newUser.id });
});

type UpdateUserRequest = Request<{ id: string }, {}, UpdateUserDto>;
usersRouter.post('/:id',
    getAuthMiddleware(),
    validateBody(UpdateUserDto),
    async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
        console.log('----------')
        console.log(req.params.id, req.user.id)
        if (req.params.id !== req.user.id) {
            res.status(StatusCodes.FORBIDDEN);
            res.json({ data: { message: 'No access' } });
            return;
        }

        await serviceRegister.usersService.setNewPassword(req.user.id, req.body.password);

        res.json({ data: plainToInstance(UserResponseDto, req.user, { excludeExtraneousValues: true }) });
    });
