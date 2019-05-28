
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



/**********     USER     **********/
import {
    User,
    UserCreateInput,
    UserChangesInput,
    UserUpdateInput,
    pickUserCreateInput,
    pickUserChangesInput,
    UserModel,
} from '../types';

/**
 * Utilitaries functions
 */

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

export function UserCreate(unsafeCreateInput: UserCreateInput) {
    const createInput = pickUserCreateInput(unsafeCreateInput);
    const model = new UserModel(createInput);
    return model.save();
}
export async function UserCreateLean(createInput: UserCreateInput) {
    const object = await UserCreate(createInput);
    return object.toObject();
}

export function UserFindByIdAndUpdate(
    { id, changes: unsafeChanges }: UserUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    const changes = pickUserChangesInput(unsafeChanges);
    return UserModel.findByIdAndUpdate(id, { $set: changes }, options);
}
export function UserFindByIdAndUpdateLean(
    update: UserUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    return UserFindByIdAndUpdate(update, options).lean();
}
export function UserFindByIdAndUpdateExec(
    update: UserUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndUpdate(update, options).exec(cb);
}
export function UserFindByIdAndUpdateLeanExec(
    update: UserUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndUpdateLean(update, options).exec(cb);
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
    const object = await UserFindByIdPopulateRolesLeanExec(id, projection, options);
    return object ? object.roles : undefined;
}

export function UserFindByIdAndAddRoles(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return UserModel.findByIdAndUpdate(id, { $push: { roles: addId } }, options);
}
export function UserFindByIdAndAddRolesLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return UserFindByIdAndAddRoles(id, addId, options).lean();
}
export function UserFindByIdAndAddRolesExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddRoles(id, addId, options).exec(cb);
}
export function UserFindByIdAndAddRolesLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddRolesLean(id, addId, options).exec(cb);
}

export function UserFindByIdAndRemoveRoles(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return UserModel.findByIdAndUpdate(id, { $pull: { roles: removeId } }, options);
}
export function UserFindByIdAndRemoveRolesLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return UserFindByIdAndRemoveRoles(id, removeId, options).lean();
}
export function UserFindByIdAndRemoveRolesExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveRoles(id, removeId, options).exec(cb);
}
export function UserFindByIdAndRemoveRolesLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
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
    const object = await UserFindByIdPopulateScopesLeanExec(id, projection, options);
    return object ? object.scopes : undefined;
}

export function UserFindByIdAndAddScopes(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return UserModel.findByIdAndUpdate(id, { $push: { scopes: addId } }, options);
}
export function UserFindByIdAndAddScopesLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return UserFindByIdAndAddScopes(id, addId, options).lean();
}
export function UserFindByIdAndAddScopesExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddScopes(id, addId, options).exec(cb);
}
export function UserFindByIdAndAddScopesLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddScopesLean(id, addId, options).exec(cb);
}

export function UserFindByIdAndRemoveScopes(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return UserModel.findByIdAndUpdate(id, { $pull: { scopes: removeId } }, options);
}
export function UserFindByIdAndRemoveScopesLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return UserFindByIdAndRemoveScopes(id, removeId, options).lean();
}
export function UserFindByIdAndRemoveScopesExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveScopes(id, removeId, options).exec(cb);
}
export function UserFindByIdAndRemoveScopesLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
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
    const object = await UserFindByIdPopulateCredentialLeanExec(id, projection, options);
    return object ? object.credential : undefined;
}

export function UserFindByIdAndAddCredential(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return UserModel.findByIdAndUpdate(id, { $push: { credential: addId } }, options);
}
export function UserFindByIdAndAddCredentialLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return UserFindByIdAndAddCredential(id, addId, options).lean();
}
export function UserFindByIdAndAddCredentialExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddCredential(id, addId, options).exec(cb);
}
export function UserFindByIdAndAddCredentialLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddCredentialLean(id, addId, options).exec(cb);
}

export function UserFindByIdAndRemoveCredential(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return UserModel.findByIdAndUpdate(id, { $pull: { credential: removeId } }, options);
}
export function UserFindByIdAndRemoveCredentialLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return UserFindByIdAndRemoveCredential(id, removeId, options).lean();
}
export function UserFindByIdAndRemoveCredentialExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveCredential(id, removeId, options).exec(cb);
}
export function UserFindByIdAndRemoveCredentialLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
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
    const object = await UserFindByIdPopulateProfilLeanExec(id, projection, options);
    return object ? object.profil : undefined;
}

export function UserFindByIdAndAddProfil(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return UserModel.findByIdAndUpdate(id, { $push: { profil: addId } }, options);
}
export function UserFindByIdAndAddProfilLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return UserFindByIdAndAddProfil(id, addId, options).lean();
}
export function UserFindByIdAndAddProfilExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddProfil(id, addId, options).exec(cb);
}
export function UserFindByIdAndAddProfilLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndAddProfilLean(id, addId, options).exec(cb);
}

