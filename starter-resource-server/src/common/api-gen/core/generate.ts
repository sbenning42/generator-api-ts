import { ctx as getCtx } from "./ctx";
import { ApiEntityModelFieldTypeUnion, ApiEntitySchema } from "./types";
import { getInterfaceEquivalentType } from "./get-interface-equivalent-type";
import { ObjectID } from "mongodb";
import { plural } from 'pluralize'

export const capitalize = (s: string) => `${s.slice(0, 1).toLocaleUpperCase()}${s.slice(1)}`;

export const applyTemplate = <A extends { [key: string]: string }>(template: string, args: A) => Object.entries(args || {})
    .reduce((steps, [key, value]: [string, string]) => steps.replace(new RegExp(`\\\$${key}`, 'g'), value), template);

// function to replace `$<index>` occurencies in `s` by corresponding `args[index]`
export const rep = (s: string, args: string[] = []) => args.reduce((str, arg, idx) => str.replace(new RegExp(`\\$${idx}`, 'g'), arg), s);

export const epExpress2Swagger = (ep: string, vars: { [key: string]: string } = {}) => {
    if (ep[ep.length - 1] === '/') {
        ep = ep.slice(0, -1);
    }
    return Object.keys(vars).length > 0
        ? Object.entries(vars).reduce((e, [k, v]) => ep.replace(new RegExp(`:${k}`), `{${k}}`), ep)
        : ep;
};

export const YMLDefinitionPropPrimTpl = (name: string, type: string) => rep(`
            $0:
                type: $1`, [name, type]);
export const YMLDefinitionPropObjTpl = (name: string) => rep(`
            $0:
                type: object`, [name]);
export const YMLDefinitionPropRelTpl = (name: string, ref: string, force = false) => rep(`
            $0:
                $1`, [name, force ? `$ref: '#/definitions/${ref}'` : `type: string`]);
export const YMLDefinitionPropPrimArrayTpl = (name: string, type: string) => rep(`
            $0:
                type: array
                items:
                    type: $1`, [name, type]);
export const YMLDefinitionPropObjArrayTpl = (name: string) => rep(`
            $0:
                type: array
                items:
                    type: object`, [name]);
export const YMLDefinitionPropRelArrayTpl = (name: string, ref: string, force = false) => rep(`
            $0:
                type: array
                items:
                    $1`, [name, force ? `$ref: '#/definitions/${ref}'` : `type: string`]);

export const YMLDefinitionTypeTpl = (capName: string, props: string) => props ? rep(`    $0:
        type: object
        properties:$1`, [capName, props]) : rep(`    $0:
        type: object`, [capName]);

export const YMLDefinitionTpl = (props: string) => rep(`
definitions:
$0
`, [props]);

export const YMLGetEndpoints = (routes: any) => {
    const verbs = ['GET', 'POST', 'PUT', 'DELETE'];
    const entries = Object.entries(routes).filter(([k]) => verbs.includes(k.split(' ')[0]));
    const splitEntries = entries.map(([k, v]) => {
        const [_verb, _ep] = k.split(' ');
        return [k, _verb.trim().toUpperCase(), _ep.trim(), v] as [string, string, string, any];
    });
    const already = [];
    splitEntries.forEach(([key, verb, ep, route]) => {
        let ent = already.find(a => a.ep === ep);
        if (!ent) {
            ent = { ep, entries: {} };
            already.push(ent);
        }
        ent.entries[verb] = { key, verb, ep, route };
    });
    return already;
}


export const YMLPathsEntityTpl = (endpoint: string, props: string) => rep(`    $0:$1
`, [endpoint, props]);

