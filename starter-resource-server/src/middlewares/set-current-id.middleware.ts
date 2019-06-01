import { Request, Response, NextFunction } from "express";

export function setCurrentIdMiddleware(req: Request, res: Response, next: NextFunction) {
    req['ctx'].currentId = 'test current id';
    next();
}
