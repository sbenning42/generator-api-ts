
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



/**********     TODO     **********/
import {
    Todo,
    TodoCreateInput,
    TodoChangesInput,
    TodoUpdateInput,
    pickTodoCreateInput,
    pickTodoChangesInput,
    TodoModel,
} from '../types';

/**
 * Utilitaries functions
 */

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

export function TodoCreate(unsafeCreateInput: TodoCreateInput) {
    const createInput = pickTodoCreateInput(unsafeCreateInput);
    const model = new TodoModel(createInput);
    return model.save();
}
export async function TodoCreateLean(createInput: TodoCreateInput) {
    const object = await TodoCreate(createInput);
    return object.toObject();
}

export function TodoFindByIdAndUpdate(
    { id, changes: unsafeChanges }: TodoUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    const changes = pickTodoChangesInput(unsafeChanges);
    return TodoModel.findByIdAndUpdate(id, { $set: changes }, options);
}
export function TodoFindByIdAndUpdateLean(
    update: TodoUpdateInput,
    options: any = { new: true, useFindAndModify: false }
) {
    return TodoFindByIdAndUpdate(update, options).lean();
}
export function TodoFindByIdAndUpdateExec(
    update: TodoUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndUpdate(update, options).exec(cb);
}
export function TodoFindByIdAndUpdateLeanExec(
    update: TodoUpdateInput,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndUpdateLean(update, options).exec(cb);
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
    const object = await TodoFindByIdPopulateOwnerLeanExec(id, projection, options);
    return object ? object.owner : undefined;
}

export function TodoFindByIdAndAddOwner(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return TodoModel.findByIdAndUpdate(id, { $push: { owner: addId } }, options);
}
export function TodoFindByIdAndAddOwnerLean(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false }
) {
    return TodoFindByIdAndAddOwner(id, addId, options).lean();
}
export function TodoFindByIdAndAddOwnerExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndAddOwner(id, addId, options).exec(cb);
}
export function TodoFindByIdAndAddOwnerLeanExec(
    id: string | ObjectID,
    addId: string | ObjectID,
    options: any = { new: true, useFindAndModify: false },
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndAddOwnerLean(id, addId, options).exec(cb);
}

export function TodoFindByIdAndRemoveOwner(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return TodoModel.findByIdAndUpdate(id, { $pull: { owner: removeId } }, options);
}
export function TodoFindByIdAndRemoveOwnerLean(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {}
) {
    return TodoFindByIdAndRemoveOwner(id, removeId, options).lean();
}
export function TodoFindByIdAndRemoveOwnerExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndRemoveOwner(id, removeId, options).exec(cb);
}
export function TodoFindByIdAndRemoveOwnerLeanExec(
    id: string | ObjectID,
    removeId: string | ObjectID,
    options: any = {},
    cb?: (err: any, result: any) => void
) {
    return TodoFindByIdAndRemoveOwnerLean(id, removeId, options).exec(cb);
}


/**
 * Middlewares functions
 */

export function getAllTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            attachCTX(req, 'getAllTodo', await TodoFindManyLeanExec());
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function createTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const createInput: TodoCreateInput = req.body;
        try {
            attachCTX(req, 'createTodo', await TodoCreateLean(createInput));            
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function updateTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        const changes: TodoChangesInput = req.body;
        try {
            attachCTX(req, 'updateTodo', await TodoFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}
export function deleteTodoMiddleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            attachCTX(req, 'deleteTodo', await TodoFindByIdAndRemoveLeanExec(id));
        } catch(error) {
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
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
            return res.status(400).json({ message: 'Something went wrong.', error });
        }
        next();
    };
}


/**
 * Controllers functions
 */

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
            res.json(await TodoCreateLean(createInput));
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
            res.json(await TodoFindByIdAndUpdateLeanExec({ id, changes }));
        } catch(error) {
            res.status(400).json({ message: 'Something went wrong.', error });
        }
    };
}
export function deleteTodoController() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        try {
            res.json(await TodoFindByIdAndRemoveLeanExec(id));
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
    
    constructor(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.makeAPI(middlewaresMap);
    }

    private makeAPI(middlewaresMap: { [key: string]: (req: Request, res: Response, next: NextFunction) => void } = {}) {
        this.router
            .get('/', getAllTodoController())
            .get('/:id', getByIdTodoController())
            .post('/', createTodoController())
            .put('/:id', updateTodoController())
            .delete('/:id', deleteTodoController())
            .get('/:id/owner', getTodoOwnerController())
            .put('/:id/owner/add', addTodoOwnerController())
            .put('/:id/owner/remove', removeTodoOwnerController());
    }
    
    applyAPI(app: Application) {
        app.use('/todos', this.router);
        console.log(`***********     ${BrightCCC}${'todos'.toUpperCase()}${ResetCCC}     ***********`);
        console.log('\n');
        this.router.stack.forEach(({ route: { path, methods } }) => console.log(
            `${colorVerb(Object.keys(methods)[0].toUpperCase())} => ${colorPath('/todos' + path)}`
        ));
        console.log('\n\n');
    }
}
function contextMiddleware(req: Request, res: Response, next: NextFunction) {
    req['CTX'] = req['CTX'] ? req['CTX'] : {};
    req['CTX'].req = req;
    req['CTX'].res = res;
    next();
};

function attachCTX(req: Request, key: string, value: any) {
    req['CTX'][key] = value;
    return value;
}

const ResetCCC = "[0m";
const BrightCCC = "[1m";
const DimCCC = "[2m";
const UnderscoreCCC = "[4m";
const BlinkCCC = "[5m";
const ReverseCCC = "[7m";
const HiddenCCC = "[8m";
const FgBlackCCC = "[30m";
const FgRedCCC = "[31m";
const FgGreenCCC = "[32m";
const FgYellowCCC = "[33m";
const FgBlueCCC = "[34m";
const FgMagentaCCC = "[35m";
const FgCyanCCC = "[36m";
const FgWhiteCCC = "[37m";
const BgBlackCCC = "[40m";
const BgRedCCC = "[41m";
const BgGreenCCC = "[42m";
const BgYellowCCC = "[43m";
const BgBlueCCC = "[44m";
const BgMagentaCCC = "[45m";
const BgCyanCCC = "[46m";
const BgWhiteCCC = "[47m";

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
