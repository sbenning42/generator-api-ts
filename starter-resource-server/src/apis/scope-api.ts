// export type User = any;
// export type Profil = any;
// export type Role = any;
// export type Scope = any;
// export type Credentials = any;
        
import { Request, Response, NextFunction, Router, Application } from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
        
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
        
/** 
 * Base entity interface
*/
export interface Scope {
    _id: string;
    name: string;
    users?: [User];
}
      
/** 
 * Input payload interface for entity creation
*/
export interface ScopeCreateInput {
    name: string;
}
      
/** 
 * Input payload interface for entity update
*/
export interface ScopeChangesInput {
    name?: string;
}
export interface ScopeUpdateInput {
    id: string;
    changes: ScopeChangesInput;
}

/** 
 * Mongoose Schema for this entity
*/
export const ScopeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    users: {
        type: [ObjectId] /* relation ([User]) */,
        required: false,
    },
}, { minimize: false });
export const ScopeModel = mongoose.model('Scope', ScopeSchema);

export function getManyScopesQuery() {
    return ScopeModel.find({});
}
export function getManyScopesLean() {
    return getManyScopesQuery().lean();
}
export async function getManyScopesExec() {
    return getManyScopesQuery().exec();
}
export async function getManyScopesLeanExec() {
    return getManyScopesLean().exec();
}

export function getManyScopesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getManyScopes = await getManyScopesLeanExec();
        next();
    };
}

export function getManyScopesController() {
    return async (req: Request, res: Response) => {
        res.json(await getManyScopesLeanExec());
    };
}

export function getOneScopeQuery(id: string) {
    return ScopeModel.findById(id);
}
export function getOneScopeLean(id: string) {
    return getOneScopeQuery(id).lean();
}
export async function getOneScopeExec(id: string) {
    return getOneScopeQuery(id).exec();
}
export async function getOneScopeLeanExec(id: string) {
    return getOneScopeLean(id).exec();
}

export function getOneScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getOneScope = await getOneScopeLeanExec(id);
        next();
    };
}

export function getOneScopeController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getOneScopeLeanExec(id));
    };
}

export async function getScopeUsersLeanExec(id: string) {
    const related = await getOneScopeQuery(id).populate('users').lean().exec();
    return related.users;
}

export function getScopeUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getScopeUsers = await getScopeUsersLeanExec(id);
        next();
    };
}

export function getScopeUsersController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getScopeUsersLeanExec(id));
    };
}
                

export class ScopeAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyScopesController())
            .get('/:id', getOneScopeController())
            // .post('/', createScopeController())
            // .put('/:id', updateScopeController())
            // .delete('/:id', deleteScopeController())
            .get('/:id/users', getScopeUsersController());
    }

    applyRouter(app: Application) {
        app.use('/scopes', this.router);
    }
}
            

