import { Request, Response, NextFunction } from "express";
import { ObjectID } from 'mongodb';

export type ID = string | number | ObjectID;

export type ApiEntityModelFieldTypeUnion = Boolean | String | Number | Date | Object | string | [Boolean] | [String] | [Number] | [Date] | [Object] | [string]; 

export type ApiMiddleware = (req: Request, res: Response, next: NextFunction) => void;

export interface ApiExludes {
    [index: number]: boolean;
}

export type ApiEntityModelFieldGuard = (ctx: any) => Promise<null | { [error: string]: string }>;

export type ApiEntityModelFieldValidator = (ctx: any, input: any) => Promise<null | { [error: string]: string }>;

export interface ApiEntityModelFieldGuards {
    all?: ApiEntityModelFieldGuard[];
    select?: ApiEntityModelFieldGuard[];
    create?: ApiEntityModelFieldGuard[];
    update?: ApiEntityModelFieldGuard[];
}

export interface ApiEntityModelFieldValidators {
    all?: ApiEntityModelFieldValidator[];
    create?: ApiEntityModelFieldValidator[];
    update?: ApiEntityModelFieldValidator[];
}

export interface ApiEntityModelFieldSchema {
    type: ApiEntityModelFieldTypeUnion;
    required?: boolean;
    unique?: boolean;
    select?: boolean;
    default?: any;
    guards?: ApiEntityModelFieldGuards;
    validators?: ApiEntityModelFieldValidators;
    reverse?: string;
    array?: boolean;
    relation?: boolean;
    related?: string;
    populate?: string;
}

export interface ApiEntityModelSchema {
    [field: string]: ApiEntityModelFieldSchema;
}

export interface ApiEntityWSSchema {
    middlewares?: ApiMiddleware[];
    excludes?: ApiExludes;
    skip?: boolean;
    type?: 'query' | 'mutation';
    secure?: boolean;
}

export interface ApiEntityWSsSchema {
    [endpointPattern: string]: ApiEntityWSSchema;
}

export interface ApiEntityConfig {
    ownerFieldName?: string;
}

export interface ApiEntitySchema {
    config?: ApiEntityConfig;
    model: ApiEntityModelSchema;
    ws?: ApiEntityWSsSchema;
}

export interface ApiEntitiesSchema {
    [entity: string]: ApiEntitySchema;
}

export interface ApiConfig {
    secret?: string;
    outDir?: string;
    relativeLibPath?: string;
    relativePassportPath?: string;
    passportName?: string;
    iAmModelName?: string;
}

export interface ApiSchema {
    config?: ApiConfig;
    apis: ApiEntitiesSchema;
}
