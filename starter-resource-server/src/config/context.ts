import { Request, Response, NextFunction } from 'express';

/**
 * `context` is a way to access req-dependant data in `mongoose` model field default function value
 * 
 * eg:
 * 
 *  const schema = new mongoose.Schema({
 *      name: {
 *          type: String,
 *          default: () => context().currentUserId // `context` call return `req.ctx` witch contain `req` and `res`
 *      }
 *  });
 * 
 */

let ctx: any;
export function initContextMiddleware(req: Request, res: Response, next: NextFunction) {
    ctx = { req, res };
    req['ctx'] = ctx;
    next();
}

export const context = () => ctx;
