const TS_Prefix = `
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


`;

const TS_Suffix = `

function attachCTX(req: Request, key: string, value: any) {
    req['CTX'][key] = value;
    return value;
}

const ResetCCC = "\x1b[0m";
const BrightCCC = "\x1b[1m";
const DimCCC = "\x1b[2m";
const UnderscoreCCC = "\x1b[4m";
const BlinkCCC = "\x1b[5m";
const ReverseCCC = "\x1b[7m";
const HiddenCCC = "\x1b[8m";
const FgBlackCCC = "\x1b[30m";
const FgRedCCC = "\x1b[31m";
const FgGreenCCC = "\x1b[32m";
const FgYellowCCC = "\x1b[33m";
const FgBlueCCC = "\x1b[34m";
const FgMagentaCCC = "\x1b[35m";
const FgCyanCCC = "\x1b[36m";
const FgWhiteCCC = "\x1b[37m";
const BgBlackCCC = "\x1b[40m";
const BgRedCCC = "\x1b[41m";
const BgGreenCCC = "\x1b[42m";
const BgYellowCCC = "\x1b[43m";
const BgBlueCCC = "\x1b[44m";
const BgMagentaCCC = "\x1b[45m";
const BgCyanCCC = "\x1b[46m";
const BgWhiteCCC = "\x1b[47m";

function colorVerb(verb: string) {
    switch (verb) {
        case 'GET':
            return \`\${BrightCCC}\${FgBlueCCC}GET\${ResetCCC}\`;
        case 'POST':
            return \`\${BrightCCC}\${FgGreenCCC}POST\${ResetCCC}\`;
        case 'PUT':
            return \`\${BrightCCC}\${FgYellowCCC}PUT\${ResetCCC}\`;
        case 'DELETE':
            return \`\${BrightCCC}\${FgRedCCC}DELETE\${ResetCCC}\`;
        default:
            return verb;
    }
}
function colorPath(path: string) {
    const parts = path.split('/').slice(1);
    parts[0] = \`\${UnderscoreCCC}\${BrightCCC}\${parts[0]}\${ResetCCC}\${UnderscoreCCC}\`;
    if (parts[1]) {
        parts[1] = \`\${UnderscoreCCC}\${FgBlueCCC}\${parts[1]}\${ResetCCC}\${UnderscoreCCC}\`;
    }
    if (parts[2]) {
        parts[2] = \`\${UnderscoreCCC}\${BrightCCC}\${FgYellowCCC}\${parts[2]}\${ResetCCC}\${UnderscoreCCC}\`;
    }
    if (parts[3] && parts[3] === 'add') {
        parts[3] = \`\${UnderscoreCCC}\${FgGreenCCC}\${parts[3]}\${ResetCCC}\${UnderscoreCCC}\`;
    } else if (parts[3] && parts[3] === 'remove') {
        parts[3] = \`\${UnderscoreCCC}\${FgRedCCC}\${parts[3]}\${ResetCCC}\${UnderscoreCCC}\`;
    }
    return \`\${UnderscoreCCC}\${parts.join('/')}\${ResetCCC}\`;
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
    _id?: string,
$1
}

//
// Function used to pick only needed properties
//

export function pick$0CreateInput<T extends { _id?: string|ObjectID }>(input: T) {
    if (input._id !== undefined
        && input._id !== null
    ) {
        input._id = typeof(input._id) === 'string' ? new ObjectID(input._id) : input._id;
    }
    return [$2].reduce((createInput, key) => {
        createInput[key] = input[key];
        return createInput;
    }, {}) as $0CreateInput;
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

//
// Function used to pick only needed properties
//

export function pick$0ChangesInput<T extends {}>(input: T) {
    return [$2].reduce((changesInput, key) => {
        changesInput[key] = input[key];
        return changesInput;
    }, {}) as $0ChangesInput;
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
export const $0Model = mongoose.model<Document & $0>('$0', $0Schema);
`.trim();

const TS_SchemaPropTpl = `$0: {
            type: $1,
            required: $2,
            default: $3,
            unique: $4,
            hidden: $5,
            ref: '$6',
        },`;


const TS_SchemaArrayPropTpl = `$0: [{
            type: $1,
            required: $2,
            default: $3,
            unique: $4,
            hidden: $5,
            ref: '$6',
        }],`;


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
    return $0FindMany(conditions, projection, options).lean() as Query<$0[]>;
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
    return $0FindOne(conditions, projection, options).lean() as Query<$0>;
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
    return $0FindById(id, projection, options).lean() as Query<$0>;
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

