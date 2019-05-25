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
export interface Role {
    _id: string;
    name: string;
    users?: [User];
}
      
/** 
 * Input payload interface for entity creation
*/
export interface RoleCreateInput {
    name: string;
}
      
/** 
 * Input payload interface for entity update
*/
export interface RoleChangesInput {
    name?: string;
}
export interface RoleUpdateInput {
    id: string;
    changes: RoleChangesInput;
}

/** 
 * Mongoose Schema for this entity
*/
export const RoleSchema = new mongoose.Schema({
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
export const RoleModel = mongoose.model('Role', RoleSchema);

export function getManyRolesQuery() {
    return RoleModel.find({});
}
export function getManyRolesLean() {
    return getManyRolesQuery().lean();
}
export async function getManyRolesExec() {
    return getManyRolesQuery().exec();
}
export async function getManyRolesLeanExec() {
    return getManyRolesLean().exec();
}

export function getManyRolesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getManyRoles = await getManyRolesLeanExec();
        next();
    };
}

export function getManyRolesController() {
    return async (req: Request, res: Response) => {
        res.json(await getManyRolesLeanExec());
    };
}

export function getOneRoleQuery(id: string) {
    return RoleModel.findById(id);
}
export function getOneRoleLean(id: string) {
    return getOneRoleQuery(id).lean();
}
export async function getOneRoleExec(id: string) {
    return getOneRoleQuery(id).exec();
}
export async function getOneRoleLeanExec(id: string) {
    return getOneRoleLean(id).exec();
}

export function getOneRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getOneRole = await getOneRoleLeanExec(id);
        next();
    };
}

export function getOneRoleController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getOneRoleLeanExec(id));
    };
}

export async function getRoleUsersLeanExec(id: string) {
    const related = await getOneRoleQuery(id).populate('users').lean().exec();
    return related.users;
}

export function getRoleUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getRoleUsers = await getRoleUsersLeanExec(id);
        next();
    };
}

export function getRoleUsersController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getRoleUsersLeanExec(id));
    };
}
                

export class RoleAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyRolesController())
            .get('/:id', getOneRoleController())
            // .post('/', createRoleController())
            // .put('/:id', updateRoleController())
            // .delete('/:id', deleteRoleController())
            .get('/:id/users', getRoleUsersController());
    }

    applyRouter(app: Application) {
        app.use('/roles', this.router);
    }
}
            

