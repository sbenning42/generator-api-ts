
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
    Credential,
    CredentialCreateBody,
    CredentialChangesBody,
    CredentialUpdateBody,
    CredentialSchema,
    CredentialModel,
    CredentialDocument,
    CredentialDocumentQuery,
    CredentialDocumentsQuery,
    CredentialCondition,
    CredentialProjection,
    CredentialPopulate,
} from '../types';


export type MongooseCB<T = any> = (err: any, results: T) => void;

const populateAll = <Q extends (CredentialDocumentQuery | CredentialDocumentsQuery)>(
    query: Q,
    populates: CredentialPopulate[],
    idx: number = 0
) => idx < populates.length
    ? populateAll(query.populate(populates[idx]), populates, idx + 1)
    : query;

const docPopulateAll = <D extends CredentialDocument | CredentialDocument[]>(
    doc: D,
    populates: CredentialPopulate[],
    idx: number = 0
) => idx < populates.length
    ? docPopulateAll(
        Array.isArray(doc)
            ? doc.map(d => d.populate(populates[idx]))
            : (doc as CredentialDocument).populate(populates[idx]),
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


/********* CREDENTIAL Module *********/


export class CredentialUtils {

    CredentialSchema = CredentialSchema;
    Credential = CredentialModel;

    findAll(
        projection?: CredentialProjection,
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<CredentialDocument[]>,
        options: any = {},
    ) {
        return populateAll(
            this.Credential.find({}, projection, options, cb),
            populates
        ) as CredentialDocumentsQuery;
    }

    findMany(
        condition: CredentialCondition,
        projection?: CredentialProjection,
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<CredentialDocument[]>,
        options: any = {},
    ) {
        return populateAll(
            this.Credential.find(condition, projection, options, cb),
            populates
        ) as CredentialDocumentsQuery;
    }

    findOne(
        condition: CredentialCondition,
        projection?: CredentialProjection,
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<CredentialDocument>,
        options: any = {},
    ) {
        return populateAll(
            this.Credential.findOne(condition, projection, options, cb),
            populates
        ) as CredentialDocumentQuery;
    }

    findById(
        id: ID,
        projection?: CredentialProjection,
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<CredentialDocument>,
        options: any = {},
    ) {
        return populateAll(
            this.Credential.findById(id, projection, options, cb),
            populates
        ) as CredentialDocumentQuery;
    }

    sanitizeCreateBody(body: CredentialCreateBody) {
        if (typeof(body.id) === 'string') {
            body.id = new ObjectID(body.id);
        }
        return ['user', 'password', 'owner'].reduce<CredentialCreateBody>((sanitizedBody, key) => ({
            ...sanitizedBody,
            [key]: body[key]
        }), {} as CredentialCreateBody);
    }

    async create(
        body: CredentialCreateBody,
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<CredentialDocument>,
        options: SaveOptions = {},
    ) {
        const sanitizedBody = this.sanitizeCreateBody(body);
        const modelInstance = new this.Credential(sanitizedBody);
        return docPopulateAll(
            await modelInstance.save(options, cb),
            populates
        ) as CredentialDocument;
    }

    async createMany(
        bodies: CredentialCreateBody[],
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<CredentialDocument[]>,
        options: SaveOptions = {},
    ) {
        const modelInstances = bodies.map(body => new this.Credential(this.sanitizeCreateBody(body)));
        return docPopulateAll(
            await this.Credential.insertMany(modelInstances, options, cb),
            populates
        ) as CredentialDocument[];
    }

    sanitizeChangesBody(body: CredentialChangesBody) {
        return ['user', 'password'].reduce<CredentialChangesBody>((sanitizedBody, key) => ({
            ...sanitizedBody,
            [key]: body[key]
        }), {} as CredentialChangesBody);
    }

    updateById(
        { id, changes }: CredentialUpdateBody,
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<CredentialDocument>,
        options: QueryFindByIdAndUpdateOptions = { new: true },
    ) {
        const sanitizedChanges = this.sanitizeChangesBody(changes);
        const body = { $set: sanitizedChanges };
        return populateAll(
            this.Credential.findByIdAndUpdate(id, body, options, cb),
            populates
        ) as CredentialDocumentQuery;
    }

    deleteById(
        id: ID,
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<CredentialDocument>,
        options: QueryFindByIdAndRemoveOptions = {},
    ) {
        return populateAll(
            this.Credential.findByIdAndRemove(id, options, cb),
            populates
        ) as CredentialDocumentQuery;
    }

    updateOne(
        condition: CredentialCondition,
        changes: CredentialChangesBody,
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<CredentialDocument>,
        options: QueryFindOneAndUpdateOptions = { new: true },
    ) {
        const sanitizedChanges = this.sanitizeChangesBody(changes);
        const body = { $set: sanitizedChanges };
        return populateAll(
            this.Credential.findOneAndUpdate(condition, body, options, cb),
            populates
        ) as CredentialDocumentQuery;
    }

    deleteOne(
        condition: CredentialCondition,
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<CredentialDocument>,
        options: QueryFindOneAndRemoveOptions = {},
    ) {
        return populateAll(
            this.Credential.findOneAndRemove(condition, options, cb),
            populates
        ) as CredentialDocumentQuery;
    }

    updateMany(
        condition: CredentialCondition,
        changes: CredentialChangesBody,
        populates: CredentialPopulate[] = [],
        cb?: MongooseCB<any>,
        options: ModelUpdateOptions = {},
    ) {
        const sanitizedChanges = this.sanitizeChangesBody(changes);
        const body = { $set: sanitizedChanges };
        return populateAll(
            this.Credential.updateMany(condition, body, options, cb),
            populates
        );
    }

    deleteMany(
        condition: CredentialCondition,
        cb?: (err: any) => void,
    ) {
        return this.Credential.remove(condition, cb);
    }
}


export class CredentialService {
    
    utils: CredentialUtils = new CredentialUtils();

}

export const mainCredentialService: CredentialService = new CredentialService();


export class CredentialMiddlewares {
    
    service: CredentialService = mainCredentialService;

}


export class CredentialControllers {
    
    service: CredentialService = mainCredentialService;

    async getAll(req: Request, res: Response) {
        const { utils } = this.service;
        try {
            res.json(await utils.findAll());
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async getById(req: Request, res: Response) {
        const { utils } = this.service;
        const id = req.params.id;
        try {
            res.json(await utils.findById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async create(req: Request, res: Response) {
        const { utils } = this.service;
        try {
            res.json(await utils.create(req.body));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async update(req: Request, res: Response) {
        const { utils } = this.service;
        const id = req.params.id;
        try {
            res.json(await utils.updateById({ id, changes: req.body }));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async delete(req: Request, res: Response) {
        const { utils } = this.service;
        const id = req.params.id;
        try {
            res.json(await utils.deleteById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }

}

export const mainCredentialControllers: CredentialControllers = new CredentialControllers();


export class CredentialRouter {
    
    router = Router();

    constructor(
        protected context?: any,
    ) {
        this.setupRouter();
    }

    private setupRouter() {
        const {
            logToken
        } = this.context;
        this.router
        .put('/:id', logToken, mainCredentialControllers.update);
    }

    applyRouter(app: Application) {
        app.use('/credentials', this.router);
    }
}


export function applyCredentialAPI<CTX>(app: Application, context?: CTX) {
    new CredentialRouter(context).applyRouter(app);
}
