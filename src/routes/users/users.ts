import express, { Response, Request, NextFunction, raw } from 'express';
import { validateBody } from '../../middlewares/validate-body';
import { CreateUserDto } from './dtos/create-user.dto';
import { usersService } from '../../services/users.service';
import { generateValidationResponse } from '../../validators/generate-validation-response';
import { UpdateUserDto } from './dtos/update-user.dto';
import { getAuthMiddleware } from '../../middlewares/auth';

export const usersRouter = express.Router();

type CreateUserRequest = Request<{}, {}, CreateUserDto>;
usersRouter.post('/', validateBody(CreateUserDto), async (req: CreateUserRequest, res: Response, next: NextFunction) =>  {
  const { username } = req.body;
  if (await usersService.isUserNameExists(username)) {
    res.status(403);
    res.send(generateValidationResponse([{ property: 'username', constraints: { duplication: 'Already exists' } }]));
    return;
  }

  const newUser = await usersService.addUser(req.body);

  res.send({ username, id: newUser.id });
});

type UpdateUserRequest = Request<{}, {}, UpdateUserDto>;
usersRouter.post('/:id',
    getAuthMiddleware(),
    validateBody(UpdateUserDto),
    async (req: UpdateUserRequest, res: Response, next: NextFunction) => {
        const { password, passwordConfirm } = req.body;

        res.send({ password, passwordConfirm });
    });
