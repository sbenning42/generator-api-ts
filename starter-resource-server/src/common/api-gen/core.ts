import fs from 'fs';
import YAML from 'yamljs';
import {
    TSTypeTpl,
    TSUpdateBodyTpl,
    TSChangesBodyTpl,
    TSCreateBodyTpl,
    TSTypePropTpl,
    TSCreateBodyPropTpl,
    TSChangesBodyPropTpl,
    TSMongooseSchemaTpl,
    TSMongooseModelTpl,
    TSMongooseSchemaArrayPropTpl,
    TSMongooseSchemaPropTpl,
    TSTypeImportsTpl,
    TSMongooseModelPopulateTpl,
    TSMongooseModelProjectionTpl,
    TSMongooseModelProjectionPropTpl,
    TSUtilsTpl,
    TSModuleImportsTpl,
    TSServicesTpl,
    TSMiddlewaresTpl,
    TSControllersTpl,
    TSRouterTpl,
    TSApplyAPI,
    TSRouterRouteWithMiddlewareTpl,
    TSRouterRouteTpl,
    TSPushBodyPropTpl,
    TSPullBodyPropTpl,
    TSPullBodyTpl,
    TSPushBodyTpl,
    TSRelationManyUtilsTpl,
    TSRelationMutationUtilsTpl,
    TSRelationQueryUtilsTpl,
    TSRelationQueryControllersTpl,
    TSRelationMutationControllersTpl,
    TSRelationArrayMutationControllersTpl,
} from './templates/TS';
import {
    _APISchemaEntity,
    APISchema,
    strictAPISchema,
    Mixed,
    ObjectId,
    _APISchemaEntityProperty,
    _APISchema,
    _APISchemaEntityPropertyTyped,
    _APISchemaEntityRoutes,
    _APISchemaEntityRoute
} from './types';
import { prettifySchema } from './prettier';
import { YMLDefinitionTypeTpl, YMLDefinitionPropRelArrayTpl, YMLDefinitionPropObjArrayTpl, YMLDefinitionPropPrimArrayTpl, YMLDefinitionPropRelTpl, YMLDefinitionPropObjTpl, YMLDefinitionPropPrimTpl, YMLDefinitionTpl, YMLPathsEntityTpl, YMLGetEndpoints, YMLPathsEntityVerbTpl, YMLPathsTpl, epExpress2Swagger, YMLPathsEntityVerbVarsTpl, YMLPathsEntityBodyVarsTpl, YMLPathsEntityVerbRespTpl, YMLPathsEntityVerbArrayRespTpl } from './templates/YML';
import { environment } from '../../environment';


/***************************************** Core **************************************************/

const {
    port
} = environment;

export interface APIEntityFieldGen {
    generated: string; // this is the generated string to write in file
    entity: _APISchemaEntity; // this is a reference to the `parent` entity (for lookup purpose)
    name?: string; // this is a reference to the `parent` entity name (for lookup purpose)
    args?: any[]; // Not Implemented Yet. @todo: preserve the { TS_*** `templates`: `args` } map / graph used to generate `generated`
}

/** An `APIEntityGen` object is generated for each `entities` in the `APISchema` */
export interface APIEntityGen {
    TS_types: {
        TS_typeImports: APIEntityFieldGen;
        TS_type: APIEntityFieldGen;
        TS_createBody: APIEntityFieldGen;
        TS_changesBody: APIEntityFieldGen;
        TS_pushBody: APIEntityFieldGen;
        TS_pullBody: APIEntityFieldGen;
        TS_updateBody: APIEntityFieldGen;
        TS_mongooseSchema: APIEntityFieldGen;
        TS_mongooseModel: APIEntityFieldGen;
        TS_mongooseModelProjection: APIEntityFieldGen;
        TS_mongooseModelPopulate: APIEntityFieldGen;
    };
    TS_modules: {
        TS_moduleImports: APIEntityFieldGen;
        TS_utils: APIEntityFieldGen;
        TS_service: APIEntityFieldGen;
        TS_middlewares: APIEntityFieldGen;
        TS_controllers: APIEntityFieldGen;
        TS_router: APIEntityFieldGen;
        TS_routerRoute: APIEntityFieldGen;
        TS_routerRouteWithMiddlewares: APIEntityFieldGen;
        TS_applyAPI: APIEntityFieldGen;
    };
    GQL_schema: {
        GQL_type: APIEntityFieldGen;
        GQL_createBodyType: APIEntityFieldGen;
        GQL_updateBodyType: APIEntityFieldGen;
        GQL_input: APIEntityFieldGen;
        GQL_createBodyinput: APIEntityFieldGen;
        GQL_updateBodyinput: APIEntityFieldGen;
        GQL_query: APIEntityFieldGen;
        GQL_mutation: APIEntityFieldGen;
    };
    GQL_typescript: {
        GQL_resolvers: APIEntityFieldGen;
        GQL_utils: APIEntityFieldGen;
    };
    YML_schema: {
        YML_definitionType: APIEntityFieldGen;
        YML_pathsEntity: APIEntityFieldGen;
    };
}

