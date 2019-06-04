
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
    User,
    UserCreateBody,
    UserChangesBody,
    UserPushBody,
    UserPullBody,
    UserUpdateBody,
    UserRawUpdateBody,
    UserSchema,
    UserModel,
    UserDocument,
    UserDocumentQuery,
    UserDocumentsQuery,
    UserCondition,
    UserProjection,
    UserPopulate,
} from '../types';


import { mainPassportService } from '../../modules/passport/service';
const thisPassport = {
    jwt: mainPassportService.jwt(),
    self: mainPassportService.self(),
};


export type MongooseCB<T = any> = (err: any, results: T) => void;

const populateAll = <Q extends (UserDocumentQuery | UserDocumentsQuery)>(
    query: Q,
    populates: UserPopulate[],
    idx: number = 0
) => idx < populates.length
    ? populateAll(query.populate(populates[idx]), populates, idx + 1)
    : query;

const docPopulateAll = <D extends UserDocument | UserDocument[]>(
    doc: D,
    populates: UserPopulate[],
    idx: number = 0
) => idx < populates.length
    ? docPopulateAll(
        Array.isArray(doc)
            ? doc.map(d => d.populate(populates[idx]))
            : (doc as UserDocument).populate(populates[idx]),
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


/********* USER Module *********/


export class UserUtils {

    UserSchema = UserSchema;
    User = UserModel;

    findAll(
        projection?: UserProjection,
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument[]>,
        options: any = {},
    ) {
        return populateAll(
            this.User.find({}, projection, options, cb),
            populates
        ) as UserDocumentsQuery;
    }

    findMany(
        condition: UserCondition,
        projection?: UserProjection,
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument[]>,
        options: any = {},
    ) {
        return populateAll(
            this.User.find(condition, projection, options, cb),
            populates
        ) as UserDocumentsQuery;
    }

    findOne(
        condition: UserCondition,
        projection?: UserProjection,
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument>,
        options: any = {},
    ) {
        return populateAll(
            this.User.findOne(condition, projection, options, cb),
            populates
        ) as UserDocumentQuery;
    }

    findById(
        id: ID,
        projection?: UserProjection,
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument>,
        options: any = {},
    ) {
        return populateAll(
            this.User.findById(id, projection, options, cb),
            populates
        ) as UserDocumentQuery;
    }

    sanitizeCreateBody(body: UserCreateBody) {
        if (typeof(body.id) === 'string') {
            delete body.id;
            body._id = new ObjectID(body.id);
        }
        return ['_id', 'username', 'password', 'json'].reduce<UserCreateBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: body[key]
            }
            : sanitizedBody,
            {} as UserCreateBody
        );
    }

    async create(
        body: UserCreateBody,
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument>,
        options: SaveOptions = {},
        trusted: boolean = false
    ) {
        const sanitizedBody = this.sanitizeCreateBody(body);
        const modelInstance = new this.User(sanitizedBody);
        return docPopulateAll(
            await modelInstance.save(options, cb),
            populates
        ) as UserDocument;
    }

    async createMany(
        bodies: UserCreateBody[],
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument[]>,
        options: SaveOptions = {},
        trusted: boolean = false
    ) {
        const modelInstances = bodies.map(body => new this.User(this.sanitizeCreateBody(body)));
        return docPopulateAll(
            await this.User.insertMany(modelInstances, options, cb),
            populates
        ) as UserDocument[];
    }

    sanitizeChangesBody(body: UserChangesBody) {
        return ['username', 'password', 'json'].reduce<UserChangesBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: body[key]
            }
            : sanitizedBody,
            {} as UserChangesBody);
    }

    sanitizePushBody(body: UserPushBody) {
        return [].reduce<UserPushBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: Array.isArray(body[key]) && body[key].length > 0 ? { $each: body[key] } : body[key]
            }
            : sanitizedBody,
            {} as UserPushBody);
    }

    sanitizePullBody(body: UserPullBody) {
        return [].reduce<UserPullBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: Array.isArray(body[key]) && body[key].length > 0 ? { $each: body[key] } : body[key]
            }
            : sanitizedBody,
            {} as UserPullBody);
    }

    updateById(
        { id, changes = {}, push = {}, pull = {} }: UserUpdateBody,        
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument>,
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
            this.User.findByIdAndUpdate(id, sanitizedBody, options, cb),
            populates
        ) as UserDocumentQuery;
    }

    deleteById(
        id: ID,
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument>,
        options: QueryFindByIdAndRemoveOptions = {},
    ) {
        return populateAll(
            this.User.findByIdAndRemove(id, options, cb),
            populates
        ) as UserDocumentQuery;
    }

    updateOne(
        condition: UserCondition,
        { changes = {}, push = {}, pull = {} }: UserRawUpdateBody,        
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument>,
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
            this.User.findOneAndUpdate(condition, sanitizedBody, options, cb),
            populates
        ) as UserDocumentQuery;
    }

    deleteOne(
        condition: UserCondition,
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument>,
        options: QueryFindOneAndRemoveOptions = {},
    ) {
        return populateAll(
            this.User.findOneAndRemove(condition, options, cb),
            populates
        ) as UserDocumentQuery;
    }

    updateMany(
        condition: UserCondition,
        { changes = {}, push = {}, pull = {} }: UserRawUpdateBody,        
        populates: UserPopulate[] = [],
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
            this.User.updateMany(condition, sanitizedBody, options, cb),
            populates
        );
    }

    deleteMany(
        condition: UserCondition,
        cb?: (err: any) => void,
    ) {
        return this.User.remove(condition, cb);
    }

}


export class UserService {
    
    utils: UserUtils = new UserUtils();

}

export const mainUserService: UserService = new UserService();


export class UserMiddlewares {

}


export class UserControllers {

    async getAll(req: Request, res: Response) {
        const { utils } = mainUserService;
        try {
            res.json(await utils.findAll());
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async getById(req: Request, res: Response) {
        const { utils } = mainUserService;
        const id = req.params.id;
        try {
            res.json(await utils.findById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async create(req: Request, res: Response) {
        const { utils } = mainUserService;
        try {
            res.json(await utils.create(req.body));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async update(req: Request, res: Response) {
        const { utils } = mainUserService;
        const id = req.params.id;
        const { changes, push, pull } = req.body;
        try {
            res.json(await utils.updateById({ id, changes, push, pull }));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async delete(req: Request, res: Response) {
        const { utils } = mainUserService;
        const id = req.params.id;
        try {
            res.json(await utils.deleteById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }



}

export const mainUserControllers: UserControllers = new UserControllers();


export class UserRouter {
    
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
            self
        } = this.context;
        this.router
            .get('/', jwt, mainUserControllers.getAll)
            .post('/', mainUserControllers.create)
            .get('/:id', jwt, mainUserControllers.getById)
            .put('/:id', jwt, self, mainUserControllers.update)
            .delete('/:id', jwt, mainUserControllers.delete);
    }

    applyRouter(app: Application) {
        app.use('/users', this.router);
    }
}


export function applyUserAPI<CTX>(app: Application, context?: CTX, prettifyRouter?: (...args: any[]) => void, ...args: any[]) {
    const router = new UserRouter(context);
    router.applyRouter(app);
    if (prettifyRouter && args.length > 1) {
        prettifyRouter(args[0], router.router, args[1]);
    }
    return router;
}
