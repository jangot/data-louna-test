import express, { Response, Request, NextFunction } from 'express';
import { serviceRegister } from '../../service-register';

export const productsPagesRouter = express.Router();

productsPagesRouter.get('/', async (req: Request, res: Response, next: NextFunction) =>  {
    const products = await serviceRegister.productsService.getList();

    res.render('products', { title: 'Products', user: req.user, products });
});
