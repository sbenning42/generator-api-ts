import { Request, Response, NextFunction } from 'express';
import { v4 as uuid } from 'uuid';

export class MyContextService {
    
    private _contexts: {[id: string]: any} = {};
    name: string = 'context';
    
    initialize() {
        return (req: Request, res: Response, next: NextFunction) => {
            const id = req['id'] = uuid();
            req[this.name] = this._contexts[id] = { id, req, res };
            next();
        }
    }

    get(id: string, name: string) {
        return this._contexts[id] && this._contexts[id][name];
    }

    set(id: string, name: string, item: any) {
        return this._contexts[id] && (this._contexts[id][name] = item);
    }

    clear(id: string) {
        delete this._contexts[id];
    }
}

export const myContextService: MyContextService = new MyContextService();
