import express, { Response, Request, NextFunction, raw } from 'express';
import { validateBody } from '../../middlewares/validate-body';
import { CreateUserDto } from './dtos/create-user.dto';
import { usersService } from '../../services/users.service';
import { generateValidationResponse } from '../../validators/generate-validation-response';

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
