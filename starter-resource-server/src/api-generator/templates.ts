import { Model, Document } from "mongoose";

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
        },`;
const TS_UtilsTpl = `
export function $0FindMany(conditions: any = {}, projection?: any, options: any = {}) {
    return $0Model.find(conditions, projection, options);
}
export function $0FindManyLean(conditions: any = {}, projection?: any, options: any = {}) {
    return $0FindMany(conditions, projection, options).lean();
}
export function $0FindManyExec(conditions: any = {}, projection?: any, options: any = {}, cb?) {
    return $0FindMany(conditions, projection, options).exec(cb);
}
export function $0FindManyLeanExec(conditions: any = {}, projection?: any, options: any = {}, cb?) {
    return $0FindManyLean(conditions, projection, options).exec(cb);
}

export function $0FindOne(conditions: any = {}, projection?: any, options: any = {}) {
    return $0Model.findOne(conditions, projection, options);
}
export function $0FindOneLean(conditions: any = {}, projection?: any, options: any = {}) {
    return $0FindOne(conditions, projection, options).lean();
}
export function $0FindOneExec(conditions: any = {}, projection?: any, options: any = {}, cb?) {
    return $0FindOne(conditions, projection, options).exec(cb);
}
export function $0FindOneLeanExec(conditions: any = {}, projection?: any, options: any = {}, cb?) {
    return $0FindOneLean(conditions, projection, options).exec(cb);
}

export function $0FindById(id: string | ObjectID, projection?: any, options: any = {}) {
    return $0Model.findById(id, projection, options);
}
export function $0FindByIdLean(id: string | ObjectID, projection?: any, options: any = {}) {
    return $0FindById(id, projection, options).lean();
}
export function $0FindByIdExec(id: string | ObjectID, projection?: any, options: any = {}, cb?) {
    return $0FindById(id, projection, options).exec(cb);
}
export function $0FindByIdLeanExec(id: string | ObjectID, projection?: any, options: any = {}, cb?) {
    return $0FindByIdLean(id, projection, options).exec(cb);
}

export function $0Create(createInput: $0CreateInput) {
    const model = new $0Model(createInput);
    return model.save();
}

export function $0FindByIdAndUpdate({ id, changes }: $0UpdateInput, options: any = { new: true }) {
    return $0Model.findByIdAndUpdate(id, { $set: changes }, { new: true });
}
export function $0FindByIdAndUpdateLean(update: $0UpdateInput, options: any = { new: true }) {
    return $0FindByIdAndUpdate(id, update, options).lean();
}
export function $0FindByIdAndUpdateExec(update: $0UpdateInput, options: any = { new: true }, cb?) {
    return $0FindByIdAndUpdate(id, update, options).exec(cb);
}
export function $0FindByIdAndUpdateLeanExec(update: $0UpdateInput, options: any = { new: true }, cb?) {
    return $0FindByIdAndUpdateLean(id, update, options).exec(cb);
}

export function $0FindByIdAndRemove(id: string | ObjectID, options: any = { new: true }) {
    return $0Model.findByIdAndRemove(id, { new: true });
}
export function $0FindByIdAndRemoveLean(id: string | ObjectID, options: any = { new: true }) {
    return $0FindByIdAndRemove(id, options).lean();
}
export function $0FindByIdAndRemoveExec(id: string | ObjectID, options: any = { new: true }, cb?) {
    return $0FindByIdAndRemove(id, options).exec(cb);
}
export function $0FindByIdAndRemoveLeanExec(id: string | ObjectID, options: any = { new: true }, cb?) {
    return $0FindByIdAndRemoveLean(id, options).exec(cb);
}

`.trim();

const T = {
    query: {
        getMany: `export function __NAME_0__Query() {
return __NAME_1__.find({});
}
export function __NAME_0__Lean() {
return __NAME_0__Query().lean();
}
export async function __NAME_0__Exec() {
return __NAME_0__Query().exec();
}
export async function __NAME_0__LeanExec() {
return __NAME_0__Lean().exec();
}

