import { NextFunction, Request, Response } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export function validateBody<T extends object>(dtoClass: new (...args: any[]) => T): (req: Request, res: any, next: (error?: any) => void) => void {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToInstance(dtoClass, req.body);
        const errors = await validate(dtoInstance);

        if (errors.length > 0) {
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors.map(err => ({
                    field: err.property,
                    constraints: err.constraints
                })),
            });
        }

        req.body = dtoInstance;
        next();
    };
}