export const YMLPathsEntityVerbTpl = (ep: string) => (verb: string, vars: string, resps: string, desc: string = '', sec: boolean = false) => vars && resps ? rep(`
        $0:$5
            tags: ['$4']
            description: "$1"
            parameters:$2
            responses:
                '200':
                    description: "not provided."
                    schema:$3`, [verb, desc, vars, resps, ep.split('/')[0], sec ? YMLsecureTPL() : ''])
        : (vars ? rep(`
        $0:$4
            tags: ['$3']
            description: "$1"
            parameters:$2
            responses:
                '200':
                    description: "not provided."
                    schema:
                        type: object`, [verb, desc, vars, ep.split('/')[0], sec ? YMLsecureTPL() : ''])
        : (resps ? rep(`
        $0:$4
            tags: ['$3']
            description: "$1"
            responses:
                '200':
                    description: "not provided."
                    schema:$2`, [verb, desc, resps, ep.split('/')[0], sec ? YMLsecureTPL() : ''])
        : rep(`
        $0:$3
            tags: ['$2']
            description: "$1"
            responses:
                '200':
                    description: "not provided."
                    schema:
                        type: object`, [verb, desc, ep.split('/')[0], sec ? YMLsecureTPL() : '']))
        );

export const YMLPathsEntityVerbVarsTpl = (name: string, desc: string) => rep(`
                - name: $0
                  in: path
                  required: true
                  description: "$1"
                  type: string`, [name, desc || 'Not provided']);

export const YMLPathsEntityBodyVarsTpl = (name: string, desc: string = '') => rep(`
                - name: body
                  description: "$1"
                  in: body
                  schema:
                    $ref: '#/definitions/$0'`, [name, desc || 'Not provided']);

export const YMLPathsEntityVerbRespTpl = (ref: string) => rep(`
                        $ref: '#/definitions/$0'`, [ref]);
export const YMLPathsEntityVerbArrayRespTpl = (ref: string) => rep(`
                        type: array
                        items:
                            $ref: '#/definitions/$0'`, [ref]);

export const YMLPathsTpl = (props: string) => rep(`
paths:
$0
`, [props]);

const YMLsecureTPL = () => `
            security:
              - bearerAuth: []`;


              function getYMLParametersFor(
                name: string,
                entity: any,
                ref: any,
                verb: string,
                key: string,
                _ep: string,
                route: any,
                entries: any,
                ep: string
            ) {
                const cap = (s: string) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`; // capitalize
                if (route.parameters) {
                    return route.parameters;
                }
                switch (true) {
                    case verb === 'GET' && ep === '/':
                        return ``;
                    case verb === 'POST' && ep === '/':
                        return `${YMLPathsEntityBodyVarsTpl(`Create${cap(name)}`, '')}`;
                    case verb === 'GET' && ep === '/:id':
                        return `${YMLPathsEntityVerbVarsTpl('id', '')}`;
                    case verb === 'PUT' && ep === '/:id':
                        return `${YMLPathsEntityVerbVarsTpl('id', '')}\n${YMLPathsEntityBodyVarsTpl(`Update${cap(name)}`, '')}`;
                    case verb === 'DELETE' && ep === '/:id':
                        return `${YMLPathsEntityVerbVarsTpl('id', '')}`;
                    case verb === 'GET' && ep === `/:id/${route._ref}`:
                        return `${YMLPathsEntityVerbVarsTpl('id', '')}`;
                    default:
                        break ;
                }
                return ``;
            }
            
            function getYMLResponseFor(
                name: string,
                entity: any,
                ref: any,
                verb: string,
                key: string,
                _ep: string,
                route: any,
                entries: any,
                ep: string
            ) {
                const cap = (s: string) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`; // capitalize
                if (route.responses) {
                    return route.responses;
                }
                switch (true) {
                    case verb === 'GET' && ep === '/':
                        return `${YMLPathsEntityVerbArrayRespTpl(cap(name))}`;
                    case verb === 'POST' && ep === '/':
                        return `${YMLPathsEntityVerbRespTpl(cap(name))}`;
                    case verb === 'GET' && ep === '/:id':
                        return `${YMLPathsEntityVerbRespTpl(cap(name))}`;
                    case verb === 'PUT' && ep === '/:id':
                        return `${YMLPathsEntityVerbRespTpl(cap(name))}`;
                    case verb === 'DELETE' && ep === '/:id':
                        return `${YMLPathsEntityVerbRespTpl(cap(name))}`;
                    default:
                        break ;
                }
                return ``;
            }
            
            const isSecure = (
                name: string,
                entity: any,
                ref: any,
                verb: string,
                key: string,
                _ep: string,
                route: any,
                entries: any,
                ep: string
            ) => {
                return route.secure;   
            }
            

