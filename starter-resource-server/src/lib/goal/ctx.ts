import { Request, Response, NextFunction } from 'express';

const context: any = {};
export function getCtx() {
    return context;
}

export const initCtx = (req: Request, res: Response, next: NextFunction) => {
    context.req = req;
    context.res = res;
    next();
}
