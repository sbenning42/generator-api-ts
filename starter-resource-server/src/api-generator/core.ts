export class APIGenerator {
    sample() {
        return {
            name: 'Sample',
            type: 'array',
            props: {
                title: {
                    type: String,
                    required: true,
                    unique: true,
                    default: 'sample',
                },
                scores: {
                    type: [Number],
                    required: true,
                },
                json: {
                    type: Object,
                    default: {},
                }
            },
            relations: {
                author: 'Sample' || '[Sample]',
            },
            query: {
                getMany: {
                    skip: true,
                    auth: {
                        private: true,
                        roles: [''],
                        scopes: [''],
                    },
                    middlewares: ['']
                },
                getOne: {},
                getAuthor: {},
            },
            mutation: {
                create: {},
                update: {},
                delete: {},
                addAuthor: {},
                removeAuthor: {},
            },
        };
    }

    suf() {
        return `// export type User = any;
// export type Profil = any;
// export type Role = any;
// export type Scope = any;
// export type Credentials = any;
        
import { Request, Response, NextFunction, Router, Application } from 'express';
import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
        
const ObjectId = mongoose.Schema.Types.ObjectId;
const Mixed = mongoose.Schema.Types.Mixed;
        
`;
    }

    generate<O={}, R={}>(schema: CRUDSchemaInput<O, R>) {
        Object.keys(schema.props).forEach(k => schema.props[k] = typeCRUDSchemaInputProp(schema.props[k]));
        const C = (s: string) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;
        const c = (s: string) => `${s.slice(0, 1).toLowerCase()}${s.slice(1)}`;
        const A = (f: (ts: string, ta?: string) => string, g: string = '') =>
            (a: string, s: string) => a ? `${a}${g}${f(s, a)}` : f(s, a);
        const gT = (_t: CRUDSchemaInputPropType) => {
            const iA = Array.isArray(_t);
            const t = iA ? _t[0] : _t;
            switch (true) {
                case t === Boolean:
                    return `boolean${iA ? '[]' : ''}`;
                case t === Number:
                    return `number${iA ? '[]' : ''}`;
                case t === String:
                    return `string${iA ? '[]' : ''}`;
                case t === Date:
                    return `Date${iA ? '[]' : ''}`;
                case t === Object:
                    return `any${iA ? '[]' : ''}`;
                default:
                    throw new Error(`@generate.gT: Do not know type.`);
            }
        };
        const gTR = (rt: string) => {
            switch (rt) {
                case 'boolean':
                    return 'Boolean';
                case 'boolean[]':
                    return '[Boolean]';
                case 'number':
                    return 'Number';
                case 'number[]':
                    return '[Number]';
                case 'string':
                    return 'String';
                case 'string[]':
                    return '[String]';
                case 'Date':
                    return 'Date';
                case 'Date[]':
                    return '[Date]';
                case 'any':
                    return 'Mixed';
                case 'any[]':
                    return '[Mixed]';
                default:
                    throw new Error(`@generate.gTR: Do not know reverse type.`);
            }
        };
        const T = {
            type: `/** 
 * Base entity interface
*/
export interface __NAME__ {
__PROPS__
}
            `,
            typeProp: `    __NAME__: __TYPE__;`,
            createInput: `/** 
 * Input payload interface for entity creation
*/
export interface __NAME__ {
__PROPS__
}
            `,
            createInputProp: `    __NAME__: __TYPE__;`,
            updateInput: `/** 
 * Input payload interface for entity update
*/
export interface __NAME_0__ {
__PROPS__
}
export interface __NAME_1__ {
    id: string;
    changes: __NAME_2__;
}
            `,
            updateInputProp: `    __NAME__: __TYPE__;`,
            schema: `/** 
 * Mongoose Schema for this entity
*/
export const __NAME_0__ = new mongoose.Schema({
__PROPS__
}, { minimize: false });
export const __NAME_1__ = mongoose.model('__NAME_2__', __NAME_3__);
            `,
            schemaProp: `    __NAME_0__: {
        type: __NAME_1__,
        required: __REQUIRED__,
        default: __DEFAULT__,
        unique: __UNIQUE__,
    },`,
            query: {
                getMany: `export function __NAME_0__Query() {
    return __NAME_1__.find({});
}
export function __NAME_0__Lean() {
    return __NAME_0__Query().lean();
}
export async function __NAME_0__Exec() {
    return __NAME_0__Query().exec();
}
export async function __NAME_0__LeanExec() {
    return __NAME_0__Lean().exec();
}

export function __NAME_0__Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].__NAME_0__ = await __NAME_0__LeanExec();
        next();
    };
}

export function __NAME_0__Controller() {
    return async (req: Request, res: Response) => {
        res.json(await __NAME_0__LeanExec());
    };
}
                `,
                getOne: `export function __NAME_0__Query(id: string) {
    return __NAME_1__.findById(id);
}
export function __NAME_0__Lean(id: string) {
    return __NAME_0__Query(id).lean();
}
export async function __NAME_0__Exec(id: string) {
    return __NAME_0__Query(id).exec();
}
export async function __NAME_0__LeanExec(id: string) {
    return __NAME_0__Lean(id).exec();
}

export function __NAME_0__Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].__NAME_0__ = await __NAME_0__LeanExec(id);
        next();
    };
}

export function __NAME_0__Controller() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await __NAME_0__LeanExec(id));
    };
}
                `,
                getRelation: `export async function __NAME_0__LeanExec(id: string) {
    const related = await __NAME_1__Query(id).populate('__NAME_2__').lean().exec();
    return related.__NAME_2__;
}

export function __NAME_0__Middleware() {
    return async (req: Request, res: Response, next: NextFunction) => {
        const id = req.params.id;
        req['result'] = req['result'] ? req['result'] : {};
        req['result'].__NAME_0__ = await __NAME_0__LeanExec(id);
        next();
    };
}

export function __NAME_0__Controller() {
    return async (req: Request, res: Response) => {
        const id = req.params.id;
        res.json(await __NAME_0__LeanExec(id));
    };
}
                `,
            },
            mutation: {
                create: ``,
                update: ``,
                delete: ``,
                addRelation: ``, 
                removeRelation: ``, 
            },
            router: `export class __NAME_0__API {
    router = Router();

    constructor() {
        this.router
            .get('/', __NAME_1__Controller())
            .get('/:id', __NAME_2__Controller())
            // .post('/', __NAME_3__Controller())
            // .put('/:id', __NAME_4__Controller())
            // .delete('/:id', __NAME_5__Controller())__GET____ADD____REMOVE__;
    }

    applyRouter(app: Application) {
        app.use('/__NAME_6__', this.router);
    }
}
            `,
            routerMiddlewareGet: `
            .get('/:id/__NAME_0__', __NAME_1__Controller())`,
            routerMiddlewareAdd: ``,
            routerMiddlewareRemove: ``,
        };
        const {
            name,
            type = 'array',
            props, relations,
            query = {},
            mutation = {},
        } = schema;
        const Cname = C(name);
        const cname = c(name);
        const allQueries = [
            {n:`getMany${Cname}s`,d:false},
            {n:`getOne${Cname}`,d:false},
            ...Object.keys(relations).map(k => ({n:`get${Cname}${C(k)}`,d:false}))
        ];
        const allMutations = [
            {n:`create${Cname}`,d:false},
            {n:`update${Cname}`,d:false},
            {n:`delete${Cname}`,d:false},
            ...Object.keys(relations).map(k => ({n:`add${Cname}${C(k)}`,d:false})),
            ...Object.keys(relations).map(k => ({n:`remove${Cname}${C(k)}`,d:false})),
        ];
        allQueries.forEach(({n,d},i) => {
            if (!query[n]) {
                query[n] = {
                    skip: false,
                    auth: {
                        private: false,
                        roles: [],
                        scopes: [],
                    },
                    middlewares: []
                };
            }
            if (query[n] && !query[n].auth) {
                query[n].auth = {
                    private: false,
                    roles: [],
                    scopes: [],
                };
            }
            if (query[n] && query[n].auth && !query[n].auth.roles) {
                query[n].auth.roles = [];
            }
            if (query[n] && query[n].auth && !query[n].auth.scopes) {
                query[n].auth.scopes = [];
            }
            if (query[n] && !query[n].middlewares) {
                query[n].middlewares = [];
            }
        });
        allMutations.forEach(({n,d},i) => {
            if (!mutation[n]) {
                mutation[n] = {
                    skip: false,
                    auth: {
                        private: false,
                        roles: [],
                        scopes: [],
                    },
                    middlewares: []
                };
            }
            if (mutation[n] && !mutation[n].auth) {
                mutation[n].auth = {
                    private: false,
                    roles: [],
                    scopes: [],
                };
            }
            if (mutation[n] && mutation[n].auth && !mutation[n].auth.roles) {
                mutation[n].auth.roles = [];
            }
            if (mutation[n] && mutation[n].auth && !mutation[n].auth.scopes) {
                mutation[n].auth.scopes = [];
            }
            if (mutation[n] && !mutation[n].middlewares) {
                mutation[n].middlewares = [];
            }
        });
        const syms = {
            type: Cname,
            schema: `${Cname}Schema`,
            model: `${Cname}Model`,
            createInput: `${Cname}CreateInput`,
            updateInput: `${Cname}UpdateInput`,
            changesInput: `${Cname}ChangesInput`,
            query: allQueries.map(aq => aq.n),
            mutation: allMutations.map(am => am.n),
        };
        const defs = {
            type: T.type
                .replace('__NAME__', syms.type)
                .replace('__PROPS__', [T.typeProp
                        .replace('__NAME__', '_id')
                        .replace('__TYPE__', 'string')
                    ].concat(...Object.entries(props)
                    .map(([k, v]: [string, CRUDSchemaInputPropTyped]) => T.typeProp
                        .replace('__NAME__', k + (v.required ? '' : '?'))
                        .replace('__TYPE__', gT(v.type))
                    ))
                    .concat(...Object.entries(relations)
                        .map(([k, v]: [string, string]) => T.typeProp
                            .replace('__NAME__', k + '?')
                            .replace('__TYPE__', v)
                        )
                    ).reduce(A(p => p, '\n'), '')
                ),
            createInput: T.createInput
                .replace('__NAME__', syms.createInput)
                .replace('__PROPS__', Object.entries(props)
                    .map(([k, v]: [string, CRUDSchemaInputPropTyped]) => T.createInputProp
                        .replace('__NAME__', k + (v.required ? '' : '?'))
                        .replace('__TYPE__', gT(v.type))
                    ).reduce(A(p => p, '\n'), '')
                ),
            updateInput: T.updateInput
                .replace('__NAME_0__', syms.changesInput)
                .replace('__NAME_1__', syms.updateInput)
                .replace('__NAME_2__', syms.changesInput)
                .replace('__PROPS__', Object.entries(props)
                    .map(([k, v]: [string, CRUDSchemaInputPropTyped]) => T.updateInputProp
                        .replace('__NAME__', k + '?')
                        .replace('__TYPE__', gT(v.type))
                    ).reduce(A(p => p, '\n'), '')
                ),
            schema: T.schema
                .replace('__NAME_0__', syms.schema)
                .replace('__NAME_1__', syms.model)
                .replace('__NAME_2__', syms.type)
                .replace('__NAME_3__', syms.schema)
                .replace('__PROPS__', Object.entries(props)
                    .map(([k, v]: [string, CRUDSchemaInputPropTyped]) => T.schemaProp
                        .replace('__NAME_0__', k)
                        .replace('__NAME_1__', gTR(gT(v.type)))
                        .replace('__REQUIRED__', v.required ? 'true' : 'false')
                        .replace('__UNIQUE__', v.unique ? 'true' : 'false')
                        .replace('__DEFAULT__', v.default
                            ? (
                                typeof(v.default) === 'string'
                                    ? `'${v.default}'`
                                    : `${JSON.stringify(v.default)}`
                            )
                            : 'undefined'
                        ).replace(`\n        unique: false,`, '')
                        .replace(`\n        default: undefined,`, '')
                    ).concat(...Object.entries(relations)
                        .map(([k, v]: [string, string]) => T.schemaProp
                            .replace('__NAME_0__', k)
                            .replace('__NAME_1__', (v.includes('[') ? '[ObjectId]' : 'ObjectId') + ` /* relation (${v}) */`)
                            .replace('__REQUIRED__', 'false')
                            .replace('__UNIQUE__', 'false')
                            .replace('__DEFAULT__', 'undefined')
                            .replace(`\n        unique: false,`, '')
                            .replace(`\n        default: undefined,`, '')
                        )
                    ).reduce(A(p => p, '\n'), '')
                ),
                query: {
                    getMany: T.query.getMany
                        .replace(/__NAME_0__/g, syms.query[0])
                        .replace(/__NAME_1__/g, syms.model),
                    getOne: T.query.getOne
                        .replace(/__NAME_0__/g, syms.query[1])
                        .replace(/__NAME_1__/g, syms.model),
                    getRelations: allQueries.slice(2).map((aq,i) => T.query.getRelation
                        .replace(/__NAME_0__/g, aq.n)
                        .replace(/__NAME_1__/g, syms.query[1])
                        .replace(/__NAME_2__/g, Object.keys(relations)[i])
                    ),
                },
                mutation: {
                    create: ``,
                    update: ``,
                    delete: ``,
                    // ...
                    // ...
                },
                router: T.router
                    .replace(/__NAME_0__/g, Cname)
                    .replace(/__NAME_1__/g, syms.query[0])
                    .replace(/__NAME_2__/g, syms.query[1])
                    .replace(/__NAME_3__/g, syms.mutation[0])
                    .replace(/__NAME_4__/g, syms.mutation[1])
                    .replace(/__NAME_5__/g, syms.mutation[2])
                    .replace(/__NAME_6__/g, cname + 's')
                    .replace(/__GET__/g, allQueries.slice(2)
                        .map((aq, i) => T.routerMiddlewareGet
                            .replace(/__NAME_0__/g, Object.keys(relations)[i])
                            .replace(/__NAME_1__/g, aq.n)
                        ).reduce(A(p => p, '\n'), '')
                    )
                    .replace(/__ADD__/g, '')
                    .replace(/__REMOVE__/g, '')
        }
        return `${
            defs.type.trim()
          }
      
${defs.createInput.trim()}
      
${defs.updateInput.trim()}

${defs.schema.trim()}

${defs.query.getMany.trim()}

${defs.query.getOne.trim()}

${defs.query.getRelations.reduce(A(p => p, '\n'), '')}

${defs.router}

`;
    }
}

