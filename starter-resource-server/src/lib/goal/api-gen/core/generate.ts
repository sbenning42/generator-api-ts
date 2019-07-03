import { ctx as getCtx } from "./ctx";
import { ApiEntityModelFieldTypeUnion, ApiEntitySchema } from "./types";
import { getInterfaceEquivalentType } from "./get-interface-equivalent-type";
import { ObjectID } from "mongodb";

export const capitalize = (s: string) => `${s.slice(0, 1).toLocaleUpperCase()}${s.slice(1)}`;

export const applyTemplate = <A extends { [key: string]: string }>(template: string, args: A) => Object.entries(args || {})
    .reduce((steps, [key, value]) => steps.replace(new RegExp(`\\\$${key}`, 'g'), value), template);

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
    const entries = Object.entries(routes).filter(([k]) => verbs.includes(k.split(' ')[0].toUpperCase()));
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
            array: field.array ? '[]' : '',
            type: getInterfaceEquivalentType(field.type),
        })).join('\n'),
    });
}

export function generate() {
    const ctx = getCtx();
    const {
        schema,
        fields
    } = ctx;
    return ctx.generated = {
        typescript: Object.entries(schema.apis)
            .reduce((all, [apiName, api]: [string, ApiEntitySchema]) => {
                all[apiName] = {
                    types: {
                        model: interfaceTPL(
                            capitalize(apiName),
                            Object.entries({ ...api.model, id: { type: 'ID', required: true, array: false } })
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
                            Object.entries({ ...api.model, id: { type: 'ID', required: true, array: false } })
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
                        utils: ``,
                        service: ``,
                        controller: ``,
                        router: ``,
                    }
                };
                return all;
            }, {}),
        swagger: {
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
                                        return YMLDefinitionPropRelArrayTpl(fieldName, field.related);
                                    } else if (field.relation) {
                                        return YMLDefinitionPropRelTpl(fieldName, field.related);
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
                                    Object.entries({ ...api.model, id: { type: 'ID', required: true, array: false } as any })
                                        .filter(([fieldName, field]) => fields[apiName].create.includes(fieldName))
                                        .map(([fieldName, field]) => {
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
                                )),
                        
                                Object.entries(schema.apis)
                                    .map(([apiName, api]: [string, ApiEntitySchema]) => YMLDefinitionTypeTpl(
                                        `Set${capitalize(apiName)}`,
                                        Object.entries(api.model)
                                            .filter(([fieldName, field]) => fields[apiName].update.set.includes(fieldName))
                                            .map(([fieldName, field]) => {
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
                                    )),
                        
                                Object.entries(schema.apis)
                                    .map(([apiName, api]: [string, ApiEntitySchema]) => YMLDefinitionTypeTpl(
                                        `Push${capitalize(apiName)}`,
                                        Object.entries(api.model)
                                            .filter(([fieldName, field]) => fields[apiName].update.push.includes(fieldName))
                                            .map(([fieldName, field]) => {
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
                                    )),
                        
                                Object.entries(schema.apis)
                                    .map(([apiName, api]: [string, ApiEntitySchema]) => YMLDefinitionTypeTpl(
                                        `Pull${capitalize(apiName)}`,
                                        Object.entries(api.model)
                                            .filter(([fieldName, field]) => fields[apiName].update.pull.includes(fieldName))
                                            .map(([fieldName, field]) => {
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
                                    )),
                            
                    ).join('\n'))
        }
    };
}
