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
import { filter } from 'bluebird';

export const applyTemplate = <A extends { [key: string]: string }>(template: string, args: A) => Object.entries(args || {})
    .reduce((steps, [key, value]) => steps.replace(new RegExp(`\\\$${key}`, 'g'), value), template);

export const capitalize = (s: string) => `${s.slice(0, 1).toLocaleUpperCase()}${s.slice(1)}`;

export const mongooseSchemaTemplate = `
export const $name = new mongoose.Schema({
$properties
}, { minimize: false, timestamps: true })
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


export const runGuardsTemplate = `
export const $name = (context: GenContext) => {
    const guards = context.schema.$path;
    return Promise.all(guards.map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = resutl;
                } else if (result) {
                    step = { ...step, ...result };
                }
            }
            return step;
        }, null))
        .catch((error: any) => ({ topLevel: 'An error occured' }));
};
`;
export const runCanCreateGuardsTemplate = `
export const $name = (context: GenContext) => {
    const guards = context.schema.$path;
    return Promise.all(guards.map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = resutl;
                } else if (result) {
                    step = { ...step, ...result };
                }
            }
            return step;
        }, null))
        .catch((error: any) => ({ topLevel: 'An error occured' }))
};
`;
export const runCanUpdateGuardsTemplate = `
export const $name = (context: GenContext) => {
    const guards = context.schema.$path;
    return Promise.all(guards.map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = resutl;
                } else if (result) {
                    step = { ...step, ...result };
                }
            }
            return step;
        }, null))
        .catch((error: any) => ({ topLevel: 'An error occured' }))
};
`;
export const runValidatorsTemplate = `
export const $name = (input: $type) => {
    const validators = context.schema.$path.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = validator(input);
        if (step || validate) {
            if (!step) {
                step = validate;
            } else if (validate) {
                step = { ...step, ...validate };
            }
        }
    }, null);
};
`;
export const utilityServiceTemplate = `
export class $name {

    model = $modelName;

    constructor() {
    }

    find(
        mongooseQueryObject: $queryObject,
        mongooseProjectionObject: $projectionObject,
        mongoosePopulateObject: $populateObject,
        mongooseQueryOptions: any,
    ) {
        return this.model.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongoosePopulateObject,
            mongooseQueryOptions
        );
    }

    create(
        createPayload: $createPayloadModel,
        mongooseProjectionObject: $projectionObject,
        mongoosePopulateObject: $populateObject,
    ) {

    }

    update() {
    }

    delete() {
    }

    findLean() {
        return this.find().lean();
    }

    createLean() {
        return this.create().lean();
    }

    updateLean() {
        return this.update().lean();
    }

    deleteLean() {
        return this.delete().lean();
    }

    findExec() {
        return this.find().exec();
    }

    createExec() {
        return this.create().exec();
    }

    updateExec() {
        return this.update().exec();
    }

    deleteExec() {
        return this.delete().exec();
    }

    findLeanExec() {
        return this.findLean().exec();
    }

    createLeanExec() {
        return this.createLean().exec();
    }

    updateLeanExec() {
        return this.updateLean().exec();
    }

    deleteLeanExec() {
        return this.deleteLean().exec();
    }
}
`;

export const mainServiceTemplate = `
`;

export const mainMiddlewaresTemplate = `
`;

export const mainControllersTemplate = `
`;

export const mainRouterTemplate = `
`;

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
                jwt: mainPassportService.jwt,
                hasRole: mainPassportService.hasRole,
                iOwn: mainPassportService.owner,
            },
        }
    };

    generate({ config, apis }: GenSchema): GenGenerated {
        const generated = Object.entries(apis)
            .reduce((steps, [apiName, api]) => ({
                ...steps,
                [apiName]: {
                    typescript: {
                        types: {
                            imports: `
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';

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
                        defaultProjectionObject: applyTemplate(defaultProjectionObjectTemplate, {
                            name: `Default${capitalize(apiName)}ProjectionObject`,
                            properties: Object.entries(api.model)
                                .filter(([fieldName, field]) => !(field.guards && field.guards.canSelect && field.guards.canSelect.length))
                                .map(([fieldName, field]) => applyTemplate(defaultProjectionObjectPropertyTemplate, {
                                    name: fieldName,
                                    project: '1'
                                }))
                                .join('\n')
                        }),
                        defaultPopulateObject: applyTemplate(defaultPopulateObjectTemplate, {
                            name: `Default${capitalize(apiName)}PopulateObject`,
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
                        
                        runCanSelectGuards: '',
                        runCanCreateGuards: '',
                        runCanUpdateGuards: '',
                        runValidators: '',
                        utilityService: applyTemplate(utilityServiceTemplate, {

                        }),
                        mainService: applyTemplate(mainServiceTemplate, {
                        }),
                        mainMiddlewares: applyTemplate(mainMiddlewaresTemplate, {
                        }),
                        mainControllers: applyTemplate(mainControllersTemplate, {
                        }),
                        mainRouter: applyTemplate(mainRouterTemplate, {
                        }),
                        applyRouter: applyTemplate(applyRouterTemplate, {
                        }),
                    }
                }
            }), {}) as GenGenerated;
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
                generated[apiName].typescript.defaultProjectionObject,
                generated[apiName].typescript.defaultPopulateObject,
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
        return generated;
    }
}