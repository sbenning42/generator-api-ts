
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
    Store,
    StoreCreateBody,
    StoreChangesBody,
    StorePushBody,
    StorePullBody,
    StoreUpdateBody,
    StoreRawUpdateBody,
    StoreSchema,
    StoreModel,
    StoreDocument,
    StoreDocumentQuery,
    StoreDocumentsQuery,
    StoreCondition,
    StoreProjection,
    StorePopulate,
} from '../types';


export type MongooseCB<T = any> = (err: any, results: T) => void;

const populateAll = <Q extends (StoreDocumentQuery | StoreDocumentsQuery)>(
    query: Q,
    populates: StorePopulate[],
    idx: number = 0
) => idx < populates.length
    ? populateAll(query.populate(populates[idx]), populates, idx + 1)
    : query;

const docPopulateAll = <D extends StoreDocument | StoreDocument[]>(
    doc: D,
    populates: StorePopulate[],
    idx: number = 0
) => idx < populates.length
    ? docPopulateAll(
        Array.isArray(doc)
            ? doc.map(d => d.populate(populates[idx]))
            : (doc as StoreDocument).populate(populates[idx]),
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


/********* STORE Module *********/


export class StoreUtils {

    StoreSchema = StoreSchema;
    Store = StoreModel;

    findAll(
        projection?: StoreProjection,
        populates: StorePopulate[] = [],
        cb?: MongooseCB<StoreDocument[]>,
        options: any = {},
    ) {
        return populateAll(
            this.Store.find({}, projection, options, cb),
            populates
        ) as StoreDocumentsQuery;
    }

    findMany(
        condition: StoreCondition,
        projection?: StoreProjection,
        populates: StorePopulate[] = [],
        cb?: MongooseCB<StoreDocument[]>,
        options: any = {},
    ) {
        return populateAll(
            this.Store.find(condition, projection, options, cb),
            populates
        ) as StoreDocumentsQuery;
    }

    findOne(
        condition: StoreCondition,
        projection?: StoreProjection,
        populates: StorePopulate[] = [],
        cb?: MongooseCB<StoreDocument>,
        options: any = {},
    ) {
        return populateAll(
            this.Store.findOne(condition, projection, options, cb),
            populates
        ) as StoreDocumentQuery;
    }

    findById(
        id: ID,
        projection?: StoreProjection,
        populates: StorePopulate[] = [],
        cb?: MongooseCB<StoreDocument>,
        options: any = {},
    ) {
        return populateAll(
            this.Store.findById(id, projection, options, cb),
            populates
        ) as StoreDocumentQuery;
    }

    sanitizeCreateBody(body: StoreCreateBody) {
        if (typeof(body.id) === 'string') {
            delete body.id;
            body._id = new ObjectID(body.id);
        }
        return ['_id', 'name'].reduce<StoreCreateBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: body[key]
            }
            : sanitizedBody,
            {} as StoreCreateBody
        );
    }

    async create(
        body: StoreCreateBody,
        populates: StorePopulate[] = [],
        cb?: MongooseCB<StoreDocument>,
        options: SaveOptions = {},
        trusted: boolean = false
    ) {
        const sanitizedBody = this.sanitizeCreateBody(body);
        const modelInstance = new this.Store(sanitizedBody);
        return docPopulateAll(
            await modelInstance.save(options, cb),
            populates
        ) as StoreDocument;
    }

    async createMany(
        bodies: StoreCreateBody[],
        populates: StorePopulate[] = [],
        cb?: MongooseCB<StoreDocument[]>,
        options: SaveOptions = {},
        trusted: boolean = false
    ) {
        const modelInstances = bodies.map(body => new this.Store(this.sanitizeCreateBody(body)));
        return docPopulateAll(
            await this.Store.insertMany(modelInstances, options, cb),
            populates
        ) as StoreDocument[];
    }

    sanitizeChangesBody(body: StoreChangesBody) {
        return ['name'].reduce<StoreChangesBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: body[key]
            }
            : sanitizedBody,
            {} as StoreChangesBody);
    }

    sanitizePushBody(body: StorePushBody) {
        return [].reduce<StorePushBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: Array.isArray(body[key]) && body[key].length > 0 ? { $each: body[key] } : body[key]
            }
            : sanitizedBody,
            {} as StorePushBody);
    }

    sanitizePullBody(body: StorePullBody) {
        return [].reduce<StorePullBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: Array.isArray(body[key]) && body[key].length > 0 ? { $each: body[key] } : body[key]
            }
            : sanitizedBody,
            {} as StorePullBody);
    }

    updateById(
        { id, changes = {}, push = {}, pull = {} }: StoreUpdateBody,        
        populates: StorePopulate[] = [],
        cb?: MongooseCB<StoreDocument>,
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
            this.Store.findByIdAndUpdate(id, sanitizedBody, options, cb),
            populates
        ) as StoreDocumentQuery;
    }

    deleteById(
        id: ID,
        populates: StorePopulate[] = [],
        cb?: MongooseCB<StoreDocument>,
        options: QueryFindByIdAndRemoveOptions = {},
    ) {
        return populateAll(
            this.Store.findByIdAndRemove(id, options, cb),
            populates
        ) as StoreDocumentQuery;
    }

    updateOne(
        condition: StoreCondition,
        { changes = {}, push = {}, pull = {} }: StoreRawUpdateBody,        
        populates: StorePopulate[] = [],
        cb?: MongooseCB<StoreDocument>,
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
            this.Store.findOneAndUpdate(condition, sanitizedBody, options, cb),
            populates
        ) as StoreDocumentQuery;
    }

    deleteOne(
        condition: StoreCondition,
        populates: StorePopulate[] = [],
        cb?: MongooseCB<StoreDocument>,
        options: QueryFindOneAndRemoveOptions = {},
    ) {
        return populateAll(
            this.Store.findOneAndRemove(condition, options, cb),
            populates
        ) as StoreDocumentQuery;
    }

    updateMany(
        condition: StoreCondition,
        { changes = {}, push = {}, pull = {} }: StoreRawUpdateBody,        
        populates: StorePopulate[] = [],
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
            this.Store.updateMany(condition, sanitizedBody, options, cb),
            populates
        );
    }

    deleteMany(
        condition: StoreCondition,
        cb?: (err: any) => void,
    ) {
        return this.Store.remove(condition, cb);
    }
    
    async findVideosOf(id: ID) {
        const modelInstance = await this.findById(id, undefined, ['videos']);
        return modelInstance.videos;
    }


    addVideosTo(id: ID, ...addIds: ID[]) {
        return this.updateById({ id, push: { videos: { $each: addIds } } } as any, undefined, undefined, undefined, true);
    }

    removeVideosFrom(id: ID, ...removeIds: ID[]) {
        return this.updateById({ id, pull: { videos: { $in: removeIds } } } as any, undefined, undefined, undefined, true);
    }


}


