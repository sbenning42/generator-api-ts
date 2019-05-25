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
export interface Profil {
    _id: string;
    username: string;
    email: string;
    name: string;
    birthdate: Date;
    owner?: User;
}
      
/** 
 * Input payload interface for entity creation
*/
export interface ProfilCreateInput {
    username: string;
    email: string;
    name: string;
    birthdate: Date;
}
      
/** 
 * Input payload interface for entity update
*/
export interface ProfilChangesInput {
    username?: string;
    email?: string;
    name?: string;
    birthdate?: Date;
}
export interface ProfilUpdateInput {
    id: string;
    changes: ProfilChangesInput;
}

/** 
 * Mongoose Schema for this entity
*/
export const ProfilSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    birthdate: {
        type: Date,
        required: true,
    },
    owner: {
        type: ObjectId /* relation (User) */,
        required: false,
    },
}, { minimize: false });
export const ProfilModel = mongoose.model('Profil', ProfilSchema);

export function getManyProfilsQuery() {
    return ProfilModel.find({});
}
export function getManyProfilsLean() {
    return getManyProfilsQuery().lean();
}
export async function getManyProfilsExec() {
    return getManyProfilsQuery().exec();
}
export async function getManyProfilsLeanExec() {
    return getManyProfilsLean().exec();
}

export function getManyProfilsMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getManyProfils = await getManyProfilsLeanExec();
        next();
    };
}

export function getManyProfilsController() {
    return async (req: Request, res: Response) => {
        res.json(await getManyProfilsLeanExec());
    };
}

export function getOneProfilQuery(id: string) {
    return ProfilModel.findById(id);
}
export function getOneProfilLean(id: string) {
    return getOneProfilQuery(id).lean();
}
export async function getOneProfilExec(id: string) {
    return getOneProfilQuery(id).exec();
}
export async function getOneProfilLeanExec(id: string) {
    return getOneProfilLean(id).exec();
}

export function getOneProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getOneProfil = await getOneProfilLeanExec(id);
        next();
    };
}

export function getOneProfilController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getOneProfilLeanExec(id));
    };
}

export async function getProfilOwnerLeanExec(id: string) {
    const related = await getOneProfilQuery(id).populate('owner').lean().exec();
    return related.owner;
}

export function getProfilOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].getProfilOwner = await getProfilOwnerLeanExec(id);
        next();
    };
}

export function getProfilOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await getProfilOwnerLeanExec(id));
    };
}
                

export class ProfilAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyProfilsController())
            .get('/:id', getOneProfilController())
            // .post('/', createProfilController())
            // .put('/:id', updateProfilController())
            // .delete('/:id', deleteProfilController())
            .get('/:id/owner', getProfilOwnerController());
    }

    applyRouter(app: Application) {
        app.use('/profils', this.router);
    }
}
            

