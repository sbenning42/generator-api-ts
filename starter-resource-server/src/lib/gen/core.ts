import fs from 'fs';
import {
    GenContext,
    CAN,
    ALWAYS_CAN,
    ALWAYS_CANNOT,
    CANNOT,
    GenSchema,
    GenGenerated,
    GenTypeUnion
} from "./types";
import { mainPassportService } from "../../modules/passport/service";

export const applyTemplate = <A extends { [key: string]: string }>(template: string, args: A) => Object.entries(args || {})
    .reduce((steps, [key, value]) => steps.replace(new RegExp(`\\\$${key}`, 'g'), value), template);

export const capitalize = (s: string) => `${s.slice(0, 1).toLocaleUpperCase()}${s.slice(1)}`;

export const mongooseSchemaTemplate = `
export const $name = new mongoose.Schema({
$properties
}, { minimize: false, timestamps: true });
`;
export const mongooseSchemaPropertyTemplate = `    $name: {
        type: $type,
        required: $required,
        unique: $unique,
        select: $select,
        default: $_default,
    }`;
export const mongooseSchemaRelationPropertyTemplate = `    $name: {
        type: $type,
        required: $required,
        unique: $unique,
        select: $select,
        default: $_default,
        ref: '$ref',
    }`;
export const stringifyTypeForMongooseSchemaField = (_type: GenTypeUnion) => {
    const isArray = Array.isArray(_type);
    const type = isArray ? _type[0] : _type;
    const isRelation = typeof(type) === 'string';
    switch (true) {
        case type === Boolean:
            return isArray ? `[Boolean]` : 'Boolean';
        case type === String:
            return isArray ? `[String]` : 'String';
        case type === Number:
            return isArray ? `[Number]` : 'Number';
        case type === Date:
            return isArray ? `[Date]` : 'Date';
        case type === Object:
            return isArray ? `[Mixed]` : 'Mixed';
        case isRelation:
            return isArray ? `[ObjectId]` : 'ObjectId';
        default:
            throw new Error(`stringifyTypeForMongooseSchemaField: Do not know type \`${type}\``);
    }
};
export const stringifyTypeForInterfaceProperty = (_type: GenTypeUnion, followRelation: boolean = false) => {
    const isArray = Array.isArray(_type);
    const type = isArray ? _type[0] : _type;
    const isRelation = typeof(type) === 'string';
    switch (true) {
        case type === Boolean:
            return isArray ? `boolean[]` : 'boolean';
        case type === String:
            return isArray ? `string[]` : 'string';
        case type === Number:
            return isArray ? `number[]` : 'number';
        case type === Date:
            return isArray ? `Date[]` : 'Date';
        case type === Object:
            return isArray ? `any[]` : 'any';
        case isRelation && (followRelation || type === 'ID'):
            return isArray ? `${type}[]` : type;
        case isRelation && !followRelation:
            return isArray ? `ObjectID[]` : 'ObjectID';
        default:
            throw new Error(`stringifyTypeForInterfaceProperty: Do not know type \`${type}\``);
    }
};

export const getVerbForRouter = (wsEp: string) => {
    switch (true) {
        case wsEp.includes('GET'):
            return 'get';
        case wsEp.includes('POST'):
            return 'post';
        case wsEp.includes('PUT'):
            return 'put';
        case wsEp.includes('DELETE'):
            return 'delete';
        default:
            throw new Error(`getVerbForRouter: Do not know verb in ${wsEp}`);
    }
};
export const getPathForRouter = (wsEp: string) => {
    switch (true) {
        default:
            return wsEp.split(' ')[1];
    }
};
export const getControllerMethodForRouter = (wsEp: string) => {
    switch (true) {
        case wsEp === 'GET /':
            return 'getAll';
        case wsEp === 'POST /':
            return 'create';
        case wsEp === 'GET /:id':
            return 'getById';
        case wsEp === 'PUT /:id':
            return 'update';
        case wsEp === 'DELETE /:id':
            return 'delete';
        default:
            return ``;
    }
};

export const mongooseModelTemplate = `
export const $name = mongoose.model('$modelName', $schemaName);
`;

export const interfaceTemplate = `
export interface $name {
$properties
}
`;
export const interfacePropertyTemplate = `   $name$required: $type;`;

export const bddModelTemplate = interfaceTemplate;
export const bddModelPropertyTemplate = interfacePropertyTemplate;

export const mongooseProjectionObjectTemplate = interfaceTemplate;
export const mongooseProjectionObjectPropertyTemplate = interfacePropertyTemplate;

export const mongoosePopulateObjectTemplate = interfaceTemplate;
export const mongoosePopulateObjectPropertyTemplate = interfacePropertyTemplate;

export const populatedModelTemplate = interfaceTemplate;
export const populatedModelPropertyTemplate = interfacePropertyTemplate;

export const createPayloadModelTemplate = interfaceTemplate;
export const createPayloadModelPropertyTemplate = interfacePropertyTemplate;

export const updatePayloadModelTemplate = interfaceTemplate;
export const updatePayloadModelPropertyTemplate = interfacePropertyTemplate;

export const setPayloadModelTemplate = interfaceTemplate;
export const setPayloadModelPropertyTemplate = interfacePropertyTemplate;

export const pushPayloadModelTemplate = interfaceTemplate;
export const pushPayloadModelPropertyTemplate = interfacePropertyTemplate;

export const pullPayloadModelTemplate = interfaceTemplate;
export const pullPayloadModelPropertyTemplate = interfacePropertyTemplate;

