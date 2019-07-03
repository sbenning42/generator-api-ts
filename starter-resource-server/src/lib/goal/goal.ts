import { getCtx } from './ctx';
import { ObjectID } from 'mongodb';
import mongoose, { Query, Document } from 'mongoose';
import { Request, Response, Application, Router } from 'express';

export type ID = string | number | ObjectID;
export const ObjectId = mongoose.Schema.Types.ObjectId;
export const Mixed = mongoose.Schema.Types.Mixed;

export const Pr = (thing: any) => Promise.resolve(thing);

// Validators
export const REQUIRED = (ctx: any, input: string) => Pr(![null, undefined].includes(input) ? null : { required: 'Input is required.' });
export const MINLENGTH = (length: number) => (ctx: any, input: string) => Pr(input && input.length > length ? null : { minLength: 'Input too short.' });
export const MAXLENGTH = (length: number) => (ctx: any, input: string) => Pr(input && input.length < length ? null : { minLength: 'Input too long.' });
export const MIN = (min: number) => (ctx: any, input: number) => Pr(input && input > min ? null : { minLength: 'Input too little.' });
export const MAX = (max: number) => (ctx: any, input: number) => Pr(input && input < max ? null : { minLength: 'Input too big.' });

// Guards
export const NEVER = [() => Pr({ unauthorized: 'unauthorized' })];
export const ALWAYS = [() => Pr(null)];
export const ADMIN = [(ctx: any) => Pr(ctx.user && Array.isArray(ctx.user.roles) && 'admin' in ctx.user.roles ? null : { unauthorized: 'unauthorized.' })];
export const SELF = [(ctx: any) => Pr(ctx.user && Array.isArray(ctx.user.roles) && 'self' in ctx.user.roles ? null : { unauthorized: 'unauthorized.' })];
export const OWNER = [(ctx: any) => Pr(ctx.user && Array.isArray(ctx.user.roles) && 'owner' in ctx.user.roles ? null : { unauthorized: 'unauthorized.' })];

export const runGuards = (modelName: string, action: 'select' | 'create' | 'update', fields: string[]) => {
    //console.log('2:::::', getCtx());
    return Promise.all(
        Object.entries(getCtx().schema[modelName].model)
            .filter(([fieldName]) => fields.includes(fieldName))
            .map(([fieldName, field]: [string, any]) => Promise.all(
                field.guards[action].map((guard: any) => guard(getCtx()))
            ).then(errors => errors && errors.length > 0 && errors.some(error => !!error)
                ? { [fieldName]: errors.reduce((all, error) => ({ ...all, ...error }), {}) }
                : null
            ))
    ).then(errors => errors.filter(error => !!error)
        .reduce((all, error) => ({ ...all, ...error }), {})
    ).then(error => Object.keys(error).length > 0 ? error : null);
};

export const runValidators = (modelName: string, action: 'create' | 'update', body: any, fields: string[]) => Promise.all(
    Object.entries(getCtx().schema[modelName].model)
        .filter(([fieldName]) => fields.includes(fieldName) && Object.keys(body).includes(fieldName))
        .map(([fieldName, field]: [string, any]) => Promise.all(
            field.validators[action].map((validator: any) => validator(getCtx(), body[fieldName]))
        ).then(errors => errors && errors.length > 0 && errors.some(error => !!error)
            ? { [fieldName]: errors.reduce((all, error) => ({ ...all, ...error }), {}) }
            : null
        ))
).then(errors => errors.filter(error => !!error)
    .reduce((all, error) => ({ ...all, ...error }), {})
).then(error => Object.keys(error).length > 0 ? error : null);

/*********************************************************************************** */

export const user = {
    model: {
        username: {
            type: String,
            required: true,
            unique: true,
            validators: {
                all: [MINLENGTH(5)]
            }
        },
        password: {
            type: String,
            required: true,
            select: false,
            guards: {
                select: NEVER,
                update: NEVER
            },
            validators: {
                all: [MINLENGTH(8), MAXLENGTH(255)]
            }
        },
        roles: {
            type: [String],
            required: true,
            default: ['user'],
            guards: {
                // create: NEVER,
                // update: ADMIN
            }
        },
        todos: {
            type: ['Todo'],
            default: [],
            guards: {
                create: NEVER
            }
        }
    },
    ws: {

    }
};

export const todo = {
    model: {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        author: {
            type: 'User',
            required: true,
            default: () => {
                const ctx = getCtx();
                return ctx.user && ctx.user.id;
            },
            guards: {
                select: ADMIN,
                create: NEVER,
                update: NEVER,
            },
            reverse: true,
        }
    },
    ws: {

    }
};

/*************************************************************************** */

