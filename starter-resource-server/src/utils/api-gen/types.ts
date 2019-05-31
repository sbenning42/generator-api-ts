import { Schema } from 'mongoose';
import { Request, Response } from 'express';

export const Mixed = Schema.Types.Mixed;
export const ObjectId = Schema.Types.ObjectId;

/***************************************** Client API **************************************************/

export interface APISchemaAuthConfig {
    secret: string;
    defaultScopes?: boolean;
}

export interface APISchemaConfig {
    outDir: string;
    auth?: APISchemaAuthConfig;
    backupOutDir?: string;
}

export type APISchemaEntityPropertyType = Boolean | Number | String | Date | Object | string;

export interface APISchemaEntityPropertyTyped {
    type: APISchemaEntityPropertyType,
    required?: boolean,
    unique?: boolean,
    hidden?: boolean,
    default?: any,
    skipCreate?: boolean,
    skipChanges?: boolean,
}

export type APISchemaEntityPropertyObj = APISchemaEntityPropertyTyped | APISchemaEntityPropertyType;
export type APISchemaEntityPropertyArr = [APISchemaEntityPropertyTyped] | [APISchemaEntityPropertyType];
export type APISchemaEntityProperty = APISchemaEntityPropertyObj | APISchemaEntityPropertyArr;

export interface APISchemaEntityRouteAuth {
    private?: boolean;
    roles?: string[];
    scopes?: string[];
}

export interface APISchemaEntityRoute {
    skip?: boolean;
    auth?: APISchemaEntityRouteAuth;
    middlewares?: string[];
}

export interface APISchemaEntityProperties {
    [key: string]: APISchemaEntityProperty;
}

export type APISchemaEntityRoutes<R extends string[] = []> = {
    all?: APISchemaEntityRoute;
    query?: APISchemaEntityRoute;
    mutation?: APISchemaEntityRoute;
    'GET /'?: APISchemaEntityRoute;
    'POST /'?: APISchemaEntityRoute;
    'GET /:id'?: APISchemaEntityRoute;
    'PUT /:id'?: APISchemaEntityRoute;
    'DELETE /:id'?: APISchemaEntityRoute;
} & {
    [key in keyof R[number]]?: APISchemaEntityRoute;
}

export interface APISchemaEntityWithRoutes<R extends string[] = []> {
    properties: APISchemaEntityProperties;
    routes?: APISchemaEntityRoutes<R>;
}

export type APISchemaEntity<R extends string[] = []> = APISchemaEntityWithRoutes<R> | APISchemaEntityProperties;

export interface APISchemaEntities<RS extends { [key: string]: string[] } = {}> {
    [key: string]: APISchemaEntity<RS[string]>;
}

export interface APISchema<RS extends { [key: string]: string[] } = {}> {
    config: APISchemaConfig;
    entities: APISchemaEntities<RS>;
    context?: any | ((context: { req: Request, res: Response }) => any);
}


/************************************** Strict *****************************************************/

/**
 * Strict section is just a way to apply default values to missing fields from schema.
 *  
 */

export interface _APISchemaAuthConfig {
    secret: string;
    defaultScopes: boolean;
}

export function strictAPISchemaAuthConfig(config: APISchemaAuthConfig): _APISchemaAuthConfig {
    return {
        secret: config && config.secret !== undefined
            ? config.secret
            : 'secret',
        defaultScopes: config && config.defaultScopes !== undefined
            ? config.defaultScopes
            : false,
    };
}

export interface _APISchemaConfig {
    outDir: string;
    auth: _APISchemaAuthConfig;
    backupOutDir: string;
}

export function strictAPISchemaConfig(config: APISchemaConfig): _APISchemaConfig {
    return {
        outDir: config.outDir,
        backupOutDir: config.backupOutDir !== undefined
            ? config.backupOutDir
            : undefined,
        auth: strictAPISchemaAuthConfig(config.auth),
    };
}

export type _APISchemaEntityPropertyType = Boolean|Number|String|Date|typeof Mixed|typeof ObjectId;

export interface _APISchemaEntityPropertyTyped {
    type: _APISchemaEntityPropertyType,
    required: boolean,
    unique: boolean,
    hidden: boolean,
    skipCreate: boolean,
    skipChanges: boolean,
    default?: any,
    ref?: any,
}

export type _APISchemaEntityProperty = _APISchemaEntityPropertyTyped | [_APISchemaEntityPropertyTyped];

export function strictAPISchemaEntityProperty(_prop: APISchemaEntityProperty): _APISchemaEntityProperty {
    const isArray = Array.isArray(_prop);
    const untypedProp = isArray ? _prop[0] : _prop;
    const prop = untypedProp['type'] !== undefined ? untypedProp : { type: untypedProp };
    let type: _APISchemaEntityPropertyType;
    let ref: string;
    switch (true) {
        case prop.type === Boolean:
        case prop.type === Number:
        case prop.type === String:
        case prop.type === Date:
            type = prop.type;
            break;
        case prop.type === Object:
            type = Mixed;
            break;
        case typeof(prop.type) === 'string':
            type = ObjectId;
            ref = prop.type;
            break
        default:
            let json: string;
            try { json = JSON.stringify(prop.type) } catch(e) { json = prop.type }
            throw new Error(`Do no know type: ${json} (${prop.type})`)
    }
    const strictProp = {
        type, ref,
        required: prop.required !== undefined ? prop.required : false,
        hidden: prop.hidden !== undefined ? prop.hidden : false,
        unique: prop.unique !== undefined ? prop.unique : false,
        skipCreate: prop.skipCreate !== undefined ? prop.skipCreate : false, // (ref ? true : false),
        skipChanges: prop.skipChanges !== undefined ? prop.skipChanges : false, // (ref ? true : false),
        default: prop.default !== undefined ? prop.default : undefined,
    };
    return isArray ? [strictProp] : strictProp;
}

