
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



/**********     SCOPE     **********/
import {
    Scope,
    ScopeCreateInput,
    ScopeChangesInput,
    ScopeUpdateInput,
    pickScopeCreateInput,
    pickScopeChangesInput,
    ScopeModel,
} from '../types';

/**
 * Utilitaries functions
 */

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

export function ScopeCreate(unsafeCreateInput: ScopeCreateInput) {
    const createInput = pickScopeCreateInput(unsafeCreateInput);
    const model = new ScopeModel(createInput);
    return model.save();
}
export async function ScopeCreateLean(createInput: ScopeCreateInput) {
    const object = await ScopeCreate(createInput);
    return object.toObject();
}

export function ScopeFindByIdAndUpdate(
    { id, changes: unsafeChanges }: ScopeUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    const changes = pickScopeChangesInput(unsafeChanges);
    return ScopeModel.findByIdAndUpdate(id, { $set: changes }, options);
}
export function ScopeFindByIdAndUpdateLean(
    update: ScopeUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    return ScopeFindByIdAndUpdate(update, options).lean();
}
export function ScopeFindByIdAndUpdateExec(
    update: ScopeUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndUpdate(update, options).exec(cb);
}
export function ScopeFindByIdAndUpdateLeanExec(
    update: ScopeUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndUpdateLean(update, options).exec(cb);
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
    const object = await ScopeFindByIdPopulateUsersLeanExec(id, projection, options);
    return object ? object.users : undefined;
}

export function ScopeFindByIdAndAddUsers(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return ScopeModel.findByIdAndUpdate(id, { $push: { users: addId } }, options);
}
export function ScopeFindByIdAndAddUsersLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return ScopeFindByIdAndAddUsers(id, addId, options).lean();
}
export function ScopeFindByIdAndAddUsersExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndAddUsers(id, addId, options).exec(cb);
}
export function ScopeFindByIdAndAddUsersLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndAddUsersLean(id, addId, options).exec(cb);
}

export function ScopeFindByIdAndRemoveUsers(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return ScopeModel.findByIdAndUpdate(id, { $pull: { users: removeId } }, options);
}
export function ScopeFindByIdAndRemoveUsersLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return ScopeFindByIdAndRemoveUsers(id, removeId, options).lean();
}
export function ScopeFindByIdAndRemoveUsersExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndRemoveUsers(id, removeId, options).exec(cb);
}
export function ScopeFindByIdAndRemoveUsersLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ScopeFindByIdAndRemoveUsersLean(id, removeId, options).exec(cb);
}


/**
 * Middlewares functions
 */

export function getAllScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllScope', await ScopeFindManyLeanExec());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: ScopeCreateInput = req.body;
        try {
            attachCTX(req, 'createScope', await ScopeCreateLean(createInput));            
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: ScopeChangesInput = req.body;
        try {
            attachCTX(req, 'updateScope', await ScopeFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteScopeMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteScope', await ScopeFindByIdAndRemoveLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


/**
 * Controllers functions
 */

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
            res.json(await ScopeCreateLean(createInput));
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
            res.json(await ScopeFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteScopeController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await ScopeFindByIdAndRemoveLeanExec(id));
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
    
    constructor(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.makeAPI(middlewaresMap);
    }

    private makeAPI(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.router
            .get('/', getAllScopeController())
            .get('/:id', getByIdScopeController())
            .post('/', createScopeController())
            .put('/:id', updateScopeController())
            .delete('/:id', deleteScopeController())
            .get('/:id/users', getScopeUsersController())
            .put('/:id/users/add', addScopeUsersController())
            .put('/:id/users/remove', removeScopeUsersController());
    }
    
    applyAPI(app: Application) {
        app.use('/scopes', this.router);
        console.log(`***********     ${BrightCCC}${'scopes'.toUpperCase()}${ResetCCC}     ***********`);
        console.log('\n');
        this.router.stack.forEach(({ route: { path, methods } }) => console.log(
            `${colorVerb(Object.keys(methods)[0].toUpperCase())} => ${colorPath('/scopes' + path)}`
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
