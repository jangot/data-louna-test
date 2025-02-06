import express, { Response, Request, NextFunction } from 'express';
import { getAuthMiddleware } from '../../middlewares/auth';
import { serviceRegister } from '../../service-register';

export const productsRouter = express.Router();

productsRouter.get('/:id/buy',  getAuthMiddleware(), async (req: Request, res: Response, next: NextFunction) =>  {
    await serviceRegister.productsService.makePurchase(req.user.id, Number(req.params.id));

    const balance = await serviceRegister.usersService.getBalance(req.user.id);
    const count = await serviceRegister.productsService.getCount(Number(req.params.id));
    res.json({ data: { balance, count } });
});
