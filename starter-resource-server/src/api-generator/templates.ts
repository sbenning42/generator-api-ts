const TS_Prefix = `
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
`.trim();

const TS_TypeTpl = `
//  
// Base entity interface
//

export interface $0 {
$1
}
`.trim();

const TS_TypePropTpl = `    $0: $1;`;

const TS_CreateInputTpl = `
//  
// Input payload interface for entity creation
//

export interface $0CreateInput {
$1
}
`.trim();

const TS_CreateInputPropTpl = `    $0: $1;`;

const TS_UpdateInputTpl = `
//  
// Input payload interface for entity update
//

export interface $0ChangesInput {
$1
}

export interface $0UpdateInput {
    id: string;
    changes: $0ChangesInput;
}
`.trim();

const TS_UpdateInputPropTpl = `    $0: $1;`;

const TS_SchemaTpl = `
//  
// Mongoose Schema/Model for this entity
//

export const $0Schema = new mongoose.Schema(
    {
        $1
    },
    {
        minimize: false,
    }
);
export const $0Model = mongoose.model('$0', $0Schema);
`.trim();

const TS_SchemaPropTpl = `$0: {
            type: $1,
            required: $2,
            default: $3,
            unique: $4,
            hidden: $5,
            ref: '$6',
        },`;


const TS_UtilsTpl = `
export function $0FindMany(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return $0Model.find(conditions, projection, options);
}
export function $0FindManyLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return $0FindMany(conditions, projection, options).lean();
}
export function $0FindManyExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindMany(conditions, projection, options).exec(cb);
}
export function $0FindManyLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindManyLean(conditions, projection, options).exec(cb);
}

export function $0FindOne(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return $0Model.findOne(conditions, projection, options);
}
export function $0FindOneLean(
    conditions: any = {},
    projection?: any,
    options: any = {}
) {
    return $0FindOne(conditions, projection, options).lean();
}
export function $0FindOneExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindOne(conditions, projection, options).exec(cb);
}
export function $0FindOneLeanExec(
    conditions: any = {},
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindOneLean(conditions, projection, options).exec(cb);
}

export function $0FindById(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return $0Model.findById(id, projection, options);
}
export function $0FindByIdLean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return $0FindById(id, projection, options).lean();
}
export function $0FindByIdExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindById(id, projection, options).exec(cb);
}
export function $0FindByIdLeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdLean(id, projection, options).exec(cb);
}

export function $0Create(createInput: $0CreateInput) {
    const model = new $0Model(createInput);
    return model.save();
}
export async function $0CreateLean(createInput: $0CreateInput) {
    const object = await $0Create(createInput);
    return object.toObject();
}

export function $0FindByIdAndUpdate(
    { id, changes }: $0UpdateInput,
    options: any = { new: true }
) {
    return $0Model.findByIdAndUpdate(id, { $set: changes }, options);
}
export function $0FindByIdAndUpdateLean(
    update: $0UpdateInput,
    options: any = { new: true }
) {
    return $0FindByIdAndUpdate(update, options).lean();
}
export function $0FindByIdAndUpdateExec(
    update: $0UpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdAndUpdate(update, options).exec(cb);
}
export function $0FindByIdAndUpdateLeanExec(
    update: $0UpdateInput,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdAndUpdateLean(update, options).exec(cb);
}

export function $0FindByIdAndRemove(
    id: string | ObjectID,
    options: any = {}
) {
    return $0Model.findByIdAndRemove(id, options);
}
export function $0FindByIdAndRemoveLean(
    id: string | ObjectID,
    options: any = {}
) {
    return $0FindByIdAndRemove(id, options).lean();
}
export function $0FindByIdAndRemoveExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdAndRemove(id, options).exec(cb);
}
export function $0FindByIdAndRemoveLeanExec(
    id: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdAndRemoveLean(id, options).exec(cb);
}

`.trim();

const TS_RelationUtilsTpl = `
export function $0FindByIdPopulate$1(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return $0Model.findById(id, projection, options).populate('$2');
}
export function $0FindByIdPopulate$1Lean(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return $0FindByIdPopulate$1(id, projection, options).lean();
}
export function $0FindByIdPopulate$1Exec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdPopulate$1(id, projection, options).exec(cb);
}
export function $0FindByIdPopulate$1LeanExec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdPopulate$1Lean(id, projection, options).exec(cb);
}

export async function $0FindById$1(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await $0FindByIdPopulate$1LeanExec(id, projection, options);
    return object ? object.$2 : undefined;
}

export function $0FindByIdAndAdd$1(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return $0Model.findByIdAndUpdate(id, { $push: { $2: addId } }, options);
}
export function $0FindByIdAndAdd$1Lean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true }
) {
    return $0FindByIdAndAdd$1(id, addId, options).lean();
}
export function $0FindByIdAndAdd$1Exec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdAndAdd$1(id, addId, options).exec(cb);
}
export function $0FindByIdAndAdd$1LeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdAndAdd$1Lean(id, addId, options).exec(cb);
}

export function $0FindByIdAndRemove$1(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return $0Model.findByIdAndUpdate(id, { $pull: { $2: removeId } }, options);
}
export function $0FindByIdAndRemove$1Lean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true }
) {
    return $0FindByIdAndRemove$1(id, removeId, options).lean();
}
export function $0FindByIdAndRemove$1Exec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdAndRemove$1(id, removeId, options).exec(cb);
}
export function $0FindByIdAndRemove$1LeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = { new: true },
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdAndRemove$1Lean(id, removeId, options).exec(cb);
}
`;

