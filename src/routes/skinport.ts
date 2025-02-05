import express, { Response, Request, NextFunction } from 'express';
import { serviceRegister } from '../service-register';

export const skinportRouter = express.Router();

skinportRouter.get('/', async (req: Request, res: Response, next: NextFunction) =>  {
    const products = await serviceRegister.skinportService.loadList();
    res.renderAndCache('skinport', { title: 'Skinport items', products });
});