export function __NAME_0__Middleware() {
return async (req: Request, res: Response, next: NextFunction) => {
req['result'] = req['result'] ? req['result'] : {};
try {
    req['result'].__NAME_0__ = await __NAME_0__LeanExec();
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
next();
};
}

export function __NAME_0__Controller() {
return async (req: Request, res: Response) => {
try {
    res.json(await __NAME_0__LeanExec());
} catch(error) {
    res.status(500).json({ message: 'Something went wrong', error });
}
};
}
        `,
        getOne: `export function __NAME_0__Query(id: string) {
return __NAME_1__.findById(id);
}
export function __NAME_0__Lean(id: string) {
return __NAME_0__Query(id).lean();
}
export async function __NAME_0__Exec(id: string) {
return __NAME_0__Query(id).exec();
}
export async function __NAME_0__LeanExec(id: string) {
return __NAME_0__Lean(id).exec();
}

export function __NAME_0__Middleware() {
return async (req: Request, res: Response, next: NextFunction) => {
const id = req.params.id;
req['result'] = req['result'] ? req['result'] : {};
try {
    req['result'].__NAME_0__ = await __NAME_0__LeanExec(id);
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
next();
};
}

export function __NAME_0__Controller() {
return async (req: Request, res: Response) => {
const id = req.params.id;
try {
    res.json(await __NAME_0__LeanExec(id));
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
};
}
        `,
        getRelation: `export async function __NAME_0__LeanExec(id: string) {
const related = await __NAME_1__Query(id).populate('__NAME_2__').lean().exec();
return related.__NAME_2__;
}

export function __NAME_0__Middleware() {
return async (req: Request, res: Response, next: NextFunction) => {
const id = req.params.id;
req['result'] = req['result'] ? req['result'] : {};
try {
    req['result'].__NAME_0__ = await __NAME_0__LeanExec(id);
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
next();
};
}

export function __NAME_0__Controller() {
return async (req: Request, res: Response) => {
const id = req.params.id;
try {
    res.json(await __NAME_0__LeanExec(id));
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
};
}
        `,
    },
    mutation: {
        create: `export function __NAME_0__Middleware() {
return async (req: Request, res: Response, next: NextFunction) => {
req['result'] = req['result'] ? req['result'] : {};
const data = req.body;
try {
    const model = new __NAME_1__(data);
    req['result'].__NAME_0__ = await model.save();
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
next();
};
}

export function __NAME_0__Controller() {
return async (req: Request, res: Response) => {
const data = req.body;
try {
    const model = new __NAME_1__(data);
    res.json(await model.save());
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
};
}
        `,
        update: `export function __NAME_0__Middleware() {
return async (req: Request, res: Response, next: NextFunction) => {
const id = req.params.id;
req['result'] = req['result'] ? req['result'] : {};
const changes = req.body;
try {
    // use { new: true } to return modified document rather than old one (default to false)
    // use upsert if you want an update-or-create-if-not-exists behaviour
    req['result'].__NAME_0__ = await __NAME_1__.findByIdAndUpdate(id, { $set: changes }, { new: true });
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
next();
};
}

export function __NAME_0__Controller() {
return async (req: Request, res: Response) => {
const id = req.params.id;
const changes = req.body;
try {
    res.json(await __NAME_1__.findByIdAndUpdate(id, { $set: changes }, { new: true }));
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
};
}
        `,
        delete: `export function __NAME_0__Middleware() {
return async (req: Request, res: Response, next: NextFunction) => {
const id = req.params.id;
req['result'] = req['result'] ? req['result'] : {};
try {
    req['result'].__NAME_0__ = await __NAME_1__.findByIdAndRemove(id);
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
next();
};
}

export function __NAME_0__Controller() {
return async (req: Request, res: Response) => {
const id = req.params.id;
try {
    res.json(await __NAME_1__.findByIdAndRemove(id));
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
};
}
        `,
        addRelation: `export function __NAME_0__Middleware() {
return async (req: Request, res: Response, next: NextFunction) => {
const id = req.params.id;
req['result'] = req['result'] ? req['result'] : {};
const addId = req.body.id;
try {
    const [sub, subject] = await Promise.all([
        __NAME_1__.findById(id).populate('__NAME_3__').lean().exec(),
        __NAME_2__.findById(addId).exec()
    ]);
    if (!(sub && subject)) {
        return res.status(404).json({ message: 'Something went wrong', sub, subject });
    }
    if (Array.isArray(sub.__NAME_3__)) {
        sub.__NAME_3__.push(subject._id);
    } else {
        sub.__NAME_3__ = subject._id;
    }
    req['result'].__NAME_0__ = await sub.save();
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
next();
};
}

export function __NAME_0__Controller() {
return async (req: Request, res: Response) => {
const id = req.params.id;
req['result'] = req['result'] ? req['result'] : {};
const addId = req.body.id;
try {
    const [sub, subject] = await Promise.all([
        __NAME_1__.findById(id).populate('__NAME_3__').lean().exec(),
        __NAME_2__.findById(addId).exec()
    ]);
    if (!(sub && subject)) {
        return res.status(404).json({ message: 'Something went wrong', sub, subject });
    }
    if (Array.isArray(sub.__NAME_3__)) {
        sub.__NAME_3__.push(subject._id);
    } else {
        sub.__NAME_3__ = subject._id;
    }
    res.json(await sub.save());
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
};
}
        `, 
        removeRelation: `export function __NAME_0__Middleware() {
return async (req: Request, res: Response, next: NextFunction) => {
const id = req.params.id;
req['result'] = req['result'] ? req['result'] : {};
const removeId = req.body.id;
try {
    const [sub, subject] = await Promise.all([
        __NAME_1__.findById(id).populate('__NAME_3__').lean().exec(),
        __NAME_2__.findById(removeId).exec()
    ]);
    if (!(sub && subject)) {
        return res.status(404).json({ message: 'Something went wrong', sub, subject });
    }
    if (Array.isArray(sub.__NAME_3__)) {
        sub.__NAME_3__ = sub.__NAME_3__.filter((it: ObjectID) => !subject._id.equals(it));
    } else {
        sub.__NAME_3__ = undefined;
    }
    req['result'].__NAME_0__ = await sub.save();
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
next();
};
}

export function __NAME_0__Controller() {
return async (req: Request, res: Response) => {
const id = req.params.id;
req['result'] = req['result'] ? req['result'] : {};
const removeId = req.body.id;
try {
    const [sub, subject] = await Promise.all([
        __NAME_1__.findById(id).populate('__NAME_3__').lean().exec(),
        __NAME_2__.findById(removeId).exec()
    ]);
    if (!(sub && subject)) {
        return res.status(404).json({ message: 'Something went wrong', sub, subject });
    }
    if (Array.isArray(sub.__NAME_3__)) {
        sub.__NAME_3__ = sub.__NAME_3__.filter((it: ObjectID) => !subject._id.equals(it));
    } else {
        sub.__NAME_3__ = undefined;
    }
    res.json(await sub.save());
} catch(error) {
    return res.status(400).json({ message: 'Something went wrong', error });            
}
};
}
        `, 
    },
    router: `export class __NAME_0__API {
router = Router();

constructor() {
this.router
    .get('/', __NAME_1__Controller())
    .get('/:id', __NAME_2__Controller())
    .post('/', __NAME_3__Controller())
    .put('/:id', __NAME_4__Controller())
    .delete('/:id', __NAME_5__Controller())__GET____ADD____REMOVE__;
}

applyRouter(app: Application) {
app.use('/__NAME_6__', this.router);
}
}
    `,
    routerMiddlewareGet: `
    .get('/:id/__NAME_0__', __NAME_1__Controller())`,
    routerMiddlewareAdd: `
    .post('/:id/__NAME_0__/add', __NAME_1__Controller())`,
    routerMiddlewareRemove: `
    .post('/:id/__NAME_0__/remove', __NAME_1__Controller())`,
};
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
};

export function replaceIt(tpl: string, ...args: string[]) {
    return args.reduce((s, it, idx) => s.replace(new RegExp(`\\$${idx}`, 'g'), it), tpl);
}

export function replaceThem(
    _tpl: string | { tpl: string, glue: string },
    on: [string, any][],
    by: (...args: any[]) => string[],
    ...args: string[]
) {
    const { tpl, glue } = typeof(_tpl) === 'string' ? { tpl: _tpl, glue: '\n' } : _tpl;
    return on.map(([k, v], idx) => replaceIt(tpl, ...by(k, v, idx))).join(glue);
}

