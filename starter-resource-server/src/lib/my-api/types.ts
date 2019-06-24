import { Request, Response, NextFunction } from "express";

export type MyApiAllowedTypeUnion = Boolean | String | Number | Date | Object | string | [Boolean] | [String] | [Number] | [Date] | [Object] | [string];

export type MyApiValidator<T = any> = (input: T) => (null | { [errorName: string]: any });
export type MyApiValidators = MyApiValidator[];
export type MyApiGuard = (ctx: MyApiContext) => (boolean | Promise<boolean>);
export type MyApiGuards = MyApiGuard[];
export type MyApiMiddleware = (ctx: MyApiContext) => (req: Request, res: Response, next: NextFunction) => void;
export type MyApiMiddlewares = { [name: string]: MyApiMiddleware };
export type MyApiExcludes = { [name: string]: boolean };

export interface MyApiContext {
    req: Request;
    res: Response;
    [key: string]: any;
}

export interface MyApiDescriptionAuthConfig {
    jwtSecret: string;
    localFields: [string, string];
}

export interface MyApiDescriptionConfig {
    outDir: string;
    auth: MyApiDescriptionAuthConfig;
}

export interface MyApiDescriptionApiField {
    type: MyApiAllowedTypeUnion;
    required?: boolean;
    unique?: boolean;
    populateAll?: boolean;
    populateOne?: boolean;
    cascade?: boolean;
    reverse?: string[];
    default?: any;
    validators?: MyApiValidators;
    canSelect?: MyApiGuards;
    canCreate?: MyApiGuards;
    canUpdate?: MyApiGuards;
}

export interface MyApiDescriptionApiFields {
    [name: string]: MyApiDescriptionApiField;
}



export interface MyApiDescriptionApiRoute {
    middlewares?: MyApiMiddlewares;
    excludes?: MyApiExcludes;
}

export interface MyApiDescriptionApiRoutes {
    all?: MyApiDescriptionApiRoute;
    queries?: MyApiDescriptionApiRoute;
    mutation?: MyApiDescriptionApiRoute;
    'POST /'?: MyApiDescriptionApiRoute;
    'GET /'?: MyApiDescriptionApiRoute;
    'GET /:id'?: MyApiDescriptionApiRoute;
    'PUT /:id'?: MyApiDescriptionApiRoute;
    'DELETE /:id'?: MyApiDescriptionApiRoute;
    [routePattern: string]: MyApiDescriptionApiRoute;
}

export interface MyApiDescriptionApi {
    fields: MyApiDescriptionApiFields;
    routes?: MyApiDescriptionApiRoutes;
}

export interface MyApiDescriptionApis {
    [name: string]: MyApiDescriptionApi;
}

export interface MyApiDescription {
    config: MyApiDescriptionConfig;
    apis: MyApiDescriptionApis;
}
