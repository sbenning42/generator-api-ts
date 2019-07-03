import { ctx as getCtx } from "./ctx";
import { ApiEntityModelFieldTypeUnion, ApiEntitySchema } from "./types";
import { getInterfaceEquivalentType } from "./get-interface-equivalent-type";
import { ObjectID } from "mongodb";

export const capitalize = (s: string) => `${s.slice(0, 1).toLocaleUpperCase()}${s.slice(1)}`;

export const applyTemplate = <A extends { [key: string]: string }>(template: string, args: A) => Object.entries(args || {})
    .reduce((steps, [key, value]) => steps.replace(new RegExp(`\\\$${key}`, 'g'), value), template);

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
            definitions: {
            }
        }
    };
}