const TS_MiddlewareTpls = `
export function getAll$0Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAll$0', await $0FindManyLeanExec());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function getById$0Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'getById$0', await $0FindByIdLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function create$0Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: $0CreateInput = req.body;
        try {
            attachCTX(req, 'create$0', await $0CreateLean(createInput));            
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function update$0Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: $0ChangesInput = req.body;
        try {
            attachCTX(req, 'update$0', await $0FindByIdAndUpdate({ id, changes }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function delete$0Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'delete$0', await $0FindByIdAndRemove(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
`.trim();

const TS_RelationMiddlewareTpls = `
export function get$0$1Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'get$0$1', await $0FindById$1(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function add$0$1Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            attachCTX(req, 'add$0$1', await $0FindByIdAndAdd$1LeanExec(id, addId));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function remove$0$1Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            attachCTX(req, 'remove$0$1', await $0FindByIdAndRemove$1LeanExec(id, removeId));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
`; 

const TS_ControllerTpls = `
export function getAll$0Controller() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            res.json(await $0FindManyLeanExec());
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function getById$0Controller() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await $0FindByIdLeanExec(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function create$0Controller() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: $0CreateInput = req.body;
        try {
            res.json(await $0CreateLean(createInput));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function update$0Controller() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: $0ChangesInput = req.body;
        try {
            res.json(await $0FindByIdAndUpdate({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function delete$0Controller() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await $0FindByIdAndRemove(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
`.trim();

const TS_RelationControllerTpls = `
export function get$0$1Controller() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await $0FindById$1(id));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function add$0$1Controller() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: addId } = req.body;
        try {
            res.json(await $0FindByIdAndAdd$1LeanExec(id, addId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function remove$0$1Controller() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const { id: removeId } = req.body;
        try {
            res.json(await $0FindByIdAndRemove$1LeanExec(id, removeId));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
`;

const TS_RouterTpl = `
export class $0API {

    router = Router();
    
    constructor() {
        this.makeAPI();
    }

    private makeAPI() {
        this.router
            .get('/', getAll$0Controller())
            .get('/:id', getById$0Controller())
            .post('/', create$0Controller())
            .put('/:id', update$0Controller())
            .delete('/:id', delete$0Controller())$2$3$4;
    }
    
    applyAPI(app: Application) {
        app.use('/$1', this.router);
    }
}
`;

const TS_GetRelationRouterTpl = `.get('/:id/$0', get$1$2Controller())`;

const TS_AddRelationRouterTpl = `.post('/:id/$0/add', add$1$2Controller())`;

const TS_RemoveRelationRouterTpl = `.post('/:id/$0/remove', remove$1$2Controller())`;

export const templates = {
    TS_CreateInputPropTpl,
    TS_CreateInputTpl,
    TS_SchemaPropTpl,
    TS_SchemaTpl,
    TS_TypePropTpl,
    TS_TypeTpl,
    TS_UpdateInputPropTpl,
    TS_UpdateInputTpl,
    TS_UtilsTpl,
    TS_RelationUtilsTpl,
    TS_MiddlewareTpls,
    TS_RelationMiddlewareTpls,
    TS_ControllerTpls,
    TS_RelationControllerTpls,
    TS_RouterTpl,
    TS_GetRelationRouterTpl,
    TS_AddRelationRouterTpl,
    TS_RemoveRelationRouterTpl,
    TS_Prefix
};

export function replaceIt(tpl: string, ...args: string[]) {
    return args.reduce((s, it, idx) => s.replace(new RegExp(`\\$${idx}`, 'g'), it), tpl);
}

export function replaceThem(
    _tpl: string | { tpl: string, glue: string },
    on: [string, any][],
    by: (...args: any[]) => string[],
) {
    const { tpl, glue } = typeof(_tpl) === 'string' ? { tpl: _tpl, glue: '\n' } : _tpl;
    return on.map(([k, v], idx) => replaceIt(tpl, ...by(k, v, idx))).join(glue);
}
