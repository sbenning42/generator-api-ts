
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



/**********     CREDENTIAL     **********/
import {
    Credential,
    CredentialCreateInput,
    CredentialChangesInput,
    CredentialUpdateInput,
    pickCredentialCreateInput,
    pickCredentialChangesInput,
    CredentialModel,
} from '../types';

/**
 * Utilitaries functions
 */

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

export function CredentialCreate(unsafeCreateInput: CredentialCreateInput) {
    const createInput = pickCredentialCreateInput(unsafeCreateInput);
    const model = new CredentialModel(createInput);
    return model.save();
}
export async function CredentialCreateLean(createInput: CredentialCreateInput) {
    const object = await CredentialCreate(createInput);
    return object.toObject();
}

export function CredentialFindByIdAndUpdate(
    { id, changes: unsafeChanges }: CredentialUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    const changes = pickCredentialChangesInput(unsafeChanges);
    return CredentialModel.findByIdAndUpdate(id, { $set: changes }, options);
}
export function CredentialFindByIdAndUpdateLean(
    update: CredentialUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    return CredentialFindByIdAndUpdate(update, options).lean();
}
export function CredentialFindByIdAndUpdateExec(
    update: CredentialUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndUpdate(update, options).exec(cb);
}
export function CredentialFindByIdAndUpdateLeanExec(
    update: CredentialUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndUpdateLean(update, options).exec(cb);
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
    const object = await CredentialFindByIdPopulateOwnerLeanExec(id, projection, options);
    return object ? object.owner : undefined;
}

export function CredentialFindByIdAndAddOwner(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return CredentialModel.findByIdAndUpdate(id, { $push: { owner: addId } }, options);
}
export function CredentialFindByIdAndAddOwnerLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return CredentialFindByIdAndAddOwner(id, addId, options).lean();
}
export function CredentialFindByIdAndAddOwnerExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndAddOwner(id, addId, options).exec(cb);
}
export function CredentialFindByIdAndAddOwnerLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndAddOwnerLean(id, addId, options).exec(cb);
}

export function CredentialFindByIdAndRemoveOwner(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return CredentialModel.findByIdAndUpdate(id, { $pull: { owner: removeId } }, options);
}
export function CredentialFindByIdAndRemoveOwnerLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return CredentialFindByIdAndRemoveOwner(id, removeId, options).lean();
}
export function CredentialFindByIdAndRemoveOwnerExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndRemoveOwner(id, removeId, options).exec(cb);
}
export function CredentialFindByIdAndRemoveOwnerLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return CredentialFindByIdAndRemoveOwnerLean(id, removeId, options).exec(cb);
}


/**
 * Middlewares functions
 */

export function getAllCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllCredential', await CredentialFindManyLeanExec());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: CredentialCreateInput = req.body;
        try {
            attachCTX(req, 'createCredential', await CredentialCreateLean(createInput));            
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: CredentialChangesInput = req.body;
        try {
            attachCTX(req, 'updateCredential', await CredentialFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteCredentialMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteCredential', await CredentialFindByIdAndRemoveLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


/**
 * Controllers functions
 */

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
            res.json(await CredentialCreateLean(createInput));
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
            res.json(await CredentialFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteCredentialController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await CredentialFindByIdAndRemoveLeanExec(id));
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
    
    constructor(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.makeAPI(middlewaresMap);
    }

    private makeAPI(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.router
            .put('/:id/owner/add', addCredentialOwnerController())
            .put('/:id/owner/remove', removeCredentialOwnerController());
    }
    
    applyAPI(app: Application) {
        app.use('/credentials', this.router);
        console.log(`***********     ${BrightCCC}${'credentials'.toUpperCase()}${ResetCCC}     ***********`);
        console.log('\n');
        this.router.stack.forEach(({ route: { path, methods } }) => console.log(
            `${colorVerb(Object.keys(methods)[0].toUpperCase())} => ${colorPath('/credentials' + path)}`
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
