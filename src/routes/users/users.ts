import express, { Response, Request, NextFunction, raw } from 'express';
import { validateBody } from '../../middlewares/validate-body';
import { CreateUserDto } from './dtos/create-user.dto';
import { userSerivce } from '../../services/users.service';

export const usersRouter = express.Router();

type CreateUserRequest = Request<{}, {}, CreateUserDto>;
usersRouter.post('/', validateBody(CreateUserDto), async (req: CreateUserRequest, res: Response, next: NextFunction) =>  {
  const { username, password } = req.body;
  if (await userSerivce.isUserNameExists(username)) {
    res.status(403);
    res.send({ message: 'username already exist' });
  }

  res.send({ username });
});
