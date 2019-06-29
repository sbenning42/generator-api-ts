import { Request, Response, NextFunction } from "express";

export type LibMiddleware = (req: Request, res: Response, next: NextFunction) => void;
export type LibMiddlewareFactory = (...args: any[]) => LibMiddleware;
export type LibMiddlewareOrFactoryUnion = LibMiddlewareFactory | LibMiddleware;

export type LibGuardError = { [name: string]: any };
export type LibGuardReturnUnion = LibGuardError | null;
export type LibGuard = (context: GenContext) => Promise<LibGuardReturnUnion>;

export type LibValidatorError = { [name: string]: any };
export type LibValidatorReturnUnion = LibValidatorError | null;
export type LibValidator<T = any> = (input: T) => LibValidatorReturnUnion;

export interface CustomGenContext {
    [key: string]: any;
}
export const P = <T>(input: T) => Promise.resolve(input);

export const CAN = () => P(null);
export const ALWAYS_CAN = [() => P(null)];
export const CANNOT = () => P({});
export const ALWAYS_CANNOT = [() => P({})];

export interface LibGenContext {
    guards: {
        can: LibGuard;
        cannot: LibGuard;
        alwaysCan: LibGuard[];
        alwaysCannot: LibGuard[];
    };
    validators: {};
    middlewares: {
        jwt: LibMiddleware;
        hasRole: LibMiddlewareFactory;
        iOwn: LibMiddlewareFactory;
    };
}
export type GenContext = CustomGenContext & { lib: LibGenContext };

export type GenTypeUnion = Boolean | String | Number | Date | Object | string | [Boolean] | [String] | [Number] | [Date] | [Object] | [string];

export type GenSchema = {
    config: {
        jwtSecret: string;
        passportFields?: [string, string?];
        iAmModelName?: string;
        outDir?: string;
        genLibModulePath?: string;
        contextName?: string;
        contextPath?: string;
    };
    apis: {
        [api: string]: {
            config?: {
                ownerFieldName?: string;
            },
            model: {
                all?: {
                    required?: boolean;
                    unique?: boolean;
                    validators?: {
                        [name: string]: LibValidator;
                    };
                    guards?: {
                        canSelect?: LibGuard[];
                        canCreate?: LibGuard[];
                        canUpdate?: LibGuard[];
                    };
                    populate?: boolean;
                    populateAll?: boolean;
                    reverse?: string;
                };
            } & {
                [field: string]: {
                    type: GenTypeUnion;
                    required?: boolean;
                    unique?: boolean;
                    default?: any;
                    validators?: {
                        [name: string]: LibValidator;
                    };
                    guards?: {
                        canSelect?: LibGuard[];
                        canCreate?: LibGuard[];
                        canUpdate?: LibGuard[];
                    };
                    populate?: boolean;
                    populateAll?: boolean;
                    reverse?: string[];
                }
            };
            webServices: {
                all?: {
                    middlewares?: LibMiddlewareOrFactoryUnion[];
                    skip?: boolean;
                };
                queries?: {
                    middlewares?: LibMiddlewareOrFactoryUnion[];
                    excludes?: { [idx: number]: boolean };
                    skip?: boolean;
                };
                query?: {
                    middlewares?: LibMiddlewareOrFactoryUnion[];
                    excludes?: { [idx: number]: boolean };
                    skip?: boolean;
                };
                mutation?: {
                    middlewares?: LibMiddlewareOrFactoryUnion[];
                    excludes?: { [idx: number]: boolean };
                    skip?: boolean;
                };
            } & {
                'GET /'?: {
                    middlewares?: LibMiddlewareOrFactoryUnion[];
                    excludes?: { [idx: number]: boolean };
                    skip?: boolean;
                },
                'POST /'?: {
                    middlewares?: LibMiddlewareOrFactoryUnion[];
                    excludes?: { [idx: number]: boolean };
                    skip?: boolean;
                },
                'GET /:id'?: {
                    middlewares?: LibMiddlewareOrFactoryUnion[];
                    excludes?: { [idx: number]: boolean };
                    skip?: boolean;
                },
                'PUT /:id'?: {
                    middlewares?: LibMiddlewareOrFactoryUnion[];
                    excludes?: { [idx: number]: boolean };
                    skip?: boolean;
                },
                'DELETE /:id'?: {
                    middlewares?: LibMiddlewareOrFactoryUnion[];
                    excludes?: { [idx: number]: boolean };
                    skip?: boolean;
                },
                [endpointPattern: string]: {
                    middlewares?: LibMiddlewareOrFactoryUnion[];
                    excludes?: { [idx: number]: boolean };
                    skip?: boolean;
                }
            };
        }
    }
};

export type GenGenerated = {
    [apiName: string]: {
        typescript: {
            types: {
                imports: string;
                mongooseSchema: string;
                mongooseModel: string;
                mongooseQueryObject: string;
                mongooseProjectionObject: string;
                mongoosePopulateObject: string;
                bddModel: string;
                populatedModel: string;
                createPayloadModel: string;
                updatePayloadModel: string;
                setPayloadModel: string;
                pushPayloadModel: string;
                pullPayloadModel: string;
            };
            imports: string;
            dynamicImports: string;
            defaultProjectionObject: string;
            defaultPopulateObject: string;
            fieldForCreate: string;
            fieldForUpdateSet: string;
            fieldForUpdatePush: string;
            fieldForUpdatePull: string;
            runCanSelectGuards: string;
            runCanCreateGuards: string;
            runCanUpdateGuards: string;
            runAllCanSelectGuards: string;
            runAllCanCreateGuards: string;
            runAllCanUpdateGuards: string;
            runValidators: string;
            runAllValidators: string;
            utilityService: string;
            mainService: string;
            mainMiddlewares: string;
            mainControllers: string;
            mainRouter: string;
            applyRouter: string;
        }
        swagger: {
            infos: string;
            security: string;
            definitions: string;
            paths: string;
        };
        graphql: {
            types: {
                mongooseQueryObject: string;
                mongooseProjectionObject: string;
                mongoosePopulateObject: string;
                bddModel: string;
                populatedModel: string;
                createPayloadModel: string;
                updatePayloadModel: string;
                setPayloadModel: string;
                pushPayloadModel: string;
                pullPayloadModel: string;
            };
            inputs: {
                mongooseQueryObject: string;
                mongooseProjectionObject: string;
                mongoosePopulateObject: string;
                bddModel: string;
                populatedModel: string;
                createPayloadModel: string;
                updatePayloadModel: string;
                setPayloadModel: string;
                pushPayloadModel: string;
                pullPayloadModel: string;
            };
            Query: {};
            Mutation: {};
        };
    };
};