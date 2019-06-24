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
import {
    GQLSchemaTpl,
    GQLTypeTpl,
    GQLInputTpl,
    GQLQueriesTpl,
    GQLMutationsTpl,
    GQLTypePropertyTpl,
    GQLTypePropertyTypeTpl,
    GQLInputPropertyTpl,
    GQLQueryPropertyWithArgsTpl,
    GQLQueryPropertyTpl,
    GQLMutationPropertyWithArgsTpl,
    GQLMutationPropertyTpl
} from './templates/GQL';

export const cap = (s: string) => s.slice(0, 1).toUpperCase() + s.slice(1);

export const generateGQL= (schema: _APISchema) => {
    const {
        entities
    } = schema;
    return GQLSchemaTpl({
        types: Object.entries(entities).filter(() => true).map(([name, entity]) => {
            const {
                properties,
                routes
            } = entity;
            const _properties = Object.entries(properties)
                .map(([propName, property]) => [propName, Array.isArray(property) ? property[0] : property, Array.isArray(property)] as [string, _APISchemaEntityPropertyTyped, boolean])
                .filter(([propName, property]) => true)
                .map(([propName, property, isArray]) => {
                    const {
                        type,
                        required,
                        ref,
                        unique,
                        hidden,
                        default: _default,
                        skipCreate,
                        skipChanges,
                        skipAdd,
                        skipRemove,
                    } = property;
                    return [
                        propName,
                        GQLTypePropertyTpl({
                            name: propName,
                            type: GQLTypePropertyTypeTpl(type, isArray, required, ref)
                        })] as [string, string];
                }).reduce((props, [propName, propertyStr]) => ({ ...props, [propName]: propertyStr }), {});
            return GQLTypeTpl({ name, properties: Object.values(_properties).join('\n') });
        }).join('\n'),
        inputs: Object.entries(entities).filter(() => true).map(([name, entity]) => {
            const {
                properties,
                routes
            } = entity;
            const _properties = Object.entries(properties)
                .map(([propName, property]) => [propName, Array.isArray(property) ? property[0] : property, Array.isArray(property)] as [string, _APISchemaEntityPropertyTyped, boolean])
                .filter(() => true)
                .map(([propName, property, isArray]) => {
                    const {
                        type,
                        required,
                        ref,
                        unique,
                        hidden,
                        default: _default,
                        skipCreate,
                        skipChanges,
                        skipAdd,
                        skipRemove,
                    } = property;
                    return [
                        propName,
                        GQLInputPropertyTpl({
                            name: propName,
                            type: GQLTypePropertyTypeTpl(type, isArray, required, ref)
                        })] as [string, string];
                }).reduce((props, [propName, propertyStr]) => ({ ...props, [propName]: propertyStr }), {});
            return GQLInputTpl({ name, properties: Object.values(_properties).join('\n') });
        }).join('\n'),
        
        queries: Object.entries(entities).filter(() => true).map(([name, entity]) => {
            const {
                properties,
                routes
            } = entity;
            const _routes = Object.entries(routes).filter(() => true).map(([ep, route]) => {
                const {
                    skip,
                    middlewares,
                    excludeMiddlewares,
                    auth,
                    _ref,
                    
                } = route;
                const parameters = '';
                const responses = '';
                console.log(ep);
                const isArray = Array.isArray(properties[route._ref]) || ep === 'GET /';
                const refProperty = isArray ? (properties[route._ref] || [])[0] : properties[route._ref];
                return [
                    ep,
                    ep.includes(':')
                        ? GQLQueryPropertyWithArgsTpl({
                            name: ep,
                            type: responses || GQLTypePropertyTypeTpl(
                                refProperty ? refProperty.type : cap(name),
                                isArray,
                                false,
                                refProperty ? refProperty.ref : cap(name)
                            ),
                            args: parameters || GQLTypePropertyTpl({ name: 'id', type: 'String', required: true, isArray: false })
                        })
                        : GQLQueryPropertyTpl({
                            name: ep,
                            type: responses || GQLTypePropertyTypeTpl(
                                refProperty ? refProperty.type : cap(name),
                                isArray,
                                false,
                                refProperty ? refProperty.ref : cap(name)
                            )
                        })
                ] as [string, string];
            }).reduce((rts, [ep, routeStr]) => ({ ...rts, [ep]: routeStr }), {})
            return GQLQueriesTpl({ properties: Object.values(_routes).join('\n') });
        }).join('\n'),
        
        mutations: Object.entries(entities).filter(() => true).map(([name, entity]) => {
            const {
                properties,
                routes
            } = entity;
            const _routes = Object.entries(routes).filter(() => true).map(([ep, route]) => {
                const {
                    skip,
                    middlewares,
                    excludeMiddlewares,
                    auth,
                    _ref,
                } = route;
                const parameters = '';
                const responses = '';
                const isArray = Array.isArray(properties[route._ref]);
                const refProperty = isArray ? (properties[route._ref] || [])[0] : properties[route._ref];
                return [
                    ep,
                    ep.includes(':')
                        ? GQLMutationPropertyWithArgsTpl({
                            name: ep,
                            type: responses || GQLTypePropertyTypeTpl(
                                refProperty ? refProperty.type : cap(name),
                                isArray,
                                false,
                                refProperty ? refProperty.ref : cap(name)
                            ),
                            args: parameters || GQLTypePropertyTpl({ name: 'id', type: 'String', required: true, isArray: false })
                        })
                        : GQLMutationPropertyTpl({
                            name: ep,
                            type: responses || GQLTypePropertyTypeTpl(
                                refProperty ? refProperty.type : cap(name),
                                isArray,
                                false,
                                refProperty ? refProperty.ref : cap(name)
                            )
                        })
                ] as [string, string];
            }).reduce((rts, [ep, routeStr]) => ({ ...rts, [ep]: routeStr }), {})
            return GQLMutationsTpl({ properties: Object.values(_routes).join('\n') });
        }).join('\n'),
    });
};
