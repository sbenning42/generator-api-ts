import { Request, Response, NextFunction } from 'express';
import { ObjectID } from 'mongodb';
import { Singleton } from '../../common/singleton/singleton';
import { mainTodoServiceExt } from './service';

export class TodoMiddlewares extends Singleton {
    constructor() {
        super(TodoMiddlewares);
    }

    reverseAddTodoOwner() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const todoId = new ObjectID();
            req.body._id = todoId;
            await mainTodoServiceExt.reverseAddTodoOwner(req.user.id, todoId);
            next();
        };
    }

    reverseRemoveTodoOwner() {
        return async (req: Request, res: Response, next: NextFunction) => {
            await mainTodoServiceExt.reverseRemoveTodoOwner(req.user.id, req.params.id);
            next();
        };
    }
}

export const mainTodoMiddlewares: TodoMiddlewares = new TodoMiddlewares();