export class APIGen {

    // not used
    schemas: { s: APISchema<any>, _s: _APISchema<any> }[] = [];

    generate<RS extends { [key: string]: string[] }>(_schema: APISchema<RS>) {
        const schema = strictAPISchema(_schema);
        // not used
        this.schemas.push({ s: _schema, _s: schema });
    
        prettifySchema(schema, console);

        const cap = (s: string) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`; // capitalize
        const pad = (tab: number) => tab ? `    ${pad(tab - 1)}` : ''; // pad with blank
        // `ia` stands for isArray // `ts=true` to have the `constructed` primitive type (eg: not the `Contrustor` type)
        const stringifyType = (type: any, ia: boolean = false, ts: boolean = false) => {
            const str = (s: string) => ia ? (ts ? `${s}[]` : `[${s}]`) : s;
            switch (true) {
                case type === Boolean:
                    return ts ? str('boolean') : str('Boolean');
                case type === Number:
                    return ts ? str('number') : str('Number');
                case type === String:
                    return ts ? str('string') : str('String');
                case type === Date:
                    return str('Date');
                case type === Mixed:
                    return str('Mixed');
                case type === ObjectId:
                    return str('ObjectId');
                default:
                    return str(type);
            }
        };
        const stringifyPropType = (_property: _APISchemaEntityProperty) => {
            const ia = Array.isArray(_property);
            const property = ia ? _property[0] : _property;
            let type = property.type;
            switch (type) {
                case ObjectId:
                    type = property.ref;
                    break;
                case Mixed:
                    type = 'any';
                    break;
                default:
                    break;
            }
            return stringifyType(type, false, true);
        };
        const entities = Object.entries(schema.entities)
            .map(([name, entity]) => ({
                YML_schema: {
                    YML_definitionType: {
                        entity, name,
                        generated: `${
                            YMLDefinitionTypeTpl(
                                cap(name),
                                Object.entries(entity.properties)
                                    .map(([n, e]) => [n, Array.isArray(e) ? e[0] : e, Array.isArray(e)] as [string, _APISchemaEntityPropertyTyped, boolean])
                                    .map(([n, e, ia]) => ia
                                        ? (
                                            !!e.ref
                                                ? YMLDefinitionPropRelArrayTpl(n, cap(e.ref))
                                                : (
                                                    e.type === Mixed
                                                        ? YMLDefinitionPropObjArrayTpl(n)
                                                        : YMLDefinitionPropPrimArrayTpl(n, stringifyType(e.type, false, true))
                                                )
                                        )
                                        : (
                                            !!e.ref
                                                ? YMLDefinitionPropRelTpl(n, cap(e.ref))
                                                : (
                                                    e.type === Mixed
                                                        ? YMLDefinitionPropObjTpl(n)
                                                        : YMLDefinitionPropPrimTpl(n, stringifyType(e.type, false, true))
                                                )
                                        )
                                    ).join('')
                            )
                        }\n${
                            YMLDefinitionTypeTpl(
                                `${cap(name)}CreateBody`,
                                Object.entries(entity.properties)
                                    .filter(([propName, property]) => Array.isArray(property)
                                        ? !property[0].skipCreate
                                        : !property.skipCreate
                                    )
                                    .map(([n, e]) => [n, Array.isArray(e) ? e[0] : e, Array.isArray(e)] as [string, _APISchemaEntityPropertyTyped, boolean])
                                    .map(([n, e, ia]) => ia
                                        ? (
                                            !!e.ref
                                                ? YMLDefinitionPropRelArrayTpl(n, cap(e.ref))
                                                : (
                                                    e.type === Mixed
                                                        ? YMLDefinitionPropObjArrayTpl(n)
                                                        : YMLDefinitionPropPrimArrayTpl(n, stringifyType(e.type, false, true))
                                                )
                                        )
                                        : (
                                            !!e.ref
                                                ? YMLDefinitionPropRelTpl(n, cap(e.ref))
                                                : (
                                                    e.type === Mixed
                                                        ? YMLDefinitionPropObjTpl(n)
                                                        : YMLDefinitionPropPrimTpl(n, stringifyType(e.type, false, true))
                                                )
                                        )
                                    ).join('')
                            )
                        }\n${

                            YMLDefinitionTypeTpl(
                                `${cap(name)}ChangesBody`,
                                Object.entries(entity.properties)
                                    .filter(([propName, property]) => Array.isArray(property)
                                        ? !property[0].skipChanges
                                        : !property.skipChanges
                                    )
                                    .map(([n, e]) => [n, Array.isArray(e) ? e[0] : e, Array.isArray(e)] as [string, _APISchemaEntityPropertyTyped, boolean])
                                    .map(([n, e, ia]) => ia
                                        ? (
                                            !!e.ref
                                                ? YMLDefinitionPropRelArrayTpl(n, cap(e.ref))
                                                : (
                                                    e.type === Mixed
                                                        ? YMLDefinitionPropObjArrayTpl(n)
                                                        : YMLDefinitionPropPrimArrayTpl(n, stringifyType(e.type, false, true))
                                                )
                                        )
                                        : (
                                            !!e.ref
                                                ? YMLDefinitionPropRelTpl(n, cap(e.ref))
                                                : (
                                                    e.type === Mixed
                                                        ? YMLDefinitionPropObjTpl(n)
                                                        : YMLDefinitionPropPrimTpl(n, stringifyType(e.type, false, true))
                                                )
                                        )
                                    ).join('')
                            )
                        
                        }\n${

                            YMLDefinitionTypeTpl(
                                `${cap(name)}PushBody`,
                                Object.entries(entity.properties)
                                    .filter(([propName, property]) => Array.isArray(property) && !property[0].skipChanges)
                                    .map(([n, e]) => [n, Array.isArray(e) ? e[0] : e, Array.isArray(e)] as [string, _APISchemaEntityPropertyTyped, boolean])
                                    .map(([n, e, ia]) => ia
                                        ? (
                                            !!e.ref
                                                ? YMLDefinitionPropRelArrayTpl(n, cap(e.ref))
                                                : (
                                                    e.type === Mixed
                                                        ? YMLDefinitionPropObjArrayTpl(n)
                                                        : YMLDefinitionPropPrimArrayTpl(n, stringifyType(e.type, false, true))
                                                )
                                        )
                                        : (
                                            !!e.ref
                                                ? YMLDefinitionPropRelTpl(n, cap(e.ref))
                                                : (
                                                    e.type === Mixed
                                                        ? YMLDefinitionPropObjTpl(n)
                                                        : YMLDefinitionPropPrimTpl(n, stringifyType(e.type, false, true))
                                                )
                                        )
                                    ).join('')
                            )
                        
                        }\n${

                            YMLDefinitionTypeTpl(
                                `${cap(name)}PullBody`,
                                Object.entries(entity.properties)
                                    .filter(([propName, property]) => Array.isArray(property) && !property[0].skipChanges)
                                    .map(([n, e]) => [n, Array.isArray(e) ? e[0] : e, Array.isArray(e)] as [string, _APISchemaEntityPropertyTyped, boolean])
                                    .map(([n, e, ia]) => ia
                                        ? (
                                            !!e.ref
                                                ? YMLDefinitionPropRelArrayTpl(n, cap(e.ref))
                                                : (
                                                    e.type === Mixed
                                                        ? YMLDefinitionPropObjArrayTpl(n)
                                                        : YMLDefinitionPropPrimArrayTpl(n, stringifyType(e.type, false, true))
                                                )
                                        )
                                        : (
                                            !!e.ref
                                                ? YMLDefinitionPropRelTpl(n, cap(e.ref))
                                                : (
                                                    e.type === Mixed
                                                        ? YMLDefinitionPropObjTpl(n)
                                                        : YMLDefinitionPropPrimTpl(n, stringifyType(e.type, false, true))
                                                )
                                        )
                                    ).join('')
                            )
                        
                        }\n${

                            YMLDefinitionTypeTpl(
                                `${cap(name)}UpdateBody`,
                                [
                                    YMLDefinitionPropPrimTpl('id', 'string'),
                                    YMLDefinitionPropRelTpl('changes', `${cap(name)}ChangesBody`, true),
                                    YMLDefinitionPropRelTpl('push', `${cap(name)}PushBody`, true),
                                    YMLDefinitionPropRelTpl('pull', `${cap(name)}PullBody`, true),
                                ].join('')
                            )
                        
                        }`
                    },
                    YML_pathsEntity: {
                        entity, name, generated: YMLGetEndpoints({
                            ...Object.entries(entity.routes)
                                .filter(([ep, route]) => {
                                    if (
                                        route.skip
                                        || entity.routes.all.skip
                                        ||  (['GET'].some(v => ep.startsWith(v)) && entity.routes.query.skip)
                                        ||  (['POST', 'PUT', 'DELETE'].some(v => ep.startsWith(v)) && entity.routes.mutation.skip)
                                    ) {
                                        return false;
                                    }
                                    return true;
                                })
                                .reduce((all, [k, v]) => ({ ...all, [k]: v }), {})
                        })
                            .map(({ ep, entries }) => YMLPathsEntityTpl(
                                `/${name}s${epExpress2Swagger(ep, { id: 'id' })}`,
                                Object.entries(entries).map(([verb, { key, ep: _ep, route }]: any) => YMLPathsEntityVerbTpl(cap(name))(
                                    verb.toLowerCase(),
                                    getYMLParametersFor(name, entity, entity.properties[route._ref], verb, key, _ep, route, entries, ep),
                                    getYMLResponseFor(name, entity, entity.properties[route._ref], verb, key, _ep, route, entries, ep),
                                    'sample description',
                                    isSecure(name, entity, entity.properties[route._ref], verb, key, _ep, route, entries, ep),
                                )).join('')
                            )).join('')
                    }
                },
                TS_types: {
                    TS_typeImports: {
                        entity, name,
                        generated: TSTypeImportsTpl([], [], schema.context)
                    },
                    TS_type: {
                        entity, name,
                        generated: TSTypeTpl(
                            cap(name),
                            Object.entries(entity.properties)
                                // .filter(([propName, property]) => true) // implements if needed
                                .map(([propName, property]) => TSTypePropTpl(
                                    propName,
                                    stringifyPropType(property),
                                    Array.isArray(property),
                                    Array.isArray(property) ? property[0].required : property.required
                                )).join('\n')
                        )
                    },
                    TS_createBody: {
                        entity, name,
                        generated: TSCreateBodyTpl(
                            cap(name),
                            Object.entries(entity.properties)
                                .filter(([propName, property]) => Array.isArray(property)
                                    ? !property[0].skipCreate
                                    : !property.skipCreate
                                ).map(([propName, property]) => TSCreateBodyPropTpl(
                                    propName,
                                    stringifyPropType(property),
                                    Array.isArray(property),
                                    Array.isArray(property) ? property[0].required : property.required
                                )).join('\n')
                        )
                    },
                    TS_changesBody: {
                        entity, name,
                        generated: TSChangesBodyTpl(
                            cap(name),
                            Object.entries(entity.properties)
                                .filter(([propName, property]) => Array.isArray(property)
                                    ? !property[0].skipChanges
                                    : !property.skipChanges
                                ).map(([propName, property]) => TSChangesBodyPropTpl(
                                    propName,
                                    stringifyPropType(property),
                                    Array.isArray(property),
                                )).join('\n')
                        )
                    },
                    TS_pushBody: {
                        entity, name,
                        generated: TSPushBodyTpl(
                            cap(name),
                            Object.entries(entity.properties)
                                .filter(([propName, property]) => Array.isArray(property) && !property[0].skipChanges)
                                .map(([propName, property]) => TSPushBodyPropTpl(
                                    propName,
                                    stringifyPropType(property),
                                )).join('\n')
                        )
                    },
                    TS_pullBody: {
                        entity, name,
                        generated: TSPullBodyTpl(
                            cap(name),
                            Object.entries(entity.properties)
                                .filter(([propName, property]) => Array.isArray(property) && !property[0].skipChanges)
                                .map(([propName, property]) => TSPullBodyPropTpl(
                                    propName,
                                    stringifyPropType(property),
                                )).join('\n')
                        )
                    },
                    TS_updateBody: {
                        entity, name,
                        generated: TSUpdateBodyTpl(cap(name))
                    },
                    TS_mongooseSchema: {
                        entity, name,
                        generated: TSMongooseSchemaTpl(
                            cap(name),
                            Object.entries(entity.properties)
                                .map(([propName, property]) => [
                                    propName,
                                    Array.isArray(property) ? property[0] : property,
                                    Array.isArray(property)
                                ])
                                // .filter(([propName, property]) => true)
                                .map(([propName, property, isArray]: [string, _APISchemaEntityPropertyTyped, boolean]) => property.ref && isArray
                                    ? TSMongooseSchemaArrayPropTpl(
                                        propName,
                                        stringifyType(property.type, false),
                                        property.ref,
                                        property.required,
                                        property.unique,
                                        property.hidden,
                                        property.default,
                                    )
                                    : TSMongooseSchemaPropTpl(
                                        propName,
                                        stringifyType(property.type, isArray),
                                        property.ref,
                                        property.required,
                                        property.unique,
                                        property.hidden,
                                        property.default,
                                    )
                                ).join('\n')
                        ),
                    },
                    TS_mongooseModel: {
                        entity, name,
                        generated: TSMongooseModelTpl(cap(name))
                    },
                    TS_mongooseModelProjection: {
                        entity, name,
                        generated: TSMongooseModelProjectionTpl(
                            cap(name),
                            Object.entries({
                                createdAt: '',
                                updatedAt: '',
                                ...entity.properties,
                            })
                                .map(([propName]) => TSMongooseModelProjectionPropTpl(propName))
                                .join('\n')
                        )
                    },
                    TS_mongooseModelPopulate: {
                        entity, name,
                        generated: TSMongooseModelPopulateTpl(
                            cap(name),
                            Object.entries(entity.properties)
                                .filter(([, property]) => Array.isArray(property) ? (!!property[0].ref) : !!property.ref)
                                .map(([propName]) => `'${propName}'`)
                                .join(' | ')
                        ),
                    },
                },
                TS_modules: {
                    TS_moduleImports: {
                        entity, name,
                        generated: TSModuleImportsTpl(cap(name), [], schema.config.passport)
                    },
                    TS_utils: {
                        entity, name,
                        generated: TSUtilsTpl(
                            cap(name),
                            Object.entries(entity.properties)
                                .filter(([propName, property]) => Array.isArray(property)
                                    ? !property[0].skipCreate
                                    : !property.skipCreate
                                ).map(([propName]) => `'${propName}'`).join(', '),
                            Object.entries(entity.properties)
                                .filter(([propName, property]) => Array.isArray(property)
                                    ? !property[0].skipChanges
                                    : !property.skipChanges
                                ).map(([propName]) => `'${propName}'`).join(', '),
                            Object.entries(entity.properties)
                                .filter(([propName, property]) => Array.isArray(property) && !property[0].skipChanges)
                                .map(([propName]) => `'${propName}'`).join(', '),
                            Object.entries(entity.properties)
                                .filter(([propName, property]) => Array.isArray(property) && !property[0].skipChanges)
                                .map(([propName]) => `'${propName}'`).join(', '),
                            Object.entries(entity.properties)
                                .map(([propName, property]) => [
                                    propName,
                                    Array.isArray(property) ? property[0] : property,
                                    Array.isArray(property)
                                ] as [string, _APISchemaEntityPropertyTyped, boolean])
                                .filter(([, property]) => !!property.ref)
                                .map(([propName, property, isArray]) => TSRelationQueryUtilsTpl(cap(propName), propName)
                                    + (isArray
                                        ? (/*property.skipChanges ? '' : */TSRelationManyUtilsTpl(cap(propName), propName))
                                        : (/*property.skipChanges ? '' : */TSRelationMutationUtilsTpl(cap(propName), propName)))
                                ).join('\n')
                        )
                    },
                    TS_service: {
                        entity, name, generated: TSServicesTpl(cap(name)),
                    },
                    TS_middlewares: {
                        entity, name, generated: TSMiddlewaresTpl(cap(name)),
                    },
                    TS_controllers: {
                        entity, name, generated: TSControllersTpl(
                            cap(name),
                            Object.entries(entity.properties)
                                .map(([propName, property]) => [
                                    propName,
                                    Array.isArray(property) ? property[0] : property,
                                    Array.isArray(property)
                                ] as [string, _APISchemaEntityPropertyTyped, boolean])
                                .filter(([, property]) => !!property.ref)
                                .map(([propName, property, isArray]) => TSRelationQueryControllersTpl(cap(name), propName)
                                    + (isArray
                                        ? (/*property.skipChanges ? '' : */TSRelationArrayMutationControllersTpl(cap(name), propName))
                                        : (/*property.skipChanges ? '' : */TSRelationMutationControllersTpl(cap(name), propName)))
                                ).join('\n')
                        ),
                    },
                    TS_router: {
                        entity, name, generated: TSRouterTpl(
                            cap(name),
                            [
                                ...Object.entries(entity.routes),
                            ]
                                .filter(([endpoint, route]) => [
                                    'GET', 'POST', 'PUT', 'DELETE'
                                ].some(verb => endpoint.startsWith(verb)))
                                .filter(([endpoint, route]) => !route.skip
                                    && !(endpoint.startsWith('GET') ? entity.routes.query : entity.routes.mutation).skip
                                    && !entity.routes.all.skip
                                )
                                .map(([endpoint, route]) => {
                                    // deconstruct `all`, `query` and `mutation` routes config for later easy access
                                    const
                                        {
                                            auth: {
                                                private: allPrivate,
                                                roles: allRoles,
                                                scopes: allScopes
                                            },
                                            middlewares: _allMiddlewares,
                                            skip: allSkip
                                        } = entity.routes.all,
                                        {
                                            auth: {
                                                private: queryPrivate,
                                                roles: queryRoles,
                                                scopes: queryScopes
                                            },
                                            middlewares: _queryMiddlewares,
                                            skip: querySkip
                                        } = entity.routes.query,
                                        {
                                            auth: {
                                                private: mutationPrivate,
                                                roles: mutationRoles,
                                                scopes: mutationScopes
                                            },
                                            middlewares: _mutationMiddlewares,
                                            skip: mutationSkip
                                        } = entity.routes.mutation,
                                        {
                                            auth: {
                                                private: _private,
                                                roles: roles,
                                                scopes: scopes
                                            },
                                            middlewares: middlewares,
                                            excludeMiddlewares: excludeMiddlewares,
                                            skip: skip,
                                            _ref
                                        } = route;
                                    const [_verb, _ep] = endpoint.split(' ');
                                    const verb = _verb.trim().toUpperCase();
                                    const ep = _ep.trim().toLowerCase();
                                    const allMiddlewares = _allMiddlewares.filter(m => !excludeMiddlewares.includes(m));
                                    const queryMiddlewares = verb === 'GET'
                                        ? _queryMiddlewares.filter(m => !excludeMiddlewares.includes(m))
                                        : [];
                                    const mutationMiddlewares = verb !== 'GET'
                                        ? _mutationMiddlewares.filter(m => !excludeMiddlewares.includes(m))
                                        : [];
                                    const hasMiddlewares = [
                                        allMiddlewares,
                                        queryMiddlewares,
                                        mutationMiddlewares,
                                        middlewares
                                    ].some(middlewares => middlewares && middlewares.length > 0);
                                    let controller: string;
                                    switch (true) {
                                        case verb === `GET` && ep === `/`:
                                            controller = `main${cap(name)}Controllers.getAll`;
                                            break;
                                        case verb === `GET` && ep === `/:id`:
                                            controller = `main${cap(name)}Controllers.getById`;
                                            break;
                                        case _ref !== undefined && verb === `GET` && ep === `/:id/${_ref}`:
                                            controller = `main${cap(name)}Controllers.get${cap(_ref)}Of`;
                                            break;
                                        case verb === `POST` && ep === `/`:
                                            controller = `main${cap(name)}Controllers.create`;
                                            break;
                                        case verb === `PUT` && ep === `/:id`:
                                            controller = `main${cap(name)}Controllers.update`;
                                            break;
                                        case _ref !== undefined && verb === `PUT` && ep === `/:id/${_ref}/add`:
                                            controller = `main${cap(name)}Controllers.add${cap(_ref)}To`;
                                            break;
                                        case _ref !== undefined && verb === `PUT` && ep === `/:id/${_ref}/remove`:
                                            controller = `main${cap(name)}Controllers.remove${cap(_ref)}From`;
                                            break;
                                        case verb === `DELETE` && ep === `/:id`:
                                            controller = `main${cap(name)}Controllers.delete`;
                                            break;
                                        default:
                                            controller = `(_: Request, res: Response) => res.status(504).json({ message: 'Not implementd.' })`;
                                            break;
                                    }
                                    return  hasMiddlewares
                                        ? TSRouterRouteWithMiddlewareTpl(
                                            verb.toLowerCase(),
                                            ep,
                                            controller,
                                            [
                                                ...allMiddlewares,
                                                ...queryMiddlewares,
                                                ...mutationMiddlewares,
                                                ...(middlewares || [])   
                                            ].join(', ')
                                        )
                                        : TSRouterRouteTpl(verb.toLowerCase(), ep, controller);
                                }),
                            name,
                            Object.entries(entity.routes)
                                .filter(([, route]) => route.middlewares && route.middlewares.length > 0)
                                .map(([, route]) => route.middlewares)
                                .reduce((all, middlewares) => all.concat(...middlewares), [])
                        ),
                    },
                    TS_applyAPI: {
                        entity, name, generated: TSApplyAPI(cap(name)),
                    },
                }
            })) as APIEntityGen[];
        const types = entities.map(entity => entity.TS_types);
        const modules = entities.map(entity => entity.TS_modules);
        const outDir = schema.config.outDir;
        const backupOutDir = schema.config.backupOutDir;
        return entities;
        /*
        if (backupOutDir) {
            this.backup(outDir, backupOutDir);
        }
        this.write(outDir, entities)
        */
    }
    
    write(outDir: string, entities: APIEntityGen[]) {
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { mode: 0o755 });
        }
        const types = entities.map(({ TS_types }) => `/********* ${
            TS_types.TS_type.entity.name.toUpperCase()
        } *********/\n\n${
            TS_types.TS_type.generated
        }\n${
            TS_types.TS_createBody.generated
        }\n${
            TS_types.TS_changesBody.generated
        }\n${
            TS_types.TS_pushBody.generated
        }\n${
            TS_types.TS_pullBody.generated
        }\n${
            TS_types.TS_updateBody.generated
        }\n${
            TS_types.TS_mongooseSchema.generated
        }\n${
            TS_types.TS_mongooseModel.generated
        }\n${
            TS_types.TS_mongooseModelProjection.generated
        }\n${
            TS_types.TS_mongooseModelPopulate.generated
        }
        `);
        const definitions = entities.map(({ YML_schema }) => `${
            YML_schema.YML_definitionType.generated
        }`);
        const paths = entities.map(({ YML_schema }) => `${
            YML_schema.YML_pathsEntity.generated
        }`);
        if (definitions.length < 1) {
        }
        if (paths.length < 1) {
        }
        fs.writeFileSync(
            `${outDir}/swagger.yml`,
            `
swagger: "2.0"
info:
    version: "0.0.1"
    title: "Swagger API"
host: localhost:${port}
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
        \n${
                YMLDefinitionTpl([
                    ...definitions,
                    ...[
                        YMLDefinitionTypeTpl('AddIdBody', YMLDefinitionPropPrimTpl('addId', 'string')),
                        YMLDefinitionTypeTpl('AddIdsBody', YMLDefinitionPropPrimArrayTpl('addIds', 'string')),
                        YMLDefinitionTypeTpl('RemoveIdBody', YMLDefinitionPropPrimTpl('removeId', 'string')),
                        YMLDefinitionTypeTpl('RemoveIdsBody', YMLDefinitionPropPrimArrayTpl('removeIds', 'string')),
                    ]
                ].join('\n'))
            }\n${
                YMLPathsTpl(paths.join('\n'))
            }`,
            { flag: 'w', encoding: 'utf8', mode: 0o644 }
        );
        fs.writeFileSync(
            `${outDir}/types.ts`,
            entities[0].TS_types.TS_typeImports.generated + types.join('\n'),
            { flag: 'w', encoding: 'utf8', mode: 0o644 }
        );
        entities.forEach(({ TS_modules }) => {
            if (!fs.existsSync(`${outDir}/${TS_modules.TS_utils.name}`)) {
                fs.mkdirSync(`${outDir}/${TS_modules.TS_utils.name}`, { mode: 0o755 });
            }
            fs.writeFileSync(
                `${outDir}/${TS_modules.TS_utils.name}/${TS_modules.TS_utils.name}.ts`,
                `${
                    TS_modules.TS_moduleImports.generated
                }\n${
                    `/********* ${TS_modules.TS_utils.name.toUpperCase()} Module *********/`
                }\n\n${
                    TS_modules.TS_utils.generated
                }\n${
                    TS_modules.TS_service.generated
                }\n${
                    TS_modules.TS_middlewares.generated
                }\n${
                    TS_modules.TS_controllers.generated
                }\n${
                    TS_modules.TS_router.generated
                }\n${
                    TS_modules.TS_applyAPI.generated
                }`,
                { flag: 'w', encoding: 'utf8', mode: 0o644 }
            );
        });
        const jsonSwagger = YAML.load(`${outDir}/swagger.yml`);
        fs.writeFileSync(`${outDir}/swagger.json`, JSON.stringify(jsonSwagger), { flag: 'w', encoding: 'utf8', mode: 0o644 });
    }
    
    backup(outDir: string, backupOutDir: string) {

    }
}


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
            return `${YMLPathsEntityBodyVarsTpl(`${cap(name)}CreateBody`, '')}`;
        case verb === 'GET' && ep === '/:id':
            return `${YMLPathsEntityVerbVarsTpl('id', '')}`;
        case verb === 'PUT' && ep === '/:id':
            return `${YMLPathsEntityVerbVarsTpl('id', '')}\n${YMLPathsEntityBodyVarsTpl(`${cap(name)}UpdateBody`, '')}`;
        case verb === 'DELETE' && ep === '/:id':
            return `${YMLPathsEntityVerbVarsTpl('id', '')}`;
        case verb === 'GET' && ep === `/:id/${route._ref}`:
            return `${YMLPathsEntityVerbVarsTpl('id', '')}`;
        case verb === 'PUT' && ep === `/:id/${route._ref}/add`:
            return `${YMLPathsEntityVerbVarsTpl('id', '')}\n${YMLPathsEntityBodyVarsTpl(Array.isArray(entity.properties[route._ref]) ? `AddIdsBody` : `AddIdBody`, '')}`;
        case verb === 'PUT' && ep === `/:id/${route._ref}/remove`:
            return `${YMLPathsEntityVerbVarsTpl('id', '')}\n${YMLPathsEntityBodyVarsTpl(Array.isArray(entity.properties[route._ref]) ? `RemoveIdsBody` : `RemoveIdBody`, '')}`;
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
    //console.log(ref, route._ref, entity.properties[route._ref] ? (Array.isArray(entity.properties[route._ref]) ? entity.properties[route._ref][0].ref : entity.properties[route._ref].ref) : 'no ref');
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
        case verb === 'GET' && ep === `/:id/${route._ref}`:
            return Array.isArray(entity.properties[route._ref]) ? `${YMLPathsEntityVerbArrayRespTpl(ref[0].ref)}` : `${YMLPathsEntityVerbRespTpl(ref.ref)}`;
        case verb === 'PUT' && ep === `/:id/${route._ref}/add`:
            return Array.isArray(entity.properties[route._ref]) ? `${YMLPathsEntityVerbArrayRespTpl(ref[0].ref)}` : `${YMLPathsEntityVerbRespTpl(ref.ref)}`;
        case verb === 'PUT' && ep === `/:id/${route._ref}/remove`:
            return Array.isArray(entity.properties[route._ref]) ? `${YMLPathsEntityVerbArrayRespTpl(ref[0].ref)}` : `${YMLPathsEntityVerbRespTpl(ref.ref)}`;
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
    return route && (
        !(route.excludeMiddlewares && route.excludeMiddlewares.includes('jwt'))
        && (
            (route.middlewares && route.middlewares.includes('jwt'))
            || (entity.routes.all && entity.routes.all.middlewares.includes('jwt'))
            || (verb === 'GET' && entity.routes.query && entity.routes.query.middlewares.includes('jwt'))
            || (verb !== 'GET' && entity.routes.mutation && entity.routes.mutation.middlewares.includes('jwt'))
        )
    )    
}
