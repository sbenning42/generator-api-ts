import { getCtx } from './ctx';
import { ObjectID } from 'mongodb';
import { Query, Document } from 'mongoose';
import { Request, Response, Application, Router } from 'express';

export type ID = string | number | ObjectID;

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

export const runGuards = (modelName: string, action: 'select' | 'create' | 'update', fields: string[]) => Promise.all(
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

export const runValidators = (modelName: string, action: 'create' | 'update', body: any, fields: string[]) => Promise.all(
    Object.entries(getCtx().schema[modelName].model)
        .filter(([fieldName]) => fields.includes(fieldName))
        .map(([fieldName, field]: [string, any]) => Promise.all(
            field.validators[action].map((validator: any) => validator(getCtx(), body[fieldName]))
        ).then(errors => errors && errors.length > 0 && errors.some(error => !!error)
            ? { [fieldName]: errors.reduce((all, error) => ({ ...all, ...error }), {}) }
            : null
        ))
).then(errors => errors.filter(error => !!error)
    .reduce((all, error) => ({ ...all, ...error }), {})
).then(error => Object.keys(error).length > 0 ? error : null);

export const user = {
    model: {
        username: {
            type: String,
            required: true,
            unique: true,
            validators: {
                both: [MINLENGTH(5)]
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
                both: [MINLENGTH(8), MAXLENGTH(255)]
            }
        },
        roles: {
            type: [String],
            required: true,
            default: ['user'],
            guards: {
                create: NEVER,
                update: ADMIN
            }
        },
        todos: {
            type: ['Todo'],
            default: [],
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


getCtx().schema = augmentSchema({ user, todo });

export class UserUtils {
    
    qPopulateAll(q: Query<any>) {
        return Promise.all(getCtx().populates.user.map((populate: string) => q.populate(populate)));
    }
    
    dPopulateAll(d: Document) {
        return Promise.all(getCtx().populates.user.map((populate: string) => d.populate(populate).execPopulate()));
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
        const guardErrors = await runGuards('User', 'select', fields);
        if (guardErrors) {
            Object.keys(guardErrors).forEach(field => {
                delete projection[field];
            });
            err.guardErrors = { select: guardErrors };
        }
        return this.qPopulateAll(model[method](condition, projection));
    }

    async _create(_body: any) {
        const {
            models: { user: model },
            fields: { user: { create: fields } },
            err
        } = getCtx();
        const body = fields
            .filter(field => _body[field] !== undefined)
            .reduce((b, field) => ({ ...b, [field]: _body[field] }), {});
        const guardErrors = await runGuards('User', 'create', fields);
        if (guardErrors) {
            Object.keys(guardErrors).forEach(field => {
                delete body[field];
            });
            err.guardErrors = { create: guardErrors };
        }
        const validatorErrors = await runValidators('User', 'create', body, fields);
        if (validatorErrors) {
            err.validatorErrors = { create: validatorErrors };
            throw new Error(JSON.stringify(validatorErrors));
        }
        const instance = new model(body);
        return instance.save();
    }

    async _update(id: ID, _body: any) {
        const {
            models: { user: model },
            fields: { user: { update: { set: setFields, push: pushFields, pull: pullFields } } },
            err
        } = getCtx();
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
        const guardErrors = await runGuards('User', 'update', fields);
        if (guardErrors) {
            Object.keys(guardErrors).forEach(field => {
                delete set[field];
                delete push[field];
                delete pull[field];
            });
            err.guardErrors = { update: guardErrors };
        }
        const validatorErrors = await runValidators('User', 'update', { ...pull, ...push, ...set }, fields);
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
        const instance = model.findByIdAndUpdate(id, update);
        return instance.save();
    }

    async _delete(id: ID) {
        const {
            models: { user: model },
        } = getCtx();
        return model.findByIdAndRemove(id);
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
                res.json(await this.service.getAll());
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }

    getById() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                res.json(await this.service.getById(id));
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }

    create() {
        return async (req: Request, res: Response) => {
            const body = req.body;
            try {
                res.json(await this.service.create(body));
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
                res.json(await this.service.update(id, body));
            } catch (error) {
                res.status(400).json({ error: error.toString() });
            }
        };
    }

    delete() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                res.json(await this.service.delete(id));
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
            .get('/', ...middlewares['GET /'], this.controller.getAll())
            .post('/', ...middlewares['POST /'], this.controller.create())
            .get('/:id', ...middlewares['GET /:id'], this.controller.getById())
            .put('/:id', ...middlewares['PUT /:id'], this.controller.update())
            .delete('/:id', ...middlewares['DELETE /:id'], this.controller.delete())
        );
    }
}
