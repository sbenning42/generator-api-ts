
import { Request, Response, Router, Application } from 'express';
import { ObjectID } from 'mongodb';
import {
    Query,
    Document,
    SaveOptions,
    ModelUpdateOptions,
    QueryFindOneAndUpdateOptions,
    QueryFindOneAndRemoveOptions,
} from 'mongoose';
import {
    ID,
    Todo,
    TodoCreateBody,
    TodoChangesBody,
    TodoPushBody,
    TodoPullBody,
    TodoUpdateBody,
    TodoRawUpdateBody,
    TodoSchema,
    TodoModel,
    TodoDocument,
    TodoDocumentQuery,
    TodoDocumentsQuery,
    TodoCondition,
    TodoProjection,
    TodoPopulate,
} from '../types';


import { mainPassportService } from '../../modules/passport/service';
const thisPassport = {
    jwt: mainPassportService.jwt(),
    self: mainPassportService.self(),
};


export type MongooseCB<T = any> = (err: any, results: T) => void;

const populateAll = <Q extends (TodoDocumentQuery | TodoDocumentsQuery)>(
    query: Q,
    populates: TodoPopulate[],
    idx: number = 0
) => idx < populates.length
    ? populateAll(query.populate(populates[idx]), populates, idx + 1)
    : query;

const docPopulateAll = <D extends TodoDocument | TodoDocument[]>(
    doc: D,
    populates: TodoPopulate[],
    idx: number = 0
) => idx < populates.length
    ? docPopulateAll(
        Array.isArray(doc)
            ? doc.map(d => d.populate(populates[idx]))
            : (doc as TodoDocument).populate(populates[idx]),
        populates,
        idx + 1
    )
    : doc;

export type QueryFindByIdAndUpdateOptions = {
    rawResult?: true;
} & {
    upsert?: true;
} & {
    new?: true;
} & QueryFindOneAndUpdateOptions;

export type QueryFindByIdAndRemoveOptions = QueryFindOneAndRemoveOptions;


/********* TODO Module *********/


export class TodoUtils {

    TodoSchema = TodoSchema;
    Todo = TodoModel;

    findAll(
        projection?: TodoProjection,
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<TodoDocument[]>,
        options: any = {},
    ) {
        return populateAll(
            this.Todo.find({}, projection, options, cb),
            populates
        ) as TodoDocumentsQuery;
    }

    findMany(
        condition: TodoCondition,
        projection?: TodoProjection,
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<TodoDocument[]>,
        options: any = {},
    ) {
        return populateAll(
            this.Todo.find(condition, projection, options, cb),
            populates
        ) as TodoDocumentsQuery;
    }

    findOne(
        condition: TodoCondition,
        projection?: TodoProjection,
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<TodoDocument>,
        options: any = {},
    ) {
        return populateAll(
            this.Todo.findOne(condition, projection, options, cb),
            populates
        ) as TodoDocumentQuery;
    }

    findById(
        id: ID,
        projection?: TodoProjection,
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<TodoDocument>,
        options: any = {},
    ) {
        return populateAll(
            this.Todo.findById(id, projection, options, cb),
            populates
        ) as TodoDocumentQuery;
    }

