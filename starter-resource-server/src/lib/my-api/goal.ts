import { MyApiDescription } from "./types";
import { CANNOT } from "./constantes";

export const myApi: MyApiDescription = {
    
    config: {
        auth: {
            jwtSecret: 'secret',
            localFields: ['username', 'password'],
        },
        outDir: './generated',
    },
    
    apis: {
        
        user: {
            
            fields: {
                username: {
                    type: String,
                    required: true,
                    unique: true,
                    validators: [
                        (s: string) => s.length < 3 ? {[`minLength-3`]: `Username too short.`} : null,
                        (s: string) => s.length > 255 ? {[`maxLength-255`]: `Username too long.`} : null
                    ],
                },
                password: {
                    type: String,
                    required: true,
                    canSelect: CANNOT, // put `select: false` in the mongoose Schema + call function to know if context can bypass the mongoose rule on 'GET /' and 'GET /:id'
                    canUpdate: CANNOT, // call function to know if context can update this field on 'PUT /:id' route
                    validators: [
                        (s: string) => s.length < 8 ? {[`minLength-8`]: `Password too short.`} : null,
                        (s: string) => s.length > 255 ? {[`maxLength-255`]: `Password too long.`} : null
                    ], // call those function on 'POST /' and 'PUT /:id' to know if the provided field value is valid
                },
                roles: {
                    type: [String],
                    required: true,
                    canCreate: CANNOT, // call function to know if context can provide this field on 'POST /' route
                    canUpdate: [(ctx: any) => 'admin' in ctx.user.roles],
                    default: ['user'], // put `default: ['user']` in the mongoose Schema
                },
                tags: {
                    type: '[Tag]',
                    populateAll: true, // call .populate('tags') on mongoose query in 'GET /'
                    populateOne: true, // call .populate('tags') on mongoose query in 'GET /:id'
                    canCreate: CANNOT,
                    canUpdate: CANNOT,

                },
                todos: {
                    type: '[Todos]',
                    populateOne: true,
                    cascade: true, // perform 'DELETE /:id' on each `todos` when 'DELETE /:id' is performed on `user` 
                    canCreate: CANNOT,
                    canUpdate: CANNOT,
                },
            },
            
            routes: {
                all: {
                    middlewares: {
                        jwt: (ctx: any) => ctx.middlewares.jwt, // throw error if `req` has no valid `Bearer <token>` JSON Web Token in `Authorization` 
                        thisIsSelf: (ctx: any) => ctx.middlewares.thisIsSelf, // add `'self'` in `req.user.roles` if `req.params.id === req.user._id.toString()`
                        selfOrAdmin: (ctx: any) => ctx.middlewares.hasRole('self', 'admin'), // throw error if `req.user.roles` does not includes 'self' or 'admin' 
                    },
                },
                'POST /': {
                    excludes: {
                        jwt: true,
                        thisIsSelf: true,
                        selfOrAdmin: true
                    }, // exclude those middlewares for that route
                    middlewares: {
                        log: (ctx: any) => ctx.middlewares.log, // just log the context in console
                    }
                },
                'DELETE /:id': {
                    excludes: {
                        selfOrAdmin: true
                    },
                    middlewares: {
                        admin: (ctx: any) => ctx.middlewares.hasRole('admin'),
                    },
                },
            },
        },
        
        tag: {
            
            fields: {
                title: {
                    type: String,
                    required: true,
                    unique: true,
                    validators: [
                        (s: string) => s.length < 3 ? {[`minLength-3`]: `Title too short.`} : null,
                        (s: string) => s.length > 255 ? {[`maxLength-255`]: `Title too long.`} : null
                    ],
                },
                author: {
                    type: 'User',
                    required: true,
                    canCreate: CANNOT,
                    canUpdate: CANNOT,
                    default: (ctx: any) => ctx.req.user._id, // `default` can also be a function using MyApiContext. MyApiEngine takes care to resolve all needed scopes when it forward this kind of `default` value to mongoose. (eg: mongoose default function does not support accessing `req`. MyApi does ;) )  
                    reverse: ['tags'], // on 'POST /' add the created `._id` to author.tags. on 'PUT /:id' if 'author' changes delete '._id' from old author.tags and add it to the new (that case is not possible here because of `canUpdate: CANNOT`). On 'Delete /:id' remove '._id' from author.tags
                }
            },
            
            routes: {
                all: {
                    middlewares: {
                        jwt: (ctx: any) => ctx.middlewares.jwt,
                        ownedByAuthor: (ctx: any) => ctx.middlewares.ownedBy('author'), // add 'owner' to req.user.roles if Tags(req.params.id).author match req.user._id
                    },
                },
                mutation: {
                    middlewares: {
                        admin: (ctx: any) => ctx.middlewares.hasRole('admin'),
                    },
                },
                'POST /': {
                    excludes: { ownedByAuthor: true, admin: true },
                },
            },
        },
        
        todo: {
            
            fields: {
                title: {
                    type: String,
                    required: true,
                    unique: true,
                    validators: [
                        (s: string) => s.length < 3 ? {[`minLength-3`]: `Title too short.`} : null,
                        (s: string) => s.length > 255 ? {[`maxLength-255`]: `Title too long.`} : null
                    ],
                },
                done: {
                    type: Boolean,
                    required: true,
                },
                json: {
                    type: Object,
                },
                author: {
                    type: 'User',
                    required: true,
                    canCreate: CANNOT,
                    canUpdate: CANNOT,
                    default: (ctx: any) => ctx.req.user._id,
                    reverse: ['todos'],
                }
            },
            
            routes: {
                all: {
                    middlewares: {
                        jwt: (ctx: any) => ctx.middlewares.jwt,
                        ownedByAuthor: (ctx: any) => ctx.middlewares.ownedBy('author'),
                    },
                },
                mutation: {
                    middlewares: {
                        ownerOrAdmin: (ctx: any) => ctx.middlewares.hasRole('owner', 'admin'),
                    },
                },
                'POST /': {
                    excludes: { ownedByAuthor: true, ownerOrAdmin: true },
                },
            },
        }
    },
};
