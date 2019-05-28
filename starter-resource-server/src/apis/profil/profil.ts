
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



/**********     PROFIL     **********/
import {
    Profil,
    ProfilCreateInput,
    ProfilChangesInput,
    ProfilUpdateInput,
    pickProfilCreateInput,
    pickProfilChangesInput,
    ProfilModel,
} from '../types';

/**
 * Utilitaries functions
 */

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

export function ProfilCreate(unsafeCreateInput: ProfilCreateInput) {
    const createInput = pickProfilCreateInput(unsafeCreateInput);
    const model = new ProfilModel(createInput);
    return model.save();
}
export async function ProfilCreateLean(createInput: ProfilCreateInput) {
    const object = await ProfilCreate(createInput);
    return object.toObject();
}

export function ProfilFindByIdAndUpdate(
    { id, changes: unsafeChanges }: ProfilUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    const changes = pickProfilChangesInput(unsafeChanges);
    return ProfilModel.findByIdAndUpdate(id, { $set: changes }, options);
}
export function ProfilFindByIdAndUpdateLean(
    update: ProfilUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    return ProfilFindByIdAndUpdate(update, options).lean();
}
export function ProfilFindByIdAndUpdateExec(
    update: ProfilUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndUpdate(update, options).exec(cb);
}
export function ProfilFindByIdAndUpdateLeanExec(
    update: ProfilUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndUpdateLean(update, options).exec(cb);
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
    const object = await ProfilFindByIdPopulateOwnerLeanExec(id, projection, options);
    return object ? object.owner : undefined;
}

export function ProfilFindByIdAndAddOwner(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return ProfilModel.findByIdAndUpdate(id, { $push: { owner: addId } }, options);
}
export function ProfilFindByIdAndAddOwnerLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return ProfilFindByIdAndAddOwner(id, addId, options).lean();
}
export function ProfilFindByIdAndAddOwnerExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndAddOwner(id, addId, options).exec(cb);
}
export function ProfilFindByIdAndAddOwnerLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndAddOwnerLean(id, addId, options).exec(cb);
}

export function ProfilFindByIdAndRemoveOwner(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return ProfilModel.findByIdAndUpdate(id, { $pull: { owner: removeId } }, options);
}
export function ProfilFindByIdAndRemoveOwnerLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return ProfilFindByIdAndRemoveOwner(id, removeId, options).lean();
}
export function ProfilFindByIdAndRemoveOwnerExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndRemoveOwner(id, removeId, options).exec(cb);
}
export function ProfilFindByIdAndRemoveOwnerLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return ProfilFindByIdAndRemoveOwnerLean(id, removeId, options).exec(cb);
}


/**
 * Middlewares functions
 */

export function getAllProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllProfil', await ProfilFindManyLeanExec());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: ProfilCreateInput = req.body;
        try {
            attachCTX(req, 'createProfil', await ProfilCreateLean(createInput));            
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: ProfilChangesInput = req.body;
        try {
            attachCTX(req, 'updateProfil', await ProfilFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteProfilMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteProfil', await ProfilFindByIdAndRemoveLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


/**
 * Controllers functions
 */

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
            res.json(await ProfilCreateLean(createInput));
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
            res.json(await ProfilFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteProfilController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await ProfilFindByIdAndRemoveLeanExec(id));
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
    
    constructor(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.makeAPI(middlewaresMap);
    }

    private makeAPI(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.router
            .get('/', getAllProfilController())
            .get('/:id', getByIdProfilController())
            .post('/', createProfilController())
            .put('/:id', updateProfilController())
            .delete('/:id', deleteProfilController())
            .get('/:id/owner', getProfilOwnerController())
            .put('/:id/owner/add', addProfilOwnerController())
            .put('/:id/owner/remove', removeProfilOwnerController());
    }
    
    applyAPI(app: Application) {
        app.use('/profils', this.router);
        console.log(`***********     ${BrightCCC}${'profils'.toUpperCase()}${ResetCCC}     ***********`);
        console.log('\n');
        this.router.stack.forEach(({ route: { path, methods } }) => console.log(
            `${colorVerb(Object.keys(methods)[0].toUpperCase())} => ${colorPath('/profils' + path)}`
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