    sanitizeCreateBody(body: TodoCreateBody) {
        if (typeof(body.id) === 'string') {
            delete body.id;
            body._id = new ObjectID(body.id);
        }
        return ['_id', 'title', 'done', 'tags'].reduce<TodoCreateBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: body[key]
            }
            : sanitizedBody,
            {} as TodoCreateBody
        );
    }

    async create(
        body: TodoCreateBody,
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<TodoDocument>,
        options: SaveOptions = {},
        trusted: boolean = false
    ) {
        const sanitizedBody = this.sanitizeCreateBody(body);
        const modelInstance = new this.Todo(sanitizedBody);
        return docPopulateAll(
            await modelInstance.save(options, cb),
            populates
        ) as TodoDocument;
    }

    async createMany(
        bodies: TodoCreateBody[],
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<TodoDocument[]>,
        options: SaveOptions = {},
        trusted: boolean = false
    ) {
        const modelInstances = bodies.map(body => new this.Todo(this.sanitizeCreateBody(body)));
        return docPopulateAll(
            await this.Todo.insertMany(modelInstances, options, cb),
            populates
        ) as TodoDocument[];
    }

    sanitizeChangesBody(body: TodoChangesBody) {
        return ['title', 'done', 'tags'].reduce<TodoChangesBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: body[key]
            }
            : sanitizedBody,
            {} as TodoChangesBody);
    }

    sanitizePushBody(body: TodoPushBody) {
        return ['tags'].reduce<TodoPushBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: Array.isArray(body[key]) && body[key].length > 0 ? { $each: body[key] } : body[key]
            }
            : sanitizedBody,
            {} as TodoPushBody);
    }

    sanitizePullBody(body: TodoPullBody) {
        return ['tags'].reduce<TodoPullBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: Array.isArray(body[key]) && body[key].length > 0 ? { $each: body[key] } : body[key]
            }
            : sanitizedBody,
            {} as TodoPullBody);
    }

    updateById(
        { id, changes = {}, push = {}, pull = {} }: TodoUpdateBody,        
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<TodoDocument>,
        options: QueryFindByIdAndUpdateOptions = { new: true },
        trusted: boolean = false
    ) {
        const sanitizedChanges = trusted ? changes : this.sanitizeChangesBody(changes);
        const sanitizedPush = trusted ? push : this.sanitizePushBody(push);
        const sanitizedPull = trusted ? pull : this.sanitizePullBody(pull);
        const body = {
            $set: sanitizedChanges,
            $push: sanitizedPush,
            $pull: sanitizedPull,
        };
        const sanitizedBody = ['$set', '$push', '$pull']
            .filter(key => Object.keys(body[key] || {}).length > 0)
            .reduce((obj, key) => ({ ...obj, [key]: body[key] }), {});
        return populateAll(
            this.Todo.findByIdAndUpdate(id, sanitizedBody, options, cb),
            populates
        ) as TodoDocumentQuery;
    }

    deleteById(
        id: ID,
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<TodoDocument>,
        options: QueryFindByIdAndRemoveOptions = {},
    ) {
        return populateAll(
            this.Todo.findByIdAndRemove(id, options, cb),
            populates
        ) as TodoDocumentQuery;
    }

    updateOne(
        condition: TodoCondition,
        { changes = {}, push = {}, pull = {} }: TodoRawUpdateBody,        
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<TodoDocument>,
        options: QueryFindOneAndUpdateOptions = { new: true },
        trusted: boolean = false
    ) {
        const sanitizedChanges = trusted ? changes : this.sanitizeChangesBody(changes);
        const sanitizedPush = trusted ? push : this.sanitizePushBody(push);
        const sanitizedPull = trusted ? pull : this.sanitizePullBody(pull);
        const body = {
            $set: sanitizedChanges,
            $push: sanitizedPush,
            $pull: sanitizedPull,
        };
        const sanitizedBody = ['$set', '$push', '$pull']
            .filter(key => Object.keys(body[key] || {}).length > 0)
            .reduce((obj, key) => ({ ...obj, [key]: body[key] }), {});
        return populateAll(
            this.Todo.findOneAndUpdate(condition, sanitizedBody, options, cb),
            populates
        ) as TodoDocumentQuery;
    }

    deleteOne(
        condition: TodoCondition,
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<TodoDocument>,
        options: QueryFindOneAndRemoveOptions = {},
    ) {
        return populateAll(
            this.Todo.findOneAndRemove(condition, options, cb),
            populates
        ) as TodoDocumentQuery;
    }

    updateMany(
        condition: TodoCondition,
        { changes = {}, push = {}, pull = {} }: TodoRawUpdateBody,        
        populates: TodoPopulate[] = [],
        cb?: MongooseCB<any>,
        options: ModelUpdateOptions = {},
        trusted: boolean = false
    ) {
        const sanitizedChanges = trusted ? changes : this.sanitizeChangesBody(changes);
        const sanitizedPush = trusted ? push : this.sanitizePushBody(push);
        const sanitizedPull = trusted ? pull : this.sanitizePullBody(pull);
        const body = {
            $set: sanitizedChanges,
            $push: sanitizedPush,
            $pull: sanitizedPull,
        };
        const sanitizedBody = ['$set', '$push', '$pull']
            .filter(key => Object.keys(body[key] || {}).length > 0)
            .reduce((obj, key) => ({ ...obj, [key]: body[key] }), {});
        return populateAll(
            this.Todo.updateMany(condition, sanitizedBody, options, cb),
            populates
        );
    }

    deleteMany(
        condition: TodoCondition,
        cb?: (err: any) => void,
    ) {
        return this.Todo.remove(condition, cb);
    }
    
    async findOwnerOf(id: ID) {
        const modelInstance = await this.findById(id, undefined, ['owner']);
        return modelInstance.owner;
    }


    addOwnerTo(id: ID, addId: ID) {
        return this.updateById({ id, changes: { owner: addId } } as any, undefined, undefined, undefined, true);
    }

    removeOwnerFrom(id: ID) {
        return this.updateById({ id, changes: { owner: null } } as any, undefined, undefined, undefined, true);
    }


}