export function $0Create(unsafeCreateInput: $0CreateInput) {
    const createInput = pick$0CreateInput(unsafeCreateInput);
    const model = new $0Model(createInput);
    return model.save();
}
export async function $0CreateLean(createInput: $0CreateInput) {
    const object = await $0Create(createInput);
    return object.toObject() as $0;
}

export function $0FindByIdAndUpdate(
    { id, changes: unsafeChanges }: $0UpdateInput,
    options: any = { new: true }
) {
    const changes = pick$0ChangesInput(unsafeChanges);
    return $0Model.findByIdAndUpdate(id, { $set: changes }, options);
}
export function $0FindByIdAndUpdateLean(
    update: $0UpdateInput,
    options: any = { new: true }
) {
    return $0FindByIdAndUpdate(update, options).lean() as Query<$0>;
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
    return $0FindByIdAndRemove(id, options).lean() as Query<$0>;
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
export function $0FindByIdPopulate$1Lean<T = any>(
    id: string | ObjectID,
    projection?: any,
    options: any = {}
) {
    return $0FindByIdPopulate$1(id, projection, options).lean() as Query<$0 & { $2: T }>;
}
export function $0FindByIdPopulate$1Exec(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdPopulate$1(id, projection, options).exec(cb);
}
export function $0FindByIdPopulate$1LeanExec<T = any>(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdPopulate$1Lean<T>(id, projection, options).exec(cb);
}

export async function $0FindById$1<T = any>(
    id: string | ObjectID,
    projection?: any,
    options: any = {},
) {
    const object = await $0FindByIdPopulate$1LeanExec<T>(id, projection, options);
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
    return $0FindByIdAndAdd$1(id, addId, options).lean() as Query<$0>;
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
    options: any = {}
) {
    return $0Model.findByIdAndUpdate(id, { $pull: { $2: removeId } }, options);
}
export function $0FindByIdAndRemove$1Lean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return $0FindByIdAndRemove$1(id, removeId, options).lean() as Query<$0>;
}
export function $0FindByIdAndRemove$1Exec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return $0FindByIdAndRemove$1(id, removeId, options).exec(cb);
}
export function $0FindByIdAndRemove$1LeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
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
            attachCTX(req, 'update$0', await $0FindByIdAndUpdateLeanExec({ id, changes }));
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
            attachCTX(req, 'delete$0', await $0FindByIdAndRemoveLeanExec(id));
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
            res.json(await $0FindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function delete$0Controller() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await $0FindByIdAndRemoveLeanExec(id));
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

const TS_SkipableRouterTpl = `
export class $0API {

    router = Router();
    
    constructor(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.makeAPI(middlewaresMap);
    }

    private makeAPI(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.router
            $2$3$4$5$6$7$8$9;
    }
    
    applyAPI(app: Application) {
        app.use('/$1', this.router);
        console.log(\`***********     \${BrightCCC}\${'\$1'.toUpperCase()}\${ResetCCC}     ***********\`);
        console.log('\\n');
        this.router.stack.forEach(({ route: { path, methods } }) => console.log(
            \`\${colorVerb(Object.keys(methods)[0].toUpperCase())} => \${colorPath('/$1' + path)}\`
        ));
        console.log('\\n\\n');
    }
}
`;

const TS_MaybeMiddlewareTpl = `$1, `;

const TS_GetAllRouterTpl = `.get('/', $1getAll$0Controller())`;
const TS_GetByIdRouterTpl = `.get('/:id', $1getById$0Controller())`;
const TS_CreateRouterTpl = `.post('/', $1create$0Controller())`;
const TS_UpdateRouterTpl = `.put('/:id', $1update$0Controller())`;
const TS_DeleteRouterTpl = `.delete('/:id', $1delete$0Controller())`;
const TS_GetRelationRouterTpl = `.get('/:id/$0', $3get$1$2Controller())`;
const TS_AddRelationRouterTpl = `.put('/:id/$0/add', $3add$1$2Controller())`;
const TS_RemoveRelationRouterTpl = `.put('/:id/$0/remove', $3remove$1$2Controller())`;

export const templates = {
    TS_CreateInputPropTpl,
    TS_CreateInputTpl,
    TS_SchemaPropTpl,
    TS_SchemaArrayPropTpl,
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
    TS_SkipableRouterTpl,
    TS_GetAllRouterTpl,
    TS_GetByIdRouterTpl,
    TS_CreateRouterTpl,
    TS_UpdateRouterTpl,
    TS_DeleteRouterTpl,
    TS_GetRelationRouterTpl,
    TS_AddRelationRouterTpl,
    TS_RemoveRelationRouterTpl,
    TS_MaybeMiddlewareTpl,
    TS_Prefix,
    TS_Suffix
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
