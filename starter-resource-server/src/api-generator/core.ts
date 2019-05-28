import { templates, replaceThem, replaceIt } from "./templates";

export class APIGenerator {

    generate<O={}, R={}>(schema: CRUDSchemaInput<O, R>) {
        const C = (s: string) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;
        const c = (s: string) => `${s.slice(0, 1).toLowerCase()}${s.slice(1)}`;
        const requireIt = (s: string, isRequired: boolean = false) => `${s}${isRequired ? '' : '?'}`;
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
                    throw new Error(`@generate.gT: Do not know type.` + t);
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
                    return rt.includes('[') ? `[ObjectId]` : `ObjectId`
            }
        };
        const mGT = (t: any) => typeof(t) === 'string' ? t : gT(t);
        const ent2Prop = ({ r=true, m=true, fR=false }={}) => (k: string, v: CRUDSchemaInputPropTyped) => [
            r ? requireIt(k, v.required) : (fR ? requireIt(k) : k),
            m ? mGT(v.type) : gT(v.type)
        ];
        const {
            name,
            type = 'array',
            props,
            relations = {},
            query = {},
            mutation = {},
            skips = [],
        } = schema;
        const Cname = C(name);
        const cname = c(name);
        Object.keys(props).forEach(k => props[k] = typeCRUDSchemaInputProp(props[k]));
        const relationsAsProps = Object.keys(relations).map(k => [k, typeCRUDSchemaInputProp(relations[k])]);
        const propsAndRelationsAsProps = [
            ['_id', { type: String, required: true }],
            ...Object.entries(props),
            ...relationsAsProps,
        ] as [string, CRUDSchemaInputPropTyped][];
        const {
            TS_CreateInputPropTpl,
            TS_CreateInputTpl,
            TS_SchemaPropTpl,
            TS_SchemaTpl,
            TS_TypePropTpl,
            TS_TypeTpl,
            TS_UpdateInputPropTpl,
            TS_UpdateInputTpl,
            TS_UtilsTpl,
            TS_RelationUtilsTpl,
            TS_MiddlewareTpls,
            TS_RelationMiddlewareTpls,
            TS_ControllerTpls,
            TS_RelationControllerTpls,
            TS_RouterTpl,
            TS_SkipableRouterTpl,
            TS_GetAllRouterTpl,
            TS_GetByIdRouterTpl,
            TS_CreateRouterTpl,
            TS_UpdateRouterTpl,
            TS_DeleteRouterTpl,
            TS_GetRelationRouterTpl,
            TS_AddRelationRouterTpl,
            TS_RemoveRelationRouterTpl,
            TS_MaybeMiddlewareTpl
        } = templates;
        const typePropsTpl = replaceThem(TS_TypePropTpl, propsAndRelationsAsProps, ent2Prop());
        const typeTpl = replaceIt(TS_TypeTpl, Cname, typePropsTpl);
        const createInputPropsTpl = replaceThem(TS_CreateInputPropTpl, Object.entries(props), ent2Prop({m:false}));
        const createInputTpl = replaceIt(
            TS_CreateInputTpl,
            Cname,
            createInputPropsTpl,
            Object.keys(props).map(k => `'${k}'`).toString()
        );
        const updateInputPropsTpl = replaceThem(TS_UpdateInputPropTpl, Object.entries(props), ent2Prop({r:false,m:false,fR:true}));
        const updateInputTpl = replaceIt(
            TS_UpdateInputTpl,
            Cname,
            updateInputPropsTpl,
            Object.keys(props)
                .filter(k => !props[k].hidden)
                .map(k => `'${k}'`).toString()
        );
        const schemaPropsTpl = replaceThem(
            { tpl: TS_SchemaPropTpl, glue: '\n        ' },
            propsAndRelationsAsProps.filter(([k]) => k !== '_id'),
            (k: string, v: CRUDSchemaInputPropTyped) => [
                k,
                gTR(mGT(v.type)),
                v.required ? 'true' : 'false',
                JSON.stringify(v.default),
                v.unique ? 'true' : 'false',
                v.hidden ? 'true' : 'false',
                typeof(v.type) === 'string' ? (v.type as string).replace('[', '').replace(']', '') : undefined
            ]
        )
            .replace(/\s*unique: false,/g, '')
            .replace(/\s*required: false,/g, '')
            .replace(/\s*hidden: false,/g, '')
            .replace(/\s*default: undefined,/g, '')
            .replace(/\s*ref: 'undefined',/g, '');
        const schemaTpl = replaceIt(TS_SchemaTpl, Cname, schemaPropsTpl);
        const utilsTpl = replaceIt(TS_UtilsTpl, Cname);
        const relationUtilsTpls = replaceThem(TS_RelationUtilsTpl, Object.entries(relations), k => [Cname, C(k), k]);
        const middlewareTpls = replaceIt(TS_MiddlewareTpls, Cname);
        const controllerTpls = replaceIt(TS_ControllerTpls, Cname);
        const relationMiddlewareTpls = replaceThem(TS_RelationMiddlewareTpls, Object.entries(relations), k => [Cname, C(k)]);
        const relationControllerTpls = replaceThem(TS_RelationControllerTpls, Object.entries(relations), k => [Cname, C(k)]);
        const glue = '\n            ';
        const skippedRouterTpl = replaceIt(
            TS_SkipableRouterTpl,
            Cname,
            `${cname}s`,
            (
                (query[`getAll${Cname}`] && query[`getAll${Cname}`].skip)
                    || skips.includes('all')
                    || skips.includes('query')
                    || skips.includes(`getAll${Cname}`)
            )
                ? ''
                : replaceIt(
                    TS_GetAllRouterTpl,
                    Cname,
                    (query[`ALL`] && query[`ALL`].middlewares.toString() || '')
                        + (query[`getAll${Cname}`] && query[`getAll${Cname}`].middlewares.toString() || ''),
                ),
            (
                (query[`getById${Cname}`] && query[`getById${Cname}`].skip)
                    || skips.includes('all')
                    || skips.includes('query')
                    || skips.includes(`getById${Cname}`)
            )
                ? ''
                : (glue + replaceIt(
                    TS_GetByIdRouterTpl,
                    Cname,
                    (query[`ALL`] && query[`ALL`].middlewares.toString() || '')
                        + (query[`getById${Cname}`] && query[`getById${Cname}`].middlewares.toString() || ''),
                )),
            (
                (mutation[`create${Cname}`] && mutation[`create${Cname}`].skip)
                    || skips.includes('all')
                    || skips.includes('mutation')
                    || skips.includes(`create${Cname}`)
            )    
                ? ''
                : (glue + replaceIt(
                    TS_CreateRouterTpl,
                    Cname,
                    (mutation[`ALL`] && mutation[`ALL`].middlewares.toString() || '')
                        + (mutation[`create${Cname}`] && mutation[`create${Cname}`].middlewares.toString() || ''),
                )),
            (
                (mutation[`update${Cname}`] && mutation[`update${Cname}`].skip)
                    || skips.includes('all')
                    || skips.includes('mutation')
                    || skips.includes(`update${Cname}`)
            )
                ? ''
                : (glue + replaceIt(
                    TS_UpdateRouterTpl,
                    Cname,
                    (mutation[`ALL`] && mutation[`ALL`].middlewares.toString() || '')
                        + (mutation[`update${Cname}`] && mutation[`update${Cname}`].middlewares.toString() || ''),
                )),
            (
                (mutation[`delete${Cname}`] && mutation[`delete${Cname}`].skip)
                    || skips.includes('all')
                    || skips.includes('mutation')
                    || skips.includes(`delete${Cname}`)
            )
                ? ''
                : (glue + replaceIt(
                    TS_DeleteRouterTpl,
                    Cname,
                    (mutation[`ALL`] && mutation[`ALL`].middlewares.toString() || '')
                        + (mutation[`delete${Cname}`] && mutation[`delete${Cname}`].middlewares.toString() || ''),
                )),
            replaceThem(
                { tpl: `${glue}${TS_GetRelationRouterTpl}`, glue },
                Object.entries(relations).filter(([name, type]) => {
                    const key = Object.keys(query).find(_k => _k === `get${Cname}${C(name)}`);
                    const getQuery = query[key];
                    return !(skips.includes('all')
                        || skips.includes('query')
                        || skips.includes(`get${Cname}${C(name)}`))
                        && (!getQuery
                        || getQuery.skip !== true);
                }),
                (k, v) => {
                    const key = Object.keys(query).find(_k => _k === `get${Cname}${C(k)}`);
                    const getQuery = query[key];
                    return [
                        k,
                        Cname,
                        C(k),
                        (query['ALL'] && query[`ALL`].middlewares.toString() || '')
                            + (getQuery && getQuery.middlewares.toString() || ''),
                    ];
                }
            ),
            replaceThem(
                { tpl: `${glue}${TS_AddRelationRouterTpl}`, glue },
                Object.entries(relations).filter(([name, type]) => {
                    const key = Object.keys(mutation).find(_k => _k === `add${Cname}${C(name)}`);
                    const addMutation = mutation[key];
                    return !(skips.includes('all')
                        && skips.includes('mutation')
                        && skips.includes(`add${Cname}${C(name)}`))
                        && (!addMutation
                        || addMutation.skip !== true);
                }),
                k => {
                    const key = Object.keys(mutation).find(_k => _k === `add${Cname}${C(k)}`);
                    const addMutation = mutation[key];
                    return [
                        k,
                        Cname,
                        C(k),
                        (mutation['ALL'] && mutation[`ALL`].middlewares.toString() || '')
                            + (addMutation && addMutation.middlewares.toString() || ''),
                    ];
                }
            ),
            replaceThem(
                { tpl: `${glue}${TS_RemoveRelationRouterTpl}`, glue },
                Object.entries(relations).filter(([name, type]) => {
                    const key = Object.keys(mutation).find(_k => _k === `remove${Cname}${C(name)}`);
                    const removeMutation = mutation[key];
                    return !(skips.includes('all')
                        && skips.includes('mutation')
                        && skips.includes(`remove${Cname}${C(name)}`))
                        && (!removeMutation
                        || removeMutation.skip !== true);
                }),
                k => {
                    const key = Object.keys(mutation).find(_k => _k === `remove${Cname}${C(k)}`);
                    const removeMutation = mutation[key];
                    return [
                        k,
                        Cname,
                        C(k),
                        (mutation['ALL'] && mutation[`ALL`].middlewares.toString() || '')
                            + (removeMutation && removeMutation.middlewares.toString() || ''),
                    ];
                }
            )
        ).replace(/\n            \n/g, '\n');
        const defs = {
            Cname,
            cname,
            typeTpl,
            createInputTpl,
            updateInputTpl,
            schemaTpl,
            utilsTpl,
            relationUtilsTpls,
            middlewareTpls,
            relationMiddlewareTpls,
            controllerTpls,
            relationControllerTpls,
            skippedRouterTpl
        }
        return [`

${defs.typeTpl}

${defs.createInputTpl}

${defs.updateInputTpl}

${defs.schemaTpl}

${defs.utilsTpl}

${defs.relationUtilsTpls}

${defs.middlewareTpls}

${defs.relationMiddlewareTpls}

${defs.controllerTpls}

${defs.relationControllerTpls}

${skippedRouterTpl}


`, defs];
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
    skips?: string[];
}