export const defaultProjectionObjectTemplate = `
export const $name = {
$properties
};
`;
export const defaultProjectionObjectPropertyTemplate = `    $name: $project,`
export const defaultPopulateObjectTemplate = `
export const $name = {
$properties
};
`;
export const defaultPopulateObjectPropertyTemplate = `    $name: $populate,`;

export const fieldForCreateTemplate = `
export const $name = [$fields];
`;
export const fieldForUpdateSetTemplate = `
export const $name = [$fields];
`;
export const fieldForUpdatePushTemplate = `
export const $name = [$fields];
`;
export const fieldForUpdatePullTemplate = `
export const $name = [$fields];
`;

export const runGuardsTemplate = `
export const $name = async (context: GenContext) => {
    const guards = context.schema.apis.$api.model.$field.guards
        && context.schema.apis.$api.model.$field.guards.$guards;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['$field']: {
                            ...(step['$field'] ? step['$field'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};
`;
export const runAllGuardsTemplate = `
export const $name = async (context: GenContext) => {
    return Promise.all([
$guards
    ]);
};
`;
export const runAllGuardsGuardTemplate = `        $guard(context),`;
export const runCanSelectGuardsTemplate = applyTemplate(runGuardsTemplate, { guards: `canSelect` });
export const runAllCanSelectGuardsTemplate = runAllGuardsTemplate;
export const runAllCanSelectGuardsGuardTemplate = runAllGuardsGuardTemplate;
export const runCanCreateGuardsTemplate = applyTemplate(runGuardsTemplate, { guards: `canCreate` });
export const runAllCanCreateGuardsTemplate = runAllGuardsTemplate;
export const runAllCanCreateGuardsGuardTemplate = runAllGuardsGuardTemplate;
export const runCanUpdateGuardsTemplate = applyTemplate(runGuardsTemplate, { guards: `canUpdate` });
export const runAllCanUpdateGuardsTemplate = runAllGuardsTemplate;
export const runAllCanUpdateGuardsGuardTemplate = runAllGuardsGuardTemplate;
export const runValidatorsTemplate = `
export const $name = (input: $type, context: GenContext) => {
    const validators = context.schema.apis.$api.model.$field.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = (validator as LibValidator)(input);
        if (step || validate) {
            if (!step) {
                step = validate;
            } else if (validate) {
                step = { ...step, ...validate };
            }
        }
        return step;
    }, null as LibValidatorReturnUnion);
};
`; 
export const runAllValidatorsTemplate = `
export const $name = (context: GenContext, payload: any) => {
    const validators = Object.entries(context.schema.apis.$api.model)
        .map(([fieldName, field]: [string, any]) => [fieldName, field, field.validators || {}] as [string, any, LibValidator]);
    const validations = validators.map(([fieldName, field, validators]) => Object.entries(validators)
        .map(([validatorName, validator]) => [validatorName, validator(payload[fieldName], context)] as [string, LibValidatorReturnUnion])
    );
    if (validations.some(([validationName, validation]) => !!validation)) {
        return validations;
    }
    return null;
};
`;

export const dynamicImportsTemplate = `
import {
$types
} from '../types';
`;

