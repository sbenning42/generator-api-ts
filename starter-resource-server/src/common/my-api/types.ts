import { Request, Response, NextFunction } from 'express';

/**
 * Union of all accepted types
 * 
 * `Object` type is coerced to `any` in typescript types, to `object` in swagger and to `JSON` in graphql schema.
 * `Date` type is coerced to `Date` in typescript types, to `date` in swagger and to `DateTime` in graphql schema.
 * `MyTypeFunction` type is not register in the `mongoose.Schema`. It is coerced to it's return value, and added to the entity on read operations.
 */
export type MyTypeUnion = Boolean|String|Number|Date|Object|string|[Boolean]|[String]|[Number]|[Date]|[Object]|[string]|MyTypeFunction;
/**
 * `MyTypeFunction` is used to compute non-persistent fields before reading
 * 
 * @param instance the entity instance on witch we want to compute the field
 */
export type MyTypeFunction = (instance: any) => MyTypeUnion;
/**
 * `MyValidator` is used to validate some client-side input data before creating or updating the entity
 * 
 * @param input the client-side input data to validate
 */
export type MyValidator<T extends MyTypeUnion = MyTypeUnion> = (input: T) => null|any|Promise<null>|Promise<any>;

/**
 * Middlewares Store used to communicate data uppon nexted function's call
 */
export interface MyContext {
    /**
     * Express Request object
     */
    req: Request;
    /**
     * Express Response object
     */
    res: Response;
    /**
     * the Store dictionnary
     */
    [key: string]: any;
}

/**
 * Metadata about a `MyField` instance
 */
export interface _MyFieldAttributes {
    required: boolean;
    unique: boolean;
    select: boolean;
    isArray: boolean;
    isRelated: boolean;
    /**
     * Special knd of validators / middlewares
     * They are used to define if a given `MyContext` instance is allowed to perform the operation
     */
    can: {
        read: _MyCanType;
        create: _MyCanType;
        update: _MyCanType;
    }
}
export type _MyCanType = (ctx: MyContext) => (boolean|Promise<boolean>);

export interface MyFieldAttributes {
    required?: boolean;
    unique?: boolean;
    select?: boolean;
    isArray?: boolean;
    isRelated?: boolean;
    can?: MyCanType;
}
export type MyCanType = _MyCanType|{
    read?: _MyCanType;
    create?: _MyCanType;
    update?: _MyCanType;
};

/**
 * Metadata about a property of an entity
 */
export interface _MyField {
    name: string;
    parent: string;
    type: MyTypeUnion;
    returnType?: string;
    validators: MyValidator[];
    /**
     * The default value to give to a field
     */
    default: MyDefaultTypeUnion;
    attributes: _MyFieldAttributes;
    /**
     * When `true` with a relational field
     * The relation is linked to it's counterpart in the second entity
     */
    autoReverse?: boolean;
}

/**
 * The default value can either be synchronously defined or sync/async computed based on the `MyContext` instance.
 * Can be useful if the default value is related to the anthentified user perfoming the request.
 */
export type MyDefaultTypeUnion = MyTypeUnion|((ctx: MyContext) => MyTypeUnion|Promise<MyTypeUnion>);

export type MyField = MyTypeUnion|{
    name?: string;
    type: MyTypeUnion;
    returnType?: string;
    validators?: MyValidator[];
    /**
     * The default value to give to a field
     */
    default?: MyDefaultTypeUnion;
    /**
     * When `true` with a relational field
     * The relation is linked to it's counterpart in the second entity
     * @link `./test.ts`@`test`@`schema.entities.user.fields.todos.attributes.can` comment block
     */
    autoReverse?: boolean;
    attributes?: MyFieldAttributes;
}

export type MyMiddleware = (req: Request, res: Response, next: NextFunction) => void;
export type MyController = (req: Request, res: Response) => void;

export interface _MyService {
    base: string;
    endpoint: string;
    verb: string;
    middlewares: string[];
    exclude: boolean;
    swaggerParameters: string;
    swaggerResponses: string;
    grapgqlParameters: string;
    grapgqlResponse: string;
    can: _MyCanType;
}
export interface _MyServices {
    readAll: _MyService;
    readOne: _MyService;
    create: _MyService;
    update: _MyService;
    delete: _MyService;
    [name: string]: _MyService;
}

export interface MyService {
    base?: string;
    endpoint?: string;
    middlewares?: string[];
    exclude?: boolean;
    excludeMiddlewares?: string[];
    swaggerParameters?: string;
    swaggerResponses?: string;
    grapgqlParameters?: string;
    grapgqlResponse?: string;
    can?: _MyCanType; 
}

export interface MyServices {
    all?: MyService;
    query?: MyService;
    mutation?: MyService;
    readAll?: MyService;
    readOne?: MyService;
    create?: MyService;
    update?: MyService;
    delete?: MyService;
    [name: string]: MyService;
}

export interface _MyFields {
    [name: string]: _MyField;
}

export interface MyFields {
    [name: string]: MyField;
}

export interface _MyEntity {
    name: string;
    fields: _MyFields;
    services: _MyServices;
}

export interface MyEntity {
    name?: string;
    fields: MyFields;
    services?: MyServices;
}

export interface _MyEntities {
    [name: string]: _MyEntity;
}

export interface MyEntities {
    [name: string]: MyEntity;
}

export interface _MySchema {
    config: any;
    entities: _MyEntities;
}

export interface MySchema {
    config: any;
    entities: MyEntities;
}


/** Augmented */


export interface MyAugmentedField {
    TS: {
        type: string;
        populatedType: string;
        create: string;
        update: string;
        iterable: string;
        canRead: string;
        canCreate: string;
        canUpdate: string;
    };
    GQL: {
        type: string;
        input: string;
        createInput: string;
        updateInput: string;
    };
    JSON: {
        type: string;
        create: string;
        update: string;
    };
}
export interface MyAugmentedService {
    TS: {
        can: string;
        asMiddleware: string; 
        asController: string;
    };
    GQL: {
        asQuery?: string;
        asMutation?: string;
    };
    JSON: {
        path: string;
        verb: string;
        definition: string;
    };
}
export interface MyAugmentedFields {
    [name: string]: MyAugmentedField;
}
export interface MyAugmentedServices {
    [name: string]: MyAugmentedServices;
}
export interface MyAugmentedEntity extends _MyEntity {
    augmentedFields: MyAugmentedFields;
    augmentedServices: MyAugmentedServices;
    TS: {
        type: string;
        populatedType: string;
        create: string;
        update: string;
        iterable: string;
        canRead: string;
        canCreate: string;
        canUpdate: string;
        common: string;
        cans: string;
        middlewares: string;
        controllers: string;
    };
    GQL: {
        type: string;
        input: string;
        createInput: string;
        updateInput: string;
        query: string;
        mutation: string;
    };
    JSON: {
        type: string;
        create: string;
        update: string;
        paths: string;
    };
}

export type Template<Args extends {}> = {
    template: string
} & Args;
