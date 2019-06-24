import { MySchema, _MyField, _MySchema, MyService, _MyEntities } from './types';

function assignEndpoint(name: string) {
    switch (name) {
        case 'readAll':
            return `get /`;
        case 'readOne':
            return `get /:id`;
        case 'create':
            return `post /`;
        case 'update':
            return `put /:id`;
        case 'delete':
            return `delete /:id`;
        default:
            return '';
    }
}

function getSwaggerParameters(name: string, service: MyService) {
    switch (name) {
        case 'readAll':
            return `[]`;
        case 'readOne':
            return `[{"name": "id", "in": "path", "required": true, "description": "The 'id' of entity", "type": "string"}]`;
        case 'create':
            return `[{"name": "body", "in": "body", "description": "Body", "schema": {"$ref": "#/definitions/CreatePayload"}}]`;
        case 'update':
            return `[{"name": "id", "in": "path", "required": true, "description": "The 'id' of entity", "type": "string"}, {"name": "body", "in": "body", "description": "Body", "schema": {"$ref": "#/definitions/UpdatePayload"}}]`;
        case 'delete':
            return `[{"name": "id", "in": "path", "required": true, "description": "The 'id' of entity", "type": "string"}]`; 
        default:
            return '';
    }
}
function getSwaggerResponses(name: string, service: MyService) {
    switch (name) {
        case 'readAll':
            return `{"200": {"description": "Success result", "schema": {"$ref": "#/definitions/"}}, "400": {"description": "Failure error", "schema": {"$ref": "#/definitions/Error"}}}`;
        case 'readOne':
            return `{"200": {"description": "Success result", "schema": {"$ref": "#/definitions/"}}, "400": {"description": "Failure error", "schema": {"$ref": "#/definitions/Error"}}}`;
        case 'create':
            return `{"200": {"description": "Success result", "schema": {"$ref": "#/definitions/"}}, "400": {"description": "Failure error", "schema": {"$ref": "#/definitions/Error"}}}`;
        case 'update':
            return `{"200": {"description": "Success result", "schema": {"$ref": "#/definitions/"}}, "400": {"description": "Failure error", "schema": {"$ref": "#/definitions/Error"}}}`;
        case 'delete':
            return `{"200": {"description": "Success result", "schema": {"$ref": "#/definitions/"}}, "400": {"description": "Failure error", "schema": {"$ref": "#/definitions/Error"}}}`; 
        default:
            return '';
    }
}
function getGraphqlParameters(name: string, service: MyService) {
    switch (name) {
        case 'readAll':
            return ``;
        case 'readOne':
            return ``;
        case 'create':
            return ``;
        case 'update':
            return ``;
        case 'delete':
            return ``; 
        default:
            return '';
    }
}
function getGraphqlResponse(name: string, service: MyService) {
    switch (name) {
        case 'readAll':
            return ``;
        case 'readOne':
            return ``;
        case 'create':
            return ``;
        case 'update':
            return ``;
        case 'delete':
            return ``; 
        default:
            return '';
    }
}

