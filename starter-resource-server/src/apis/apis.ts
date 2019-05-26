import {
    Request,
    Response,
    NextFunction,
    Router,
    Application
} from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
        
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;

export function contextMiddleware(req: Request, res: Response, next: NextFunction) {
    req['CTX'] = req['CTX'] ? req['CTX'] : {};
    req['CTX'].req = req;
    req['CTX'].res = res;
    next();
};

export function attachCTX(req: Request, key: string, value: any) {
    req['CTX'][key] = value;
    return value;
}
        
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
        try {
            req['result'].getManyUsers = await getManyUsersLeanExec();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getManyUsersController() {
    return async (req: Request, res: Response) => {
        try {
            res.json(await getManyUsersLeanExec());
        } catch(error) {
            res.status(500).json({ message: 'Something went wrong', error });
        }
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
        try {
            req['result'].getOneUser = await getOneUserLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getOneUserController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getOneUserLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
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
        try {
            req['result'].getUserRoles = await getUserRolesLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getUserRolesController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getUserRolesLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
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
        try {
            req['result'].getUserScopes = await getUserScopesLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getUserScopesController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getUserScopesLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
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
        try {
            req['result'].getUserCredential = await getUserCredentialLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getUserCredentialController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getUserCredentialLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
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
        try {
            req['result'].getUserProfil = await getUserProfilLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getUserProfilController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getUserProfilLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function createUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        const data = req.body;
        try {
            const model = new UserModel(data);
            req['result'].createUser = await model.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function createUserController() {
    return async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const model = new UserModel(data);
            res.json(await model.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function updateUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const changes = req.body;
        try {
            // use { new: true } to return modified document rather than old one (default to false)
            // use upsert if you want an update-or-create-if-not-exists behaviour
            req['result'].updateUser = await UserModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function updateUserController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        const changes = req.body;
        try {
            res.json(await UserModel.findByIdAndUpdate(id, { $set: changes }, { new: true }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function deleteUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        try {
            req['result'].deleteUser = await UserModel.findByIdAndRemove(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function deleteUserController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await UserModel.findByIdAndRemove(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function addUserRolesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('roles').lean().exec(),
                RoleModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.roles)) {
                sub.roles.push(subject._id);
            } else {
                sub.roles = subject._id;
            }
            req['result'].addUserRoles = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function addUserRolesController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('roles').lean().exec(),
                RoleModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.roles)) {
                sub.roles.push(subject._id);
            } else {
                sub.roles = subject._id;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                
export function addUserScopesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('scopes').lean().exec(),
                ScopeModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.scopes)) {
                sub.scopes.push(subject._id);
            } else {
                sub.scopes = subject._id;
            }
            req['result'].addUserScopes = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function addUserScopesController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('scopes').lean().exec(),
                ScopeModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.scopes)) {
                sub.scopes.push(subject._id);
            } else {
                sub.scopes = subject._id;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                
export function addUserCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('credential').lean().exec(),
                CredentialModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.credential)) {
                sub.credential.push(subject._id);
            } else {
                sub.credential = subject._id;
            }
            req['result'].addUserCredential = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function addUserCredentialController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('credential').lean().exec(),
                CredentialModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.credential)) {
                sub.credential.push(subject._id);
            } else {
                sub.credential = subject._id;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                
export function addUserProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('profil').lean().exec(),
                ProfilModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.profil)) {
                sub.profil.push(subject._id);
            } else {
                sub.profil = subject._id;
            }
            req['result'].addUserProfil = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function addUserProfilController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('profil').lean().exec(),
                ProfilModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.profil)) {
                sub.profil.push(subject._id);
            } else {
                sub.profil = subject._id;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function removeUserRolesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('roles').lean().exec(),
                RoleModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.roles)) {
                sub.roles = sub.roles.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.roles = undefined;
            }
            req['result'].removeUserRoles = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function removeUserRolesController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('roles').lean().exec(),
                RoleModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.roles)) {
                sub.roles = sub.roles.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.roles = undefined;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                
export function removeUserScopesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('scopes').lean().exec(),
                ScopeModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.scopes)) {
                sub.scopes = sub.scopes.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.scopes = undefined;
            }
            req['result'].removeUserScopes = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function removeUserScopesController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('scopes').lean().exec(),
                ScopeModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.scopes)) {
                sub.scopes = sub.scopes.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.scopes = undefined;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                
export function removeUserCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('credential').lean().exec(),
                CredentialModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.credential)) {
                sub.credential = sub.credential.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.credential = undefined;
            }
            req['result'].removeUserCredential = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function removeUserCredentialController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('credential').lean().exec(),
                CredentialModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.credential)) {
                sub.credential = sub.credential.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.credential = undefined;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                
export function removeUserProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('profil').lean().exec(),
                ProfilModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.profil)) {
                sub.profil = sub.profil.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.profil = undefined;
            }
            req['result'].removeUserProfil = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function removeUserProfilController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                UserModel.findById(id).populate('profil').lean().exec(),
                ProfilModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.profil)) {
                sub.profil = sub.profil.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.profil = undefined;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export class UserAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyUsersController())
            .get('/:id', getOneUserController())
            .post('/', createUserController())
            .put('/:id', updateUserController())
            .delete('/:id', deleteUserController())
            .get('/:id/roles', getUserRolesController())
            .get('/:id/scopes', getUserScopesController())
            .get('/:id/credential', getUserCredentialController())
            .get('/:id/profil', getUserProfilController())
            .post('/:id/roles/add', addUserRolesController())
            .post('/:id/scopes/add', addUserScopesController())
            .post('/:id/credential/add', addUserCredentialController())
            .post('/:id/profil/add', addUserProfilController())
            .post('/:id/roles/remove', removeUserRolesController())
            .post('/:id/scopes/remove', removeUserScopesController())
            .post('/:id/credential/remove', removeUserCredentialController())
            .post('/:id/profil/remove', removeUserProfilController());
    }

    applyRouter(app: Application) {
        app.use('/users', this.router);
    }
}
            

