import { MyApiAllowedTypeUnion } from "./types";

/**
 * Pour chaque entité:
 *
 * - model sans relation
 * - model avec relation
 * - payload de creation
 * - payload d'update
 * - payload d'update $set
 * - payload d'update $push
 * - payload d'update $pull
 * - schema + model mongoose
 *
 * - equivalent swagger for all
 * - equivalent graphql type for all
 * - equivalent graphql input for all
 *
 * - une function par guard du model (field level)
 * - une function pour tous les guards du model
 *
 * - une function par validator du model (field level)
 * - une function pour tous les validators du model
 *
 * - une function par middleware du model (route level)
 * - une function pour tous les middleware du model
 *
 */

export const apply = (tpl: string, args: { [name: string]: string }) => Object.entries(args)
    .reduce(
        (stepTpl: string, [key, value]) => stepTpl.replace(new RegExp(`\\\$${key}`, 'g'), value),
        tpl,
    );


export const _interfaceTPL = `
export interface $name {
$properties
}
`;
export const _interfacePropertyTPL = `    $name$required: $type$isArray;`;

export const _classTPL = `
export class $name {
$properties
$methods
}
`;
export const _classPropertyTPL = `    $name$required: $type$isArray = $value;`;
export const _classMethodTPL = `
    $name(
$arguments
    ) {
$implementation
    }
`;

export const _mongooseSchemaTPL = `
export const $name = new mongoose.Schema({
$properties
}, {
    minimize: false,
    timestamps: true,
});
`;
export const mongooseSchemaTPL = (args: { name: string, properties: string }) => apply(_mongooseSchemaTPL, args);

export const _mongooseSchemaPropertyTPL = `
    $name: {
        type: $type,
        required: $required,
        unique: $unique,
        select: $select,
        default: $default,
    },`;
export const _mongooseSchemaPropertyRefTPL = `
    $name: {
        type: $type,
        required: $required,
        unique: $unique,
        select: $select,
        default: $default,
        ref: $ref,
    },`;
export const mongooseSchemaPropertyTPL = (args: {
    name: string,
    type: string,
    required?: boolean,
    unique?: boolean,
    select?: boolean,
    default?: string,
}) => apply(_mongooseSchemaPropertyTPL, {
    name: args.name,
    type: args.type,
    required: args.required ? 'true' : 'false',
    unique: args.unique ? 'true' : 'false',
    select: args.select ? 'true' : 'false',
    default: args.default,
});
export const mongooseSchemaPropertyRefTPL = (args: {
    name: string,
    type: string,
    ref: string,
    required?: boolean,
    unique?: boolean,
    select?: boolean,
    default?: string,
}) => apply(_mongooseSchemaPropertyRefTPL, {
    name: args.name,
    type: args.type,
    required: args.required ? 'true' : 'false',
    unique: args.unique ? 'true' : 'false',
    select: args.select ? 'true' : 'false',
    default: args.default,
    ref: args.ref
});

export const _mongooseModelTPL = `
export const $modelName = mongoose.model('$name', $schemaName);
`;
export const mongooseModelTPL = (args: { name: string, modelName: string, schemaName: string }) => apply(_mongooseModelTPL, args);

export const _swaggerDefinitionsTPL = `    "definitions": {
$definitions
    }`;

export const _swaggerObjectDefinitionTPL = `        "$name": {
            "type": "object",
            "properties": {
$properties
            }
        }`;

export const _swaggerObjectPropertyDefinitionTPL = `                "$name": {
                    "type": "$type"
                }`;

export const _swaggerObjectPropertyArrayDefinitionTPL = `               "$name": {
                    "type": "array",
                    "items": {
                        "type": "$type"
                    }
                }`;

export const _swaggerObjectPropertyRefDefinitionTPL = `                "$name": {
                    "$ref": "#/definitions/$type"
                }`;

export const _swaggerObjectPropertyRefArrayDefinitionTPL = `                "$name": {
                    "type": "array",
                    "items": {
                        "$ref": "#/definitions/$type"
                    }
                }`;

export const interfacePropertyTPL = (args: { name: string, required: boolean, type: string, isArray: boolean }) => apply(
    _interfacePropertyTPL,
    {
        name: args.name,
        type: args.type,
        required: args.required ? '' : '?',
        isArray: args.isArray ? '[]' : '',
    }
);
export const interfaceTPL = (args: { name: string, properties: string }) => apply(_interfaceTPL, args);

