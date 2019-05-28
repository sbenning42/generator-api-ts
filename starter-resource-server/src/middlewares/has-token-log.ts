import { Request, Response, NextFunction } from "express";
import { l } from "../utils/logger";

export function hasTokenLogMiddleware(req: Request, res: Response, next: NextFunction) {
    l.info(`Has token ? ${req.headers.authorization || 'NO sorry ...' }`);
    next();
}