export interface _APISchemaEntityRouteAuth {
    private: boolean;
    roles: string[];
    scopes: string[];
}

export function strictAPISchemaEntityRouteAuth(auth: APISchemaEntityRouteAuth): _APISchemaEntityRouteAuth {
    return {
        private: auth && auth.private !== undefined ? auth.private : false,
        roles: auth && auth.roles !== undefined ? auth.roles : [],
        scopes: auth && auth.scopes !== undefined ? auth.scopes : [],
    };
} 

export interface _APISchemaEntityRoute {
    skip: boolean;
    auth: _APISchemaEntityRouteAuth;
    middlewares: string[];
}

export function strictAPISchemaEntityRoute(route: APISchemaEntityRoute): _APISchemaEntityRoute {
    return {
        skip: route && route.skip !== undefined ? route.skip : false,
        middlewares: route && route.middlewares !== undefined ? route.middlewares : [],
        auth: strictAPISchemaEntityRouteAuth(route && route.auth),
    };
}

export interface _APISchemaEntityProperties {
    [key: string]: _APISchemaEntityProperty;
}

export function strictAPISchemaEntityProperties(properties: APISchemaEntityProperties): _APISchemaEntityProperties {
    return Object.entries(properties || {}).reduce<_APISchemaEntityProperties>((props, [key, property]) => ({
        ...props,
        [key]: strictAPISchemaEntityProperty(property),
    }), {});
}

export type _APISchemaEntityRoutes<R extends string[] = []> = {
    all: _APISchemaEntityRoute;
    query: _APISchemaEntityRoute;
    mutation: _APISchemaEntityRoute;
    'GET /': _APISchemaEntityRoute;
    'POST /': _APISchemaEntityRoute;
    'GET /:id': _APISchemaEntityRoute;
    'PUT /:id': _APISchemaEntityRoute;
    'DELETE /:id': _APISchemaEntityRoute;
} & {
    [key in keyof R[number]]: _APISchemaEntityRoute;
}

export function strictAPISchemaEntityRoutes<R extends string[]>(routes: APISchemaEntityRoutes<R>): _APISchemaEntityRoutes<R> {
    return Object.entries(routes || {}).reduce<_APISchemaEntityRoutes<R>>((thisRoutes, [endpoint, route]) => ({
        ...thisRoutes,
        [endpoint]: strictAPISchemaEntityRoute(route),
    }), {
        all: strictAPISchemaEntityRoute(routes && routes.all),
        query: strictAPISchemaEntityRoute(routes && routes.query),
        mutation: strictAPISchemaEntityRoute(routes && routes.mutation),
        'GET /': strictAPISchemaEntityRoute(routes && routes['GET /']),
        'POST /': strictAPISchemaEntityRoute(routes && routes['POST /']),
        'GET /:id': strictAPISchemaEntityRoute(routes && routes['GET /:id']),
        'PUT /:id': strictAPISchemaEntityRoute(routes && routes['PUT /:id']),
        'DELETE /:id': strictAPISchemaEntityRoute(routes && routes['DELETE /:id']),
        ...({} as { [key in keyof R[number]]: _APISchemaEntityRoute }) /** @todo: apply custom routes definition (eg: not `{}`) */
    });
}

export interface _APISchemaEntity<R extends string[] = []> {
    name: string
    properties: _APISchemaEntityProperties;
    routes: _APISchemaEntityRoutes<R>;
}

export function strictAPISchemaEntity<R extends string[]>(name: string, _entity: APISchemaEntity<R>): _APISchemaEntity<R> {
    const entity = (_entity && (_entity['properties'] !== undefined || _entity['routes'] !== undefined) ? _entity : { properties: _entity }) as APISchemaEntityWithRoutes<R>;
    return {
        name,
        properties: strictAPISchemaEntityProperties(entity.properties),
        routes: strictAPISchemaEntityRoutes<R>(entity.routes),
    };
}

export interface _APISchemaEntities<RS extends { [key: string]: string[] } = {}> {
    [key: string]: _APISchemaEntity<RS[string]>;
}

export function strictAPISchemaEntities<RS extends { [key: string]: string[] }>(entities: APISchemaEntities<RS>): _APISchemaEntities<RS> {
    return Object.entries(entities || {}).reduce<_APISchemaEntities<RS>>((ents, [key, entity]) => ({
        ...ents,
        [key]: strictAPISchemaEntity<RS[string]>(key, entity),
    }), {});
}

export interface _APISchema<RS extends { [key: string]: string[] } = {}> {
    config: _APISchemaConfig;
    entities: _APISchemaEntities<RS>;
    context: (context: { req: Request, res: Response }) => any;
}

export function strictAPISchema<RS extends { [key: string]: string[] }>(schema: APISchema<RS>): _APISchema<RS> {
    return {
        config: strictAPISchemaConfig(schema && schema.config),
        entities: strictAPISchemaEntities<RS>(schema && schema.entities),
        context: schema.context !== undefined
            ? (
                typeof(schema.context) === 'function'
                    ? schema.context
                    : () => schema.context
            )
            : () => ({}),
    };
}
