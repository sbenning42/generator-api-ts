
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
    Video,
    VideoCreateBody,
    VideoChangesBody,
    VideoPushBody,
    VideoPullBody,
    VideoUpdateBody,
    VideoRawUpdateBody,
    VideoSchema,
    VideoModel,
    VideoDocument,
    VideoDocumentQuery,
    VideoDocumentsQuery,
    VideoCondition,
    VideoProjection,
    VideoPopulate,
} from '../types';


export type MongooseCB<T = any> = (err: any, results: T) => void;

const populateAll = <Q extends (VideoDocumentQuery | VideoDocumentsQuery)>(
    query: Q,
    populates: VideoPopulate[],
    idx: number = 0
) => idx < populates.length
    ? populateAll(query.populate(populates[idx]), populates, idx + 1)
    : query;

const docPopulateAll = <D extends VideoDocument | VideoDocument[]>(
    doc: D,
    populates: VideoPopulate[],
    idx: number = 0
) => idx < populates.length
    ? docPopulateAll(
        Array.isArray(doc)
            ? doc.map(d => d.populate(populates[idx]))
            : (doc as VideoDocument).populate(populates[idx]),
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


/********* VIDEO Module *********/


export class VideoUtils {

    VideoSchema = VideoSchema;
    Video = VideoModel;

    findAll(
        projection?: VideoProjection,
        populates: VideoPopulate[] = [],
        cb?: MongooseCB<VideoDocument[]>,
        options: any = {},
    ) {
        return populateAll(
            this.Video.find({}, projection, options, cb),
            populates
        ) as VideoDocumentsQuery;
    }

    findMany(
        condition: VideoCondition,
        projection?: VideoProjection,
        populates: VideoPopulate[] = [],
        cb?: MongooseCB<VideoDocument[]>,
        options: any = {},
    ) {
        return populateAll(
            this.Video.find(condition, projection, options, cb),
            populates
        ) as VideoDocumentsQuery;
    }

    findOne(
        condition: VideoCondition,
        projection?: VideoProjection,
        populates: VideoPopulate[] = [],
        cb?: MongooseCB<VideoDocument>,
        options: any = {},
    ) {
        return populateAll(
            this.Video.findOne(condition, projection, options, cb),
            populates
        ) as VideoDocumentQuery;
    }

    findById(
        id: ID,
        projection?: VideoProjection,
        populates: VideoPopulate[] = [],
        cb?: MongooseCB<VideoDocument>,
        options: any = {},
    ) {
        return populateAll(
            this.Video.findById(id, projection, options, cb),
            populates
        ) as VideoDocumentQuery;
    }

    sanitizeCreateBody(body: VideoCreateBody) {
        if (typeof(body.id) === 'string') {
            body.id = new ObjectID(body.id);
        }
        return ['json'].reduce<VideoCreateBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: body[key]
            }
            : sanitizedBody,
            {} as VideoCreateBody
        );
    }

    async create(
        body: VideoCreateBody,
        populates: VideoPopulate[] = [],
        cb?: MongooseCB<VideoDocument>,
        options: SaveOptions = {},
        trusted: boolean = false
    ) {
        const sanitizedBody = this.sanitizeCreateBody(body);
        const modelInstance = new this.Video(sanitizedBody);
        return docPopulateAll(
            await modelInstance.save(options, cb),
            populates
        ) as VideoDocument;
    }

    async createMany(
        bodies: VideoCreateBody[],
        populates: VideoPopulate[] = [],
        cb?: MongooseCB<VideoDocument[]>,
        options: SaveOptions = {},
        trusted: boolean = false
    ) {
        const modelInstances = bodies.map(body => new this.Video(this.sanitizeCreateBody(body)));
        return docPopulateAll(
            await this.Video.insertMany(modelInstances, options, cb),
            populates
        ) as VideoDocument[];
    }

    sanitizeChangesBody(body: VideoChangesBody) {
        return ['json'].reduce<VideoChangesBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: body[key]
            }
            : sanitizedBody,
            {} as VideoChangesBody);
    }

    sanitizePushBody(body: VideoPushBody) {
        return [].reduce<VideoPushBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: Array.isArray(body[key]) && body[key].length > 0 ? { $each: body[key] } : body[key]
            }
            : sanitizedBody,
            {} as VideoPushBody);
    }

    sanitizePullBody(body: VideoPullBody) {
        return [].reduce<VideoPullBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: Array.isArray(body[key]) && body[key].length > 0 ? { $each: body[key] } : body[key]
            }
            : sanitizedBody,
            {} as VideoPullBody);
    }

    updateById(
        { id, changes = {}, push = {}, pull = {} }: VideoUpdateBody,        
        populates: VideoPopulate[] = [],
        cb?: MongooseCB<VideoDocument>,
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
            this.Video.findByIdAndUpdate(id, sanitizedBody, options, cb),
            populates
        ) as VideoDocumentQuery;
    }

    deleteById(
        id: ID,
        populates: VideoPopulate[] = [],
        cb?: MongooseCB<VideoDocument>,
        options: QueryFindByIdAndRemoveOptions = {},
    ) {
        return populateAll(
            this.Video.findByIdAndRemove(id, options, cb),
            populates
        ) as VideoDocumentQuery;
    }

    updateOne(
        condition: VideoCondition,
        { changes = {}, push = {}, pull = {} }: VideoRawUpdateBody,        
        populates: VideoPopulate[] = [],
        cb?: MongooseCB<VideoDocument>,
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
            this.Video.findOneAndUpdate(condition, sanitizedBody, options, cb),
            populates
        ) as VideoDocumentQuery;
    }

    deleteOne(
        condition: VideoCondition,
        populates: VideoPopulate[] = [],
        cb?: MongooseCB<VideoDocument>,
        options: QueryFindOneAndRemoveOptions = {},
    ) {
        return populateAll(
            this.Video.findOneAndRemove(condition, options, cb),
            populates
        ) as VideoDocumentQuery;
    }

    updateMany(
        condition: VideoCondition,
        { changes = {}, push = {}, pull = {} }: VideoRawUpdateBody,        
        populates: VideoPopulate[] = [],
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
            this.Video.updateMany(condition, sanitizedBody, options, cb),
            populates
        );
    }

    deleteMany(
        condition: VideoCondition,
        cb?: (err: any) => void,
    ) {
        return this.Video.remove(condition, cb);
    }
    
    async findStoreOf(id: ID) {
        const modelInstance = await this.findById(id, undefined, ['store']);
        return modelInstance.store;
    }


    addStoreTo(id: ID, addId: ID) {
        return this.updateById({ id, changes: { store: addId } } as any, undefined, undefined, undefined, true);
    }

    removeStoreFrom(id: ID) {
        return this.updateById({ id, changes: { store: null } } as any, undefined, undefined, undefined, true);
    }


}


