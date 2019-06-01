import { Request, Response, NextFunction } from "express";

let _ctx: any;

export function initContextMiddleware(req: Request, res: Response, next: NextFunction) {
    _ctx = { req, res };
    req['ctx'] = _ctx;
    next();
}

export const context = () => _ctx;
