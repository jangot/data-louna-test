import express, { Response, Request, NextFunction } from 'express';
import { serviceRegister } from '../service-register';
import { getCacheMiddleware } from '../middlewares/cache-middleware';

export const skinportRouter = express.Router();

skinportRouter.get('/', getCacheMiddleware(), async (req: Request, res: Response, next: NextFunction) =>  {
    const products = await serviceRegister.skinportService.loadList();
    res.render('skinport', { title: 'Skinport items', products });
});
