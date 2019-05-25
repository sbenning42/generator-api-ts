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
export interface User {
    _id: string;
    roles?: [Role];
    scopes?: [Scope];
    credential?: Credential;
    profil?: Profil;
}
      
/** 
 * Input payload interface for entity creation
*/
export interface UserCreateInput {

}
      
/** 
 * Input payload interface for entity update
*/
export interface UserChangesInput {

}
export interface UserUpdateInput {
    id: string;
    changes: UserChangesInput;
}

/** 
 * Mongoose Schema for this entity
*/
export const UserSchema = new mongoose.Schema({
    roles: {
        type: [ObjectId] /* relation ([Role]) */,
        required: false,
    },
    scopes: {
        type: [ObjectId] /* relation ([Scope]) */,
        required: false,
    },
    credential: {
        type: ObjectId /* relation (Credential) */,
        required: false,
    },
    profil: {
        type: ObjectId /* relation (Profil) */,
        required: false,
    },
}, { minimize: false });
export const UserModel = mongoose.model('User', UserSchema);

export function getManyUsersQuery() {
    return UserModel.find({});
}
export function getManyUsersLean() {
    return getManyUsersQuery().lean();
}
export async function getManyUsersExec() {
    return getManyUsersQuery().exec();
}
export async function getManyUsersLeanExec() {
    return getManyUsersLean().exec();
}

export function getManyUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getManyUsers = await getManyUsersLeanExec();
        next();
    };
}

export function getManyUsersController() {
    return async (req: Request, res: Response) => {
        res.json(await getManyUsersLeanExec());
    };
}

export function getOneUserQuery(id: string) {
    return UserModel.findById(id);
}
export function getOneUserLean(id: string) {
    return getOneUserQuery(id).lean();
}
export async function getOneUserExec(id: string) {
    return getOneUserQuery(id).exec();
}
export async function getOneUserLeanExec(id: string) {
    return getOneUserLean(id).exec();
}

export function getOneUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getOneUser = await getOneUserLeanExec(id);
        next();
    };
}

export function getOneUserController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getOneUserLeanExec(id));
    };
}

export async function getUserRolesLeanExec(id: string) {
    const related = await getOneUserQuery(id).populate('roles').lean().exec();
    return related.roles;
}

export function getUserRolesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getUserRoles = await getUserRolesLeanExec(id);
        next();
    };
}

export function getUserRolesController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getUserRolesLeanExec(id));
    };
}
                
export async function getUserScopesLeanExec(id: string) {
    const related = await getOneUserQuery(id).populate('scopes').lean().exec();
    return related.scopes;
}

export function getUserScopesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getUserScopes = await getUserScopesLeanExec(id);
        next();
    };
}

export function getUserScopesController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getUserScopesLeanExec(id));
    };
}
                
export async function getUserCredentialLeanExec(id: string) {
    const related = await getOneUserQuery(id).populate('credential').lean().exec();
    return related.credential;
}

export function getUserCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getUserCredential = await getUserCredentialLeanExec(id);
        next();
    };
}

export function getUserCredentialController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getUserCredentialLeanExec(id));
    };
}
                
export async function getUserProfilLeanExec(id: string) {
    const related = await getOneUserQuery(id).populate('profil').lean().exec();
    return related.profil;
}

export function getUserProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getUserProfil = await getUserProfilLeanExec(id);
        next();
    };
}

export function getUserProfilController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getUserProfilLeanExec(id));
    };
}
                

export class UserAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyUsersController())
            .get('/:id', getOneUserController())
            // .post('/', createUserController())
            // .put('/:id', updateUserController())
            // .delete('/:id', deleteUserController())
            .get('/:id/roles', getUserRolesController())

            .get('/:id/scopes', getUserScopesController())

            .get('/:id/credential', getUserCredentialController())

            .get('/:id/profil', getUserProfilController());
    }

    applyRouter(app: Application) {
        app.use('/users', this.router);
    }
}
            

