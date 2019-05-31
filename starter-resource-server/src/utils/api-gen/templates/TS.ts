// function to replace `$<index>` occurencies in `s` by corresponding `args[index]`
export const rep = (s: string, args: string[] = []) => args.reduce((str, arg, idx) => str.replace(new RegExp(`\\$${idx}`, 'g'), arg), s);

// TS***Tpl functions are `rep` call wrappers. They defines their `s` (eg: the template)
// as well as defining last transformations to perform to `args` 

export const TSTypeImportsTpl = (customs: string[] = [], consts: string[] = []) => rep(`
import { Request, Response, NextFunction } from 'express';
import { Schema, model, Document, DocumentQuery } from 'mongoose';
import { ObjectID } from 'mongodb';
$0

export const Mixed = Schema.Types.Mixed;
export const ObjectId = Schema.Types.ObjectId;

export type ID = string | ObjectID;

$1

`, [
    customs.length > 0 ? customs.join('\n') : '',
    consts.length > 0 ? consts.join('\n') : '',
]);

export const TSTypeTpl = (name: string, props: string) => rep(`
export interface $0 {
$1
}
`, [name, props]);
export const TSTypePropTpl = (name: string, type: string, isArray: boolean = false, required: boolean = false) =>
    rep(`   $0$1: $2$3;`, [name, required ? '' : '?', type, isArray ? '[]' : '']);

export const TSCreateBodyTpl = (name: string, props: string) => rep(`
export interface $0CreateBody {
    id?: ID;
$1
}
`, [name, props]);
export const TSCreateBodyPropTpl = (name: string, type: string, isArray: boolean = false, required: boolean = false) =>
    rep(`   $0$1: $2$3;`, [name, required ? '' : '?', type, isArray ? '[]' : '']);

export const TSChangesBodyTpl = (name: string, props: string) => rep(`
export interface $0ChangesBody {
$1
}
`, [name, props]);
export const TSChangesBodyPropTpl = (name: string, type: string, isArray: boolean = false, required: boolean = false) =>
    rep(`   $0?: $1$2;`, [name, type, isArray ? '[]' : '']);

export const TSUpdateBodyTpl = (name: string) => rep(`
export interface $0UpdateBody {
    id: ID;
    changes: $0ChangesBody;
}
`, [name]);

export const TSMongooseSchemaTpl = (name: string, props: string) => rep(`
export const $0Schema = new Schema({
$1
}, { minimize: false }); 
`, [name, props]);

