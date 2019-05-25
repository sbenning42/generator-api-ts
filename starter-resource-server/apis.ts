export type User = any;
export type Profil = any;
export type Role = any;
export type Scope = any;
export type Credentials = any;
        
import { Request, Response, NextFunction, Router, Application } from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
        
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
        
/** 
 * Base entity interface
*/
export interface Todo {
    _id: string;
    title: string;
    done: boolean;
    owner?: User;
}
      
/** 
 * Input payload interface for entity creation
*/
export interface TodoCreateInput {
    title: string;
    done: boolean;
}
      
/** 
 * Input payload interface for entity update
*/
export interface TodoChangesInput {
    title?: string;
    done?: boolean;
}
export interface TodoUpdateInput {
    id: string;
    changes: TodoChangesInput;
}

/** 
 * Mongoose Schema for this entity
*/
export const TodoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    done: {
        type: Boolean,
        required: true,
    },
    owner: {
        type: ObjectId /* relation (User) */,
        required: false,
    },
}, { minimize: false });
export const TodoModel = mongoose.model('Todo', TodoSchema);

export function getManyTodosQuery() {
    return TodoModel.find({});
}
export function getManyTodosLean() {
    return getManyTodosQuery().lean();
}
export async function getManyTodosExec() {
    return getManyTodosQuery().exec();
}
export async function getManyTodosLeanExec() {
    return getManyTodosLean().exec();
}

export function getManyTodosMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getManyTodos = await getManyTodosLeanExec();
        next();
    };
}

export function getManyTodosController() {
    return async (req: Request, res: Response) => {
        res.json(await getManyTodosLeanExec());
    };
}

export function getOneTodoQuery(id: string) {
    return TodoModel.findById(id);
}
export function getOneTodoLean(id: string) {
    return getOneTodoQuery(id).lean();
}
export async function getOneTodoExec(id: string) {
    return getOneTodoQuery(id).exec();
}
export async function getOneTodoLeanExec(id: string) {
    return getOneTodoLean(id).exec();
}

export function getOneTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getOneTodo = await getOneTodoLeanExec(id);
        next();
    };
}

export function getOneTodoController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getOneTodoLeanExec(id));
    };
}

export async function getTodoOwnerLeanExec(id: string) {
    const related = await getOneTodoQuery(id).populate('owner').lean().exec();
    return related.owner;
}

export function getTodoOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getTodoOwner = await getTodoOwnerLeanExec(id);
        next();
    };
}

export function getTodoOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getTodoOwnerLeanExec(id));
    };
}
                

export class TodoAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyTodosController())
            .get('/:id', getOneTodoController())
            // .post('/', createTodoController())
            // .put('/:id', updateTodoController())
            // .delete('/:id', deleteTodoController())
            .get('/:id/owner', getTodoOwnerController());
    }

    applyRouter(app: Application) {
        app.use('/todos', this.router);
    }
}
            