export function UserFindByIdAndRemoveProfil(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return UserModel.findByIdAndUpdate(id, { $pull: { profil: removeId } }, options);
}
export function UserFindByIdAndRemoveProfilLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return UserFindByIdAndRemoveProfil(id, removeId, options).lean();
}
export function UserFindByIdAndRemoveProfilExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveProfil(id, removeId, options).exec(cb);
}
export function UserFindByIdAndRemoveProfilLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndRemoveProfilLean(id, removeId, options).exec(cb);
}


/**
 * Middlewares functions
 */

export function getAllUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllUser', await UserFindManyLeanExec());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: UserCreateInput = req.body;
        try {
            attachCTX(req, 'createUser', await UserCreateLean(createInput));            
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: UserChangesInput = req.body;
        try {
            attachCTX(req, 'updateUser', await UserFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteUserMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteUser', await UserFindByIdAndRemoveLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


/**
 * Controllers functions
 */

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
            res.json(await UserCreateLean(createInput));
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
            res.json(await UserFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteUserController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await UserFindByIdAndRemoveLeanExec(id));
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
    
    constructor(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.makeAPI(middlewaresMap);
    }

    private makeAPI(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.router
            .get('/', getAllUserController())
            .get('/:id', getByIdUserController())
            .post('/', createUserController())
            .put('/:id', updateUserController())
            .delete('/:id', deleteUserController())
            .get('/:id/roles', getUserRolesController())
            .get('/:id/scopes', getUserScopesController())
            .get('/:id/profil', getUserProfilController())
            .put('/:id/roles/add', addUserRolesController())
            .put('/:id/scopes/add', addUserScopesController())
            .put('/:id/credential/add', 
                middlewaresMap.isAuthentified,
                middlewaresMap.isOwner,
                addUserCredentialController())
            .put('/:id/profil/add', addUserProfilController())
            .put('/:id/roles/remove', removeUserRolesController())
            .put('/:id/scopes/remove', removeUserScopesController())
            .put('/:id/credential/remove', 
                middlewaresMap.isAuthentified,
                middlewaresMap.isOwner,
                removeUserCredentialController())
            .put('/:id/profil/remove', removeUserProfilController());
    }
    
    applyAPI(app: Application) {
        app.use('/users', this.router);
        console.log(`***********     ${BrightCCC}${'users'.toUpperCase()}${ResetCCC}     ***********`);
        console.log('\n');
        this.router.stack.forEach(({ route: { path, methods } }) => console.log(
            `${colorVerb(Object.keys(methods)[0].toUpperCase())} => ${colorPath('/users' + path)}`
        ));
        console.log('\n\n');
    }
}
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

export const ResetCCC = "[0m";
export const BrightCCC = "[1m";
export const DimCCC = "[2m";
export const UnderscoreCCC = "[4m";
export const BlinkCCC = "[5m";
export const ReverseCCC = "[7m";
export const HiddenCCC = "[8m";
export const FgBlackCCC = "[30m";
export const FgRedCCC = "[31m";
export const FgGreenCCC = "[32m";
export const FgYellowCCC = "[33m";
export const FgBlueCCC = "[34m";
export const FgMagentaCCC = "[35m";
export const FgCyanCCC = "[36m";
export const FgWhiteCCC = "[37m";
export const BgBlackCCC = "[40m";
export const BgRedCCC = "[41m";
export const BgGreenCCC = "[42m";
export const BgYellowCCC = "[43m";
export const BgBlueCCC = "[44m";
export const BgMagentaCCC = "[45m";
export const BgCyanCCC = "[46m";
export const BgWhiteCCC = "[47m";

export function colorVerb(verb: string) {
    switch (verb) {
        case 'GET':
            return `${BrightCCC}${FgBlueCCC}GET${ResetCCC}`;
        case 'POST':
            return `${BrightCCC}${FgGreenCCC}POST${ResetCCC}`;
        case 'PUT':
            return `${BrightCCC}${FgYellowCCC}PUT${ResetCCC}`;
        case 'DELETE':
            return `${BrightCCC}${FgRedCCC}DELETE${ResetCCC}`;
        default:
            return verb;
    }
}
export function colorPath(path: string) {
    const parts = path.split('/').slice(1);
    parts[0] = `${UnderscoreCCC}${BrightCCC}${parts[0]}${ResetCCC}${UnderscoreCCC}`;
    if (parts[1]) {
        parts[1] = `${UnderscoreCCC}${FgBlueCCC}${parts[1]}${ResetCCC}${UnderscoreCCC}`;
    }
    if (parts[2]) {
        parts[2] = `${UnderscoreCCC}${BrightCCC}${FgYellowCCC}${parts[2]}${ResetCCC}${UnderscoreCCC}`;
    }
    if (parts[3] && parts[3] === 'add') {
        parts[3] = `${UnderscoreCCC}${FgGreenCCC}${parts[3]}${ResetCCC}${UnderscoreCCC}`;
    } else if (parts[3] && parts[3] === 'remove') {
        parts[3] = `${UnderscoreCCC}${FgRedCCC}${parts[3]}${ResetCCC}${UnderscoreCCC}`;
    }
    return `${UnderscoreCCC}${parts.join('/')}${ResetCCC}`;
}