export const utilityServiceTemplate = `
export class $name {

    context: GenContext;

    model = $modelName;

    constructor() {
    }

    populateAll(query: any, populates: string[], idx: number = 0) {
        if (idx === populates.length) {
            return query;
        }
        return this.populateAll(query.populate(populates[idx]), populates, idx + 1);
    }

    async applyAllCanSelectGuards(query: Promise<any> | DocumentQuery<any, any>) {
        const deleteThem = (results: LibGuardReturnUnion[], instance: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete instance[fieldName];
            }));
        };
        const results = await $runAllCanSelectGuards(this.context);
        return query
            .then(result => {
                Array.isArray(result)
                    ? result.forEach(res => deleteThem(results, res))
                    : deleteThem(results, result);
                return result;
            });
    }

    async applyAllCanCreateGuards(_payload: $createPayloadModel) {
        const payload = $fieldForCreate
            .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload[fieldName] }), {});
        const deleteThem = (results: LibGuardReturnUnion[], body: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete body[fieldName];
            }));
        };
        const results = await $runAllCanCreateGuards(this.context);
        deleteThem(results, payload);
        return payload as $createPayloadModel;
    }

    async applyAllCanUpdateGuards(_payload: $updatePayloadModel) {
        const payload = {
            id: _payload.id,
            $set: $fieldForUpdateSet
                .filter(fieldName => _payload.$set && fieldName in Object.keys(_payload.$set))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$set[fieldName] }), {}),
            $push: $fieldForUpdatePush
                .filter(fieldName => _payload.$push && fieldName in Object.keys(_payload.$push))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$push[fieldName] }), {}),
            $pull: $fieldForUpdatePull
                .filter(fieldName => _payload.$pull && fieldName in Object.keys(_payload.$pull))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$pull[fieldName] }), {}),
        };
        const deleteThem = (results: LibGuardReturnUnion[], body: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete body[fieldName];
            }));
        };
        const results = await $runAllCanUpdateGuards(this.context);
        deleteThem(results, payload.$set);
        deleteThem(results, payload.$push);
        deleteThem(results, payload.$pull);
        return payload as $updatePayloadModel;
    }

    applyAllValidators(context: GenContext, payload: any) {
        return $runAllValidators(context, payload);
    }

    async find(
        mongooseQueryObject?: $queryObject,
        mongooseProjectionObject?: $projectionObject,
        mongoosePopulateObject: $populateObject = {},
        mongooseQueryOptions?: any,
        lean: boolean = false,
        exec: boolean = false,
        cb?: any
    ) {
        const populates = Object.keys(mongoosePopulateObject).filter(key => mongoosePopulateObject[key]);
        const query = () => this.populateAll(this.model.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongooseQueryOptions
        ), populates);
        const queryLean = () => lean ? query().lean() : query();
        const queryExec = () => exec ? queryLean().exec(cb) : queryLean();
        return this.applyAllCanSelectGuards(queryExec());
    }

    async create(
        _createPayload: $createPayloadModel,
    ) {
        const createPayload = await this.applyAllCanCreateGuards(_createPayload);
        const results = this.applyAllValidators(gen.context, createPayload);
        if (results) {
            throw new Error(JSON.stringify(results));
        }
        const instance = new this.model(createPayload);
        return instance.save();
    }

    async update(
        _updatePayload: $updatePayloadModel,
        lean: boolean = false,
        exec: boolean = false,
        cb?: any
    ) {
        const updatePayload = await this.applyAllCanUpdateGuards(_updatePayload);
        const query = () => this.model.findByIdAndUpdate(updatePayload.id, {
            $set: updatePayload.$set,
            $push: Object.entries(updatePayload.$push || {}).reduce((step, [fieldName, toPush]) => ({
                ...step,
                [fieldName]: { $each: toPush }
            }), {}),
            $pull: Object.entries(updatePayload.$pull || {}).reduce((step, [fieldName, toPull]) => ({
                ...step,
                [fieldName]: { $in: toPull }
            }), {}),
        });
        const resultsForSet = this.applyAllValidators(gen.context, updatePayload.$set);
        const resultsForPush = this.applyAllValidators(gen.context, updatePayload.$push);
        const resultsForPull = this.applyAllValidators(gen.context, updatePayload.$pull);
        if (resultsForSet || resultsForPush || resultsForPull) {
            throw new Error(JSON.stringify([resultsForSet, resultsForPush, resultsForPull]));
        }
        const queryLean = () => lean ? query().lean() : query();
        const queryExec = () => exec ? queryLean().exec(cb) : queryLean();
        return queryExec();
    }

    async delete(
        id: ID,
        lean: boolean = false,
        exec: boolean = false,
        cb?: any
    ) {
        const query = () => this.model.findByIdAndRemove(id);
        const queryLean = () => lean ? query().lean() : query();
        const queryExec = () => exec ? queryLean().exec(cb) : queryLean();
        return queryExec();
    }

    async findLean(
        mongooseQueryObject?: $queryObject,
        mongooseProjectionObject?: $projectionObject,
        mongoosePopulateObject: $populateObject = {},
        mongooseQueryOptions?: any
    ) {
        return this.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongoosePopulateObject,
            mongooseQueryOptions,
            true
        );
    }

    async createLean(createPayload: $createPayloadModel) {
        return this.create(createPayload);
    }

    async updateLean(updatePayload: $updatePayloadModel) {
        return this.update(updatePayload, true);
    }

    async deleteLean(id: ID) {
        return this.delete(id, true);
    }

    async findExec(
        mongooseQueryObject?: $queryObject,
        mongooseProjectionObject?: $projectionObject,
        mongoosePopulateObject: $populateObject = {},
        mongooseQueryOptions?: any,
        cb?: any,
    ) {
        return this.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongoosePopulateObject,
            mongooseQueryOptions,
            false,
            true,
            cb
        );
    }

    async createExec(createPayload: $createPayloadModel) {
        return this.create(createPayload);
    }

    async updateExec(updatePayload: $updatePayloadModel, cb?: any) {
        return this.update(updatePayload, false, true, cb);
    }

    async deleteExec(id: ID, cb?: any) {
        return this.delete(id, false, true, cb);
    }

    async findLeanExec(
        mongooseQueryObject?: $queryObject,
        mongooseProjectionObject?: $projectionObject,
        mongoosePopulateObject: $populateObject = {},
        mongooseQueryOptions?: any,
        cb?: any
    ) {
        return this.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongoosePopulateObject,
            mongooseQueryOptions,
            true,
            true,
            cb
        );
    }

    async createLeanExec(createPayload: $createPayloadModel) {
        return this.create(createPayload);
    }

    async updateLeanExec(updatePayload: $updatePayloadModel, cb?: any) {
        return this.update(updatePayload, true, true, cb);
    }

    async deleteLeanExec(id: ID, cb?: any) {
        return this.delete(id, true, true, cb);
    }
}

export const $instance = new $name();

`;

export const mainServiceTemplate = `
export class $name {

    utils = $utilsInstance;

    constructor() {
        this.utils.context = gen.context;
    }

    async getAll() {
        const results = await this.utils.find({}, $defaultProjectionObject, $defaultPopulateObject);
        return results;
    }
    
    async getById(id: ID) {
        const result = await this.utils.find({ id }, $defaultProjectionObject, $defaultPopulateObject);
        return result;
    }
    
    async create(createPayload: $createPayloadModel) {
        const result = await this.utils.create(createPayload);
        return result;
    }
    
    async update(updatePayload: $updatePayloadModel) {
        const result = await this.utils.update(updatePayload);
        return result;
    }
    
    async delete(id: ID) {
        const result = await this.utils.delete(id);
        return result;
    }
}

export const $instance = new $name();

`;

export const mainMiddlewaresTemplate = `
/*

export class $name {
    constructor() {}
}

export const $instance = new $name();

*/
`;