const _YMLPreffixTpl = `
swagger: "2.0"
info:
    version: "0.0.1"
    title: "Swagger API"
host: localhost:$port
basePath: "/"
schemes:
    - http
    - https

securityDefinitions:
    bearerAuth:
        type: "apiKey"
        name: "Authorization"
        in: "header"
consumes:
    - application/json
produces:
    - application/json
`
            
const _typesImportsTpl = `
import { ObjectID } from 'mongodb';
import { ID } from '$relativeLibPath';

`;
const _apiImportsTpl = `
import { Request, Response, NextFunction, Application, Router } from 'express';
import { ObjectID } from 'mongodb';
import { ID, ctx as getCtx, select, create, update, _delete } from '../$relativeLibPath';
`;

const _interfaceTPL = `
export interface $name {
$fields
}
`;
const _interfacePropertyTPL = `    $name$required: $type$array;`;
const interfaceTPL = (name: string, fields: { name: string, required: boolean, type: ApiEntityModelFieldTypeUnion, array: boolean }[]) => {
    return applyTemplate(_interfaceTPL, {
        name: name,
        fields: fields.map(field => applyTemplate(_interfacePropertyTPL, {
            name: field.name,
            required: field.required ? '' : '?',
            array: '',
            type: getInterfaceEquivalentType(field.type),
        })).join('\n'),
    });
}

const _utilsTemplate = `
export class $name {

    selectAll() {
        return select('$api');
    }

    selectById(id: ID) {
        return select('$api', id); 
    }

    create(body: any) {
        return create('$api', body);
    }

    update(id: ID, body: any) {
        return update('$api', id, body);
    }

    delete(id: ID) {
        return _delete('$api', id);
    }
}
`;

const _serviceTemplate = `
export class $name {
    
    utils = new $utilsName();

    async getAll() {
        return this.utils.selectAll();
    }

    async getById(id: ID) {
        return this.utils.selectById(id);
    }

    async create(body: any) {
        return this.utils.create(body);
    }

    async update(id: ID, body: any) {
        return this.utils.update(id, body);
    }

    async delete(id: ID) {
        return this.utils.delete(id);
    }
}
`;

const _controllerTemplate = `
export class $name {
    
    service = new $serviceName();

    getAll() {
        return async (req: Request, res: Response) => {
            try {
                res.json({
                    response: await this.service.getAll(),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString(), ...getCtx().err });
            }
        };
    }

    getById() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                res.json({
                    response: await this.service.getById(id),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString(), ...getCtx().err });
            }
        };
    }

    create() {
        return async (req: Request, res: Response) => {
            const body = req.body;
            try {
                res.json({
                    response: await this.service.create(body),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString(), ...getCtx().err });
            }
        };
    }

    update() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            const body = req.body;
            try {
                res.json({
                    response: await this.service.update(id, body),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString(), ...getCtx().err });
            }
        };
    }

    delete() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                res.json({
                    response: await this.service.delete(id),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString(), ...getCtx().err });
            }
        };
    }
}
`;

