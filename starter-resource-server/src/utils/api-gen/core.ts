import fs from 'fs';
import { Request, Response, NextFunction } from 'express';
import { Schema } from 'mongoose';
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
    TSRouterRouteTpl
} from './templates/TS';
import { _APISchemaEntity, APISchema, strictAPISchema, Mixed, ObjectId, _APISchemaEntityProperty, _APISchema } from './types';
import { prettifySchema } from './prettier';


/***************************************** Core **************************************************/


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
}

export class APIGen {

    schemas: { s: APISchema<any>, _s: _APISchema<any> }[] = [];

    generate<RS extends { [key: string]: string[] }>(_schema: APISchema<RS>) {
        const schema = strictAPISchema(_schema);
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
                TS_types: {
                    TS_typeImports: {
                        entity, name,
                        generated: TSTypeImportsTpl()
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
                    TS_updateBody: {
                        entity, name,
                        generated: TSUpdateBodyTpl(cap(name))
                    },
                    TS_mongooseSchema: {
                        entity, name,
                        generated: TSMongooseSchemaTpl(
                            cap(name),
                            Object.entries(entity.properties)
                                // .filter(([propName, property]) => true)
                                .map(([propName, property]) => Array.isArray(property)
                                    ? TSMongooseSchemaArrayPropTpl(
                                        propName,
                                        stringifyType(property[0].type, false),
                                        property[0].ref,
                                        property[0].required,
                                        property[0].unique,
                                        property[0].hidden,
                                        property[0].default,
                                    )
                                    : TSMongooseSchemaPropTpl(
                                        propName,
                                        stringifyType(property.type, false),
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
                            Object.entries(entity.properties)
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
                        generated: TSModuleImportsTpl(cap(name))
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
                        )
                    },
                    TS_service: {
                        entity, name, generated: TSServicesTpl(cap(name)),
                    },
                    TS_middlewares: {
                        entity, name, generated: TSMiddlewaresTpl(cap(name)),
                    },
                    TS_controllers: {
                        entity, name, generated: TSControllersTpl(cap(name)),
                    },
                    TS_router: {
                        entity, name, generated: TSRouterTpl(
                            cap(name),
                            Object.entries(entity.routes)
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
                                            middlewares: allMiddlewares,
                                            skip: allSkip
                                        } = entity.routes.all,
                                        {
                                            auth: {
                                                private: queryPrivate,
                                                roles: queryRoles,
                                                scopes: queryScopes
                                            },
                                            middlewares: queryMiddlewares,
                                            skip: querySkip
                                        } = entity.routes.query,
                                        {
                                            auth: {
                                                private: mutationPrivate,
                                                roles: mutationRoles,
                                                scopes: mutationScopes
                                            },
                                            middlewares: mutationMiddlewares,
                                            skip: mutationSkip
                                        } = entity.routes.mutation,
                                        {
                                            auth: {
                                                private: _private,
                                                roles: roles,
                                                scopes: scopes
                                            },
                                            middlewares: middlewares,
                                            skip: skip
                                        } = route;
                                    const hasMiddlewares = [
                                        allMiddlewares,
                                        queryMiddlewares,
                                        mutationMiddlewares,
                                        middlewares
                                    ].some(middlewares => middlewares && middlewares.length > 0);
                                    const [verb, ep] = endpoint.split(' ');
                                    let controller: string;
                                    switch (true) {
                                        case verb === `GET` && ep === `/`:
                                            controller = `main${cap(name)}Controllers.getAll`;
                                            break;
                                        case verb === `GET` && ep === `/:id`:
                                            controller = `main${cap(name)}Controllers.getById`;
                                            break;
                                        case verb === `POST` && ep === `/`:
                                            controller = `main${cap(name)}Controllers.create`;
                                            break;
                                        case verb === `PUT` && ep === `/:id`:
                                            controller = `main${cap(name)}Controllers.update`;
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
                                                ...(allMiddlewares || []),
                                                ...(queryMiddlewares || []),
                                                ...(mutationMiddlewares || []),
                                                ...(middlewares || [])   
                                            ].concat().join(', ')
                                        )
                                        : TSRouterRouteTpl(verb.toLowerCase(), ep, controller);
                                }),
                            name,
                            Object.entries(entity.routes)
                                .filter(([, route]) => route.middlewares && route.middlewares.length > 0)
                                .map(([, route]) => route.middlewares)
                                .reduce((all, middlewares) => all.concat(...middlewares), [])
                        )
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
        const cap = (s: string) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`;
        const pad = (tab: number) => tab ? `    ${pad(tab - 1)}` : '';
        const types = entities.map(({ TS_types }) => `/********* ${
            TS_types.TS_type.entity.name.toUpperCase()
        } *********/\n\n${
            TS_types.TS_type.generated
        }\n${
            TS_types.TS_createBody.generated
        }\n${
            TS_types.TS_changesBody.generated
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
        if (entities.length < 1) {
            return console.log(`Nothing to generate. You might want to add \`entities\` in your \`APISchema\`.`);
        }
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
    }
    
    backup(outDir: string, backupOutDir: string) {

    }
}
