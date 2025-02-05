import { serviceRegister } from '../service-register';
import { NextFunction, Request, Response } from 'express';

declare module 'express-serve-static-core' {
    interface Response {
        renderAndCache: (view: string, options: any) => Promise<void>;
    }
}

export function getCacheMiddleware(): (req: Request, res: any, next: (error?: any) => void) => void {
    return async function authMiddleware(req: Request, res: Response, next: NextFunction) {
        const key = req.originalUrl;

        const cachedPage = await serviceRegister.redis.getClient().get(key);

        if (cachedPage) {
            return res.send(cachedPage);
        }

        res.renderAndCache = async (view: string, options: any) => {
            res.render(view, options, async (err, html) => {
                if (!err) {
                    await serviceRegister.redis.getClient().set(key, html, { EX: 60 * 5 });
                    res.send(html);
                } else {
                    res.status(500).send('Rendering error');
                }
            });
        };

        next();
    };
}
