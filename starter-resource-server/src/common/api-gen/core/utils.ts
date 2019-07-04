import mongoose from 'mongoose';
import { ObjectID } from 'mongodb';
import { ctx } from './ctx';
import { ID } from './types';


export const runGuards = (modelName: string, action: 'select' | 'create' | 'update', fields: string[]) => {
    return Promise.all(
        Object.entries(ctx().schema.apis[modelName].model)
            .filter(([fieldName]) => fields.includes(fieldName))
            .map(([fieldName, field]: [string, any]) => Promise.all(
                field.guards[action].map((guard: any) => guard(ctx()))
            ).then(errors => errors && errors.length > 0 && errors.some(error => !!error)
                ? { [fieldName]: errors.reduce((all, error) => ({ ...all, ...error }), {}) }
                : null
            ))
    ).then(errors => errors.filter(error => !!error)
        .reduce((all, error) => ({ ...all, ...error }), {})
    ).then(error => Object.keys(error).length > 0 ? error : null);
};

export const runValidators = (modelName: string, action: 'create' | 'update', body: any, fields: string[]) => Promise.all(
    Object.entries(ctx().schema.apis[modelName].model)
        .filter(([fieldName]) => fields.includes(fieldName) && Object.keys(body).includes(fieldName))
        .map(([fieldName, field]: [string, any]) => Promise.all(
            field.validators[action].map((validator: any) => validator(ctx(), body[fieldName]))
        ).then(errors => errors && errors.length > 0 && errors.some(error => !!error)
            ? { [fieldName]: errors.reduce((all, error) => ({ ...all, ...error }), {}) }
            : null
        ))
).then(errors => errors.filter(error => !!error)
    .reduce((all, error) => ({ ...all, ...error }), {})
).then(error => Object.keys(error).length > 0 ? error : null);

export async function populateAllQuery(api: string, query: mongoose.Query<any>) {
    await Promise.all(ctx().populates[api].map((populate: string) => query.populate(populate)));
    return query;
}

export async function populateAllDocument(api: string, document: mongoose.Document) {
    await Promise.all(ctx().populates[api].map((populate: string) => document.populate(populate).execPopulate()));
    return document;   
}

export async function select(api: string, id?: ID) {
    const [condition, method] = id ? [id, 'findById'] : [{}, 'find'];
    const {
        models: { [api]: model },
        projections: { [api]: baseProjection },
        fields: { [api]: { select: fields } },
        err
    } = ctx();
    const projection = { ...baseProjection };
    const guardErrors = await runGuards(api, 'select', fields);
    if (guardErrors) {
        Object.keys(guardErrors).forEach(field => {
            delete projection[field];
        });
        err.guardErrors = { select: guardErrors };
    }
    return populateAllQuery(api, model[method](condition, projection));
}

export async function create(api: string, _body: any) {
    const {
        models: { [api]: model },
        fields: { [api]: { create: fields } },
        reverses: { [api]: reverses },
        err
    } = ctx();
    const body = fields
        .filter(field => _body[field] !== undefined)
        .reduce((b, field) => ({ ...b, [field]: _body[field] }), {});
    const guardErrors = await runGuards(api, 'create', fields);
    if (guardErrors) {
        Object.keys(guardErrors).forEach(field => {
            delete body[field];
        });
        err.guardErrors = { create: guardErrors };
    }
    const validatorErrors = await runValidators(api, 'create', body, fields);
    if (validatorErrors) {
        err.validatorErrors = { create: validatorErrors };
        throw new Error(JSON.stringify(validatorErrors));
    }
    const instance = new model(body);
    const saved = await instance.save();
    await Promise.all(reverses.map(async ({ field, on, target, array }) => {
        const {
            models: { [(target as string).toLocaleLowerCase()]: reverseModel },
        } = ctx();
        const value = saved[field];
        if (Array.isArray(value)) {
            const reversedInstances = await reverseModel.find({ _id: { $in: value.map(v => new ObjectID(v)) } });
            return Promise.all(
                reversedInstances.filter(ri => {
                    if (array) {
                        return !(ri[on] && ri[on].includes(saved._id));
                    } else {
                        return !ri[on] === saved._id;
                    }
                }).map(ri => {
                    if (array) {
                        ri[on] ? ri[on].push(saved._id) : (ri[on] = [saved._id]);
                    } else {
                        ri[on] = saved._id;
                    }
                    return ri.save();
                }));
        } else {
            const reversedInstance = await reverseModel.findById(value);
            if (array) {
                reversedInstance[on] ? reversedInstance[on].push(saved._id) : (reversedInstance[on] = [saved._id]);
            } else {
                reversedInstance[on] = saved._id;
            }
            return reversedInstance.save();
        }
    }));
    return instance.save();

}