export const classPropertyTPL = (args: { name: string, required: boolean, type: string, isArray: boolean, value: string }) => apply(
    _classPropertyTPL,
    {
        name: args.name,
        type: args.type,
        value: args.value,
        required: args.required ? '' : '?',
        isArray: args.isArray ? '[]' : '',
    }
);
export const classTPL = (args: { name: string, properties: string, methods: string }) => apply(_classMethodTPL, args);

export const swaggerDefinitionsTPL = (args: { definitions: string }) => apply(_swaggerDefinitionsTPL, args);
export const swaggerObjectDefinitionTPL = (args: { name: string, properties: string }) => apply(_swaggerObjectDefinitionTPL, args);
export const swaggerObjectPropertyDefinitionTPL = (args: { name: string, type: string }) => apply(_swaggerObjectPropertyDefinitionTPL, args);
export const swaggerObjectPropertyArrayDefinitionTPL = (args: { name: string, type: string }) => apply(_swaggerObjectPropertyArrayDefinitionTPL, args);
export const swaggerObjectPropertyRefDefinitionTPL = (args: { name: string, type: string }) => apply(_swaggerObjectPropertyRefDefinitionTPL, args);
export const swaggerObjectPropertyRefArrayDefinitionTPL = (args: { name: string, type: string }) => apply(_swaggerObjectPropertyRefArrayDefinitionTPL, args);

export const capitalize = (s: string) => `${s.slice(0, 1).toLocaleUpperCase()}${s.slice(1)}`;

export const stringifyTypeForTS = (_type: MyApiAllowedTypeUnion) => {
    let type: MyApiAllowedTypeUnion = _type;
    let isArray: boolean = false;
    let isRelation: boolean = false;
    if (Array.isArray(_type)) {
        type = _type[0];
        isArray = true;
    } else if (typeof(_type) === 'string') {
        if (_type.includes('[')) {
            type = _type.replace('[', '').replace(']', '');
            isArray = true;
        }
        isRelation = true;
    }
    switch (true) {
        case type === Boolean:
            return `boolean${isArray ? '[]' : ''}`;
        case type === String:
            return `string${isArray ? '[]' : ''}`;
        case type === Number:
            return `number${isArray ? '[]' : ''}`;
        case type === Date:
            return `Date${isArray ? '[]' : ''}`;
        case type === Object:
            return `any${isArray ? '[]' : ''}`;
        case isRelation:
            return `${type}${isArray ? '[]' : ''}`;
        default:
            throw new Error(`stringifyTypeForTSInterface: Do not know type ${type}`);
    }
};

export const stringifyTypeForMongoose = (_type: MyApiAllowedTypeUnion) => {
    let type: MyApiAllowedTypeUnion = _type;
    let isArray: boolean = false;
    let isRelation: boolean = false;
    if (Array.isArray(_type)) {
        type = _type[0];
        isArray = true;
    } else if (typeof(_type) === 'string') {
        if (_type.includes('[')) {
            type = _type.replace('[', '').replace(']', '');
            isArray = true;
        }
        isRelation = true;
    }
    switch (true) {
        case type === Boolean:
            return `boolean${isArray ? '[]' : ''}`;
        case type === String:
            return `string${isArray ? '[]' : ''}`;
        case type === Number:
            return `number${isArray ? '[]' : ''}`;
        case type === Date:
            return `Date${isArray ? '[]' : ''}`;
        case type === Object:
            return `any${isArray ? '[]' : ''}`;
        case isRelation:
            return `${type}${isArray ? '[]' : ''}`;
        default:
            throw new Error(`stringifyTypeForTSInterface: Do not know type ${type}`);
    }
};

export const stringifyTypeForSwagger = (_type: MyApiAllowedTypeUnion) => {
    let type: MyApiAllowedTypeUnion = _type;
    let isRelation: boolean = false;
    if (Array.isArray(_type)) {
        type = _type[0];
    } else if (typeof(_type) === 'string') {
        if (_type.includes('[')) {
            type = _type.replace('[', '').replace(']', '');
        }
        isRelation = true;
    }
    switch (true) {
        case type === Boolean:
            return `boolean`;
        case type === String:
            return `string`;
        case type === Number:
            return `number`;
        case type === Date:
            return `object`;
        case type === Object:
            return `object`;
        case isRelation:
            return `${type}`;
        default:
            throw new Error(`stringifyTypeForTSInterface: Do not know type ${type}`);
    }
};

export const stringifyDefaultForMongoose = (_default: any) => {
    return ``;
};