export const TSMongooseSchemaPropTpl = (
    name: string,
    type: string,
    ref: string,
    required: boolean,
    unique: boolean,
    hidden: boolean,
    _default: any
) => rep(`    $0: {
        type: $1,
        ref: '$2',
        required: $3,
        unique: $4,
        select: $5,
        default: $6,
    },`, [
    name,
    type,
    ref,
    required.toString(),
    unique.toString(),
    (!hidden).toString(),
    typeof(_default) === 'string' ? `${_default}` : JSON.stringify(_default)
])
    .replace(/\s*ref: 'undefined',/g, '')
    .replace(/\s*default: undefined,/g, '')
    .replace(/"/g, '\'');
export const TSMongooseSchemaArrayPropTpl = (
    name: string,
    type: string,
    ref: string,
    required: boolean,
    unique: boolean,
    hidden: boolean,
    _default: any
) => rep(`    $0: [{
        type: $1,
        ref: '$2',
        required: $3,
        unique: $4,
        select: $5,
        default: $6,
    }],`, [
    name,
    type,
    ref,
    required.toString(),
    unique.toString(),
    (!hidden).toString(),
    typeof(_default) === 'string' ? `${_default}` : JSON.stringify(_default)
])
    .replace(/\s*ref: 'undefined',/g, '')
    .replace(/\s*default: undefined,/g, '')
    .replace(/"/g, '\'');

export const TSMongooseModelTpl = (name: string) => rep(`
export type $0Document = Document & $0;
export type $0DocumentsQuery = DocumentQuery<$0Document[], $0Document>;
export type $0DocumentQuery = DocumentQuery<$0Document, $0Document>;
export const $0Model = model<$0Document>('$0', $0Schema);
export type $0Condition = any;
`, [name]);

export const TSMongooseModelProjectionTpl = (name: string, props: string) => rep(`
export interface $0Projection {
$1
}
`, [name, props]);
export const TSMongooseModelProjectionPropTpl = (name: string) => rep(`    $0: 0 | 1;`, [name]);

export const TSMongooseModelPopulateTpl = (name: string, props: string) => rep(`
export type $0Populate = $1;
`, [name, props || `''`]);

export const TSModuleImportsTpl = (name: string, ...customs: string[]) => rep(`
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
    $0,
    $0CreateBody,
    $0ChangesBody,
    $0UpdateBody,
    $0Schema,
    $0Model,
    $0Document,
    $0DocumentQuery,
    $0DocumentsQuery,
    $0Condition,
    $0Projection,
    $0Populate,
} from '../types';
$1

export type MongooseCB<T = any> = (err: any, results: T) => void;

const populateAll = <Q extends ($0DocumentQuery | $0DocumentsQuery)>(
    query: Q,
    populates: $0Populate[],
    idx: number = 0
) => idx < populates.length
    ? populateAll(query.populate(populates[idx]), populates, idx + 1)
    : query;

const docPopulateAll = <D extends $0Document | $0Document[]>(
    doc: D,
    populates: $0Populate[],
    idx: number = 0
) => idx < populates.length
    ? docPopulateAll(
        Array.isArray(doc)
            ? doc.map(d => d.populate(populates[idx]))
            : (doc as $0Document).populate(populates[idx]),
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

`, [name, customs.length > 0 ? customs.join('\n') : '']);

/*
import m, {} from 'mongoose';
const M = m.model('M', new m.Schema({ a: String }));
const i = new M({ a: 'a' });
i.save()
M.find({}, {}, {}, () => {});
M.findOne({}, {}, {}, () => {});
M.findById('', {}, {}, () => {});
M.findByIdAndRemove('', {}, () => {})
*/

export const TSUtilsTpl = (
    name: string,
    createBodyAllowedProperties: string,
    changesBodyAllowedProperties: string,
) => rep(`
export class $0Utils {

    $0Schema = $0Schema;
    $0 = $0Model;

    findAll(
        projection?: $0Projection,
        populates: $0Populate[] = [],
        cb?: MongooseCB<$0Document[]>,
        options: any = {},
    ) {
        return populateAll(
            this.$0.find({}, projection, options, cb),
            populates
        ) as $0DocumentsQuery;
    }

    findMany(
        condition: $0Condition,
        projection?: $0Projection,
        populates: $0Populate[] = [],
        cb?: MongooseCB<$0Document[]>,
        options: any = {},
    ) {
        return populateAll(
            this.$0.find(condition, projection, options, cb),
            populates
        ) as $0DocumentsQuery;
    }

    findOne(
        condition: $0Condition,
        projection?: $0Projection,
        populates: $0Populate[] = [],
        cb?: MongooseCB<$0Document>,
        options: any = {},
    ) {
        return populateAll(
            this.$0.findOne(condition, projection, options, cb),
            populates
        ) as $0DocumentQuery;
    }

    findById(
        id: ID,
        projection?: $0Projection,
        populates: $0Populate[] = [],
        cb?: MongooseCB<$0Document>,
        options: any = {},
    ) {
        return populateAll(
            this.$0.findById(id, projection, options, cb),
            populates
        ) as $0DocumentQuery;
    }

    sanitizeCreateBody(body: $0CreateBody) {
        if (typeof(body.id) === 'string') {
            body.id = new ObjectID(body.id);
        }
        return [$1].reduce<$0CreateBody>((sanitizedBody, key) => ({
            ...sanitizedBody,
            [key]: body[key]
        }), {} as $0CreateBody);
    }

    async create(
        body: $0CreateBody,
        populates: $0Populate[] = [],
        cb?: MongooseCB<$0Document>,
        options: SaveOptions = {},
    ) {
        const sanitizedBody = this.sanitizeCreateBody(body);
        const modelInstance = new this.$0(sanitizedBody);
        return docPopulateAll(
            await modelInstance.save(options, cb),
            populates
        ) as $0Document;
    }

    async createMany(
        bodies: $0CreateBody[],
        populates: $0Populate[] = [],
        cb?: MongooseCB<$0Document[]>,
        options: SaveOptions = {},
    ) {
        const modelInstances = bodies.map(body => new this.$0(this.sanitizeCreateBody(body)));
        return docPopulateAll(
            await this.$0.insertMany(modelInstances, options, cb),
            populates
        ) as $0Document[];
    }

    sanitizeChangesBody(body: $0ChangesBody) {
        return [$2].reduce<$0ChangesBody>((sanitizedBody, key) => ({
            ...sanitizedBody,
            [key]: body[key]
        }), {} as $0ChangesBody);
    }

    updateById(
        { id, changes }: $0UpdateBody,
        populates: $0Populate[] = [],
        cb?: MongooseCB<$0Document>,
        options: QueryFindByIdAndUpdateOptions = { new: true },
    ) {
        const sanitizedChanges = this.sanitizeChangesBody(changes);
        const body = { $set: sanitizedChanges };
        return populateAll(
            this.$0.findByIdAndUpdate(id, body, options, cb),
            populates
        ) as $0DocumentQuery;
    }

    deleteById(
        id: ID,
        populates: $0Populate[] = [],
        cb?: MongooseCB<$0Document>,
        options: QueryFindByIdAndRemoveOptions = {},
    ) {
        return populateAll(
            this.$0.findByIdAndRemove(id, options, cb),
            populates
        ) as $0DocumentQuery;
    }

    updateOne(
        condition: $0Condition,
        changes: $0ChangesBody,
        populates: $0Populate[] = [],
        cb?: MongooseCB<$0Document>,
        options: QueryFindOneAndUpdateOptions = { new: true },
    ) {
        const sanitizedChanges = this.sanitizeChangesBody(changes);
        const body = { $set: sanitizedChanges };
        return populateAll(
            this.$0.findOneAndUpdate(condition, body, options, cb),
            populates
        ) as $0DocumentQuery;
    }

    deleteOne(
        condition: $0Condition,
        populates: $0Populate[] = [],
        cb?: MongooseCB<$0Document>,
        options: QueryFindOneAndRemoveOptions = {},
    ) {
        return populateAll(
            this.$0.findOneAndRemove(condition, options, cb),
            populates
        ) as $0DocumentQuery;
    }

    updateMany(
        condition: $0Condition,
        changes: $0ChangesBody,
        populates: $0Populate[] = [],
        cb?: MongooseCB<any>,
        options: ModelUpdateOptions = {},
    ) {
        const sanitizedChanges = this.sanitizeChangesBody(changes);
        const body = { $set: sanitizedChanges };
        return populateAll(
            this.$0.updateMany(condition, body, options, cb),
            populates
        );
    }

    deleteMany(
        condition: $0Condition,
        cb?: (err: any) => void,
    ) {
        return this.$0.remove(condition, cb);
    }
}
`, [
    name,
    createBodyAllowedProperties,
    changesBodyAllowedProperties ? changesBodyAllowedProperties : createBodyAllowedProperties,
]);

export const TSServicesTpl = (name: string) => rep(`
export class $0Service {
    
    utils: $0Utils = new $0Utils();

}

export const main$0Service: $0Service = new $0Service();
`, [name]);

export const TSMiddlewaresTpl = (name: string) => rep(`
export class $0Middlewares {

}
`, [name]);

export const TSControllersTpl = (name: string) => rep(`
export class $0Controllers {

    async getAll(req: Request, res: Response) {
        const { utils } = main$0Service;
        try {
            res.json(await utils.findAll());
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async getById(req: Request, res: Response) {
        const { utils } = main$0Service;
        const id = req.params.id;
        try {
            res.json(await utils.findById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async create(req: Request, res: Response) {
        const { utils } = main$0Service;
        try {
            res.json(await utils.create(req.body));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async update(req: Request, res: Response) {
        const { utils } = main$0Service;
        const id = req.params.id;
        try {
            res.json(await utils.updateById({ id, changes: req.body }));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }
    
    async delete(req: Request, res: Response) {
        const { utils } = main$0Service;
        const id = req.params.id;
        try {
            res.json(await utils.deleteById(id));
        } catch (error) {
            res.status(400).json({ error, message: 'Something went wrong.' });
        }
    }

}

export const main$0Controllers: $0Controllers = new $0Controllers();
`, [name]);

export const TSRouterTpl = (name: string, routes: string[], endpoint: string, middlewares: string[] = []) => rep(`
export class $0Router {
    
    router = Router();

    constructor(
        protected context: any = {},
    ) {
        this.setupRouter();
    }

    private setupRouter() {
        const {
            $3
        } = this.context;
        this.router$1;
    }

    applyRouter(app: Application) {
        app.use('/$2s', this.router);
    }
}
`, [name, routes.join(''), endpoint, middlewares.join(',\n            ')]);

export const TSRouterRouteTpl = (verb: string, endpoint: string, controller: string) => rep(`
        .$0('$1', $2)`, [verb, endpoint, controller]);


export const TSRouterRouteWithMiddlewareTpl = (
    verb: string,
    endpoint: string,
    controller: string,
    ...middlewares: string[]
) => rep(`
        .$0('$1', $2, $3)`, [verb, endpoint, middlewares.join(', '), controller]);

export const TSApplyAPI = (name: string) => rep(`
export function apply$0API<CTX>(app: Application, context?: CTX) {
    new $0Router(context).applyRouter(app);
}
`, [name]);