/*

//  
// Base entity interface
//

export interface User {
    _id: string;
    roles?: [Role];
    scopes?: [Scope];
    credential?: Credential;
    profil?: Profil;
}

//  
// Input payload interface for entity creation
//

export interface UserCreateInput {

}

//  
// Input payload interface for entity update
//

export interface UserChangesInput {

}

export interface UserUpdateInput {
    id: string;
    changes: UserChangesInput;
}

//  
// Mongoose Schema/Model for this entity
//

export const UserSchema = new mongoose.Schema(
    {
        roles: {
            type: [ObjectId],
            ref: 'Role',
        },
        scopes: {
            type: [ObjectId],
            ref: 'Scope',
        },
        credential: {
            type: ObjectId,
            ref: 'Credential',
        },
        profil: {
            type: ObjectId,
            ref: 'Profil',
        },
    },
    {
        minimize: false,
    }
);
export const UserModel = mongoose.model('User', UserSchema);

export function UserFindMany(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return UserModel.find(conditions, projection, options);
}
export function UserFindManyLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return UserFindMany(conditions, projection, options).lean();
}
export function UserFindManyExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindMany(conditions, projection, options).exec(cb);
}
export function UserFindManyLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindManyLean(conditions, projection, options).exec(cb);
}

export function UserFindOne(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return UserModel.findOne(conditions, projection, options);
}
export function UserFindOneLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return UserFindOne(conditions, projection, options).lean();
}
export function UserFindOneExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindOne(conditions, projection, options).exec(cb);
}
export function UserFindOneLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindOneLean(conditions, projection, options).exec(cb);
}

export function UserFindById(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserModel.findById(id, projection, options);
}
export function UserFindByIdLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserFindById(id, projection, options).lean();
}
export function UserFindByIdExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindById(id, projection, options).exec(cb);
}
export function UserFindByIdLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdLean(id, projection, options).exec(cb);
}

export function UserCreate(createInput: UserCreateInput) {
    const model = new UserModel(createInput);
    return model.save();
}

export function UserFindByIdAndUpdate(
    { id, changes }: UserUpdateInput,
    options: any = { new: true }
) {
    return UserModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
}
export function UserFindByIdAndUpdateLean(
    update: UserUpdateInput,
    options: any = { new: true }
) {
    return UserFindByIdAndUpdate(id, update, options).lean();
}
export function UserFindByIdAndUpdateExec(
    update: UserUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndUpdate(id, update, options).exec(cb);
}
export function UserFindByIdAndUpdateLeanExec(
    update: UserUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndUpdateLean(id, update, options).exec(cb);
}

export function UserFindByIdAndRemove(
    id: string | ObjectID,
    options: any = {}
) {
    return UserModel.findByIdAndRemove(id, options);
}
export function UserFindByIdAndRemoveLean(
    id: string | ObjectID,
    options: any = {}
) {
    return UserFindByIdAndRemove(id, options).lean();
}
export function UserFindByIdAndRemoveExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemove(id, options).exec(cb);
}
export function UserFindByIdAndRemoveLeanExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveLean(id, options).exec(cb);
}


export function UserFindByIdPopulateRoles(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserModel.findById(id, projection, options).populate('roles');
}
export function UserFindByIdPopulateRolesLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserFindByIdPopulateRoles(id, projection, options).lean();
}
export function UserFindByIdPopulateRolesExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdPopulateRoles(id, projection, options).exec(cb);
}
export function UserFindByIdPopulateRolesLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdPopulateRolesLean(id, projection, options).exec(cb);
}

export async function UserFindByIdRoles(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await UserFindByIdPopulateRolesLeanExec();
    return object ? object.roles : undefined;
}

export function UserFindByIdAndAddRoles(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return UserModel.findByIdAndUpdate(id, { $push: { roles: addId } }, { new: true });
}
export function UserFindByIdAndAddRolesLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return UserFindByIdAndAddRoles(id, addId, options).lean();
}
export function UserFindByIdAndAddRolesExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddRoles(id, addId, options).exec(cb);
}
export function UserFindByIdAndAddRolesLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddRolesLean(id, addId, options).exec(cb);
}

export function UserFindByIdAndRemoveRoles(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return UserModel.findByIdAndUpdate(id, { $pull: { roles: removeId } }, { new: true });
}
export function UserFindByIdAndRemoveRolesLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return UserFindByIdAndRemoveRoles(id, removeId, options).lean();
}
export function UserFindByIdAndRemoveRolesExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveRoles(id, removeId, options).exec(cb);
}
export function UserFindByIdAndRemoveRolesLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveRolesLean(id, removeId, options).exec(cb);
}


export function UserFindByIdPopulateScopes(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserModel.findById(id, projection, options).populate('scopes');
}
export function UserFindByIdPopulateScopesLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserFindByIdPopulateScopes(id, projection, options).lean();
}
export function UserFindByIdPopulateScopesExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdPopulateScopes(id, projection, options).exec(cb);
}
export function UserFindByIdPopulateScopesLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdPopulateScopesLean(id, projection, options).exec(cb);
}

export async function UserFindByIdScopes(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await UserFindByIdPopulateScopesLeanExec();
    return object ? object.scopes : undefined;
}

export function UserFindByIdAndAddScopes(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return UserModel.findByIdAndUpdate(id, { $push: { scopes: addId } }, { new: true });
}
export function UserFindByIdAndAddScopesLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return UserFindByIdAndAddScopes(id, addId, options).lean();
}
export function UserFindByIdAndAddScopesExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddScopes(id, addId, options).exec(cb);
}
export function UserFindByIdAndAddScopesLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddScopesLean(id, addId, options).exec(cb);
}

export function UserFindByIdAndRemoveScopes(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return UserModel.findByIdAndUpdate(id, { $pull: { scopes: removeId } }, { new: true });
}
export function UserFindByIdAndRemoveScopesLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return UserFindByIdAndRemoveScopes(id, removeId, options).lean();
}
export function UserFindByIdAndRemoveScopesExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveScopes(id, removeId, options).exec(cb);
}
export function UserFindByIdAndRemoveScopesLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveScopesLean(id, removeId, options).exec(cb);
}


export function UserFindByIdPopulateCredential(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserModel.findById(id, projection, options).populate('credential');
}
export function UserFindByIdPopulateCredentialLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserFindByIdPopulateCredential(id, projection, options).lean();
}
export function UserFindByIdPopulateCredentialExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdPopulateCredential(id, projection, options).exec(cb);
}
export function UserFindByIdPopulateCredentialLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdPopulateCredentialLean(id, projection, options).exec(cb);
}

export async function UserFindByIdCredential(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await UserFindByIdPopulateCredentialLeanExec();
    return object ? object.credential : undefined;
}

export function UserFindByIdAndAddCredential(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return UserModel.findByIdAndUpdate(id, { $push: { credential: addId } }, { new: true });
}
export function UserFindByIdAndAddCredentialLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return UserFindByIdAndAddCredential(id, addId, options).lean();
}
export function UserFindByIdAndAddCredentialExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddCredential(id, addId, options).exec(cb);
}
export function UserFindByIdAndAddCredentialLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddCredentialLean(id, addId, options).exec(cb);
}

export function UserFindByIdAndRemoveCredential(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return UserModel.findByIdAndUpdate(id, { $pull: { credential: removeId } }, { new: true });
}
export function UserFindByIdAndRemoveCredentialLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return UserFindByIdAndRemoveCredential(id, removeId, options).lean();
}
export function UserFindByIdAndRemoveCredentialExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveCredential(id, removeId, options).exec(cb);
}
export function UserFindByIdAndRemoveCredentialLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveCredentialLean(id, removeId, options).exec(cb);
}


export function UserFindByIdPopulateProfil(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserModel.findById(id, projection, options).populate('profil');
}
export function UserFindByIdPopulateProfilLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserFindByIdPopulateProfil(id, projection, options).lean();
}
export function UserFindByIdPopulateProfilExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdPopulateProfil(id, projection, options).exec(cb);
}
export function UserFindByIdPopulateProfilLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdPopulateProfilLean(id, projection, options).exec(cb);
}

export async function UserFindByIdProfil(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await UserFindByIdPopulateProfilLeanExec();
    return object ? object.profil : undefined;
}

export function UserFindByIdAndAddProfil(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return UserModel.findByIdAndUpdate(id, { $push: { profil: addId } }, { new: true });
}
export function UserFindByIdAndAddProfilLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return UserFindByIdAndAddProfil(id, addId, options).lean();
}
export function UserFindByIdAndAddProfilExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddProfil(id, addId, options).exec(cb);
}
export function UserFindByIdAndAddProfilLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddProfilLean(id, addId, options).exec(cb);
}

export function UserFindByIdAndRemoveProfil(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return UserModel.findByIdAndUpdate(id, { $pull: { profil: removeId } }, { new: true });
}
export function UserFindByIdAndRemoveProfilLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return UserFindByIdAndRemoveProfil(id, removeId, options).lean();
}
export function UserFindByIdAndRemoveProfilExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveProfil(id, removeId, options).exec(cb);
}
export function UserFindByIdAndRemoveProfilLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveProfilLean(id, removeId, options).exec(cb);
}


export function getAllUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllUser', await UserFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function getByIdUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getByIdUser', await UserFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: UserCreateInput = req.body;
        try {
            attachCTX(req, 'createUser', await UserCreate(createInput));            
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: UserChangesInput = req.body;
        try {
            attachCTX(req, 'updateUser', await UserFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteUser', await UserFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getUserRolesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getUserRoles', await UserFindByIdRoles(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function addUserRolesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            attachCTX(req, 'addUserRoles', await UserFindByIdAndAddRolesLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function removeUserRolesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            attachCTX(req, 'removeUserRoles', await UserFindByIdAndRemoveRolesLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getUserScopesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getUserScopes', await UserFindByIdScopes(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function addUserScopesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            attachCTX(req, 'addUserScopes', await UserFindByIdAndAddScopesLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function removeUserScopesMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            attachCTX(req, 'removeUserScopes', await UserFindByIdAndRemoveScopesLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getUserCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getUserCredential', await UserFindByIdCredential(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function addUserCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            attachCTX(req, 'addUserCredential', await UserFindByIdAndAddCredentialLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function removeUserCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            attachCTX(req, 'removeUserCredential', await UserFindByIdAndRemoveCredentialLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getUserProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getUserProfil', await UserFindByIdProfil(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function addUserProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            attachCTX(req, 'addUserProfil', await UserFindByIdAndAddProfilLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function removeUserProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            attachCTX(req, 'removeUserProfil', await UserFindByIdAndRemoveProfilLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getAllUserController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await UserFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function getByIdUserController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await UserFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function createUserController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: UserCreateInput = req.body;
        try {
            res.json(await UserCreate(createInput));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function updateUserController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: UserChangesInput = req.body;
        try {
            res.json(await UserFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteUserController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await UserFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}


export function getUserRolesController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await UserFindByIdRoles(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function addUserRolesController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            res.json(await UserFindByIdAndAddRolesLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function removeUserRolesController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            res.json(await UserFindByIdAndRemoveRolesLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}


export function getUserScopesController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await UserFindByIdScopes(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function addUserScopesController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            res.json(await UserFindByIdAndAddScopesLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function removeUserScopesController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            res.json(await UserFindByIdAndRemoveScopesLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}


export function getUserCredentialController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await UserFindByIdCredential(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function addUserCredentialController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            res.json(await UserFindByIdAndAddCredentialLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function removeUserCredentialController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            res.json(await UserFindByIdAndRemoveCredentialLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}


export function getUserProfilController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await UserFindByIdProfil(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function addUserProfilController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            res.json(await UserFindByIdAndAddProfilLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function removeUserProfilController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            res.json(await UserFindByIdAndRemoveProfilLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}



export class UserAPI {

    router = Router();
    
    constructor() {
        this.makeAPI();
    }

    private makeAPI() {
        this.router
            .get('/', getAllUserController())
            .get('/:id', getByIdUserController())
            .post('/', createUserController())
            .put('/:id', updateUserController())
            .delete('/:id', deleteUserController())
            .get('/:id/roles', getUserRolesController())
            .get('/:id/scopes', getUserScopesController())
            .get('/:id/credential', getUserCredentialController())
            .get('/:id/profil', getUserProfilController())
            .post('/:id/roles/add', addUserRolesController())
            .post('/:id/scopes/add', addUserScopesController())
            .post('/:id/credential/add', addUserCredentialController())
            .post('/:id/profil/add', addUserProfilController())
            .post('/:id/roles/remove', removeUserRolesController())
            .post('/:id/scopes/remove', removeUserScopesController())
            .post('/:id/credential/remove', removeUserCredentialController())
            .post('/:id/profil/remove', removeUserProfilController());
    }
    
    applyAPI(app: Application) {
        app.use('/users', this.router);
    }
}


*/


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
        try {
            req['result'].getManyRoles = await getManyRolesLeanExec();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getManyRolesController() {
    return async (req: Request, res: Response) => {
        try {
            res.json(await getManyRolesLeanExec());
        } catch(error) {
            res.status(500).json({ message: 'Something went wrong', error });
        }
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
        try {
            req['result'].getOneRole = await getOneRoleLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getOneRoleController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getOneRoleLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
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
        try {
            req['result'].getRoleUsers = await getRoleUsersLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getRoleUsersController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getRoleUsersLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function createRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        const data = req.body;
        try {
            const model = new RoleModel(data);
            req['result'].createRole = await model.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function createRoleController() {
    return async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const model = new RoleModel(data);
            res.json(await model.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function updateRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const changes = req.body;
        try {
            // use { new: true } to return modified document rather than old one (default to false)
            // use upsert if you want an update-or-create-if-not-exists behaviour
            req['result'].updateRole = await RoleModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function updateRoleController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        const changes = req.body;
        try {
            res.json(await RoleModel.findByIdAndUpdate(id, { $set: changes }, { new: true }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function deleteRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        try {
            req['result'].deleteRole = await RoleModel.findByIdAndRemove(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function deleteRoleController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await RoleModel.findByIdAndRemove(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function addRoleUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                RoleModel.findById(id).populate('users').lean().exec(),
                UserModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.users)) {
                sub.users.push(subject._id);
            } else {
                sub.users = subject._id;
            }
            req['result'].addRoleUsers = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function addRoleUsersController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                RoleModel.findById(id).populate('users').lean().exec(),
                UserModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.users)) {
                sub.users.push(subject._id);
            } else {
                sub.users = subject._id;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function removeRoleUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                RoleModel.findById(id).populate('users').lean().exec(),
                UserModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.users)) {
                sub.users = sub.users.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.users = undefined;
            }
            req['result'].removeRoleUsers = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function removeRoleUsersController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                RoleModel.findById(id).populate('users').lean().exec(),
                UserModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.users)) {
                sub.users = sub.users.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.users = undefined;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export class RoleAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyRolesController())
            .get('/:id', getOneRoleController())
            .post('/', createRoleController())
            .put('/:id', updateRoleController())
            .delete('/:id', deleteRoleController())
            .get('/:id/users', getRoleUsersController());
    }

    applyRouter(app: Application) {
        app.use('/roles', this.router);
    }
}
            

/*

//  
// Base entity interface
//

export interface Role {
    _id: string;
    name: string;
    users?: [User];
}

//  
// Input payload interface for entity creation
//

export interface RoleCreateInput {
    name: string;
}

//  
// Input payload interface for entity update
//

export interface RoleChangesInput {
    name?: string;
}

export interface RoleUpdateInput {
    id: string;
    changes: RoleChangesInput;
}

//  
// Mongoose Schema/Model for this entity
//

export const RoleSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            ref: 'undefined',
        },
        users: {
            type: [ObjectId],
            ref: 'User',
        },
    },
    {
        minimize: false,
    }
);
export const RoleModel = mongoose.model('Role', RoleSchema);

export function RoleFindMany(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return RoleModel.find(conditions, projection, options);
}
export function RoleFindManyLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return RoleFindMany(conditions, projection, options).lean();
}
export function RoleFindManyExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindMany(conditions, projection, options).exec(cb);
}
export function RoleFindManyLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindManyLean(conditions, projection, options).exec(cb);
}

export function RoleFindOne(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return RoleModel.findOne(conditions, projection, options);
}
export function RoleFindOneLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return RoleFindOne(conditions, projection, options).lean();
}
export function RoleFindOneExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindOne(conditions, projection, options).exec(cb);
}
export function RoleFindOneLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindOneLean(conditions, projection, options).exec(cb);
}

export function RoleFindById(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return RoleModel.findById(id, projection, options);
}
export function RoleFindByIdLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return RoleFindById(id, projection, options).lean();
}
export function RoleFindByIdExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindById(id, projection, options).exec(cb);
}
export function RoleFindByIdLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdLean(id, projection, options).exec(cb);
}

export function RoleCreate(createInput: RoleCreateInput) {
    const model = new RoleModel(createInput);
    return model.save();
}

export function RoleFindByIdAndUpdate(
    { id, changes }: RoleUpdateInput,
    options: any = { new: true }
) {
    return RoleModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
}
export function RoleFindByIdAndUpdateLean(
    update: RoleUpdateInput,
    options: any = { new: true }
) {
    return RoleFindByIdAndUpdate(id, update, options).lean();
}
export function RoleFindByIdAndUpdateExec(
    update: RoleUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndUpdate(id, update, options).exec(cb);
}
export function RoleFindByIdAndUpdateLeanExec(
    update: RoleUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndUpdateLean(id, update, options).exec(cb);
}

export function RoleFindByIdAndRemove(
    id: string | ObjectID,
    options: any = {}
) {
    return RoleModel.findByIdAndRemove(id, options);
}
export function RoleFindByIdAndRemoveLean(
    id: string | ObjectID,
    options: any = {}
) {
    return RoleFindByIdAndRemove(id, options).lean();
}
export function RoleFindByIdAndRemoveExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndRemove(id, options).exec(cb);
}
export function RoleFindByIdAndRemoveLeanExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndRemoveLean(id, options).exec(cb);
}


export function RoleFindByIdPopulateUsers(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return RoleModel.findById(id, projection, options).populate('users');
}
export function RoleFindByIdPopulateUsersLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return RoleFindByIdPopulateUsers(id, projection, options).lean();
}
export function RoleFindByIdPopulateUsersExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdPopulateUsers(id, projection, options).exec(cb);
}
export function RoleFindByIdPopulateUsersLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdPopulateUsersLean(id, projection, options).exec(cb);
}

export async function RoleFindByIdUsers(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await RoleFindByIdPopulateUsersLeanExec();
    return object ? object.users : undefined;
}

export function RoleFindByIdAndAddUsers(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return RoleModel.findByIdAndUpdate(id, { $push: { users: addId } }, { new: true });
}
export function RoleFindByIdAndAddUsersLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return RoleFindByIdAndAddUsers(id, addId, options).lean();
}
export function RoleFindByIdAndAddUsersExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndAddUsers(id, addId, options).exec(cb);
}
export function RoleFindByIdAndAddUsersLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndAddUsersLean(id, addId, options).exec(cb);
}

export function RoleFindByIdAndRemoveUsers(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return RoleModel.findByIdAndUpdate(id, { $pull: { users: removeId } }, { new: true });
}
export function RoleFindByIdAndRemoveUsersLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return RoleFindByIdAndRemoveUsers(id, removeId, options).lean();
}
export function RoleFindByIdAndRemoveUsersExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndRemoveUsers(id, removeId, options).exec(cb);
}
export function RoleFindByIdAndRemoveUsersLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndRemoveUsersLean(id, removeId, options).exec(cb);
}


export function getAllRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllRole', await RoleFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function getByIdRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getByIdRole', await RoleFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: RoleCreateInput = req.body;
        try {
            attachCTX(req, 'createRole', await RoleCreate(createInput));            
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: RoleChangesInput = req.body;
        try {
            attachCTX(req, 'updateRole', await RoleFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteRole', await RoleFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getRoleUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getRoleUsers', await RoleFindByIdUsers(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function addRoleUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            attachCTX(req, 'addRoleUsers', await RoleFindByIdAndAddUsersLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function removeRoleUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            attachCTX(req, 'removeRoleUsers', await RoleFindByIdAndRemoveUsersLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getAllRoleController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await RoleFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function getByIdRoleController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await RoleFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function createRoleController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: RoleCreateInput = req.body;
        try {
            res.json(await RoleCreate(createInput));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function updateRoleController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: RoleChangesInput = req.body;
        try {
            res.json(await RoleFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteRoleController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await RoleFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}


export function getRoleUsersController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await RoleFindByIdUsers(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function addRoleUsersController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            res.json(await RoleFindByIdAndAddUsersLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function removeRoleUsersController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            res.json(await RoleFindByIdAndRemoveUsersLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}



export class RoleAPI {

    router = Router();
    
    constructor() {
        this.makeAPI();
    }

    private makeAPI() {
        this.router
            .get('/', getAllRoleController())
            .get('/:id', getByIdRoleController())
            .post('/', createRoleController())
            .put('/:id', updateRoleController())
            .delete('/:id', deleteRoleController())
            .get('/:id/users', getRoleUsersController())
            .post('/:id/users/add', addRoleUsersController())
            .post('/:id/users/remove', removeRoleUsersController());
    }
    
    applyAPI(app: Application) {
        app.use('/roles', this.router);
    }
}


*/


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
        try {
            req['result'].getManyScopes = await getManyScopesLeanExec();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getManyScopesController() {
    return async (req: Request, res: Response) => {
        try {
            res.json(await getManyScopesLeanExec());
        } catch(error) {
            res.status(500).json({ message: 'Something went wrong', error });
        }
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
        try {
            req['result'].getOneScope = await getOneScopeLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getOneScopeController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getOneScopeLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
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
        try {
            req['result'].getScopeUsers = await getScopeUsersLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getScopeUsersController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getScopeUsersLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function createScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        const data = req.body;
        try {
            const model = new ScopeModel(data);
            req['result'].createScope = await model.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function createScopeController() {
    return async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const model = new ScopeModel(data);
            res.json(await model.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function updateScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const changes = req.body;
        try {
            // use { new: true } to return modified document rather than old one (default to false)
            // use upsert if you want an update-or-create-if-not-exists behaviour
            req['result'].updateScope = await ScopeModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function updateScopeController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        const changes = req.body;
        try {
            res.json(await ScopeModel.findByIdAndUpdate(id, { $set: changes }, { new: true }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function deleteScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        try {
            req['result'].deleteScope = await ScopeModel.findByIdAndRemove(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function deleteScopeController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await ScopeModel.findByIdAndRemove(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function addScopeUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                ScopeModel.findById(id).populate('users').lean().exec(),
                UserModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.users)) {
                sub.users.push(subject._id);
            } else {
                sub.users = subject._id;
            }
            req['result'].addScopeUsers = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function addScopeUsersController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                ScopeModel.findById(id).populate('users').lean().exec(),
                UserModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.users)) {
                sub.users.push(subject._id);
            } else {
                sub.users = subject._id;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function removeScopeUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                ScopeModel.findById(id).populate('users').lean().exec(),
                UserModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.users)) {
                sub.users = sub.users.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.users = undefined;
            }
            req['result'].removeScopeUsers = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function removeScopeUsersController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                ScopeModel.findById(id).populate('users').lean().exec(),
                UserModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.users)) {
                sub.users = sub.users.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.users = undefined;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export class ScopeAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyScopesController())
            .get('/:id', getOneScopeController())
            .post('/', createScopeController())
            .put('/:id', updateScopeController())
            .delete('/:id', deleteScopeController())
            .get('/:id/users', getScopeUsersController())
            .post('/:id/users/add', addScopeUsersController())
            .post('/:id/users/remove', removeScopeUsersController());
    }

    applyRouter(app: Application) {
        app.use('/scopes', this.router);
    }
}
            

/*

//  
// Base entity interface
//

export interface Scope {
    _id: string;
    name: string;
    users?: [User];
}

//  
// Input payload interface for entity creation
//

export interface ScopeCreateInput {
    name: string;
}

//  
// Input payload interface for entity update
//

export interface ScopeChangesInput {
    name?: string;
}

export interface ScopeUpdateInput {
    id: string;
    changes: ScopeChangesInput;
}

//  
// Mongoose Schema/Model for this entity
//

export const ScopeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            ref: 'undefined',
        },
        users: {
            type: [ObjectId],
            ref: 'User',
        },
    },
    {
        minimize: false,
    }
);
export const ScopeModel = mongoose.model('Scope', ScopeSchema);

export function ScopeFindMany(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return ScopeModel.find(conditions, projection, options);
}
export function ScopeFindManyLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return ScopeFindMany(conditions, projection, options).lean();
}
export function ScopeFindManyExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindMany(conditions, projection, options).exec(cb);
}
export function ScopeFindManyLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindManyLean(conditions, projection, options).exec(cb);
}

export function ScopeFindOne(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return ScopeModel.findOne(conditions, projection, options);
}
export function ScopeFindOneLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return ScopeFindOne(conditions, projection, options).lean();
}
export function ScopeFindOneExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindOne(conditions, projection, options).exec(cb);
}
export function ScopeFindOneLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindOneLean(conditions, projection, options).exec(cb);
}

export function ScopeFindById(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return ScopeModel.findById(id, projection, options);
}
export function ScopeFindByIdLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return ScopeFindById(id, projection, options).lean();
}
export function ScopeFindByIdExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindById(id, projection, options).exec(cb);
}
export function ScopeFindByIdLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdLean(id, projection, options).exec(cb);
}

export function ScopeCreate(createInput: ScopeCreateInput) {
    const model = new ScopeModel(createInput);
    return model.save();
}

export function ScopeFindByIdAndUpdate(
    { id, changes }: ScopeUpdateInput,
    options: any = { new: true }
) {
    return ScopeModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
}
export function ScopeFindByIdAndUpdateLean(
    update: ScopeUpdateInput,
    options: any = { new: true }
) {
    return ScopeFindByIdAndUpdate(id, update, options).lean();
}
export function ScopeFindByIdAndUpdateExec(
    update: ScopeUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndUpdate(id, update, options).exec(cb);
}
export function ScopeFindByIdAndUpdateLeanExec(
    update: ScopeUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndUpdateLean(id, update, options).exec(cb);
}

export function ScopeFindByIdAndRemove(
    id: string | ObjectID,
    options: any = {}
) {
    return ScopeModel.findByIdAndRemove(id, options);
}
export function ScopeFindByIdAndRemoveLean(
    id: string | ObjectID,
    options: any = {}
) {
    return ScopeFindByIdAndRemove(id, options).lean();
}
export function ScopeFindByIdAndRemoveExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndRemove(id, options).exec(cb);
}
export function ScopeFindByIdAndRemoveLeanExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndRemoveLean(id, options).exec(cb);
}


export function ScopeFindByIdPopulateUsers(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return ScopeModel.findById(id, projection, options).populate('users');
}
export function ScopeFindByIdPopulateUsersLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return ScopeFindByIdPopulateUsers(id, projection, options).lean();
}
export function ScopeFindByIdPopulateUsersExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdPopulateUsers(id, projection, options).exec(cb);
}
export function ScopeFindByIdPopulateUsersLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdPopulateUsersLean(id, projection, options).exec(cb);
}

export async function ScopeFindByIdUsers(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await ScopeFindByIdPopulateUsersLeanExec();
    return object ? object.users : undefined;
}

export function ScopeFindByIdAndAddUsers(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return ScopeModel.findByIdAndUpdate(id, { $push: { users: addId } }, { new: true });
}
export function ScopeFindByIdAndAddUsersLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return ScopeFindByIdAndAddUsers(id, addId, options).lean();
}
export function ScopeFindByIdAndAddUsersExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndAddUsers(id, addId, options).exec(cb);
}
export function ScopeFindByIdAndAddUsersLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndAddUsersLean(id, addId, options).exec(cb);
}

export function ScopeFindByIdAndRemoveUsers(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return ScopeModel.findByIdAndUpdate(id, { $pull: { users: removeId } }, { new: true });
}
export function ScopeFindByIdAndRemoveUsersLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return ScopeFindByIdAndRemoveUsers(id, removeId, options).lean();
}
export function ScopeFindByIdAndRemoveUsersExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndRemoveUsers(id, removeId, options).exec(cb);
}
export function ScopeFindByIdAndRemoveUsersLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndRemoveUsersLean(id, removeId, options).exec(cb);
}


export function getAllScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllScope', await ScopeFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function getByIdScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getByIdScope', await ScopeFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: ScopeCreateInput = req.body;
        try {
            attachCTX(req, 'createScope', await ScopeCreate(createInput));            
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: ScopeChangesInput = req.body;
        try {
            attachCTX(req, 'updateScope', await ScopeFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteScope', await ScopeFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getScopeUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getScopeUsers', await ScopeFindByIdUsers(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function addScopeUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            attachCTX(req, 'addScopeUsers', await ScopeFindByIdAndAddUsersLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function removeScopeUsersMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            attachCTX(req, 'removeScopeUsers', await ScopeFindByIdAndRemoveUsersLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getAllScopeController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await ScopeFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function getByIdScopeController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await ScopeFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function createScopeController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: ScopeCreateInput = req.body;
        try {
            res.json(await ScopeCreate(createInput));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function updateScopeController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: ScopeChangesInput = req.body;
        try {
            res.json(await ScopeFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteScopeController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await ScopeFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}


export function getScopeUsersController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await ScopeFindByIdUsers(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function addScopeUsersController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            res.json(await ScopeFindByIdAndAddUsersLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function removeScopeUsersController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            res.json(await ScopeFindByIdAndRemoveUsersLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}



export class ScopeAPI {

    router = Router();
    
    constructor() {
        this.makeAPI();
    }

    private makeAPI() {
        this.router
            .get('/', getAllScopeController())
            .get('/:id', getByIdScopeController())
            .post('/', createScopeController())
            .put('/:id', updateScopeController())
            .delete('/:id', deleteScopeController())
            .get('/:id/users', getScopeUsersController())
            .post('/:id/users/add', addScopeUsersController())
            .post('/:id/users/remove', removeScopeUsersController());
    }
    
    applyAPI(app: Application) {
        app.use('/scopes', this.router);
    }
}


*/


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
        try {
            req['result'].getManyCredentials = await getManyCredentialsLeanExec();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getManyCredentialsController() {
    return async (req: Request, res: Response) => {
        try {
            res.json(await getManyCredentialsLeanExec());
        } catch(error) {
            res.status(500).json({ message: 'Something went wrong', error });
        }
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
        try {
            req['result'].getOneCredential = await getOneCredentialLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getOneCredentialController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getOneCredentialLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
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
        try {
            req['result'].getCredentialOwner = await getCredentialOwnerLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getCredentialOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getCredentialOwnerLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function createCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        const data = req.body;
        try {
            const model = new CredentialModel(data);
            req['result'].createCredential = await model.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function createCredentialController() {
    return async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const model = new CredentialModel(data);
            res.json(await model.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function updateCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const changes = req.body;
        try {
            // use { new: true } to return modified document rather than old one (default to false)
            // use upsert if you want an update-or-create-if-not-exists behaviour
            req['result'].updateCredential = await CredentialModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function updateCredentialController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        const changes = req.body;
        try {
            res.json(await CredentialModel.findByIdAndUpdate(id, { $set: changes }, { new: true }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function deleteCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        try {
            req['result'].deleteCredential = await CredentialModel.findByIdAndRemove(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function deleteCredentialController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await CredentialModel.findByIdAndRemove(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function addCredentialOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                CredentialModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner.push(subject._id);
            } else {
                sub.owner = subject._id;
            }
            req['result'].addCredentialOwner = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function addCredentialOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                CredentialModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner.push(subject._id);
            } else {
                sub.owner = subject._id;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function removeCredentialOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                CredentialModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner = sub.owner.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.owner = undefined;
            }
            req['result'].removeCredentialOwner = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function removeCredentialOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                CredentialModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner = sub.owner.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.owner = undefined;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export class CredentialAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyCredentialsController())
            .get('/:id', getOneCredentialController())
            .post('/', createCredentialController())
            .put('/:id', updateCredentialController())
            .delete('/:id', deleteCredentialController())
            .get('/:id/owner', getCredentialOwnerController())
            .post('/:id/owner/add', addCredentialOwnerController())
            .post('/:id/owner/remove', removeCredentialOwnerController());
    }

    applyRouter(app: Application) {
        app.use('/credentials', this.router);
    }
}
            

/*

//  
// Base entity interface
//

export interface Credential {
    _id: string;
    username: string;
    password: string;
    owner?: User;
}

//  
// Input payload interface for entity creation
//

export interface CredentialCreateInput {
    username: string;
    password: string;
}

//  
// Input payload interface for entity update
//

export interface CredentialChangesInput {
    username?: string;
    password?: string;
}

export interface CredentialUpdateInput {
    id: string;
    changes: CredentialChangesInput;
}

//  
// Mongoose Schema/Model for this entity
//

export const CredentialSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            ref: 'undefined',
        },
        password: {
            type: String,
            required: true,
            ref: 'undefined',
        },
        owner: {
            type: ObjectId,
            ref: 'User',
        },
    },
    {
        minimize: false,
    }
);
export const CredentialModel = mongoose.model('Credential', CredentialSchema);

export function CredentialFindMany(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return CredentialModel.find(conditions, projection, options);
}
export function CredentialFindManyLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return CredentialFindMany(conditions, projection, options).lean();
}
export function CredentialFindManyExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindMany(conditions, projection, options).exec(cb);
}
export function CredentialFindManyLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindManyLean(conditions, projection, options).exec(cb);
}

export function CredentialFindOne(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return CredentialModel.findOne(conditions, projection, options);
}
export function CredentialFindOneLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return CredentialFindOne(conditions, projection, options).lean();
}
export function CredentialFindOneExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindOne(conditions, projection, options).exec(cb);
}
export function CredentialFindOneLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindOneLean(conditions, projection, options).exec(cb);
}

export function CredentialFindById(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return CredentialModel.findById(id, projection, options);
}
export function CredentialFindByIdLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return CredentialFindById(id, projection, options).lean();
}
export function CredentialFindByIdExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindById(id, projection, options).exec(cb);
}
export function CredentialFindByIdLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdLean(id, projection, options).exec(cb);
}

export function CredentialCreate(createInput: CredentialCreateInput) {
    const model = new CredentialModel(createInput);
    return model.save();
}

export function CredentialFindByIdAndUpdate(
    { id, changes }: CredentialUpdateInput,
    options: any = { new: true }
) {
    return CredentialModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
}
export function CredentialFindByIdAndUpdateLean(
    update: CredentialUpdateInput,
    options: any = { new: true }
) {
    return CredentialFindByIdAndUpdate(id, update, options).lean();
}
export function CredentialFindByIdAndUpdateExec(
    update: CredentialUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndUpdate(id, update, options).exec(cb);
}
export function CredentialFindByIdAndUpdateLeanExec(
    update: CredentialUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndUpdateLean(id, update, options).exec(cb);
}

export function CredentialFindByIdAndRemove(
    id: string | ObjectID,
    options: any = {}
) {
    return CredentialModel.findByIdAndRemove(id, options);
}
export function CredentialFindByIdAndRemoveLean(
    id: string | ObjectID,
    options: any = {}
) {
    return CredentialFindByIdAndRemove(id, options).lean();
}
export function CredentialFindByIdAndRemoveExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndRemove(id, options).exec(cb);
}
export function CredentialFindByIdAndRemoveLeanExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndRemoveLean(id, options).exec(cb);
}


export function CredentialFindByIdPopulateOwner(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return CredentialModel.findById(id, projection, options).populate('owner');
}
export function CredentialFindByIdPopulateOwnerLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return CredentialFindByIdPopulateOwner(id, projection, options).lean();
}
export function CredentialFindByIdPopulateOwnerExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdPopulateOwner(id, projection, options).exec(cb);
}
export function CredentialFindByIdPopulateOwnerLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdPopulateOwnerLean(id, projection, options).exec(cb);
}

export async function CredentialFindByIdOwner(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await CredentialFindByIdPopulateOwnerLeanExec();
    return object ? object.owner : undefined;
}

export function CredentialFindByIdAndAddOwner(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return CredentialModel.findByIdAndUpdate(id, { $push: { owner: addId } }, { new: true });
}
export function CredentialFindByIdAndAddOwnerLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return CredentialFindByIdAndAddOwner(id, addId, options).lean();
}
export function CredentialFindByIdAndAddOwnerExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndAddOwner(id, addId, options).exec(cb);
}
export function CredentialFindByIdAndAddOwnerLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndAddOwnerLean(id, addId, options).exec(cb);
}

export function CredentialFindByIdAndRemoveOwner(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return CredentialModel.findByIdAndUpdate(id, { $pull: { owner: removeId } }, { new: true });
}
export function CredentialFindByIdAndRemoveOwnerLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return CredentialFindByIdAndRemoveOwner(id, removeId, options).lean();
}
export function CredentialFindByIdAndRemoveOwnerExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndRemoveOwner(id, removeId, options).exec(cb);
}
export function CredentialFindByIdAndRemoveOwnerLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndRemoveOwnerLean(id, removeId, options).exec(cb);
}


export function getAllCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllCredential', await CredentialFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function getByIdCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getByIdCredential', await CredentialFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: CredentialCreateInput = req.body;
        try {
            attachCTX(req, 'createCredential', await CredentialCreate(createInput));            
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: CredentialChangesInput = req.body;
        try {
            attachCTX(req, 'updateCredential', await CredentialFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteCredential', await CredentialFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getCredentialOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getCredentialOwner', await CredentialFindByIdOwner(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function addCredentialOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            attachCTX(req, 'addCredentialOwner', await CredentialFindByIdAndAddOwnerLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function removeCredentialOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            attachCTX(req, 'removeCredentialOwner', await CredentialFindByIdAndRemoveOwnerLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getAllCredentialController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await CredentialFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function getByIdCredentialController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await CredentialFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function createCredentialController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: CredentialCreateInput = req.body;
        try {
            res.json(await CredentialCreate(createInput));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function updateCredentialController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: CredentialChangesInput = req.body;
        try {
            res.json(await CredentialFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteCredentialController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await CredentialFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}


export function getCredentialOwnerController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await CredentialFindByIdOwner(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function addCredentialOwnerController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            res.json(await CredentialFindByIdAndAddOwnerLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function removeCredentialOwnerController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            res.json(await CredentialFindByIdAndRemoveOwnerLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}



export class CredentialAPI {

    router = Router();
    
    constructor() {
        this.makeAPI();
    }

    private makeAPI() {
        this.router
            .get('/', getAllCredentialController())
            .get('/:id', getByIdCredentialController())
            .post('/', createCredentialController())
            .put('/:id', updateCredentialController())
            .delete('/:id', deleteCredentialController())
            .get('/:id/owner', getCredentialOwnerController())
            .post('/:id/owner/add', addCredentialOwnerController())
            .post('/:id/owner/remove', removeCredentialOwnerController());
    }
    
    applyAPI(app: Application) {
        app.use('/credentials', this.router);
    }
}


*/


/** 
 * Base entity interface
*/
export interface Profil {
    _id: string;
    username: string;
    email: string;
    name: string;
    birthdate: Date;
    json?: any;
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
    json?: any;
}
      
/** 
 * Input payload interface for entity update
*/
export interface ProfilChangesInput {
    username?: string;
    email?: string;
    name?: string;
    birthdate?: Date;
    json?: any;
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
    json: {
        type: Mixed,
        required: false,
        default: {},
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
        try {
            req['result'].getManyProfils = await getManyProfilsLeanExec();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getManyProfilsController() {
    return async (req: Request, res: Response) => {
        try {
            res.json(await getManyProfilsLeanExec());
        } catch(error) {
            res.status(500).json({ message: 'Something went wrong', error });
        }
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
        try {
            req['result'].getOneProfil = await getOneProfilLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getOneProfilController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getOneProfilLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
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
        try {
            req['result'].getProfilOwner = await getProfilOwnerLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getProfilOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getProfilOwnerLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function createProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        const data = req.body;
        try {
            const model = new ProfilModel(data);
            req['result'].createProfil = await model.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function createProfilController() {
    return async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const model = new ProfilModel(data);
            res.json(await model.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function updateProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const changes = req.body;
        try {
            // use { new: true } to return modified document rather than old one (default to false)
            // use upsert if you want an update-or-create-if-not-exists behaviour
            req['result'].updateProfil = await ProfilModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function updateProfilController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        const changes = req.body;
        try {
            res.json(await ProfilModel.findByIdAndUpdate(id, { $set: changes }, { new: true }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function deleteProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        try {
            req['result'].deleteProfil = await ProfilModel.findByIdAndRemove(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function deleteProfilController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await ProfilModel.findByIdAndRemove(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function addProfilOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                ProfilModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner.push(subject._id);
            } else {
                sub.owner = subject._id;
            }
            req['result'].addProfilOwner = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function addProfilOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                ProfilModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner.push(subject._id);
            } else {
                sub.owner = subject._id;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function removeProfilOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                ProfilModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner = sub.owner.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.owner = undefined;
            }
            req['result'].removeProfilOwner = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function removeProfilOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                ProfilModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner = sub.owner.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.owner = undefined;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export class ProfilAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyProfilsController())
            .get('/:id', getOneProfilController())
            .post('/', createProfilController())
            .put('/:id', updateProfilController())
            .delete('/:id', deleteProfilController())
            .get('/:id/owner', getProfilOwnerController())
            .post('/:id/owner/add', addProfilOwnerController())
            .post('/:id/owner/remove', removeProfilOwnerController());
    }

    applyRouter(app: Application) {
        app.use('/profils', this.router);
    }
}
            

/*

//  
// Base entity interface
//

export interface Profil {
    _id: string;
    username: string;
    email: string;
    name: string;
    birthdate: Date;
    json?: any;
    owner?: User;
}

//  
// Input payload interface for entity creation
//

export interface ProfilCreateInput {
    username: string;
    email: string;
    name: string;
    birthdate: Date;
    json?: any;
}

//  
// Input payload interface for entity update
//

export interface ProfilChangesInput {
    username?: string;
    email?: string;
    name?: string;
    birthdate?: Date;
    json?: any;
}

export interface ProfilUpdateInput {
    id: string;
    changes: ProfilChangesInput;
}

//  
// Mongoose Schema/Model for this entity
//

export const ProfilSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            ref: 'undefined',
        },
        email: {
            type: String,
            required: true,
            unique: true,
            ref: 'undefined',
        },
        name: {
            type: String,
            required: true,
            ref: 'undefined',
        },
        birthdate: {
            type: Date,
            required: true,
            ref: 'undefined',
        },
        json: {
            type: Mixed,
            default: {},
            ref: 'undefined',
        },
        owner: {
            type: ObjectId,
            ref: 'User',
        },
    },
    {
        minimize: false,
    }
);
export const ProfilModel = mongoose.model('Profil', ProfilSchema);

export function ProfilFindMany(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return ProfilModel.find(conditions, projection, options);
}
export function ProfilFindManyLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return ProfilFindMany(conditions, projection, options).lean();
}
export function ProfilFindManyExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindMany(conditions, projection, options).exec(cb);
}
export function ProfilFindManyLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindManyLean(conditions, projection, options).exec(cb);
}

export function ProfilFindOne(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return ProfilModel.findOne(conditions, projection, options);
}
export function ProfilFindOneLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return ProfilFindOne(conditions, projection, options).lean();
}
export function ProfilFindOneExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindOne(conditions, projection, options).exec(cb);
}
export function ProfilFindOneLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindOneLean(conditions, projection, options).exec(cb);
}

export function ProfilFindById(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return ProfilModel.findById(id, projection, options);
}
export function ProfilFindByIdLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return ProfilFindById(id, projection, options).lean();
}
export function ProfilFindByIdExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindById(id, projection, options).exec(cb);
}
export function ProfilFindByIdLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdLean(id, projection, options).exec(cb);
}

export function ProfilCreate(createInput: ProfilCreateInput) {
    const model = new ProfilModel(createInput);
    return model.save();
}

export function ProfilFindByIdAndUpdate(
    { id, changes }: ProfilUpdateInput,
    options: any = { new: true }
) {
    return ProfilModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
}
export function ProfilFindByIdAndUpdateLean(
    update: ProfilUpdateInput,
    options: any = { new: true }
) {
    return ProfilFindByIdAndUpdate(id, update, options).lean();
}
export function ProfilFindByIdAndUpdateExec(
    update: ProfilUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndUpdate(id, update, options).exec(cb);
}
export function ProfilFindByIdAndUpdateLeanExec(
    update: ProfilUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndUpdateLean(id, update, options).exec(cb);
}

export function ProfilFindByIdAndRemove(
    id: string | ObjectID,
    options: any = {}
) {
    return ProfilModel.findByIdAndRemove(id, options);
}
export function ProfilFindByIdAndRemoveLean(
    id: string | ObjectID,
    options: any = {}
) {
    return ProfilFindByIdAndRemove(id, options).lean();
}
export function ProfilFindByIdAndRemoveExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndRemove(id, options).exec(cb);
}
export function ProfilFindByIdAndRemoveLeanExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndRemoveLean(id, options).exec(cb);
}


export function ProfilFindByIdPopulateOwner(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return ProfilModel.findById(id, projection, options).populate('owner');
}
export function ProfilFindByIdPopulateOwnerLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return ProfilFindByIdPopulateOwner(id, projection, options).lean();
}
export function ProfilFindByIdPopulateOwnerExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdPopulateOwner(id, projection, options).exec(cb);
}
export function ProfilFindByIdPopulateOwnerLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdPopulateOwnerLean(id, projection, options).exec(cb);
}

export async function ProfilFindByIdOwner(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await ProfilFindByIdPopulateOwnerLeanExec();
    return object ? object.owner : undefined;
}

export function ProfilFindByIdAndAddOwner(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return ProfilModel.findByIdAndUpdate(id, { $push: { owner: addId } }, { new: true });
}
export function ProfilFindByIdAndAddOwnerLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return ProfilFindByIdAndAddOwner(id, addId, options).lean();
}
export function ProfilFindByIdAndAddOwnerExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndAddOwner(id, addId, options).exec(cb);
}
export function ProfilFindByIdAndAddOwnerLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndAddOwnerLean(id, addId, options).exec(cb);
}

export function ProfilFindByIdAndRemoveOwner(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return ProfilModel.findByIdAndUpdate(id, { $pull: { owner: removeId } }, { new: true });
}
export function ProfilFindByIdAndRemoveOwnerLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return ProfilFindByIdAndRemoveOwner(id, removeId, options).lean();
}
export function ProfilFindByIdAndRemoveOwnerExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndRemoveOwner(id, removeId, options).exec(cb);
}
export function ProfilFindByIdAndRemoveOwnerLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndRemoveOwnerLean(id, removeId, options).exec(cb);
}


export function getAllProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllProfil', await ProfilFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function getByIdProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getByIdProfil', await ProfilFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: ProfilCreateInput = req.body;
        try {
            attachCTX(req, 'createProfil', await ProfilCreate(createInput));            
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: ProfilChangesInput = req.body;
        try {
            attachCTX(req, 'updateProfil', await ProfilFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteProfil', await ProfilFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getProfilOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getProfilOwner', await ProfilFindByIdOwner(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function addProfilOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            attachCTX(req, 'addProfilOwner', await ProfilFindByIdAndAddOwnerLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function removeProfilOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            attachCTX(req, 'removeProfilOwner', await ProfilFindByIdAndRemoveOwnerLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getAllProfilController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await ProfilFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function getByIdProfilController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await ProfilFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function createProfilController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: ProfilCreateInput = req.body;
        try {
            res.json(await ProfilCreate(createInput));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function updateProfilController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: ProfilChangesInput = req.body;
        try {
            res.json(await ProfilFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteProfilController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await ProfilFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}


export function getProfilOwnerController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await ProfilFindByIdOwner(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function addProfilOwnerController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            res.json(await ProfilFindByIdAndAddOwnerLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function removeProfilOwnerController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            res.json(await ProfilFindByIdAndRemoveOwnerLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}



export class ProfilAPI {

    router = Router();
    
    constructor() {
        this.makeAPI();
    }

    private makeAPI() {
        this.router
            .get('/', getAllProfilController())
            .get('/:id', getByIdProfilController())
            .post('/', createProfilController())
            .put('/:id', updateProfilController())
            .delete('/:id', deleteProfilController())
            .get('/:id/owner', getProfilOwnerController())
            .post('/:id/owner/add', addProfilOwnerController())
            .post('/:id/owner/remove', removeProfilOwnerController());
    }
    
    applyAPI(app: Application) {
        app.use('/profils', this.router);
    }
}


*/


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
        unique: true,
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
        try {
            req['result'].getManyTodos = await getManyTodosLeanExec();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getManyTodosController() {
    return async (req: Request, res: Response) => {
        try {
            res.json(await getManyTodosLeanExec());
        } catch(error) {
            res.status(500).json({ message: 'Something went wrong', error });
        }
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
        try {
            req['result'].getOneTodo = await getOneTodoLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getOneTodoController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getOneTodoLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
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
        try {
            req['result'].getTodoOwner = await getTodoOwnerLeanExec(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function getTodoOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await getTodoOwnerLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function createTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        const data = req.body;
        try {
            const model = new TodoModel(data);
            req['result'].createTodo = await model.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function createTodoController() {
    return async (req: Request, res: Response) => {
        const data = req.body;
        try {
            const model = new TodoModel(data);
            res.json(await model.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function updateTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const changes = req.body;
        try {
            // use { new: true } to return modified document rather than old one (default to false)
            // use upsert if you want an update-or-create-if-not-exists behaviour
            req['result'].updateTodo = await TodoModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function updateTodoController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        const changes = req.body;
        try {
            res.json(await TodoModel.findByIdAndUpdate(id, { $set: changes }, { new: true }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function deleteTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        try {
            req['result'].deleteTodo = await TodoModel.findByIdAndRemove(id);
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function deleteTodoController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        try {
            res.json(await TodoModel.findByIdAndRemove(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}

export function addTodoOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                TodoModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner.push(subject._id);
            } else {
                sub.owner = subject._id;
            }
            req['result'].addTodoOwner = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function addTodoOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const addId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                TodoModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(addId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner.push(subject._id);
            } else {
                sub.owner = subject._id;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export function removeTodoOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                TodoModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner = sub.owner.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.owner = undefined;
            }
            req['result'].removeTodoOwner = await sub.save();
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
        next();
    };
}

export function removeTodoOwnerController() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        const removeId = req.body.id;
        try {
            const [sub, subject] = await Promise.all([
                TodoModel.findById(id).populate('owner').lean().exec(),
                UserModel.findById(removeId).exec()
            ]);
            if (!(sub && subject)) {
                return res.status(404).json({ message: 'Something went wrong', sub, subject });
            }
            if (Array.isArray(sub.owner)) {
                sub.owner = sub.owner.filter((it: ObjectID) => !subject._id.equals(it));
            } else {
                sub.owner = undefined;
            }
            res.json(await sub.save());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong', error });            
        }
    };
}
                

export class TodoAPI {
    router = Router();

    constructor() {
        this.router
            .get('/', getManyTodosController())
            .get('/:id', getOneTodoController())
            .post('/', createTodoController())
            .put('/:id', updateTodoController())
            .delete('/:id', deleteTodoController())
            .get('/:id/owner', getTodoOwnerController())
            .post('/:id/owner/add', addTodoOwnerController())
            .post('/:id/owner/remove', removeTodoOwnerController());
    }

    applyRouter(app: Application) {
        app.use('/todos', this.router);
    }
}
            

/*

//  
// Base entity interface
//

export interface Todo {
    _id: string;
    title: string;
    done: boolean;
    owner?: User;
}

//  
// Input payload interface for entity creation
//

export interface TodoCreateInput {
    title: string;
    done: boolean;
}

//  
// Input payload interface for entity update
//

export interface TodoChangesInput {
    title?: string;
    done?: boolean;
}

export interface TodoUpdateInput {
    id: string;
    changes: TodoChangesInput;
}

//  
// Mongoose Schema/Model for this entity
//

export const TodoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            unique: true,
            ref: 'undefined',
        },
        done: {
            type: Boolean,
            required: true,
            ref: 'undefined',
        },
        owner: {
            type: ObjectId,
            ref: 'User',
        },
    },
    {
        minimize: false,
    }
);
export const TodoModel = mongoose.model('Todo', TodoSchema);

export function TodoFindMany(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return TodoModel.find(conditions, projection, options);
}
export function TodoFindManyLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return TodoFindMany(conditions, projection, options).lean();
}
export function TodoFindManyExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindMany(conditions, projection, options).exec(cb);
}
export function TodoFindManyLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindManyLean(conditions, projection, options).exec(cb);
}

export function TodoFindOne(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return TodoModel.findOne(conditions, projection, options);
}
export function TodoFindOneLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return TodoFindOne(conditions, projection, options).lean();
}
export function TodoFindOneExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindOne(conditions, projection, options).exec(cb);
}
export function TodoFindOneLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindOneLean(conditions, projection, options).exec(cb);
}

export function TodoFindById(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return TodoModel.findById(id, projection, options);
}
export function TodoFindByIdLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return TodoFindById(id, projection, options).lean();
}
export function TodoFindByIdExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindById(id, projection, options).exec(cb);
}
export function TodoFindByIdLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdLean(id, projection, options).exec(cb);
}

export function TodoCreate(createInput: TodoCreateInput) {
    const model = new TodoModel(createInput);
    return model.save();
}

export function TodoFindByIdAndUpdate(
    { id, changes }: TodoUpdateInput,
    options: any = { new: true }
) {
    return TodoModel.findByIdAndUpdate(id, { $set: changes }, { new: true });
}
export function TodoFindByIdAndUpdateLean(
    update: TodoUpdateInput,
    options: any = { new: true }
) {
    return TodoFindByIdAndUpdate(id, update, options).lean();
}
export function TodoFindByIdAndUpdateExec(
    update: TodoUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndUpdate(id, update, options).exec(cb);
}
export function TodoFindByIdAndUpdateLeanExec(
    update: TodoUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndUpdateLean(id, update, options).exec(cb);
}

export function TodoFindByIdAndRemove(
    id: string | ObjectID,
    options: any = {}
) {
    return TodoModel.findByIdAndRemove(id, options);
}
export function TodoFindByIdAndRemoveLean(
    id: string | ObjectID,
    options: any = {}
) {
    return TodoFindByIdAndRemove(id, options).lean();
}
export function TodoFindByIdAndRemoveExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndRemove(id, options).exec(cb);
}
export function TodoFindByIdAndRemoveLeanExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndRemoveLean(id, options).exec(cb);
}


export function TodoFindByIdPopulateOwner(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return TodoModel.findById(id, projection, options).populate('owner');
}
export function TodoFindByIdPopulateOwnerLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return TodoFindByIdPopulateOwner(id, projection, options).lean();
}
export function TodoFindByIdPopulateOwnerExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdPopulateOwner(id, projection, options).exec(cb);
}
export function TodoFindByIdPopulateOwnerLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdPopulateOwnerLean(id, projection, options).exec(cb);
}

export async function TodoFindByIdOwner(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await TodoFindByIdPopulateOwnerLeanExec();
    return object ? object.owner : undefined;
}

export function TodoFindByIdAndAddOwner(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return TodoModel.findByIdAndUpdate(id, { $push: { owner: addId } }, { new: true });
}
export function TodoFindByIdAndAddOwnerLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return TodoFindByIdAndAddOwner(id, addId, options).lean();
}
export function TodoFindByIdAndAddOwnerExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndAddOwner(id, addId, options).exec(cb);
}
export function TodoFindByIdAndAddOwnerLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndAddOwnerLean(id, addId, options).exec(cb);
}

export function TodoFindByIdAndRemoveOwner(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return TodoModel.findByIdAndUpdate(id, { $pull: { owner: removeId } }, { new: true });
}
export function TodoFindByIdAndRemoveOwnerLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return TodoFindByIdAndRemoveOwner(id, removeId, options).lean();
}
export function TodoFindByIdAndRemoveOwnerExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndRemoveOwner(id, removeId, options).exec(cb);
}
export function TodoFindByIdAndRemoveOwnerLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndRemoveOwnerLean(id, removeId, options).exec(cb);
}


export function getAllTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllTodo', await TodoFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function getByIdTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getByIdTodo', await TodoFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: TodoCreateInput = req.body;
        try {
            attachCTX(req, 'createTodo', await TodoCreate(createInput));            
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: TodoChangesInput = req.body;
        try {
            attachCTX(req, 'updateTodo', await TodoFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteTodo', await TodoFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getTodoOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getTodoOwner', await TodoFindByIdOwner(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function addTodoOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            attachCTX(req, 'addTodoOwner', await TodoFindByIdAndAddOwnerLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function removeTodoOwnerMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            attachCTX(req, 'removeTodoOwner', await TodoFindByIdAndRemoveOwnerLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


export function getAllTodoController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await TodoFindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function getByIdTodoController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await TodoFindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function createTodoController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: TodoCreateInput = req.body;
        try {
            res.json(await TodoCreate(createInput));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function updateTodoController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: TodoChangesInput = req.body;
        try {
            res.json(await TodoFindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteTodoController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await TodoFindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}


export function getTodoOwnerController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await TodoFindByIdOwner(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function addTodoOwnerController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            res.json(await TodoFindByIdAndAddOwnerLeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function removeTodoOwnerController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            res.json(await TodoFindByIdAndRemoveOwnerLeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}



export class TodoAPI {

    router = Router();
    
    constructor() {
        this.makeAPI();
    }

    private makeAPI() {
        this.router
            .get('/', getAllTodoController())
            .get('/:id', getByIdTodoController())
            .post('/', createTodoController())
            .put('/:id', updateTodoController())
            .delete('/:id', deleteTodoController())
            .get('/:id/owner', getTodoOwnerController())
            .post('/:id/owner/add', addTodoOwnerController())
            .post('/:id/owner/remove', removeTodoOwnerController());
    }
    
    applyAPI(app: Application) {
        app.use('/todos', this.router);
    }
}


*/

