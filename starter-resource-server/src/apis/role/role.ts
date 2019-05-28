
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



/**********     ROLE     **********/
import {
    Role,
    RoleCreateInput,
    RoleChangesInput,
    RoleUpdateInput,
    pickRoleCreateInput,
    pickRoleChangesInput,
    RoleModel,
} from '../types';

/**
 * Utilitaries functions
 */

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

export function RoleCreate(unsafeCreateInput: RoleCreateInput) {
    const createInput = pickRoleCreateInput(unsafeCreateInput);
    const model = new RoleModel(createInput);
    return model.save();
}
export async function RoleCreateLean(createInput: RoleCreateInput) {
    const object = await RoleCreate(createInput);
    return object.toObject();
}

export function RoleFindByIdAndUpdate(
    { id, changes: unsafeChanges }: RoleUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    const changes = pickRoleChangesInput(unsafeChanges);
    return RoleModel.findByIdAndUpdate(id, { $set: changes }, options);
}
export function RoleFindByIdAndUpdateLean(
    update: RoleUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    return RoleFindByIdAndUpdate(update, options).lean();
}
export function RoleFindByIdAndUpdateExec(
    update: RoleUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndUpdate(update, options).exec(cb);
}
export function RoleFindByIdAndUpdateLeanExec(
    update: RoleUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndUpdateLean(update, options).exec(cb);
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
    const object = await RoleFindByIdPopulateUsersLeanExec(id, projection, options);
    return object ? object.users : undefined;
}

export function RoleFindByIdAndAddUsers(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return RoleModel.findByIdAndUpdate(id, { $push: { users: addId } }, options);
}
export function RoleFindByIdAndAddUsersLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return RoleFindByIdAndAddUsers(id, addId, options).lean();
}
export function RoleFindByIdAndAddUsersExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndAddUsers(id, addId, options).exec(cb);
}
export function RoleFindByIdAndAddUsersLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndAddUsersLean(id, addId, options).exec(cb);
}

export function RoleFindByIdAndRemoveUsers(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return RoleModel.findByIdAndUpdate(id, { $pull: { users: removeId } }, options);
}
export function RoleFindByIdAndRemoveUsersLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return RoleFindByIdAndRemoveUsers(id, removeId, options).lean();
}
export function RoleFindByIdAndRemoveUsersExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndRemoveUsers(id, removeId, options).exec(cb);
}
export function RoleFindByIdAndRemoveUsersLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return RoleFindByIdAndRemoveUsersLean(id, removeId, options).exec(cb);
}


/**
 * Middlewares functions
 */

export function getAllRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllRole', await RoleFindManyLeanExec());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: RoleCreateInput = req.body;
        try {
            attachCTX(req, 'createRole', await RoleCreateLean(createInput));            
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: RoleChangesInput = req.body;
        try {
            attachCTX(req, 'updateRole', await RoleFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteRoleMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteRole', await RoleFindByIdAndRemoveLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


/**
 * Controllers functions
 */

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
            res.json(await RoleCreateLean(createInput));
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
            res.json(await RoleFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteRoleController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await RoleFindByIdAndRemoveLeanExec(id));
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
    
    constructor(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.makeAPI(middlewaresMap);
    }

    private makeAPI(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.router
            .get('/', 
                middlewaresMap.isAuthentified,
                getAllRoleController())
            .get('/:id', 
                middlewaresMap.isAuthentified,
                getByIdRoleController())
            .post('/', 
                middlewaresMap.isAuthentified,
                middlewaresMap.isAdmin,
                createRoleController())
            .put('/:id', 
                middlewaresMap.isAuthentified,
                middlewaresMap.isAdmin,
                updateRoleController())
            .delete('/:id', 
                middlewaresMap.isAuthentified,
                middlewaresMap.isAdmin,
                deleteRoleController())
            .get('/:id/users', 
                middlewaresMap.isAuthentified,
                getRoleUsersController())
            .put('/:id/users/add', 
                middlewaresMap.isAuthentified,
                middlewaresMap.isAdmin,
                addRoleUsersController())
            .put('/:id/users/remove', 
                middlewaresMap.isAuthentified,
                middlewaresMap.isAdmin,
                removeRoleUsersController());
    }
    
    applyAPI(app: Application) {
        app.use('/roles', this.router);
        console.log(`***********     ${BrightCCC}${'roles'.toUpperCase()}${ResetCCC}     ***********`);
        console.log('\n');
        this.router.stack.forEach(({ route: { path, methods } }) => console.log(
            `${colorVerb(Object.keys(methods)[0].toUpperCase())} => ${colorPath('/roles' + path)}`
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