export const mainControllersTemplate = `
export class $name {
    
    service = $serviceInstance;

    constructor() {}

    getAll() {
        return async (req: Request, res: Response) => {
            try {
                const response = await this.service.getAll();
                res.json({ response });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }
    
    getById() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                const response = await this.service.getById(id);
                res.json({ response });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }
    
    create() {
        return async (req: Request, res: Response) => {
            const payload = req.body;
            try {
                const response = await this.service.create(payload);
                res.json({ response });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }
    
    update() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            const payload = req.body;
            try {
                const response = await this.service.update({ id, ...payload });
                res.json({ response });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }
    
    delete() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                const response = await this.service.delete(id);
                res.json({ response });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }

}

export const $instance = new $name();
`;

export const mainRouterTemplate = `
export class $name {

    controller = $controllerInstance;
    router: any;

    constructor() {}

    initialize() {
        this.router = Router()
$webServices;
    }

    applyRouter(app: Application) {
        app.use('$path', this.router);
    }

}

export const $instance = new $name();
`;

export const mainRouterWebServiceTemplate = `            .$verb('$path', $middlewares)`;

export const applyRouterTemplate = `
`;


export class GenCore {

    context: GenContext = {
        lib: {
            guards: {
                can: CAN,
                cannot: CANNOT,
                alwaysCan: ALWAYS_CAN,
                alwaysCannot: ALWAYS_CANNOT,
            },
            validators: {},
            middlewares: {
                jwt: mainPassportService.jwt(),
                hasRole: mainPassportService.hasRole,
                iOwn: mainPassportService.owner,
            },
        },
        schema: null
    };

    register(schema: GenSchema) {
        this.context.schema = schema;
    }