export type CRUDSchemaInputPropType = [Boolean]|[Number]|[String]|[Date]|[Object]|Boolean|Number|String|Date|Object;
export interface CRUDSchemaInputPropTyped {
    type: CRUDSchemaInputPropType;
    required?: boolean;
    hidden?: boolean;
    unique?: boolean;
    default?: any;
}

export type CRUDSchemaInputProp = CRUDSchemaInputPropType | CRUDSchemaInputPropTyped;
export function typeCRUDSchemaInputProp(inputProp: CRUDSchemaInputProp) {
    if (!inputProp['type']) {
        return {
            type: inputProp,
            required: false,
            unique: false,
            hidden: false,
        };
    }
    return inputProp;
}

export type CRUDSchemaInputProps<O={}> = { [K in keyof O]: CRUDSchemaInputProp };
export type CRUDSchemaInputRelations<O={}> = { [K in keyof O]: string };

export interface CRUDSchemaInputActionAuth {
    private?: boolean;
    roles?: string[];
    scopes?: string[];
}

export interface CRUDSchemaInputAction {
    skip?: boolean;
    auth?: CRUDSchemaInputActionAuth;
    middlewares?: string[];
}
export type CRUDSchemaInputQuery = CRUDSchemaInputAction;
export type CRUDSchemaInputMutation = CRUDSchemaInputAction;

export type CRUDSchemaInputQueries = { [key: string]: CRUDSchemaInputQuery };
export type CRUDSchemaInputMutations = { [key: string]: CRUDSchemaInputMutation };

export interface CRUDSchemaInput<O={}, R={}> {
    type?: 'array'; // @todo: could be 'array'|'object' to handle non-collection entities
    name: string;
    props: CRUDSchemaInputProps<O>;
    relations?: CRUDSchemaInputRelations<R>;
    query?: CRUDSchemaInputQueries;
    mutation?: CRUDSchemaInputMutations;
}


