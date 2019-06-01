import { Request, Response, NextFunction } from "express";

export function setCurrentIdMiddleware(req: Request, res: Response, next: NextFunction) {
    req['ctx'].currentId = req.user ? req.user.id : undefined;
    next();
}