const _routerTemplate = `
export class $name {

    controller = new $controllerName();

    async apply(app: Application) {
        const {
            middlewares: { $api: middlewares }
        } = getCtx();
        app.use('/$pluralizeApi', Router()
            .get('/', ...(middlewares['GET /'] || []), this.controller.getAll())
            .post('/', ...(middlewares['POST /'] || []), this.controller.create())
            .get('/:id', ...(middlewares['GET /:id'] || []), this.controller.getById())
            .put('/:id', ...(middlewares['PUT /:id'] || []), this.controller.update())
            .delete('/:id', ...(middlewares['DELETE /:id'] || []), this.controller.delete())
$customWSs
        );
    }
}
`;

export const _routerWSTemplate = `            .$verb('$ep', ...(middlewares['$endpointPattern'] || []))`;

export function generate() {
    const ctx = getCtx();
    const {
        schema,
        fields,
        config = {}
    } = ctx;
    return ctx.generated = {
        imports: {
            types: applyTemplate(_typesImportsTpl, { relativeLibPath: config.relativeLibPath || '../common/api-gen' }),
            api: applyTemplate(_apiImportsTpl, { relativeLibPath: config.relativeLibPath || '../common/api-gen' })
        },
        typescript: Object.entries(schema.apis)
            .reduce((all, [apiName, api]: [string, ApiEntitySchema]) => {
                all[apiName] = {
                    types: {
                        model: interfaceTPL(
                            capitalize(apiName),
                            Object.entries({ id: { type: 'ID', required: true, array: false }, ...api.model })
                                .map(([fieldName, field]) => ({
                                    name: fieldName,
                                    type: field.array
                                        ? (typeof(field.type[0]) === 'string' ? [ObjectID] : field.type)
                                        : (typeof(field.type) === 'string' ? ObjectID : field.type),
                                    required: field.required,
                                    array: field.array,
                                }))
                        ),
                        populatedModel: interfaceTPL(
                            `Populated${capitalize(apiName)}`,
                            Object.entries({ id: { type: 'ID', required: true, array: false }, ...api.model })
                                .map(([fieldName, field]) => ({
                                    name: fieldName,
                                    type: field.type,
                                    required: field.required,
                                    array: field.array,
                                }))
                        ),
                        createModel: interfaceTPL(
                            `Create${capitalize(apiName)}`,
                            Object.entries({ ...api.model, id: { type: 'ID', required: false, array: false } })
                                .filter(([fieldName]) => fields[apiName].create.includes(fieldName))
                                .map(([fieldName, field]) => ({
                                    name: fieldName,
                                    type: field.type,
                                    required: field.required,
                                    array: field.array,
                                }))
                        ),
                        setModel: interfaceTPL(
                            `Set${capitalize(apiName)}`,
                            Object.entries(api.model)
                                .filter(([fieldName]) => fields[apiName].update.set.includes(fieldName))
                                .map(([fieldName, field]) => ({
                                    name: fieldName,
                                    type: field.type,
                                    required: false,
                                    array: field.array,
                                }))
                        ),
                        pushModel: interfaceTPL(
                            `Push${capitalize(apiName)}`,
                            Object.entries(api.model)
                                .filter(([fieldName]) => fields[apiName].update.push.includes(fieldName))
                                .map(([fieldName, field]) => ({
                                    name: fieldName,
                                    type: field.type,
                                    required: false,
                                    array: field.array,
                                }))
                        ),
                        pullModel: interfaceTPL(
                            `Pull${capitalize(apiName)}`,
                            Object.entries(api.model)
                                .filter(([fieldName]) => fields[apiName].update.pull.includes(fieldName))
                                .map(([fieldName, field]) => ({
                                    name: fieldName,
                                    type: field.type,
                                    required: false,
                                    array: field.array,
                                }))
                        ),
                        updateModel: interfaceTPL(
                            `Update${capitalize(apiName)}`,
                            Object.entries({
                                id: { type: 'ID', required: true, array: false },
                                set: { type: `Set${capitalize(apiName)}`, required: false, array: false },
                                push: { type: `Push${capitalize(apiName)}`, required: false, array: false },
                                pull: { type: `Pull${capitalize(apiName)}`, required: false, array: false },
                            })
                                .map(([fieldName, field]) => ({
                                    name: fieldName,
                                    type: field.type,
                                    required: field.required,
                                    array: field.array,
                                }))
                        ),
                    },
                    api: {
                        utils: applyTemplate(_utilsTemplate, {
                            name: `${capitalize(apiName)}Utils`,
                            api: apiName,
                        }),
                        service: applyTemplate(_serviceTemplate, {
                            name: `${capitalize(apiName)}Service`,
                            utilsName: `${capitalize(apiName)}Utils`,
                        }),
                        controller: applyTemplate(_controllerTemplate, {
                            name: `${capitalize(apiName)}Controller`,
                            serviceName: `${capitalize(apiName)}Service`,
                        }),
                        router: applyTemplate(_routerTemplate, {
                            name: `${capitalize(apiName)}Router`,
                            controllerName: `${capitalize(apiName)}Controller`,
                            api: apiName,
                            pluralizeApi: plural(apiName),
                            customWSs: Object.entries(api.ws)
                                .filter(([endpoint]) => ![
                                    'all', 'query', 'mutation',
                                    'GET /', 'POST /',
                                    'GET /:id', 'PUT /:id', 'DELETE /:id',
                                ].includes(endpoint))
                                .map(([endpoint, ws]) => applyTemplate(_routerWSTemplate, {
                                    verb: endpoint.split(' ')[0].toLocaleLowerCase(),
                                    ep: endpoint.split(' ')[1],
                                    endpointPattern: endpoint
                                }))
                                .join('\n')
                        }),
                    }
                };
                return all;
            }, {}),
        swagger: {
            preffix: applyTemplate(_YMLPreffixTpl, { port: '4266' }),
            paths: YMLPathsTpl(Object.entries(schema.apis)
                .map(([apiName, api]: [string, ApiEntitySchema]) => YMLGetEndpoints({
                    ...Object.entries(api.ws)
                        .filter(([ep, ws]) => !ws.skip)
                        .reduce((all, [k, v]) => ({ ...all, [k]: v }), {})
                }).map(({ ep, entries }) => YMLPathsEntityTpl(
                    `/${plural(apiName)}${epExpress2Swagger(ep, { id: 'id' })}`,
                    Object.entries(entries).map(([verb, { key, ep: _ep, route }]: any) => YMLPathsEntityVerbTpl(capitalize(apiName))(
                        verb.toLowerCase(),
                        getYMLParametersFor(apiName, api, api.model[route._ref], verb, key, _ep, route, entries, ep),
                        getYMLResponseFor(apiName, api, api.model[route._ref], verb, key, _ep, route, entries, ep),
                        'sample description',
                        isSecure(apiName, api, api.model[route._ref], verb, key, _ep, route, entries, ep),
                    )).join('\n')
                )).join('\n')).join('\n')),
            definitions: YMLDefinitionTpl(
                Object.entries(schema.apis)
                    .map(([apiName, api]: [string, ApiEntitySchema]) => YMLDefinitionTypeTpl(
                        capitalize(apiName),
                        Object.entries(api.model).map(([fieldName, field]) => {
                            if (field.relation && field.array) {
                                return YMLDefinitionPropPrimTpl(fieldName, 'string');
                            } else if (field.relation) {
                                return YMLDefinitionPropPrimTpl(fieldName, 'string');
                            } else if (field.array) {
                                return field.type[0] === Object
                                    ? YMLDefinitionPropObjArrayTpl(fieldName)
                                    : YMLDefinitionPropPrimArrayTpl(fieldName, getInterfaceEquivalentType(field.type[0]));
                            } else {
                                return field.type === Object
                                    ? YMLDefinitionPropObjTpl(fieldName)
                                    : YMLDefinitionPropPrimTpl(fieldName, getInterfaceEquivalentType(field.type))
                            }
                        }).join('\n')
                    ))
                    .concat(
                        Object.entries(schema.apis)
                            .map(([apiName, api]: [string, ApiEntitySchema]) => YMLDefinitionTypeTpl(
                                `Populated${capitalize(apiName)}`,
                                Object.entries(api.model).map(([fieldName, field]) => {
                                    if (field.relation && field.array) {
                                        return YMLDefinitionPropRelArrayTpl(fieldName, field.related, true);
                                    } else if (field.relation) {
                                        return YMLDefinitionPropRelTpl(fieldName, field.related, true);
                                    } else if (field.array) {
                                        return field.type[0] === Object
                                            ? YMLDefinitionPropObjArrayTpl(fieldName)
                                            : YMLDefinitionPropPrimArrayTpl(fieldName, getInterfaceEquivalentType(field.type[0]));
                                    } else {
                                        return field.type === Object
                                            ? YMLDefinitionPropObjTpl(fieldName)
                                            : YMLDefinitionPropPrimTpl(fieldName, getInterfaceEquivalentType(field.type))
                                    }
                                }).join('\n')
                            )),
                        
                            Object.entries(schema.apis)
                                .map(([apiName, api]: [string, ApiEntitySchema]) => YMLDefinitionTypeTpl(
                                    `Create${capitalize(apiName)}`,
                                    Object.entries({ id: { type: 'ID', required: true, array: false } as any, ...api.model })
                                        .filter(([fieldName, field]) => fields[apiName].create.includes(fieldName))
                                        .map(([fieldName, field]) => {
                                            if (field.relation && field.array) {
                                                return YMLDefinitionPropPrimArrayTpl(fieldName, 'string');
                                            } else if (field.relation) {
                                                return YMLDefinitionPropPrimTpl(fieldName, 'string');
                                            } else if (field.array) {
                                                return field.type[0] === Object
                                                    ? YMLDefinitionPropObjArrayTpl(fieldName)
                                                    : YMLDefinitionPropPrimArrayTpl(fieldName, getInterfaceEquivalentType(field.type[0]));
                                            } else {
                                                return field.type === Object
                                                    ? YMLDefinitionPropObjTpl(fieldName)
                                                    : YMLDefinitionPropPrimTpl(fieldName, getInterfaceEquivalentType(field.type))
                                            }
                                        }).join('\n')
                                )),
                        
                                Object.entries(schema.apis)
                                    .map(([apiName, api]: [string, ApiEntitySchema]) => YMLDefinitionTypeTpl(
                                        `Set${capitalize(apiName)}`,
                                        Object.entries(api.model)
                                            .filter(([fieldName, field]) => fields[apiName].update.set.includes(fieldName))
                                            .map(([fieldName, field]) => {
                                                if (field.relation && field.array) {
                                                    return YMLDefinitionPropPrimArrayTpl(fieldName, 'string');
                                                } else if (field.relation) {
                                                    return YMLDefinitionPropPrimTpl(fieldName, 'string');
                                                } else if (field.array) {
                                                    return field.type[0] === Object
                                                        ? YMLDefinitionPropObjArrayTpl(fieldName)
                                                        : YMLDefinitionPropPrimArrayTpl(fieldName, getInterfaceEquivalentType(field.type[0]));
                                                } else {
                                                    return field.type === Object
                                                        ? YMLDefinitionPropObjTpl(fieldName)
                                                        : YMLDefinitionPropPrimTpl(fieldName, getInterfaceEquivalentType(field.type))
                                                }
                                            }).join('\n')
                                    )),
                        
                                Object.entries(schema.apis)
                                    .map(([apiName, api]: [string, ApiEntitySchema]) => YMLDefinitionTypeTpl(
                                        `Push${capitalize(apiName)}`,
                                        Object.entries(api.model)
                                            .filter(([fieldName, field]) => fields[apiName].update.push.includes(fieldName))
                                            .map(([fieldName, field]) => {
                                                if (field.relation && field.array) {
                                                    return YMLDefinitionPropPrimArrayTpl(fieldName, 'string');
                                                } else if (field.relation) {
                                                    return YMLDefinitionPropPrimTpl(fieldName, 'string');
                                                } else if (field.array) {
                                                    return field.type[0] === Object
                                                        ? YMLDefinitionPropObjArrayTpl(fieldName)
                                                        : YMLDefinitionPropPrimArrayTpl(fieldName, getInterfaceEquivalentType(field.type[0]));
                                                } else {
                                                    return field.type === Object
                                                        ? YMLDefinitionPropObjTpl(fieldName)
                                                        : YMLDefinitionPropPrimTpl(fieldName, getInterfaceEquivalentType(field.type))
                                                }
                                            }).join('\n')
                                    )),
                        
                                Object.entries(schema.apis)
                                    .map(([apiName, api]: [string, ApiEntitySchema]) => YMLDefinitionTypeTpl(
                                        `Pull${capitalize(apiName)}`,
                                        Object.entries(api.model)
                                            .filter(([fieldName, field]) => fields[apiName].update.pull.includes(fieldName))
                                            .map(([fieldName, field]) => {
                                                if (field.relation && field.array) {
                                                    return YMLDefinitionPropPrimArrayTpl(fieldName, 'string');
                                                } else if (field.relation) {
                                                    return YMLDefinitionPropPrimTpl(fieldName, 'string');
                                                } else if (field.array) {
                                                    return field.type[0] === Object
                                                        ? YMLDefinitionPropObjArrayTpl(fieldName)
                                                        : YMLDefinitionPropPrimArrayTpl(fieldName, getInterfaceEquivalentType(field.type[0]));
                                                } else {
                                                    return field.type === Object
                                                        ? YMLDefinitionPropObjTpl(fieldName)
                                                        : YMLDefinitionPropPrimTpl(fieldName, getInterfaceEquivalentType(field.type))
                                                }
                                            }).join('\n')
                                    )),

                                    Object.entries(schema.apis)
                                        .map(([apiName, api]: [string, ApiEntitySchema]) => YMLDefinitionTypeTpl(
                                            `Update${capitalize(apiName)}`,
                                            Object.entries({
                                                id: {
                                                    type: String,
                                                    relation: false,
                                                    array: false,
                                                },
                                                set: {
                                                    type: `Set${capitalize(apiName)}`,
                                                    relation: true,
                                                    related: `Set${capitalize(apiName)}`,
                                                    array: false,
                                                },
                                                push: {
                                                    type: `Push${capitalize(apiName)}`,
                                                    relation: true,
                                                    related: `Push${capitalize(apiName)}`,
                                                    array: false,
                                                },
                                                pull: {
                                                    type: `Pull${capitalize(apiName)}`,
                                                    relation: true,
                                                    related: `Pull${capitalize(apiName)}`,
                                                    array: false,
                                                },
                                            }).map(([fieldName, field]) => {
                                                if (field.relation && field.array) {
                                                    return YMLDefinitionPropRelArrayTpl(fieldName, field.type as any, true);
                                                } else if (field.relation) {
                                                    return YMLDefinitionPropRelTpl(fieldName, field.type as any, true);
                                                } else if (field.array) {
                                                    return field.type[0] === Object
                                                        ? YMLDefinitionPropObjArrayTpl(fieldName)
                                                        : YMLDefinitionPropPrimArrayTpl(fieldName, getInterfaceEquivalentType(field.type[0]));
                                                } else {
                                                    return YMLDefinitionPropPrimTpl(fieldName, getInterfaceEquivalentType(field.type));
                                                }
                                            }).join('\n')
                                        ))
                            
                    ).join('\n'))
        }
    };
}
