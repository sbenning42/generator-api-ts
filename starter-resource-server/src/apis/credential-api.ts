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
export interface Credential {
    _id: string;
    username: string;
    password: string;
    owner?: User;
}
      
/** 
 * Input payload interface for entity creation
*/
export interface CredentialCreateInput {
    username: string;
    password: string;
}
      
/** 
 * Input payload interface for entity update
*/
export interface CredentialChangesInput {
    username?: string;
    password?: string;
}
export interface CredentialUpdateInput {
    id: string;
    changes: CredentialChangesInput;
}

/** 
 * Mongoose Schema for this entity
*/
export const CredentialSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    owner: {
        type: ObjectId /* relation (User) */,
        required: false,
    },
}, { minimize: false });
export const CredentialModel = mongoose.model('Credential', CredentialSchema);

export function getManyCredentialsQuery() {
    return CredentialModel.find({});
}
export function getManyCredentialsLean() {
    return getManyCredentialsQuery().lean();
}
export async function getManyCredentialsExec() {
    return getManyCredentialsQuery().exec();
}
export async function getManyCredentialsLeanExec() {
    return getManyCredentialsLean().exec();
}

export function getManyCredentialsMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getManyCredentials = await getManyCredentialsLeanExec();
        next();
    };
}

export function getManyCredentialsController() {
    return async (req: Request, res: Response) => {
        res.json(await getManyCredentialsLeanExec());
    };
}

export function getOneCredentialQuery(id: string) {
    return CredentialModel.findById(id);
}
export function getOneCredentialLean(id: string) {
    return getOneCredentialQuery(id).lean();
}
export async function getOneCredentialExec(id: string) {
    return getOneCredentialQuery(id).exec();
}
export async function getOneCredentialLeanExec(id: string) {
    return getOneCredentialLean(id).exec();
}

export function getOneCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getOneCredential = await getOneCredentialLeanExec(id);
        next();
    };
}

export function getOneCredentialController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getOneCredentialLeanExec(id));
    };
}

export async function getCredentialOwnerLeanExec(id: string) {
    const related = await getOneCredentialQuery(id).populate('owner').lean().exec();
    return related.owner;
}

export function getCredentialOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getCredentialOwner = await getCredentialOwnerLeanExec(id);
        next();
    };
}

export function getCredentialOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getCredentialOwnerLeanExec(id));
    };
}
                

export class CredentialAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyCredentialsController())
            .get('/:id', getOneCredentialController())
            // .post('/', createCredentialController())
            // .put('/:id', updateCredentialController())
            // .delete('/:id', deleteCredentialController())
            .get('/:id/owner', getCredentialOwnerController());
    }

    applyRouter(app: Application) {
        app.use('/credentials', this.router);
    }
}
            

