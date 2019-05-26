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
            props, relations,
            query = {},
            mutation = {},
        } = schema;
        const Cname = C(name);
        const cname = c(name);
        Object.keys(schema.props).forEach(k => schema.props[k] = typeCRUDSchemaInputProp(schema.props[k]));
        const relationsAsProps = Object.keys(schema.relations).map(k => [k, typeCRUDSchemaInputProp(schema.relations[k])]);
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
            TS_GetRelationRouterTpl,
            TS_AddRelationRouterTpl,
            TS_RemoveRelationRouterTpl
        } = templates;
        const typePropsTpl = replaceThem(TS_TypePropTpl, propsAndRelationsAsProps, ent2Prop());
        const typeTpl = replaceIt(TS_TypeTpl, Cname, typePropsTpl);
        const createInputPropsTpl = replaceThem(TS_CreateInputPropTpl, Object.entries(props), ent2Prop({m:false}));
        const createInputTpl = replaceIt(TS_CreateInputTpl, Cname, createInputPropsTpl);
        const updateInputPropsTpl = replaceThem(TS_UpdateInputPropTpl, Object.entries(props), ent2Prop({r:false,m:false,fR:true}));
        const updateInputTpl = replaceIt(TS_UpdateInputTpl, Cname, updateInputPropsTpl);
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
                typeof(v.type) === 'string' ? v.type.replace('[', '').replace(']', '') : undefined
            ]
        )
            .replace(/\s*unique: false,/g, '')
            .replace(/\s*required: false,/g, '')
            .replace(/\s*hidden: false,/g, '')
            .replace(/\s*default: undefined,/g, '')
            .replace(/\s*ref: undefined,/g, '');
        const schemaTpl = replaceIt(TS_SchemaTpl, Cname, schemaPropsTpl);
        const utilsTpl = replaceIt(TS_UtilsTpl, Cname);
        const relationUtilsTpls = replaceThem(TS_RelationUtilsTpl, Object.entries(relations), k => [Cname, C(k), k]);
        const middlewareTpls = replaceIt(TS_MiddlewareTpls, Cname);
        const controllerTpls = replaceIt(TS_ControllerTpls, Cname);
        const relationMiddlewareTpls = replaceThem(TS_RelationMiddlewareTpls, Object.entries(relations), k => [Cname, C(k)]);
        const relationControllerTpls = replaceThem(TS_RelationControllerTpls, Object.entries(relations), k => [Cname, C(k)]);
        const glue = '\n            ';
        const skipIt = (what: any) => ([k]) => {
            const e: any[] = Object.entries(what).find(([_k]) => k === _k);
            return !e || (e && e[1].skip !== true);
        };
        const skipQuery = skipIt(query);
        const skipMutation = skipIt(mutation);
        const routerTpl = replaceIt(
            TS_RouterTpl,
            Cname,
            `${cname}s`,
            replaceThem(
                { tpl: `${glue}${TS_GetRelationRouterTpl}`, glue },
                Object.entries(relations).filter(skipQuery as any),
                k => [k, Cname, C(k)]
            ),
            replaceThem(
                { tpl: `${glue}${TS_AddRelationRouterTpl}`, glue },
                Object.entries(relations).filter(skipMutation as any),
                k => [k, Cname, C(k)]
            ),
            replaceThem(
                { tpl: `${glue}${TS_RemoveRelationRouterTpl}`, glue },
                Object.entries(relations).filter(skipMutation as any),
                k => [k, Cname, C(k)]
            )
        ).replace(/\n            \n/g, '\n');
        const defs = {
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
            routerTpl
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

${defs.routerTpl}

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
}

import fs from 'fs';

export function generateAll(
    schemas: CRUDSchemaInput[],
    path: string,
    backup: boolean = true,
) {

    const G = new APIGenerator;
    const prefix = templates.TS_Prefix;
    const definitions = schemas.map(schema => G.generate(schema)[0]).join('\n');

    if (backup) {
        function backupAll() {
            try {
                const old = fs.readFileSync(`${path}`, 'utf8');
                if (old) {
                    fs.writeFileSync(`${path}.${Date.now()}.bk`, old, { encoding: 'utf8', flag: 'w' });
                }
            } catch (error) {
                return console.error('Something Went wrong.', error);                
            }
        }
        backupAll();
    }

    try {
        fs.writeFileSync(`${path}`, prefix + definitions, { encoding: 'utf8', flag: 'w' });
    } catch (error) {
        return console.error('Something Went wrong.', error);
    }

}