export class VideoService {
    
    utils: VideoUtils = new VideoUtils();

}

export const mainVideoService: VideoService = new VideoService();


export class VideoMiddlewares {

}


export class VideoControllers {

    async getAll(req: Request, res: Response) {
        const { utils } = mainVideoService;
        try {
            res.json(await utils.findAll());
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async getById(req: Request, res: Response) {
        const { utils } = mainVideoService;
        const id = req.params.id;
        try {
            res.json(await utils.findById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async create(req: Request, res: Response) {
        const { utils } = mainVideoService;
        try {
            res.json(await utils.create(req.body));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async update(req: Request, res: Response) {
        const { utils } = mainVideoService;
        const id = req.params.id;
        const { changes, push, pull } = req.body;
        try {
            res.json(await utils.updateById({ id, changes, push, pull }));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async delete(req: Request, res: Response) {
        const { utils } = mainVideoService;
        const id = req.params.id;
        try {
            res.json(await utils.deleteById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }

    
    async getStoreOf(req: Request, res: Response) {
        const { utils } = mainVideoService;
        const id = req.params.id;
        try {
            const relation = await utils.findStoreOf(id);
            res.json(relation);
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async addStoreTo(req: Request, res: Response) {
        const { utils } = mainVideoService;
        const id = req.params.id;
        const { addId } = req.body;
        try {
            res.json(await utils.addStoreTo(id, addId));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }    
    async removeStoreFrom(req: Request, res: Response) {
        const { utils } = mainVideoService;
        const id = req.params.id;
        const { removeId } = req.body;
        try {
            res.json(await utils.removeStoreFrom(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }


}

export const mainVideoControllers: VideoControllers = new VideoControllers();


export class VideoRouter {
    
    router = Router();

    constructor(
        protected context: any = {},
    ) {
        this.setupRouter();
    }

    private setupRouter() {
        const {
            jwtMiddleware,
            addVideoToStoreMiddleware,
            deleteVideoFromStoreMiddleware,
            uploadVideoController
        } = this.context;
        this.router
            .get('/', mainVideoControllers.getAll)
            .post('/', jwtMiddleware, addVideoToStoreMiddleware, mainVideoControllers.create)
            .get('/:id', mainVideoControllers.getById)
            .put('/:id', jwtMiddleware, mainVideoControllers.update)
            .delete('/:id', jwtMiddleware, deleteVideoFromStoreMiddleware, mainVideoControllers.delete)
            .get('/:id/store', mainVideoControllers.getStoreOf)
            .post('/utils/upload', jwtMiddleware, uploadVideoController, (_: Request, res: Response) => res.status(504).json({ message: 'Not implementd.' }));
    }

    applyRouter(app: Application) {
        app.use('/videos', this.router);
    }
}


export function applyVideoAPI<CTX>(app: Application, context?: CTX, prettifyRouter?: (...args: any[]) => void, ...args: any[]) {
    const router = new VideoRouter(context);
    router.applyRouter(app);
    if (prettifyRouter && args.length > 1) {
        prettifyRouter(args[0], router.router, args[1]);
    }
    return router;
}
