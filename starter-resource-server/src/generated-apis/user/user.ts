
import {
    Request,
    Response,
    NextFunction,
    Router,
    Application
} from 'express';
import mongoose, { Document, Query } from 'mongoose';
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
 * Utilitaries
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
    return UserFindMany(conditions, projection, options).lean() as Query<User[]>;
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
    return UserFindOne(conditions, projection, options).lean() as Query<User>;
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
    return UserFindById(id, projection, options).lean() as Query<User>;
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
    return object.toObject() as User;
}

export function UserFindByIdAndUpdate(
    { id, changes: unsafeChanges }: UserUpdateInput,
    options: any = { new: true }
) {
    const changes = pickUserChangesInput(unsafeChanges);
    return UserModel.findByIdAndUpdate(id, { $set: changes }, options);
}
export function UserFindByIdAndUpdateLean(
    update: UserUpdateInput,
    options: any = { new: true }
) {
    return UserFindByIdAndUpdate(update, options).lean() as Query<User>;
}
export function UserFindByIdAndUpdateExec(
    update: UserUpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdAndUpdate(update, options).exec(cb);
}
export function UserFindByIdAndUpdateLeanExec(
    update: UserUpdateInput,
    options: any = { new: true },
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
    return UserFindByIdAndRemove(id, options).lean() as Query<User>;
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
export function UserFindByIdPopulateRolesLean<T = any>(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return UserFindByIdPopulateRoles(id, projection, options).lean() as Query<User & { roles: T }>;
}
export function UserFindByIdPopulateRolesExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdPopulateRoles(id, projection, options).exec(cb);
}
export function UserFindByIdPopulateRolesLeanExec<T = any>(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return UserFindByIdPopulateRolesLean<T>(id, projection, options).exec(cb);
}

export async function UserFindByIdRoles<T = any>(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await UserFindByIdPopulateRolesLeanExec<T>(id, projection, options);
    return object ? object.roles : undefined;
}

export function UserFindByIdAndAddRoles(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return UserModel.findByIdAndUpdate(id, { $push: { roles: addId } }, options);
}
export function UserFindByIdAndAddRolesLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return UserFindByIdAndAddRoles(id, addId, options).lean() as Query<User>;
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
    options: any = {}
) {
    return UserModel.findByIdAndUpdate(id, { $pull: { roles: removeId } }, options);
}
export function UserFindByIdAndRemoveRolesLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return UserFindByIdAndRemoveRoles(id, removeId, options).lean() as Query<User>;
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


/**
 * Middlewares
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


/**
 * Controllers
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



export class UserAPI {

    router = Router();
    
    constructor(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.makeAPI(middlewaresMap);
    }

    private makeAPI(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.router
            .get('/', 
                middlewaresMap.hasTokenLogMiddleware,
                getAllUserController())
            .get('/:id', 
                middlewaresMap.hasTokenLogMiddleware,
                getByIdUserController())
            .put('/:id', 
                middlewaresMap.hasTokenLogMiddleware,
                updateUserController())
            .delete('/:id', 
                middlewaresMap.hasTokenLogMiddleware,
                
                (req, res, next) => {
                    const ctx = middlewaresMap;
                    console.log('Test live middlewares');
                    next();
                },
                deleteUserController())
            .get('/:id/roles', 
                middlewaresMap.hasTokenLogMiddleware,
                getUserRolesController())
            .put('/:id/roles/add', 
                middlewaresMap.hasTokenLogMiddleware,
                addUserRolesController())
            .put('/:id/roles/remove', 
                middlewaresMap.hasTokenLogMiddleware,
                removeUserRolesController());
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
function attachCTX(req: Request, key: string, value: any) {
    req['CTX'][key] = value;
    return value;
}

const ResetCCC = '[0m';
const BrightCCC = '[1m';
const DimCCC = '[2m';
const UnderscoreCCC = '[4m';
const BlinkCCC = '[5m';
const ReverseCCC = '[7m';
const HiddenCCC = '[8m';
const FgBlackCCC = '[30m';
const FgRedCCC = '[31m';
const FgGreenCCC = '[32m';
const FgYellowCCC = '[33m';
const FgBlueCCC = '[34m';
const FgMagentaCCC = '[35m';
const FgCyanCCC = '[36m';
const FgWhiteCCC = '[37m';
const BgBlackCCC = '[40m';
const BgRedCCC = '[41m';
const BgGreenCCC = '[42m';
const BgYellowCCC = '[43m';
const BgBlueCCC = '[44m';
const BgMagentaCCC = '[45m';
const BgCyanCCC = '[46m';
const BgWhiteCCC = '[47m';

function colorVerb(verb: string) {
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
function colorPath(path: string) {
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