export const augmentSchema = (schema: any) => {
    Object.entries(schema)
        .forEach(([apiName, api]: [string, any]) => {
            Object.entries(api.model)
                .forEach(([fieldName, field]: [string, any]) => {
                    if (field.guards && field.guards.all) {
                        field.guards.select = field.guards.select ? field.guards.all.concat(...field.guards.select) : [...field.guards.all];
                        field.guards.create = field.guards.create ? field.guards.all.concat(...field.guards.create) : [...field.guards.all];
                        field.guards.update = field.guards.update ? field.guards.all.concat(...field.guards.update) : [...field.guards.all];
                    } else {
                        field.guards = {
                            select: field.guards && field.guards.select ? field.guards.select : [],
                            create: field.guards && field.guards.create ? field.guards.create : [],
                            update: field.guards && field.guards.update ? field.guards.update : [],
                        };
                    }
                    if (field.validators && field.validators.all) {
                        field.validators.create = field.validators.create ? field.validators.all.concat(...field.validators.create) : [...field.validators.all];
                        field.validators.update = field.validators.update ? field.validators.all.concat(...field.validators.update) : [...field.validators.all];
                    } else {
                        field.validators = {
                            create: field.validators && field.validators.create ? field.validators.create : [],
                            update: field.validators && field.validators.update ? field.validators.update : [],
                        };
                    }
                });
        });
};

/**
 * Generate:
 * 
 *  - types
 *      - entity
 *      - populated entity
 *      - create payload
 *      - update payload
 *          - set payload
 *          - push payload
 *          - pull payload
 *  - consts
 *      - default populate fieldName array 
 *      - default reverse { on: string, _for: string, at: string, array: boolean } array 
 *      - default mongoose schema 
 *      - default mongoose model
 *      - default projection
 *      - default fields
 *          - select fieldName array 
 *          - create fieldName array 
 *          - update
 *              - set fieldName array 
 *              - push fieldName array 
 *              - pull fieldName array 
 *      - middlewares array
 *  - class
 *      - utils
 *      - service
 *      - controller
 *      - router
 */

export const populateCtx = () => {
    const ctx = getCtx();
    const schema = { user, todo };
    augmentSchema(schema);
    ctx.schema = schema;
    ctx.populates = {
        user: ['todos'],
    };
    ctx.reverses = {
        user: [
            { on: 'todos', _for: 'author', at: 'Todo', array: false }
        ]
    };
    ctx.schemas = {
        user: new mongoose.Schema({
            username: {
                type: String,
                required: true,
                unique: true
            },
            password: {
                type: String,
                required: true,
                select: false, // guard.select === NEVER
            },
            roles: {
                type: [String],
                default: ['user']
            },
            todos: {
                type: [ObjectId],
                required: true,
                // ref: 'Todo'
                default: []
            },
        }, { minimize: false, timestamps: true }),
    };
    ctx.models = {
        user: mongoose.model('User', ctx.schemas.user),
    };
    ctx.projections = {
        user: {
            username: 1,
            roles: 1,
            todos: 1,
            createdAt: 1,
            updatedAt: 1,
        },
    };
    ctx.fields = {
        user: {
            select: ['id', 'username', 'roles', 'todos'],
            create: ['id', 'username', 'password', 'roles'],
            update: {
                set: ['username', 'roles', 'todos'],
                push: ['roles', 'todos'],
                pull: ['roles', 'todos'],
            },
        },
    };
    ctx.err = {};
    ctx.middlewares = {
        user: []
    };
    // console.log('1:::::', getCtx());
};

export class UserUtils {
    
    async qPopulateAll(q: Query<any>) {
        await Promise.all(getCtx().populates.user.map((populate: string) => q.populate(populate)));
        return q;
    }
    
    async dPopulateAll(d: Document) {
        await Promise.all(getCtx().populates.user.map((populate: string) => d.populate(populate).execPopulate()));
        return d;
    }

    async _select(id?: ID) {
        const [condition, method] = id ? [id, 'findById'] : [{}, 'find'];
        const {
            models: { user: model },
            projections: { user: baseProjection },
            fields: { user: { select: fields } },
            err
        } = getCtx();
        const projection = { ...baseProjection };
        const guardErrors = await runGuards('user', 'select', fields);
        if (guardErrors) {
            Object.keys(guardErrors).forEach(field => {
                delete projection[field];
            });
            err.guardErrors = { select: guardErrors };
        }
        console.log(projection);
        return this.qPopulateAll(model[method](condition, projection));
    }

