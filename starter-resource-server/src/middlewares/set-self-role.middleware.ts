import { Request, Response, NextFunction } from "express";

export function setSelfRoleMiddleware(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const selfId = req.user ? req.user.id : undefined;
    if (req.user && req.user.roles && id && selfId && id === selfId) {
        req.user.roles.push('self');
    }
    next();
}