export class StoreService {
    
    utils: StoreUtils = new StoreUtils();

}

export const mainStoreService: StoreService = new StoreService();


export class StoreMiddlewares {

}


export class StoreControllers {

    async getAll(req: Request, res: Response) {
        const { utils } = mainStoreService;
        try {
            res.json(await utils.findAll());
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async getById(req: Request, res: Response) {
        const { utils } = mainStoreService;
        const id = req.params.id;
        try {
            res.json(await utils.findById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async create(req: Request, res: Response) {
        const { utils } = mainStoreService;
        try {
            res.json(await utils.create(req.body));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async update(req: Request, res: Response) {
        const { utils } = mainStoreService;
        const id = req.params.id;
        const { changes, push, pull } = req.body;
        try {
            res.json(await utils.updateById({ id, changes, push, pull }));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async delete(req: Request, res: Response) {
        const { utils } = mainStoreService;
        const id = req.params.id;
        try {
            res.json(await utils.deleteById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }

    
    async getVideosOf(req: Request, res: Response) {
        const { utils } = mainStoreService;
        const id = req.params.id;
        try {
            const relation = await utils.findVideosOf(id);
            res.json(relation);
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async addVideosTo(req: Request, res: Response) {
        const { utils } = mainStoreService;
        const id = req.params.id;
        const { addIds } = req.body;
        try {
            res.json(await utils.addVideosTo(id, ...addIds));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }    
    async removeVideosFrom(req: Request, res: Response) {
        const { utils } = mainStoreService;
        const id = req.params.id;
        const { removeIds } = req.body;
        try {
            res.json(await utils.removeVideosFrom(id, ...removeIds));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }


}

export const mainStoreControllers: StoreControllers = new StoreControllers();


export class StoreRouter {
    
    router = Router();

    constructor(
        protected context: any = {},
    ) {
        this.setupRouter();
    }

    private setupRouter() {
        const {
            jwtMiddleware
        } = this.context;
        this.router
            .get('/', mainStoreControllers.getAll)
            .post('/', jwtMiddleware, mainStoreControllers.create)
            .get('/:id', mainStoreControllers.getById)
            .get('/:id/videos', mainStoreControllers.getVideosOf);
    }

    applyRouter(app: Application) {
        app.use('/stores', this.router);
    }
}


export function applyStoreAPI<CTX>(app: Application, context?: CTX, prettifyRouter?: (...args: any[]) => void, ...args: any[]) {
    const router = new StoreRouter(context);
    router.applyRouter(app);
    if (prettifyRouter && args.length > 1) {
        prettifyRouter(args[0], router.router, args[1]);
    }
    return router;
}
