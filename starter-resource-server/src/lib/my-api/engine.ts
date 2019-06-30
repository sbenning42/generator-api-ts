import { MyApiDescription, MyApiDescriptionApiField } from "./types";
import {
    interfacePropertyTPL,
    stringifyTypeForTS,
    interfaceTPL,
    capitalize,
    swaggerObjectDefinitionTPL,
    swaggerObjectPropertyRefArrayDefinitionTPL,
    swaggerObjectPropertyRefDefinitionTPL,
    swaggerObjectPropertyArrayDefinitionTPL,
    swaggerObjectPropertyDefinitionTPL,
    swaggerDefinitionsTPL,
    stringifyTypeForSwagger,
    mongooseSchemaTPL,
    mongooseSchemaPropertyRefTPL,
    mongooseSchemaPropertyTPL,
    stringifyTypeForMongoose,
    stringifyDefaultForMongoose,
    mongooseModelTPL
} from "./templates";
import { CANNOT } from "./constantes";
import { GenCore, gen } from "../gen/core";
import { P, GenContext } from "../gen/types";
import { Request, Response } from "express";

export class MyApiEngine {
    constructor(public api: MyApiDescription) {
        this.prepare();
    }

    private async prepare() {
/*
        const modelsWithRelations = Object.entries(this.api.apis)
            .map(([apiName, api]) => interfaceTPL({
                name: `Populated${capitalize(apiName)}`,
                properties: Object.entries({
                    _id:  { type: 'ID', required: true },
                    ...api.fields
                })
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => interfacePropertyTPL({
                        name: fieldName,
                        required: field.required && (!field.canSelect || (field.canSelect.length === 0)),
                        isArray: Array.isArray(field.type) || (typeof(field.type) === 'string' && field.type.includes('[')),
                        type: stringifyTypeForTS(field.type).replace('[]', '')
                    }))
                    .join('\n')
            }))
            .join('\n');

        const swaggerModelsWithRelations = Object.entries(this.api.apis)
            .map(([apiName, api]) => swaggerObjectDefinitionTPL({
                name: `Populated${capitalize(apiName)}`,
                properties: Object.entries({
                    _id:  { type: 'ID', required: true },
                    ...api.fields
                })
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => typeof(field.type) === 'string'
                    ? (field.type.includes('[')
                        ? swaggerObjectPropertyRefArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(field.type).replace('[]', '') })
                        : swaggerObjectPropertyRefDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(field.type).replace('[]', '') })
                    )
                    : (Array.isArray(field.type)
                        ? swaggerObjectPropertyArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(field.type).replace('[]', '') })
                        : swaggerObjectPropertyDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(field.type).replace('[]', '') })
                    ))
                    .join(',\n')
            }))
            .join(',\n');
        
        const modelsWithoutRelations = Object.entries(this.api.apis)
            .map(([apiName, api]) => interfaceTPL({
                name: capitalize(apiName),
                properties: Object.entries({
                    _id:  { type: 'ID', required: true },
                    ...api.fields
                })
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => interfacePropertyTPL({
                        name: fieldName,
                        required: field.required && (!field.canSelect || (field.canSelect.length === 0)),
                        isArray: Array.isArray(field.type) || (typeof(field.type) === 'string' && field.type.includes('[')),
                        type: stringifyTypeForTS(
                            typeof(field.type) === 'string' && field.type !== 'ID'
                                ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                                : field.type
                        ).replace('[]', '')
                    }))
                    .join('\n')
            }))
            .join('\n');

        const swaggerModelsWithoutRelations = Object.entries(this.api.apis)
            .map(([apiName, api]) => swaggerObjectDefinitionTPL({
                name: `${capitalize(apiName)}`,
                properties: Object.entries({
                    _id:  { type: 'ID', required: true },
                    ...api.fields
                })
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => typeof(field.type) === 'string'
                    ? (field.type.includes('[')
                        ? swaggerObjectPropertyRefArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                            typeof(field.type) === 'string' && field.type !== 'ID'
                                ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                                : field.type
                        ).replace('[]', '') })
                        : swaggerObjectPropertyRefDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                            typeof(field.type) === 'string' && field.type !== 'ID'
                                ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                                : field.type
                        ).replace('[]', '') })
                    )
                    : (Array.isArray(field.type)
                        ? swaggerObjectPropertyArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                            field.type
                        ).replace('[]', '') })
                        : swaggerObjectPropertyDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                            typeof(field.type) === 'string' && field.type !== 'ID'
                                ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                                : field.type
                        ).replace('[]', '') })
                    ))
                    .join(',\n')
            }))
            .join(',\n');
        
        const createPayload = Object.entries(this.api.apis)
            .map(([apiName, api]) => interfaceTPL({
                name: `${capitalize(apiName)}CreatePayload`,
                properties: Object.entries({
                    _id:  { type: 'ID' },
                    ...api.fields
                })
                .filter(([fieldName, field]: [string, MyApiDescriptionApiField]) => !field.canCreate || field.canCreate !== CANNOT)
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => interfacePropertyTPL({
                        name: fieldName,
                        required: field.required && (!field.canCreate || (field.canCreate.length === 0)),
                        isArray: Array.isArray(field.type) || (typeof(field.type) === 'string' && field.type.includes('[')),
                        type: stringifyTypeForTS(
                            typeof(field.type) === 'string' && field.type !== 'ID'
                                ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                                : field.type
                        ).replace('[]', '')
                    }))
                    .join('\n')
            }))
            .join('\n');

        const swaggerCreatePayloads = Object.entries(this.api.apis)
            .map(([apiName, api]) => swaggerObjectDefinitionTPL({
                name: `${capitalize(apiName)}CreatePayload`,
                properties: Object.entries({
                    _id:  { type: 'ID' },
                    ...api.fields
                })
                .filter(([fieldName, field]: [string, MyApiDescriptionApiField]) => !field.canCreate || field.canCreate !== CANNOT)
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => typeof(field.type) === 'string'
                ? (field.type.includes('[')
                    ? swaggerObjectPropertyRefArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                    : swaggerObjectPropertyRefDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                )
                : (Array.isArray(field.type)
                    ? swaggerObjectPropertyArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        field.type
                    ).replace('[]', '') })
                    : swaggerObjectPropertyDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                ))
                    .join(',\n')
            }))
            .join(',\n');
        
        const setPayload = Object.entries(this.api.apis)
            .map(([apiName, api]) => interfaceTPL({
                name: `${capitalize(apiName)}SetPayload`,
                properties: Object.entries(api.fields)
                .filter(([fieldName, field]: [string, MyApiDescriptionApiField]) => !field.canUpdate || field.canUpdate !== CANNOT)
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => interfacePropertyTPL({
                        name: fieldName,
                        required: false,
                        isArray: Array.isArray(field.type) || (typeof(field.type) === 'string' && field.type.includes('[')),
                        type: stringifyTypeForTS(
                            typeof(field.type) === 'string' && field.type !== 'ID'
                                ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                                : field.type
                        ).replace('[]', '')
                    }))
                    .join('\n')
            }))
            .join('\n');

        const swaggerSetPayload = Object.entries(this.api.apis)
            .map(([apiName, api]) => swaggerObjectDefinitionTPL({
                name: `${capitalize(apiName)}SetPayload`,
                properties: Object.entries(api.fields)
                .filter(([fieldName, field]: [string, MyApiDescriptionApiField]) => !field.canUpdate || field.canUpdate !== CANNOT)
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => typeof(field.type) === 'string'
                ? (field.type.includes('[')
                    ? swaggerObjectPropertyRefArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                    : swaggerObjectPropertyRefDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                )
                : (Array.isArray(field.type)
                    ? swaggerObjectPropertyArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        field.type
                    ).replace('[]', '') })
                    : swaggerObjectPropertyDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                ))
                    .join(',\n')
            }))
            .join(',\n');
        
        const pushPayload = Object.entries(this.api.apis)
            .map(([apiName, api]) => interfaceTPL({
                name: `${capitalize(apiName)}PushPayload`,
                properties: Object.entries(api.fields)
                .filter(([fieldName, field]: [string, MyApiDescriptionApiField]) => 
                    (!field.canUpdate || field.canUpdate !== CANNOT)
                    && (Array.isArray(field.type) || (typeof(field.type) === 'string' && field.type.includes('[')))
                )
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => interfacePropertyTPL({
                        name: fieldName,
                        required: false,
                        isArray: true,
                        type: stringifyTypeForTS(
                            typeof(field.type) === 'string' && field.type !== 'ID'
                                ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                                : field.type
                        ).replace('[]', '')
                    }))
                    .join('\n')
            }))
            .join('\n');

        const swaggerPushPayload = Object.entries(this.api.apis)
            .map(([apiName, api]) => swaggerObjectDefinitionTPL({
                name: `${capitalize(apiName)}PushPayload`,
                properties: Object.entries(api.fields)
                .filter(([fieldName, field]: [string, MyApiDescriptionApiField]) => 
                    (!field.canUpdate || field.canUpdate !== CANNOT)
                    && (Array.isArray(field.type) || (typeof(field.type) === 'string' && field.type.includes('[')))
                )
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => typeof(field.type) === 'string'
                ? (field.type.includes('[')
                    ? swaggerObjectPropertyRefArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                    : swaggerObjectPropertyRefDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                )
                : (Array.isArray(field.type)
                    ? swaggerObjectPropertyArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        field.type
                    ).replace('[]', '') })
                    : swaggerObjectPropertyDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                ))
                    .join(',\n')
            }))
            .join(',\n');
        
        const pullPayload = Object.entries(this.api.apis)
            .map(([apiName, api]) => interfaceTPL({
                name: `${capitalize(apiName)}PullPayload`,
                properties: Object.entries(api.fields)
                .filter(([fieldName, field]: [string, MyApiDescriptionApiField]) => 
                    (!field.canUpdate || field.canUpdate !== CANNOT)
                    && (Array.isArray(field.type) || (typeof(field.type) === 'string' && field.type.includes('[')))
                )
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => interfacePropertyTPL({
                        name: fieldName,
                        required: false,
                        isArray: true,
                        type: stringifyTypeForTS(
                            typeof(field.type) === 'string' && field.type !== 'ID'
                                ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                                : field.type
                        ).replace('[]', '')
                    }))
                    .join('\n')
            }))
            .join('\n');

        const swaggerPullPayload = Object.entries(this.api.apis)
            .map(([apiName, api]) => swaggerObjectDefinitionTPL({
                name: `${capitalize(apiName)}PullPayload`,
                properties: Object.entries(api.fields)
                .filter(([fieldName, field]: [string, MyApiDescriptionApiField]) => 
                    (!field.canUpdate || field.canUpdate !== CANNOT)
                    && (Array.isArray(field.type) || (typeof(field.type) === 'string' && field.type.includes('[')))
                )
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => typeof(field.type) === 'string'
                ? (field.type.includes('[')
                    ? swaggerObjectPropertyRefArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                    : swaggerObjectPropertyRefDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                )
                : (Array.isArray(field.type)
                    ? swaggerObjectPropertyArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        field.type
                    ).replace('[]', '') })
                    : swaggerObjectPropertyDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(
                        typeof(field.type) === 'string' && field.type !== 'ID'
                            ? (field.type.includes('[') ? '[ObjectID]' : 'ObjectID')
                            : field.type
                    ).replace('[]', '') })
                ))
                    .join(',\n')
            }))
            .join(',\n');

        
        const updatePayload = Object.entries(this.api.apis)
            .map(([apiName, api]) => interfaceTPL({
                name: `${capitalize(apiName)}UpdatePayload`,
                properties: Object.entries({
                    _id:  { type: 'ID', required: true },
                    set:  { type: `${capitalize(apiName)}SetPayload` },
                    push:  { type: `${capitalize(apiName)}PushPayload` },
                    pull:  { type: `${capitalize(apiName)}PullPayload` },
                })
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => interfacePropertyTPL({
                        name: fieldName,
                        required: field.required,
                        isArray: Array.isArray(field.type) || (typeof(field.type) === 'string' && field.type.includes('[')),
                        type: stringifyTypeForTS(field.type).replace('[]', '')
                    }))
                    .join('\n')
            }))
            .join('\n');

        const swaggerUpdatePayload = Object.entries(this.api.apis)
            .map(([apiName, api]) => swaggerObjectDefinitionTPL({
                name: `${capitalize(apiName)}UpdatePayload`,
                properties: Object.entries({
                    _id:  { type: 'ID', required: true },
                    set:  { type: `${capitalize(apiName)}SetPayload` },
                    push:  { type: `${capitalize(apiName)}PushPayload` },
                    pull:  { type: `${capitalize(apiName)}PullPayload` },
                })
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => typeof(field.type) === 'string'
                    ? (field.type.includes('[')
                        ? swaggerObjectPropertyRefArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(field.type).replace('[]', '') })
                        : swaggerObjectPropertyRefDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(field.type).replace('[]', '') })
                    )
                    : (Array.isArray(field.type)
                        ? swaggerObjectPropertyArrayDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(field.type).replace('[]', '') })
                        : swaggerObjectPropertyDefinitionTPL({ name: fieldName, type: stringifyTypeForSwagger(field.type).replace('[]', '') })
                    ))
                    .join(',\n')
            }))
            .join(',\n');

            

        const mongooseSchemas = Object.entries(this.api.apis)
            .map(([apiName, api]) => mongooseSchemaTPL({
                name: `${capitalize(apiName)}Schema`,
                properties: Object.entries(api.fields)
                .map(([fieldName, field]: [string, MyApiDescriptionApiField]) => typeof(field.type) === 'string'
                    ? mongooseSchemaPropertyRefTPL({
                        name: fieldName,
                        type: stringifyTypeForMongoose(field.type),
                        required: !!field.required,
                        unique: !!field.unique,
                        select: !field.canSelect || (field.canSelect.length === 0),
                        default: stringifyDefaultForMongoose(field.default),
                        ref: field.type.replace('[', '').replace(']', '')
                    })
                    : mongooseSchemaPropertyTPL({
                        name: fieldName,
                        type: stringifyTypeForMongoose(field.type),
                        required: !!field.required,
                        unique: !!field.unique,
                        select: !field.canSelect || (field.canSelect.length === 0),
                        default: stringifyDefaultForMongoose(field.default),
                    }))
                    .join('\n')
            }))
            .join('\n');
        
        const mongooseModels = Object.entries(this.api.apis)
            .map(([apiName, api]) => mongooseModelTPL({
                name: `${capitalize(apiName)}`,
                modelName: `${capitalize(apiName)}Model`,
                schemaName: `${capitalize(apiName)}Schema`,
            }))
            .join('\n');

        const swaggerDefinitions = swaggerDefinitionsTPL({ definitions: [
            swaggerModelsWithRelations,
            swaggerModelsWithoutRelations,
            swaggerCreatePayloads,
            swaggerSetPayload,
            swaggerPushPayload,
            swaggerPullPayload,
            swaggerUpdatePayload
        ].join(',\n') });



        console.log('modelsWithRelations: ', modelsWithRelations);
        console.log('modelsWithoutRelations: ', modelsWithoutRelations);
        console.log('createPayload: ', createPayload);
        console.log('setPayload: ', setPayload);
        console.log('pushPayload: ', pushPayload);
        console.log('pullPayload: ', pullPayload);
        console.log('updatePayload: ', updatePayload);

        console.log('mongooseSchemas: ', mongooseSchemas);
        console.log('mongooseModels: ', mongooseModels);

        console.log('swaggerDefinitions: ', swaggerDefinitions);
*/

        console.log('*********************************************************************************');
       // console.log(generated);

        /*
        console.log('swaggerModelsWithRelations: ', swaggerModelsWithRelations);
        console.log('swaggerModelsWithoutRelations: ', swaggerModelsWithoutRelations);
        console.log('swaggerCreatePayloads: ', swaggerCreatePayloads);
        console.log('swaggerSetPayload: ', swaggerSetPayload);
        console.log('swaggerPushPayload: ', swaggerPushPayload);
        console.log('swaggerPullPayload: ', swaggerPullPayload);
        console.log('swaggerUpdatePayload: ', swaggerUpdatePayload);
        */
    }

    generate() {
        /**
         * Pour chaque entité:
         * 
         * - model sans relation
         * - model avec relation
         * - payload de creation
         * - payload d'update
         * - payload d'update $set
         * - payload d'update $push
         * - payload d'update $pull
         * - schema + model mongoose
         * 
         * - equivalent swagger for all
         * - equivalent graphql type for all
         * - equivalent graphql input for all
         * 
         * - une function par guard du model (field level)
         * - une function pour tous les guards du model
         * 
         * - une function par validator du model (field level)
         * - une function pour tous les validators du model
         * 
         * - une function par middleware du model (route level)
         * - une function pour tous les middleware du model
         * 
         */
    }
}