export async function update(api: string, id: ID, _body: any) {
    const {
        models: { [api]: model },
        fields: { [api]: { update: { set: setFields, push: pushFields, pull: pullFields } } },
        err
    } = ctx();
    const { set: _set = {}, push: _push = {}, pull: _pull = {} } = _body;
    const set = setFields
        .filter(field => _set[field] !== undefined)
        .reduce((b, field) => ({ ...b, [field]: _set[field] }), {});
    const push = pushFields
        .filter(field => _push[field] !== undefined)
        .reduce((b, field) => ({ ...b, [field]: _push[field] }), {});
    const pull = pullFields
        .filter(field => _pull[field] !== undefined)
        .reduce((b, field) => ({ ...b, [field]: _pull[field] }), {});
    const fields = Array.from(new Set([...setFields, ...pushFields, ...pullFields]));
    const guardErrors = await runGuards(api, 'update', fields);
    if (guardErrors) {
        Object.keys(guardErrors).forEach(field => {
            delete set[field];
            delete push[field];
            delete pull[field];
        });
        err.guardErrors = { update: guardErrors };
    }
    const validatorErrors = await runValidators(api, 'update', { ...pull, ...push, ...set }, fields);
    if (validatorErrors) {
        err.validatorErrors = { update: validatorErrors };
        throw new Error(JSON.stringify(validatorErrors));
    }
    const update: any = { id };
    if (Object.keys(set).length > 0) {
        update.$set = set;
    }
    if (Object.keys(push).length > 0) {
        update.$push = Object.entries(push)
            .reduce((p, [key, values]) => ({ ...p, [key]: { $each: values } }), {});
    }
    if (Object.keys(pull).length > 0) {
        update.$pull = Object.entries(pull)
            .reduce((p, [key, values]) => ({ ...p, [key]: { $in: values } }), {});
    }
    return model.findByIdAndUpdate(id, update, { new: true });

}

export async function _delete(api: string, id: ID) {
    const {
        models: { [api]: model },
        reverses: { [api]: reverses },
    } = ctx();
    const instance = await model.findById(id);
    await Promise.all(reverses.map(async ({ field, on, target, array }) => {
        const {
            models: { [target]: reverseModel },
            schemas: { [target]: reverseSchema },
        } = ctx();
        const value = instance[field];
        if (Array.isArray(value)) {
            const reversedInstances = await reverseModel.find({ _id: { $in: value.map(v => new ObjectID(v)) } });
            return Promise.all(
                reversedInstances.filter(ri => true).map(ri => {
                    if (array) {
                        ri[on] = ri[on].filter(thisId => thisId !== instance._id);
                    } else if (reverseSchema[on].required) {
                        return ri.remove().then(() => ri);
                    } else {
                        ri[on] = undefined;
                    }
                    return ri.save();
                }));
        } else {
            const reversedInstance = await reverseModel.findById(value);
            if (array) {
                reversedInstance[on] = reversedInstance[on].filter(thisId => thisId !== instance._id);
            } else if (reverseSchema[on].required) {
                return reversedInstance.remove().then(() => reversedInstance);
            } else {
                reversedInstance[on] = undefined;
            }
            return reversedInstance.save();
        }
    }));
    return instance.remove().then(() => instance);

}
