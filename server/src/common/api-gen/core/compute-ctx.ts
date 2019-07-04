import mongoose from 'mongoose';
import { ApiSchema } from "./types";
import { ctx as getCtx } from "./ctx";
import { NEVER } from "./constantes";
import { augmentSchema } from './augment-schema';
import { getMongooseEquivalentType } from './get-mongoose-equivalent-type';
import { generate } from './generate';

export function computeCtx(schema: ApiSchema, shouldGenerate: boolean) {
    augmentSchema(schema);
    const ctx = getCtx();
    const { schema: { apis } }: { schema: ApiSchema } = ctx;
    
    ctx.fields = Object.entries(apis)
        .reduce((all, [apiName, api]) => {
            all[apiName] = {
                select: Object.entries(api.model).filter(([, field]) => {
                    return field.guards.select !== NEVER;
                }).map(([fieldName]) => fieldName).concat('createdAt', 'updatedAt'),
                create: Object.entries(api.model).filter(([, field]) => {
                    return field.guards.create !== NEVER;
                }).map(([fieldName]) => fieldName),
                update: {
                    set: Object.entries(api.model).filter(([, field]) => {
                        return field.guards.update !== NEVER;
                    }).map(([fieldName]) => fieldName),
                    push: Object.entries(api.model).filter(([, field]) => {
                        return Array.isArray(field.type) && field.guards.update !== NEVER;
                    }).map(([fieldName]) => fieldName),
                    pull: Object.entries(api.model).filter(([, field]) => {
                        return Array.isArray(field.type) && field.guards.update !== NEVER;
                    }).map(([fieldName]) => fieldName),
                },
            };
            return all;
        }, {});
    
    ctx.middlewares = Object.entries(apis)
        .reduce((all, [apiName, api]) => {
            const clone = { ...api.ws };
            delete clone.all;
            delete clone.query;
            delete clone.mutation;
            all[apiName] = Object.entries(clone).reduce((thisAll, [endpointPattern, ws]) => ({
                ...thisAll,
                [endpointPattern]: ws.middlewares,
            }), {});
            return all;
        }, {});
    
    ctx.populates = Object.entries(apis).reduce((all, [apiName, api]) => {
        all[apiName] = Object.entries(api.model)
            .filter(([fieldName, field]) => (
                typeof(field.type) === 'string' || (Array.isArray(field.type) && typeof(field.type[0]) === 'string')
            ) && ctx.fields[apiName].select.includes(fieldName) && field.populate)
            .map(([fieldName]) => fieldName);
        return all;
    }, {});
    
    ctx.reverses = Object.entries(apis).reduce((all, [apiName, api]) => {
        all[apiName] = Object.entries(api.model)
            .filter(([, field]) => field.reverse !== undefined)
            .reduce((thisAll, [fieldName, field]) => thisAll.concat({
                field: fieldName,
                target: Array.isArray(field.type) ? field.type[0] : field.type,
                on: field.reverse,
                array: apis[((Array.isArray(field.type) ? field.type[0] : field.type) as string).toLocaleLowerCase()].model[field.reverse].array
            }), []);
        return all;
    }, {});
    
    ctx.projections = Object.entries(ctx.fields).reduce((all, [apiName, fields]: [string, any]) => {
        all[apiName] = fields.select.reduce((thisAll, select) => ({ ...thisAll, [select]: 1 }), {});
        return all;
    }, {});
    
    ctx.schemas = Object.entries(apis).filter(([apiName]) => apiName !== 'User').reduce((all, [apiName, api]) => {
        all[apiName] = new mongoose.Schema(Object.entries(api.model).reduce((thisAll, [fieldName, field]) => {
            thisAll[fieldName] = {
                type: getMongooseEquivalentType(field.type),
                required: field.required || false,
                unique: field.unique || false,
                select: field.guards.select !== NEVER,
                default: field.default,
            };
            if ((Array.isArray(field.type) && typeof(field.type[0]) === 'string') || typeof(field.type) === 'string') {
                thisAll[fieldName].ref = Array.isArray(field.type) ? field.type[0] : field.type;
            }
            return thisAll;
        }, {}));
        return all;
    }, {});
    
    ctx.models = Object.keys(apis).filter(([apiName]) => apiName !== 'User').reduce((all, api) => ({
        ...all,
        [api]: mongoose.model(api, ctx.schemas[api]),
    }), {});

    if (shouldGenerate) {
        generate();
    }
}
