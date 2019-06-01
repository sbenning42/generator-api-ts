import { APIGen } from "./core";
import { Request, Response, NextFunction } from "express";
import { l } from "../logger";
import { ResetCCC, FgYellowCCC, BrightCCC, FgBlackCCC, FgBlueCCC } from "./prettier";

export function test() {
    new APIGen().generate({
        config: {
            outDir: './src/gen-apis', // folder to put generated code to
            backupOutDir: './src/gen-apis/backups', // folder to put generated backup code to
            auth: {
                secret: 'My Secret', // use to handle `private`, `roles` and `scopes`
                /**
                 * @todo: P0 !!!
                 */
                /**
                 * @todo: private / roles / scopes are NOT IMPLEMENTED YET !!!
                 * the following comments are for FUTUR reflexion purpose ONLY
                 */
                // set `defaultScopes: true` to apply default generated `scopes`:
                // `GET /<entity>` => scopes [`read:<entity>`] needed
                // `POST /<entity>` => scopes [`create:<entity>`] needed
                // `GET /<entity>/:id` => scopes [`read:<entity>`] needed
                // `PUT /<entity>/:id` => scopes [`update:<entity>`] needed
                // `DELETE /<entity>/:id` => scopes [`delete:<entity>`] needed
                // `GET /<entity>/:id/<related entity>` => scopes [`read:<entity>`, `read:<related-entity>@<entity>`] needed
                // `PUT /<entity>/:id/<related entity>/add` => scopes [`update:<entity>`, `create:<related-entity>@<entity>`] needed
                // `PUT /<entity>/:id/<related entity>/remove` => scopes [`update:<entity>`, `delete:<related-entity>@<entity>`] needed
                defaultScopes: false,
                /**
                 * @todo: P0 !!!
                 */
                // - `owner` and `self` roles should be added dinamicaly in middlewares based on the token value and the requested resource
                // wanted to perform operations to.
                // - scopes should be added dinamicaly in middlewares based on the token value and the requested resource
                // wanted to perform operations to. As well as the dinamicaly added`owner` and `self` roles.
                // - Finding a way to get this feature generated in `TS_module.TS_utils` by `APIGen`
                // could be a strong tool to rely on while generating `GQL_TS.GQL_resolvers`'s authorization logic 
            },
        },
        entities: {
            credential: {
                properties: { // Most mongoose properties options are available here
                    user: {
                        type: String,
                        required: true,
                        unique: true,
                    },
                    password: {
                        type: String,
                        required: true,
                    },
                    owner: {
                        type: 'User', // 
                        required: true,
                        unique: true,
                        skipChanges: true, // will not appear on CredentialChangesBody type (eg: is not exposed via PUT `/credentials/:id`)
                    }
                },
                routes: {
                    // `all`'s route config will be apply to all generated routes 
                    all:  {
                        auth: {
                            private: true,
                            roles: ['owner']
                        }
                    },
                    // `query`'s route config will be apply to all generated `GET` routes
                    query: {
                        skip: true, // skip all generated `GET` routes
                    },
                    // `mutation`'s route config will be apply to all generated `POST|PUT|DELETE` routes
                    mutation: {
                        middlewares: ['logToken']
                    },
                    'POST /': {
                        skip: true, // skip specific generated route
                    },
                    'DELETE /:id': {
                        skip: true,
                    },
                    'PUT /:id/owner/add': {
                        skip: true,
                    },
                    'PUT /:id/owner/remove': {
                        skip: true,
                    },
                }
            },
            user: {
                properties: {
                    email: {
                        type: String,
                        required: true,
                        unique: true,
                    },
                    username: {
                        type: String,
                        required: true,
                        unique: true,
                    },
                    birthDate: {
                        type: Date,
                        required: true,
                    },
                    json: {
                        type: Object,
                        default: {},
                    },
                    roles: [{
                        type: String,
                        required: true,
                        default: ['user'],
                        skipCreate: true, // will not appear on UserCreateBody type (eg: is not exposed via POST `/users`)
                        skipChanges: true, // will not appear on UserChangesBody type (eg: is not exposed via PUT `/users/:id`)
                    }],
                    credential: {
                        type: 'Credential',
                        required: true,
                        unique: true,
                        hidden: true,
                        skipCreate: true,
                        skipChanges: true,
                    }
                },
                routes: {
                    all:  {
                        auth: {
                            private: true,
                            roles: ['admin', 'self']
                        }
                    },
                    'POSt /': {
                        auth: {
                            private: false
                        }
                    },
                    'GET /:id/credential': {
                        skip: true,
                    },
                    'PUT /:id/credential/add': {
                        skip: true,
                    },
                    'PUT /:id/credential/remove': {
                        skip: true,
                    },
                }
            },
        },
        context: ({ req, res }) => ({
            req,
            res,
            middlewares: {
                logToken: (req: Request, res: Response, next: NextFunction) => {
                    const { authorization } = req.headers;
                    const token = authorization.replace('Bearer ', '');
                    l.info(`${
                        BrightCCC + FgBlueCCC
                    }logTokenMiddleware:${
                        ResetCCC + FgBlackCCC
                    }token=${
                        ResetCCC + FgYellowCCC + BrightCCC
                    }${token}${
                        ResetCCC
                    }`);
                    next();
                },
            }
        }),
    });
}