    async _create(_body: any) {
        const {
            models: { user: model },
            fields: { user: { create: fields } },
            reverses: { user: reverses },
            err
        } = getCtx();
        const body = fields
            .filter(field => _body[field] !== undefined)
            .reduce((b, field) => ({ ...b, [field]: _body[field] }), {});
        const guardErrors = await runGuards('user', 'create', fields);
        if (guardErrors) {
            Object.keys(guardErrors).forEach(field => {
                delete body[field];
            });
            err.guardErrors = { create: guardErrors };
        }
        const validatorErrors = await runValidators('user', 'create', body, fields);
        if (validatorErrors) {
            err.validatorErrors = { create: validatorErrors };
            throw new Error(JSON.stringify(validatorErrors));
        }
        const instance = new model(body);
        const saved = await instance.save();
        await Promise.all(reverses.map(async ({ on, _for, at, array }) => {
            const {
                models: { [at]: reverseModel },
            } = getCtx();
            const value = saved[on];
            if (reverseModel) {
                if (Array.isArray(value)) {
                    const reversedInstances = await reverseModel.findMany({ _id: { $in: value.map(v => new ObjectID(v)) } });
                    return Promise.all(
                        reversedInstances.filter(ri => {
                            if (array) {
                                return !(ri[_for] && ri[_for].includes(saved._id));
                            } else {
                                return !ri[_for] === saved._id;
                            }
                        }).map(ri => {
                            if (array) {
                                ri[_for] ? ri[_for].push(saved._id) : (ri[_for] = [saved._id]);
                            } else {
                                ri[_for] = saved._id;
                            }
                            return ri.save();
                        }));
                } else {
                    const reversedInstance = await reverseModel.findById(value);
                    if (array) {
                        reversedInstance[_for] ? reversedInstance[_for].push(saved._id) : (reversedInstance[_for] = [saved._id]);
                    } else {
                        reversedInstance[_for] = saved._id;
                    }
                    return reversedInstance.save();
                }
            }
        }));
        // console.log('body::: ', body, instance);
        return instance.save();
    }

    async _update(id: ID, _body: any) {
        const {
            models: { user: model },
            fields: { user: { update: { set: setFields, push: pushFields, pull: pullFields } } },
            err
        } = getCtx();
        const { set: _set = {}, push: _push = {}, pull: _pull = {} } = _body;
        console.log({ setFields, pushFields, pullFields });
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
        console.log({ id, set, push, pull });
        const guardErrors = await runGuards('user', 'update', fields);
        if (guardErrors) {
            Object.keys(guardErrors).forEach(field => {
                delete set[field];
                delete push[field];
                delete pull[field];
            });
            err.guardErrors = { update: guardErrors };
        }
        const validatorErrors = await runValidators('user', 'update', { ...pull, ...push, ...set }, fields);
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

    async _delete(id: ID) {
        const {
            models: { user: model },
            reverses: { user: reverses },
        } = getCtx();
        const instance = await model.findByIdAndRemove(id);
        await Promise.all(reverses.map(async ({ on, _for, at, array }) => {
            const {
                models: { [at]: reverseModel },
                schemas: { [at]: reverseSchema },
            } = getCtx();
            const value = instance[on];
            if (reverseModel) {
                if (Array.isArray(value)) {
                    const reversedInstances = await reverseModel.findMany({ _id: { $in: value.map(v => new ObjectID(v)) } });
                    return Promise.all(
                        reversedInstances.filter(ri => true).map(ri => {
                            if (array) {
                                ri[_for] = ri[_for].filter(thisId => thisId !== instance._id);
                            } else if (reverseSchema[_for].required) {
                                return ri.remove().then(() => ri);
                            } else {
                                ri[_for] = undefined;
                            }
                            return ri.save();
                        }));
                } else {
                    const reversedInstance = await reverseModel.findById(value);
                    if (array) {
                        reversedInstance[_for] = reversedInstance[_for].filter(thisId => thisId !== instance._id);
                    } else if (reverseSchema[_for].required) {
                        return reversedInstance.remove().then(() => reversedInstance);
                    } else {
                        reversedInstance[_for] = undefined;
                    }
                    return reversedInstance.save();
                }
            }
        }));
        return instance;
    }

    selectAll() {
        return this._select();
    }

    selectById(id: ID) {
        return this._select(id); 
    }

    create(body: any) {
        return this._create(body);
    }

    update(id: ID, body: any) {
        return this._update(id, body);
    }

    delete(id: ID) {
        return this._delete(id);
    }
}

export class UserService {
    
    utils = new UserUtils();

    async getAll() {
        return this.utils.selectAll();
    }

    async getById(id: ID) {
        return this.utils.selectById(id);
    }

    async create(body: any) {
        return this.utils.create(body);
    }

    async update(id: ID, body: any) {
        return this.utils.update(id, body);
    }

    async delete(id: ID) {
        return this.utils.delete(id);
    }
}

export class UserController {
    
    service = new UserService();

    getAll() {
        return async (req: Request, res: Response) => {
            try {
                res.json({
                    response: await this.service.getAll(),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }

    getById() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                res.json({
                    response: await this.service.getById(id),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }

    create() {
        return async (req: Request, res: Response) => {
            const body = req.body;
            try {
                res.json({
                    response: await this.service.create(body),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }

    update() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            const body = req.body;
            try {
                res.json({
                    response: await this.service.update(id, body),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }

    delete() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                res.json({
                    response: await this.service.delete(id),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }
}

export class UserRouter {

    controller = new UserController();

    async apply(app: Application) {
        const {
            middlewares: { user: middlewares }
        } = getCtx();
        app.use('/users', Router()
            .get('/', ...(middlewares['GET /'] || []), this.controller.getAll())
            .post('/', ...(middlewares['POST /'] || []), this.controller.create())
            .get('/:id', ...(middlewares['GET /:id'] || []), this.controller.getById())
            .put('/:id', ...(middlewares['PUT /:id'] || []), this.controller.update())
            .delete('/:id', ...(middlewares['DELETE /:id'] || []), this.controller.delete())
        );
    }
}
