import { ApiSchema, ApiEntitySchema, ApiEntityModelFieldSchema, ApiEntityWSsSchema } from "./types";
import { ctx } from "./ctx";
import { mainPassportService } from "../../../modules/passport/service";
import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcrypt';

function augmentEntityModelFieldSchema([, field]: [string, ApiEntityModelFieldSchema]) {
    field.array = Array.isArray(field.type);
    field.relation = typeof((field.array ? field.type[0] : field.type)) === 'string'; 
    field.related = field.relation ? (field.array ? field.type[0] : field.type) : undefined; 
    if (field.guards && field.guards.all) {
        field.guards.select = field.guards.select ? field.guards.all.concat(...field.guards.select) : [...field.guards.all];
        field.guards.create = field.guards.create ? field.guards.all.concat(...field.guards.create) : [...field.guards.all];
        field.guards.update = field.guards.update ? field.guards.all.concat(...field.guards.update) : [...field.guards.all];
    } else {
        field.guards = {
            select: field.guards && field.guards.select ? field.guards.select : [],
            create: field.guards && field.guards.create ? field.guards.create : [],
            update: field.guards && field.guards.update ? field.guards.update : [],
        };
    }
    if (field.validators && field.validators.all) {
        field.validators.create = field.validators.create ? field.validators.all.concat(...field.validators.create) : [...field.validators.all];
        field.validators.update = field.validators.update ? field.validators.all.concat(...field.validators.update) : [...field.validators.all];
    } else {
        field.validators = {
            create: field.validators && field.validators.create ? field.validators.create : [],
            update: field.validators && field.validators.update ? field.validators.update : [],
        };
    }
}

function augmentEntityWSsSchema(ws: ApiEntityWSsSchema) {
    const allMiddlewares = ws.all && ws.all.middlewares ? ws.all.middlewares : [];
    const queryMiddlewares = ws.query && ws.query.middlewares ? ws.query.middlewares : [];
    const mutationMiddlewares = ws.mutation && ws.mutation.middlewares ? ws.mutation.middlewares : [];
    const queryExcludes = ws.query && ws.query.excludes ? ws.query.excludes : [];
    const mutationExcludes = ws.mutation && ws.mutation.excludes ? ws.mutation.excludes : [];
    const allSkip = ws.all && ws.all.skip ? true : false;
    const querySkip = ws.query && ws.query.skip ? true : false;
    const mutationSkip = ws.mutation && ws.mutation.skip ? true : false;
    const allSecure = ws.all && ws.all.secure ? true : false;
    const querySecure = ws.query && ws.query.secure ? true : false;
    const mutationSecure = ws.mutation && ws.mutation.secure ? true : false;
    const clone = { ...ws };
    delete clone.all;
    delete clone.query;
    delete clone.mutation;
    if (!ws['GET /']) {
        ws['GET /'] = {}
    }
    if (!ws['POST /']) {
        ws['POST /'] = {}
    }
    if (!ws['GET /:id']) {
        ws['GET /:id'] = {}
    }
    if (!ws['PUT /:id']) {
        ws['PUT /:id'] = {}
    }
    if (!ws['DELETE /:id']) {
        ws['DELETE /:id'] = {}
    }
    const queries = Object.entries(ws)
        .filter(([endpointPattern]) => endpointPattern.startsWith('GET'));
    const mutations = Object.entries(ws)
        .filter(([endpointPattern]) => !endpointPattern.startsWith('GET'));
    queries.forEach(([, ws]) => {
        ws.type = 'query';
        ws.middlewares = ws.middlewares ? ws.middlewares : [];
        ws.excludes = ws.excludes ? ws.excludes : {};
        ws.skip = ws.skip !== false && (allSkip || querySkip || ws.skip || false);
        ws.secure = ws.secure !== false && (allSecure || querySecure || ws.secure || false);
        ws.middlewares = [
            ...allMiddlewares,
            ...queryMiddlewares,
            ...ws.middlewares
        ].filter((m, idx) => !(queryExcludes[idx] || ws.excludes[idx]));
    });
    mutations.forEach(([, ws]) => {
        ws.type = 'mutation';
        ws.middlewares = ws.middlewares ? ws.middlewares : [];
        ws.excludes = ws.excludes ? ws.excludes : {};
        ws.skip = ws.skip !== false && (allSkip || mutationSkip || ws.skip || false);
        ws.secure = ws.secure !== false && (allSecure || mutationSecure || ws.secure || false);
        ws.middlewares = [
            ...allMiddlewares,
            ...mutationMiddlewares,
            ...ws.middlewares
        ].filter((m, idx) => !(mutationExcludes[idx] || ws.excludes[idx]));
    });
}

function augmentEntitySchema([, api]: [string, ApiEntitySchema]) {
    Object.entries(api.model).forEach(augmentEntityModelFieldSchema);
    if (api.ws === undefined) {
        api.ws = {};
    }
    augmentEntityWSsSchema(api.ws);
}

export function augmentSchema(schema: ApiSchema) {
    schema.apis.user.ws = {
        all: {
            middlewares: [mainPassportService.jwt()],
            secure: true,
        },
        mutation: {
            middlewares: [
                (req: Request, res: Response, next: NextFunction) => {
                    if (req.params.id === ctx().user._id.toString()) {
                        ctx().user.roles.push('self');
                    }
                    next();
                },
                mainPassportService.hasRole(['admin', 'self'])
            ],
        },
        'POST /': {
            middlewares: [async (req: Request, res: Response, next: NextFunction) => {
                if (req.body.password) {
                    req.body.password = await bcrypt.hash(req.body.password, 10);
                }
                next();
            }],
            excludes: { 0: true, 1: true, 2: true },
            secure: false,
        },
        'DELETE /:id': {
            middlewares: [mainPassportService.hasRole(['admin'])],
            excludes: { 2: true },
        },
        'PUT /:id/password': {
            middlewares: [(req: Request, res: Response) => {
                res.status(501).json({ message: 'Not implemented yet.' });
            }]
        }
    };
    Object.entries(schema.apis).forEach(augmentEntitySchema);
    ctx().schema = schema;
}
