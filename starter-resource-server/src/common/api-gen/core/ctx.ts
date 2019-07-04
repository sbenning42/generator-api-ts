import { Request, Response, NextFunction } from 'express';

const context: any = {};

export const withCtx = (req: Request, res: Response, next: NextFunction) => {
    context.req = req;
    context.res = res;
    context.err = {};
    req['ctx'] = context;
    next();
};

export const ctx = () => context;