export class TodoService {
    
    utils: TodoUtils = new TodoUtils();

}

export const mainTodoService: TodoService = new TodoService();


export class TodoMiddlewares {

}


export class TodoControllers {

    async getAll(req: Request, res: Response) {
        const { utils } = mainTodoService;
        try {
            res.json(await utils.findAll());
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async getById(req: Request, res: Response) {
        const { utils } = mainTodoService;
        const id = req.params.id;
        try {
            res.json(await utils.findById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async create(req: Request, res: Response) {
        const { utils } = mainTodoService;
        try {
            res.json(await utils.create(req.body));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async update(req: Request, res: Response) {
        const { utils } = mainTodoService;
        const id = req.params.id;
        const { changes, push, pull } = req.body;
        try {
            res.json(await utils.updateById({ id, changes, push, pull }));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async delete(req: Request, res: Response) {
        const { utils } = mainTodoService;
        const id = req.params.id;
        try {
            res.json(await utils.deleteById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }

    
    async getOwnerOf(req: Request, res: Response) {
        const { utils } = mainTodoService;
        const id = req.params.id;
        try {
            const relation = await utils.findOwnerOf(id);
            res.json(relation);
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async addOwnerTo(req: Request, res: Response) {
        const { utils } = mainTodoService;
        const id = req.params.id;
        const { addId } = req.body;
        try {
            res.json(await utils.addOwnerTo(id, addId));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }    
    async removeOwnerFrom(req: Request, res: Response) {
        const { utils } = mainTodoService;
        const id = req.params.id;
        const { removeId } = req.body;
        try {
            res.json(await utils.removeOwnerFrom(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }


}

export const mainTodoControllers: TodoControllers = new TodoControllers();


export class TodoRouter {
    
    router = Router();

    constructor(
        protected context: any = {},
    ) {
        this.context = {
            ...thisPassport,
            ...this.context
        } as any;
        this.setupRouter();
    }

    private setupRouter() {
        const {
            jwt,
            todoOwner,
            reverseAddTodoOwner,
            reverseRemoveTodoOwner
        } = this.context;
        this.router
            .get('/', mainTodoControllers.getAll)
            .post('/', jwt, todoOwner, reverseAddTodoOwner, mainTodoControllers.create)
            .get('/:id', mainTodoControllers.getById)
            .put('/:id', jwt, todoOwner, mainTodoControllers.update)
            .delete('/:id', jwt, todoOwner, reverseRemoveTodoOwner, mainTodoControllers.delete)
            .get('/:id/owner', jwt, mainTodoControllers.getOwnerOf);
    }

    applyRouter(app: Application) {
        app.use('/todos', this.router);
    }
}


export function applyTodoAPI<CTX>(app: Application, context?: CTX, prettifyRouter?: (...args: any[]) => void, ...args: any[]) {
    const router = new TodoRouter(context);
    router.applyRouter(app);
    if (prettifyRouter && args.length > 1) {
        prettifyRouter(args[0], router.router, args[1]);
    }
    return router;
}
