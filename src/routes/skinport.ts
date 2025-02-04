import express, { Response, Request, NextFunction } from 'express';
import { serviceRegister } from '../service-register';

export const skinportRouter = express.Router();

skinportRouter.get('/', async (req: Request, res: Response, next: NextFunction) =>  {
    const data = await serviceRegister.skinportService.loadList();
    console.log(data);
    console.log('loaded')
    res.render('skinport', { title: 'Skinport items' });
});