export function privatise(schema: MySchema) {
    const entities: _MyEntities = Object.entries(schema.entities)
        .reduce((entities, [name, entity]) => ({
            ...entities,
            [name]: {
                name,
                fields: Object.entries(entity.fields)
                    .reduce((fields, [fieldName, field]) => {
                        const _field = (field['type'] ? field : { type: field }) as _MyField;
                        const _default = _field.default;
                        return {
                            ...fields,
                            [fieldName]: {
                                name: fieldName,
                                parent: name,
                                type: ((Array.isArray(_field.type) || (typeof(_field.type) === 'string' && _field.type.includes('[')))
                                    ? (Array.isArray(_field.type) ? _field.type[0] : _field.type.replace('[', '').replace(']', ''))
                                    : _field.type),
                                returnType: typeof(_field.type) === 'function' ? (_field.returnType || 'Object') : undefined,
                                default: _default,
                                autoReverse: _field.autoReverse !== undefined ? _field.autoReverse : (typeof(_field.type) === 'string' ? false : undefined),
                                attributes: {
                                    required: (_field.attributes || {} as any).required,
                                    unique: (_field.attributes || {} as any).unique,
                                    select: (_field.attributes || {} as any).select,
                                    isArray: Array.isArray(_field.type) || (typeof(_field.type) === 'string' && _field.type.includes('[')),
                                    isRelated: typeof(_field.type) === 'string',
                                    can: {
                                        read: (_field.attributes || {} as any).can
                                            ? (typeof(_field.attributes.can) === 'function' ? _field.attributes.can : (_field.attributes.can.read || (() => true)))
                                            : (() => true),
                                        create: (_field.attributes || {} as any).can
                                            ? (typeof(_field.attributes.can) === 'function' ? _field.attributes.can : (_field.attributes.can.create || (() => true)))
                                            : (() => true),
                                        update: (_field.attributes || {} as any).can
                                            ? (typeof(_field.attributes.can) === 'function' ? _field.attributes.can : (_field.attributes.can.update || (() => true)))
                                            : (() => true),
                                    }
                                }
                            },
                        };
                    }, {}),
                services: Object.entries(entity.services || {})
                    .filter(([serviceName]) => !['all', 'query', 'mutation'].includes(serviceName))
                    .reduce((services, [serviceName, service]) => {
                        service.endpoint = service.endpoint !== undefined ? service.endpoint : assignEndpoint(serviceName);
                        const allMiddlewares = ((entity.services || {}).all || {}).middlewares || [];
                        const allExcludeMiddlewares = ((entity.services || {}).all || {}).excludeMiddlewares || [];
                        const queryMiddlewares = ((entity.services || {}).query || {}).middlewares || [];
                        const queryExcludeMiddlewares = ((entity.services || {}).query || {}).excludeMiddlewares || [];
                        const mutationMiddlewares = ((entity.services || {}).mutation || {}).middlewares || [];
                        const mutationExcludeMiddlewares = ((entity.services || {}).mutation || {}).excludeMiddlewares || [];
                        const baseMiddlewares = service.middlewares || [];
                        const baseExcludeMiddlewares = service.excludeMiddlewares || [];
                        const excludeMiddlewares = [
                            ...allExcludeMiddlewares,
                            ...((service.endpoint.includes('get') || service.endpoint.includes('GET'))
                                ? queryExcludeMiddlewares
                                : mutationExcludeMiddlewares
                            ),
                            ...baseExcludeMiddlewares
                        ];
                        const middlewares = [
                            ...allMiddlewares,
                            ...((service.endpoint.includes('get') || service.endpoint.includes('GET'))
                                ? queryMiddlewares
                                : mutationMiddlewares
                            ),
                            ...baseMiddlewares
                        ].filter(m => !excludeMiddlewares.includes(m));
                        const allCan =((entity.services || {}).all || {}).can || [];
                        const queryCan =((entity.services || {}).query || {}).can || [];
                        const mutationCan =((entity.services || {}).mutation || {}).can || [];
                        const thisCan = service.endpoint.includes('get') || service.endpoint.includes('GET') ? queryCan : mutationCan;
                        const baseCan = service.can || [];
                        const can = baseCan ? baseCan : ( thisCan ? thisCan : ( allCan ? allCan : () => true ) );
                        return {
                            ...services,
                            [serviceName]: {
                                name: serviceName,
                                base: service.base || entity.name,
                                verb: service.endpoint.split(' ')[0].toUpperCase(),
                                endpoint: service.endpoint.split(' ')[1].toLowerCase(),
                                exclude: service.exclude !== undefined ? service.exclude : false,
                                swaggerParameters: service.swaggerParameters || getSwaggerParameters(serviceName, service),
                                swaggerResponses: service.swaggerResponses || getSwaggerResponses(serviceName, service),
                                grapgqlParameters: service.grapgqlParameters || getGraphqlParameters(serviceName, service),
                                grapgqlResponse: service.grapgqlResponse || getGraphqlResponse(serviceName, service),
                                middlewares, can
                            },
                        };
                    }, { 
                        readAll: {
                            name: 'readAll',
                            verb: 'GET',
                            endpoint: `/`,
                            swaggerParameters: getSwaggerParameters('readAll', undefined),
                            swaggerRespones: getSwaggerResponses('readAll', undefined),
                            graphqlParameters: getGraphqlParameters('readAll', undefined),
                            graphqlResponse: getGraphqlResponse('readAll', undefined),
                            middlewares: [],
                            can: () => true,
                            exclude: false,
                        },
                        readOne: {
                            name: 'readOne',
                            verb: 'GET',
                            endpoint: `/:id`,
                            swaggerParameters: getSwaggerParameters('readOne', undefined),
                            swaggerRespones: getSwaggerResponses('readOne', undefined),
                            graphqlParameters: getGraphqlParameters('readOne', undefined),
                            graphqlResponse: getGraphqlResponse('readOne', undefined),
                            middlewares: [],
                            can: () => true,
                            exclude: false,
                        },
                        create: {
                            name: 'create',
                            verb: 'POST',
                            endpoint: `/`,
                            swaggerParameters: getSwaggerParameters('create', undefined),
                            swaggerRespones: getSwaggerResponses('create', undefined),
                            graphqlParameters: getGraphqlParameters('create', undefined),
                            graphqlResponse: getGraphqlResponse('create', undefined),
                            middlewares: [],
                            can: () => true,
                            exclude: false,
                        },
                        update: {
                            name: 'update',
                            verb: 'PUT',
                            endpoint: `/:id`,
                            swaggerParameters: getSwaggerParameters('update', undefined),
                            swaggerRespones: getSwaggerResponses('update', undefined),
                            graphqlParameters: getGraphqlParameters('update', undefined),
                            graphqlResponse: getGraphqlResponse('update', undefined),
                            middlewares: [],
                            can: () => true,
                            exclude: false,
                        },
                        delete: {
                            name: 'delete',
                            verb: 'DELETE',
                            endpoint: `/:id`,
                            swaggerParameters: getSwaggerParameters('delete', undefined),
                            swaggerRespones: getSwaggerResponses('delete', undefined),
                            graphqlParameters: getGraphqlParameters('delete', undefined),
                            graphqlResponse: getGraphqlResponse('delete', undefined),
                            middlewares: [],
                            can: () => true,
                            exclude: false,
                        },
                    }),
            }
        }), {});
    return {
        config: schema.config || {},
        entities
    } as _MySchema;
}
