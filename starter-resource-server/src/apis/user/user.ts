
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
    UserUpdateBody,
    UserSchema,
    UserModel,
    UserDocument,
    UserDocumentQuery,
    UserDocumentsQuery,
    UserCondition,
    UserProjection,
    UserPopulate,
} from '../types';


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
            body.id = new ObjectID(body.id);
        }
        return ['username', 'password'].reduce<UserCreateBody>((sanitizedBody, key) => body[key] !== undefined
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
    ) {
        const modelInstances = bodies.map(body => new this.User(this.sanitizeCreateBody(body)));
        return docPopulateAll(
            await this.User.insertMany(modelInstances, options, cb),
            populates
        ) as UserDocument[];
    }

    sanitizeChangesBody(body: UserChangesBody) {
        return ['username', 'password'].reduce<UserChangesBody>((sanitizedBody, key) => body[key] !== undefined
            ? {
                ...sanitizedBody,
                [key]: body[key]
            }
            : sanitizedBody,
            {} as UserChangesBody);
    }

    updateById(
        { id, changes }: UserUpdateBody,
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument>,
        options: QueryFindByIdAndUpdateOptions = { new: true },
    ) {
        const sanitizedChanges = this.sanitizeChangesBody(changes);
        const body = { $set: sanitizedChanges };
        return populateAll(
            this.User.findByIdAndUpdate(id, body, options, cb),
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
        changes: UserChangesBody,
        populates: UserPopulate[] = [],
        cb?: MongooseCB<UserDocument>,
        options: QueryFindOneAndUpdateOptions = { new: true },
    ) {
        const sanitizedChanges = this.sanitizeChangesBody(changes);
        const body = { $set: sanitizedChanges };
        return populateAll(
            this.User.findOneAndUpdate(condition, body, options, cb),
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
        changes: UserChangesBody,
        populates: UserPopulate[] = [],
        cb?: MongooseCB<any>,
        options: ModelUpdateOptions = {},
    ) {
        const sanitizedChanges = this.sanitizeChangesBody(changes);
        const body = { $set: sanitizedChanges };
        return populateAll(
            this.User.updateMany(condition, body, options, cb),
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
        try {
            res.json(await utils.updateById({ id, changes: req.body }));
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
        this.setupRouter();
    }

    private setupRouter() {
        const {
            
        } = this.context;
        this.router
        .get('/', mainUserControllers.getAll)
        .post('/', mainUserControllers.create)
        .get('/:id', mainUserControllers.getById)
        .put('/:id', mainUserControllers.update)
        .delete('/:id', mainUserControllers.delete);
    }

    applyRouter(app: Application) {
        app.use('/users', this.router);
    }
}


export function applyUserAPI<CTX>(app: Application, context?: CTX) {
    new UserRouter(context).applyRouter(app);
}