    generate(write: boolean = true): GenGenerated {
        const { config, apis } = this.context.schema;
        Object.entries(apis)
            .forEach(([apiName, api]) => {
                const allMiddlewares = api.webServices.all && api.webServices.all.middlewares || [];
                const queriesMiddlewares = api.webServices.queries && api.webServices.queries.middlewares || [];
                const queryMiddlewares = api.webServices.query && api.webServices.query.middlewares || [];
                const mutationMiddlewares = api.webServices.mutation && api.webServices.mutation.middlewares || [];
                const queriesExcludes = api.webServices.queries && api.webServices.queries.excludes || {};
                const queryExcludes = api.webServices.query && api.webServices.query.excludes || {};
                const mutationExcludes = api.webServices.mutation && api.webServices.mutation.excludes || {};
                const allSkip = api.webServices.all && api.webServices.all.skip || false;
                const queriesSkip = api.webServices.queries && api.webServices.queries.skip || false;
                const querySkip = api.webServices.query && api.webServices.query.skip || false;
                const mutationSkip = api.webServices.mutation && api.webServices.mutation.skip || false;
                ['GET /', 'POST /', 'GET /:id', 'PUT /:id', 'DELETE /:id']
                    .forEach(wsEp => {
                        if (!api.webServices[wsEp]) {
                            api.webServices[wsEp] = {
                                middlewares: [],
                                excludes: [],
                                skip: false,
                            };
                        }
                    });
                Object.entries(api.webServices)
                    .filter(([wsEp, ws]) => /(GET|POST|PUT|DELETE)/.test(wsEp))
                    .forEach(([wsEp, ws]) => {
                        const wsController = getControllerMethodForRouter(wsEp);
                        const wsMiddlewares = ws.middlewares || [];
                        const wsExcludes = ws.excludes || {};
                        const wsSkip = ws.skip || false;
                        let middlewares;
                        let skip;
                        if (wsEp.startsWith('GET /')) {
                            if (wsEp.startsWith('GET /:id')) {
                                middlewares = [
                                    ...allMiddlewares,
                                    ...queryMiddlewares,
                                    ...wsMiddlewares
                                ].filter((m, idx) => !(idx in queryExcludes || idx in wsExcludes));
                                skip = allSkip || querySkip || wsSkip;
                            } else {
                                middlewares = [
                                    ...allMiddlewares,
                                    ...queriesMiddlewares,
                                    ...wsMiddlewares
                                ].filter((m, idx) => !(idx in queriesExcludes || idx in wsExcludes));
                                skip = allSkip || queriesSkip || wsSkip;
                            }
                        } else {
                            middlewares = [
                                ...allMiddlewares,
                                ...mutationMiddlewares,
                                ...wsMiddlewares
                            ].filter((m, idx) => !(idx in mutationExcludes || idx in wsExcludes));
                            skip = allSkip || mutationSkip || wsSkip;
                        }
                        ws.middlewares = middlewares;
                        ws.skip = skip;
                        console.log(`For ${wsEp}: middlewares: `, ws.middlewares, `, skip: ${ws.skip}.`);
                    });
            });
        const generated = Object.entries(apis)
            .reduce((steps, [apiName, api]) => ({
                ...steps,
                [apiName]: {
                    typescript: {
                        types: {
                            imports: `
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import { gen } from '${(config.genLibDir || "../../lib/gen").slice(3)}/core';

export const ObjectId = mongoose.Schema.Types.ObjectId;
export const Mixed = mongoose.Schema.Types.Mixed;

export type ID = string | number | ObjectID;

                            `,
                            mongooseSchema: applyTemplate(mongooseSchemaTemplate, {
                                name: `${capitalize(apiName)}Schema`,
                                properties: Object.entries(api.model).map(([fieldName, field]) => applyTemplate(
                                    typeof((Array.isArray(field.type) ? field.type[0] : field.type)) === 'string'
                                        ? mongooseSchemaRelationPropertyTemplate
                                        : mongooseSchemaPropertyTemplate,
                                    {
                                        name: fieldName,
                                        type: stringifyTypeForMongooseSchemaField(field.type),
                                        required: field.required ? 'true' : 'false',
                                        unique: field.unique ? 'true' : 'false',
                                        select: !field.guards
                                            || !field.guards.canSelect
                                            || !field.guards.canSelect.length
                                            || field.guards.canSelect === ALWAYS_CAN // in all those cases we know we have to put select: true
                                            ? 'true'
                                            : 'false',
                                        _default: typeof(field.default) === 'string'
                                            ? field.default
                                            : (typeof(field.default) === 'function'
                                                ? field.default.toString().replace(/\w*_\d*\./g, '') // erase JS engine scopes
                                                : JSON.stringify(field.default)
                                            ),
                                        ref: (Array.isArray(field.type) ? field.type[0] : field.type) as string
                                    }
                                )).join(',\n')
                            }),
                            mongooseModel: applyTemplate(mongooseModelTemplate, {
                                name: `${capitalize(apiName)}Model`,
                                modelName: `${capitalize(apiName)}`,
                                schemaName: `${capitalize(apiName)}Schema`,
                            }),
                            bddModel: applyTemplate(bddModelTemplate, {
                                name: `${capitalize(apiName)}`,
                                properties: Object.entries({
                                        id: {
                                            type: 'ID',
                                            required: true,
                                        } as any,
                                        ...api.model
                                    })
                                    .map(([fieldName, field]) => applyTemplate(bddModelPropertyTemplate, {
                                        name: fieldName,
                                        required: field.required && !(field.guards && field.guards.canSelect && field.guards.canSelect.length) ? '' : '?',
                                        type: stringifyTypeForInterfaceProperty(field.type),
                                    }))
                                    .join('\n'),
                            }),
                            mongooseQueryObject: `export type ${capitalize(apiName)}QueryObject = any`,
                            mongooseProjectionObject: applyTemplate(mongooseProjectionObjectTemplate, {
                                name: `${capitalize(apiName)}ProjectionObject`,
                                properties: Object.entries(api.model)
                                    .filter(([fieldName, field]) => true)
                                    .map(([fieldName, field]) => applyTemplate(mongooseProjectionObjectPropertyTemplate, {
                                        name: fieldName,
                                        type: '0 | 1',
                                        required: '?',
                                    }))
                                    .join('\n')
                            }),
                            mongoosePopulateObject: applyTemplate(mongoosePopulateObjectTemplate, {
                                name: `${capitalize(apiName)}PopulateObject`,
                                properties: Object.entries(api.model)
                                    .filter(([fieldName, field]) => typeof((Array.isArray(field.type) ? field.type[0] : field.type)) === 'string')
                                    .map(([fieldName, field]) => applyTemplate(mongoosePopulateObjectPropertyTemplate, {
                                        name: fieldName,
                                        type: 'boolean',
                                        required: '?',
                                    }))
                                    .join('\n')
                            }),
                            populatedModel: applyTemplate(populatedModelTemplate, {
                                name: `${capitalize(apiName)}Populated`,
                                properties: Object.entries({
                                        id: {
                                            type: 'ID',
                                            required: true,
                                        } as any,
                                        ...api.model
                                    })
                                    .filter(([fieldName, field]) => true)
                                    .map(([fieldName, field]) => applyTemplate(populatedModelPropertyTemplate, {
                                        name: fieldName,
                                        required: field.required && !(field.guards && field.guards.canSelect && field.guards.canSelect.length) ? '' : '?',
                                        type: stringifyTypeForInterfaceProperty(field.type, true),
                                    }))
                                    .join('\n'),
                            }),
                            createPayloadModel: applyTemplate(createPayloadModelTemplate, {
                                name: `${capitalize(apiName)}CreatePayloadModel`,
                                properties: Object.entries({
                                        id: {
                                            type: 'ID',
                                            required: true,
                                        } as any,
                                        ...api.model
                                    })
                                    .filter(([fieldName, field]) => !field.guards
                                        || !field.guards.canCreate
                                        || field.guards.canCreate !== ALWAYS_CANNOT
                                    )
                                    .map(([fieldName, field]) => applyTemplate(createPayloadModelPropertyTemplate, {
                                        name: fieldName,
                                        required: field.required && !(field.guards && field.guards.canCreate && field.guards.canCreate.length) ? '' : '?',
                                        type: stringifyTypeForInterfaceProperty(field.type),
                                    }))
                                    .join('\n'),
                            }),
                            updatePayloadModel: applyTemplate(updatePayloadModelTemplate, {
                                name: `${capitalize(apiName)}UpdatePayloadModel`,
                                properties: Object.entries({
                                        id: {
                                            type: 'ID',
                                            required: true,
                                        },
                                        $set: {
                                            type: `${capitalize(apiName)}SetPayloadModel`,
                                        },
                                        $push: {
                                            type: `${capitalize(apiName)}PushPayloadModel`,
                                        },
                                        $pull: {
                                            type: `${capitalize(apiName)}PullPayloadModel`,
                                        },
                                    })
                                    .filter(([fieldName, field]) => true)
                                    .map(([fieldName, field]) => applyTemplate(updatePayloadModelPropertyTemplate, {
                                        name: fieldName,
                                        required: field.required ? '' : '?',
                                        type: stringifyTypeForInterfaceProperty(field.type, true),
                                    }))
                                    .join('\n'),
                            }),
                            setPayloadModel: applyTemplate(setPayloadModelTemplate, {
                                name: `${capitalize(apiName)}SetPayloadModel`,
                                properties: Object.entries(api.model)
                                    .filter(([fieldName, field]) => !field.guards
                                        || !field.guards.canUpdate
                                        || field.guards.canUpdate !== ALWAYS_CANNOT
                                    )
                                    .map(([fieldName, field]) => applyTemplate(setPayloadModelPropertyTemplate, {
                                        name: fieldName,
                                        required: '?',
                                        type: stringifyTypeForInterfaceProperty(field.type),
                                    }))
                                    .join('\n'),
                            }),
                            pushPayloadModel: applyTemplate(pushPayloadModelTemplate, {
                                name: `${capitalize(apiName)}PushPayloadModel`,
                                properties: Object.entries(api.model)
                                    .filter(([fieldName, field]) => Array.isArray(field.type) && (!field.guards
                                        || !field.guards.canUpdate
                                        || field.guards.canUpdate !== ALWAYS_CANNOT)
                                    )
                                    .map(([fieldName, field]) => applyTemplate(pushPayloadModelPropertyTemplate, {
                                        name: fieldName,
                                        required: '?', // allways not required because `PUT /:id` perform a semantic PATCH not PUT
                                        type: stringifyTypeForInterfaceProperty(field.type),
                                    }))
                                    .join('\n'),
                            }),
                            pullPayloadModel: applyTemplate(pullPayloadModelTemplate, {
                                name: `${capitalize(apiName)}PullPayloadModel`,
                                properties: Object.entries(api.model)
                                    .filter(([fieldName, field]) => Array.isArray(field.type) && (!field.guards
                                        || !field.guards.canUpdate
                                        || field.guards.canUpdate !== ALWAYS_CANNOT)
                                    )
                                    .map(([fieldName, field]) => applyTemplate(pullPayloadModelPropertyTemplate, {
                                        name: fieldName,
                                        required: '?',
                                        type: stringifyTypeForInterfaceProperty(field.type),
                                    }))
                                    .join('\n'),
                            }),
                        },
                        imports: `
import {
    Application,
    Router,
    Request,
    Response,
    NextFunction
} from 'express';
import { DocumentQuery } from 'mongoose';
import { ObjectID } from 'mongodb';
import {
    GenContext,
    LibGuardReturnUnion,
    LibValidator,
    LibValidatorReturnUnion
} from '${config.genLibDir || "../../lib/gen"}/types';

import { gen } from '${config.genLibDir || "../../lib/gen"}/core';
                        `,
                        dynamicImports: applyTemplate(dynamicImportsTemplate, {
                            types: [
                                `    ID`,
                                `    ${capitalize(apiName)}Model`,
                                `    ${capitalize(apiName)}CreatePayloadModel`,
                                `    ${capitalize(apiName)}UpdatePayloadModel`,
                                `    ${capitalize(apiName)}QueryObject`,
                                `    ${capitalize(apiName)}ProjectionObject`,
                                `    ${capitalize(apiName)}PopulateObject`,
                            ].join(',\n')
                        }),
                        defaultProjectionObject: applyTemplate(defaultProjectionObjectTemplate, {
                            name: `default${capitalize(apiName)}ProjectionObject`,
                            properties: Object.entries(api.model)
                                .filter(([fieldName, field]) => !(field.guards && field.guards.canSelect && field.guards.canSelect.length))
                                .map(([fieldName, field]) => applyTemplate(defaultProjectionObjectPropertyTemplate, {
                                    name: fieldName,
                                    project: '1 as 0 | 1'
                                }))
                                .join('\n')
                        }),
                        defaultPopulateObject: applyTemplate(defaultPopulateObjectTemplate, {
                            name: `default${capitalize(apiName)}PopulateObject`,
                            properties: Object.entries(api.model)
                                .filter(([fieldName, field]) => typeof((Array.isArray(field.type) ? field.type[0] : field.type)) === 'string'
                                    && !(field.guards && field.guards.canSelect && field.guards.canSelect.length)
                                    && (field.populate || field.populateAll)
                                )
                                .map(([fieldName, field]) => applyTemplate(defaultPopulateObjectPropertyTemplate, {
                                    name: fieldName,
                                    populate: 'true'
                                }))
                                .join('\n')
                        }),
                        
                        
                        runCanSelectGuards: Object.entries(api.model)
                            .filter(([fieldName, field]) => true)
                            .map(([fieldName, field]) => applyTemplate(runCanSelectGuardsTemplate, {
                                name: `runCanSelect${capitalize(apiName)}${capitalize(fieldName)}Guards`,
                                api: apiName,
                                field: fieldName
                            }))
                            .join('\n'),
                        runAllCanSelectGuards: applyTemplate(runAllCanSelectGuardsTemplate, {
                            name: `runAllCanSelect${capitalize(apiName)}Guards`,
                            guards: Object.entries(api.model)
                                .filter(([fieldName, field]) => true)
                                .map(([fieldName, field]) => applyTemplate(runAllCanSelectGuardsGuardTemplate, {
                                    guard: `runCanSelect${capitalize(apiName)}${capitalize(fieldName)}Guards`
                                }))
                                .join('\n')
                        }),
                        runCanCreateGuards: Object.entries(api.model)
                            .filter(([fieldName, field]) => true)
                            .map(([fieldName, field]) => applyTemplate(runCanCreateGuardsTemplate, {
                                name: `runCanCreate${capitalize(apiName)}${capitalize(fieldName)}Guards`,
                                api: apiName,
                                field: fieldName
                            }))
                            .join('\n'),
                        runAllCanCreateGuards: applyTemplate(runAllCanCreateGuardsTemplate, {
                            name: `runAllCanCreate${capitalize(apiName)}Guards`,
                            guards: Object.entries(api.model)
                                .filter(([fieldName, field]) => true)
                                .map(([fieldName, field]) => applyTemplate(runAllCanCreateGuardsGuardTemplate, {
                                    guard: `runCanCreate${capitalize(apiName)}${capitalize(fieldName)}Guards`
                                }))
                                .join('\n')
                        }),
                        runCanUpdateGuards: Object.entries(api.model)
                            .filter(([fieldName, field]) => true)
                            .map(([fieldName, field]) => applyTemplate(runCanUpdateGuardsTemplate, {
                                name: `runCanUpdate${capitalize(apiName)}${capitalize(fieldName)}Guards`,
                                api: apiName,
                                field: fieldName
                            }))
                            .join('\n'),
                        runAllCanUpdateGuards: applyTemplate(runAllCanUpdateGuardsTemplate, {
                            name: `runAllCanUpdate${capitalize(apiName)}Guards`,
                            guards: Object.entries(api.model)
                                .filter(([fieldName, field]) => true)
                                .map(([fieldName, field]) => applyTemplate(runAllCanUpdateGuardsGuardTemplate, {
                                    guard: `runCanUpdate${capitalize(apiName)}${capitalize(fieldName)}Guards`
                                }))
                                .join('\n')
                        }),
                        runValidators: Object.entries(api.model)
                            .filter(([fieldName, field]) => true)
                            .map(([fieldName, field]) => applyTemplate(runValidatorsTemplate, {
                                name: `run${capitalize(apiName)}${capitalize(fieldName)}Validators`,
                                type: stringifyTypeForInterfaceProperty(field.type, false),
                                api: apiName,
                                field: fieldName
                            }))
                            .join('\n'),
                        
                        runAllValidators: applyTemplate(runAllValidatorsTemplate, {
                            name: `runAll${capitalize(apiName)}Validators`,
                            api: apiName
                        }),

                        fieldForCreate: applyTemplate(fieldForCreateTemplate, {
                            name: `fieldForCreate${capitalize(apiName)}`,
                            fields: Object.entries({
                                id: {
                                    type: 'ID',
                                    required: true,
                                } as any,
                                ...api.model
                            })
                            .filter(([fieldName, field]) => !field.guards
                                || !field.guards.canCreate
                                || field.guards.canCreate !== ALWAYS_CANNOT
                            ).map(([fieldName, field]) => `'${fieldName}'`).join(', ')
                        }),
                        fieldForUpdateSet: applyTemplate(fieldForUpdateSetTemplate, {
                            name: `fieldForUpdateSet${capitalize(apiName)}`,
                            fields: Object.entries(api.model)
                                .filter(([fieldName, field]) => !field.guards
                                    || !field.guards.canUpdate
                                    || field.guards.canUpdate !== ALWAYS_CANNOT
                                )
                                .map(([fieldName, field]) => `'${fieldName}'`)
                                .join(', '),
                        }),
                        fieldForUpdatePush: applyTemplate(fieldForUpdatePushTemplate, {
                            name: `fieldForUpdatePush${capitalize(apiName)}`,
                            fields: Object.entries(api.model)
                                .filter(([fieldName, field]) => Array.isArray(field.type) && (!field.guards
                                    || !field.guards.canUpdate
                                    || field.guards.canUpdate !== ALWAYS_CANNOT)
                                )
                                .map(([fieldName, field]) => `'${fieldName}'`)
                                .join(', ')
                        }),
                        fieldForUpdatePull: applyTemplate(fieldForUpdatePullTemplate, {
                            name: `fieldForUpdatePull${capitalize(apiName)}`,
                            fields: Object.entries(api.model)
                                .filter(([fieldName, field]) => Array.isArray(field.type) && (!field.guards
                                    || !field.guards.canUpdate
                                    || field.guards.canUpdate !== ALWAYS_CANNOT)
                                )
                                .map(([fieldName, field]) => `'${fieldName}'`)
                                .join(', ')
                        }),
                        utilityService: applyTemplate(utilityServiceTemplate, {
                            name: `${capitalize(apiName)}UtilityService`,
                            instance: `main${capitalize(apiName)}UtilityService`,
                            modelName: `${capitalize(apiName)}Model`,
                            runAllCanSelectGuards: `runAllCanSelect${capitalize(apiName)}Guards`,
                            runAllCanCreateGuards: `runAllCanCreate${capitalize(apiName)}Guards`,
                            runAllCanUpdateGuards: `runAllCanUpdate${capitalize(apiName)}Guards`,
                            runAllValidators: `runAll${capitalize(apiName)}Validators`,
                            createPayloadModel: `${capitalize(apiName)}CreatePayloadModel`,
                            updatePayloadModel: `${capitalize(apiName)}UpdatePayloadModel`,
                            fieldForCreate: `fieldForCreate${capitalize(apiName)}`,
                            fieldForUpdateSet: `fieldForUpdateSet${capitalize(apiName)}`,
                            fieldForUpdatePush: `fieldForUpdatePush${capitalize(apiName)}`,
                            fieldForUpdatePull: `fieldForUpdatePull${capitalize(apiName)}`,
                            queryObject: `${capitalize(apiName)}QueryObject`,
                            projectionObject: `${capitalize(apiName)}ProjectionObject`,
                            populateObject: `${capitalize(apiName)}PopulateObject`,

                        }),
                        mainService: applyTemplate(mainServiceTemplate, {
                            name: `${capitalize(apiName)}Service`,
                            utilsInstance: `main${capitalize(apiName)}UtilityService`,
                            defaultProjectionObject: `default${capitalize(apiName)}ProjectionObject`,
                            defaultPopulateObject: `default${capitalize(apiName)}PopulateObject`,
                            createPayloadModel: `${capitalize(apiName)}CreatePayloadModel`,
                            updatePayloadModel: `${capitalize(apiName)}UpdatePayloadModel`,
                            instance: `main${capitalize(apiName)}Service`,
                        }),
                        mainMiddlewares: applyTemplate(mainMiddlewaresTemplate, {
                        }),
                        mainControllers: applyTemplate(mainControllersTemplate, {
                            name: `${capitalize(apiName)}Controller`,
                            serviceInstance: `main${capitalize(apiName)}Service`,
                            createPayloadModel: `${capitalize(apiName)}CreatePayloadModel`,
                            updatePayloadModel: `${capitalize(apiName)}UpdatePayloadModel`,
                            instance: `main${capitalize(apiName)}Controller`
                        }),
                        mainRouter: applyTemplate(mainRouterTemplate, {
                            name: `${capitalize(apiName)}Router`,
                            controllerInstance: `main${capitalize(apiName)}Controller`,
                            instance: `main${capitalize(apiName)}Router`,
                            path: `/${apiName}`,
                            webServices: Object.entries({
                                ...api.webServices
                            })
                            .filter(([wsEp, ws]) => /(GET|POST|PUT|DELETE) \/(\w|\/)*/i.test(wsEp) && !ws.skip)
                            .map(([wsEp, ws]) => applyTemplate(mainRouterWebServiceTemplate, {
                                verb: getVerbForRouter(wsEp),
                                path: getPathForRouter(wsEp),
                                middlewares: (getControllerMethodForRouter(wsEp) ? [
                                    `...gen.context.schema.apis.${apiName}.webServices['${wsEp}'].middlewares`,
                                    `this.controller.${getControllerMethodForRouter(wsEp)}()`
                                ] : [`...gen.context.schema.apis.${apiName}.webServices['${wsEp}'].middlewares`]).join(', ')
                            }))
                            .join('\n')
                        }),
                        applyRouter: applyTemplate(applyRouterTemplate, {
                        }),
                    }
                }
            }), {}) as GenGenerated;
        if (write) {
            config.outDir = config.outDir !== undefined ? config.outDir : './src/gen-generated';
            if (!fs.existsSync(config.outDir)) {
                fs.mkdirSync(config.outDir, { mode: 0o755 });
            }
            const outTypescriptTypesPath = `${config.outDir}/types.ts`;
            const outSwaggerPath = `${config.outDir}/swagger.json`;
            const outGraphqlPath = `${config.outDir}/schema.graphql`;
            const types = [];
            Object.entries(apis).forEach(([apiName, api]) => {
                const outTypescriptDir = `${config.outDir}/${apiName}`;
                const outTypescriptPath = `${config.outDir}/${apiName}/${apiName}.ts`;
                types.push(generated[apiName].typescript.types);
                if (!fs.existsSync(outTypescriptDir)) {
                    fs.mkdirSync(outTypescriptDir, { mode: 0o755 });
                }
                fs.writeFileSync(outTypescriptPath, [
                    generated[apiName].typescript.imports,
                    generated[apiName].typescript.dynamicImports,
                    generated[apiName].typescript.fieldForCreate,
                    generated[apiName].typescript.fieldForUpdateSet,
                    generated[apiName].typescript.fieldForUpdatePush,
                    generated[apiName].typescript.fieldForUpdatePull,
                    generated[apiName].typescript.defaultProjectionObject,
                    generated[apiName].typescript.defaultPopulateObject,
                    generated[apiName].typescript.runCanSelectGuards,
                    generated[apiName].typescript.runCanCreateGuards,
                    generated[apiName].typescript.runCanUpdateGuards,
                    generated[apiName].typescript.runValidators,
                    generated[apiName].typescript.runAllCanSelectGuards,
                    generated[apiName].typescript.runAllCanCreateGuards,
                    generated[apiName].typescript.runAllCanUpdateGuards,
                    generated[apiName].typescript.runAllValidators,
                    generated[apiName].typescript.utilityService,
                    generated[apiName].typescript.mainService,
                    generated[apiName].typescript.mainMiddlewares,
                    generated[apiName].typescript.mainControllers,
                    generated[apiName].typescript.mainRouter,
                    generated[apiName].typescript.applyRouter,
                ].join('\n'), { mode: 0o644, flag: 'w' });
            });
            fs.writeFileSync(outTypescriptTypesPath, types.map((type, idx) => [
                idx ? '' : type.imports,
                type.mongooseSchema,
                type.mongooseModel,
                type.mongooseQueryObject,
                type.mongooseProjectionObject,
                type.mongoosePopulateObject,
                type.bddModel,
                type.populatedModel,
                type.createPayloadModel,
                type.updatePayloadModel,
                type.setPayloadModel,
                type.pushPayloadModel,
                type.pullPayloadModel,
            ].join('')).join('\n'), { mode: 0o644, flag: 'w' });
        }
        return generated;
    }
}

export const gen = new GenCore();
