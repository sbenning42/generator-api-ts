import { ObjectID } from "mongodb";
import mongoose from 'mongoose';
import { Request, Response, Application, Router } from 'express';
import { getCtx } from './ctx';

export type ID = string | number | ObjectID;

export const ObjectId = mongoose.Schema.Types.ObjectId;
export const Mixed = mongoose.Schema.Types.Mixed;

export const PrCl = (thing: any) => () => Promise.resolve(thing);
export const Pr = (thing: any) => PrCl(thing)();

export const runGuards = (guardObj: { [field: string]: ((input: any, ctx: any) => Promise<{} | null>)[] }) => {
    return async (input: any, ctx: any) => {
        console.log('GO: ', guardObj);
        console.log('INPUT: ', input);
        const guarded = await Object.entries(guardObj)
            .filter(([field, guards]) => input === undefined || field in input)
            .filter(([field, guards]) => guards && guards.length > 0)
            .map(async ([field, guards]) => [field, await Promise.all(guards.map(guard => guard(input, ctx)))] as [string, any])
            .reduce(async (res$, field$) => {
                const res = await res$;
                const [field, fieldRes] = await field$;
                if (fieldRes) {
                    res[field] = fieldRes;
                }
                return res;
            }, Promise.resolve({}));
        return Object.keys(guarded).length > 0 ? guarded : null as any;
    };
};

export const runValidators = (validatorObj: { [field: string]: ((input: any, ctx: any) => Promise<{} | null>)[] }, path: string = '') => {
    return async <T>(input: T, ctx: any) => {
        const validated = await Object.entries(validatorObj)
            .filter(([field, validators]) => input === undefined || field in input)
            .filter(([field, validators]) => validators && validators.length > 0)
            .map(async ([field, validators]) => [field, await Promise.all(validators.map(validator => validator(path ? input[path][field] : input[field], ctx)))] as [string, any])
            .reduce(async (res$, field$) => {
                const res = await res$;
                const [field, fieldRes] = await field$;
                if (fieldRes && fieldRes.length > 0 && !fieldRes.every(fr => fr === null)) {
                    res[field] = fieldRes;
                }
                return res;
            }, Promise.resolve({}));
        return Object.keys(validated).length > 0 ? validated : null as any;
    };
};

/****************************************************************************************************** */


/**
 * Apply select guards
 */
export const preUserFind = async function () {
    Object.entries(defaultUserPopulate).forEach(([field, should]) => {
        if (should) {
            this.populate(field);
        }
    });
    const thisProjection = { ...defaultUserProjection };
    const ctx = getCtx();
    console.log('Will call guards');
    const guardResults = await runUserSelectGuards(undefined, ctx);
    console.log('Had guards results: ', guardResults);
    if (guardResults) {
        ctx.userSelectGuardErrors = guardResults;
        Object.keys(guardResults).forEach(field => {
            delete thisProjection[field];
        });
    }
    console.log(thisProjection);
    this.select(thisProjection);
    console.log('Had selected');
};


/**
 * Apply create guards + create validators
 */
export const preUserSave = async function () {
    const ctx = getCtx();
    const guardResults = await runUserCreateGuards(this, ctx);
    if (guardResults) {
        ctx.userCreateGuardErrors = guardResults;
        Object.keys(guardResults).forEach(field => {
            this.set(field, undefined);
        });
    }
    const validatorResults = await runUserCreateValidators(this, ctx);
    if (validatorResults) {
        ctx.userCreateValidatorErrors = validatorResults;
        throw new Error(JSON.stringify(validatorResults));
    }
};


/**
 * Apply update guards + update validators
 */
export const preUserUpdate = async function () {
    const ctx = getCtx();
    const guardResults = await runUserUpdateGuards(this, ctx);
    console.log(guardResults);
    if (guardResults) {
        ctx.userCreateGuardErrors = guardResults;
        Object.keys(guardResults).forEach(field => {
            this.set(field, undefined);
        });
    }
    const validatorResults = await runUserUpdateValidators(this, ctx);
    if (validatorResults) {
        ctx.userCreateValidatorErrors = validatorResults;
        throw new Error(JSON.stringify(validatorResults));
    }
};

/**
 * Report modification to relateds models
 */
export const postUserSave = async function () {
    const ctx = getCtx();
    await Promise.all(Object.entries(defaultUserSync)
        .map(async ([field, { target, on, array }]) => {
            const targetModel = mongoose.model(target);
            const [, targetSchema] = Object.entries(ctx.schema).find(([api]) => api === target);
            if (Array.isArray(this[field])) {
                const oldTargeteds = this['__old_' + field] as ID[];
                const targeteds = await targetModel.find({ _id: { $in: this[field] } });
                const removeds = await targetModel.find({ _id: { $in: oldTargeteds } });
                const news = targeteds.filter(tar => !oldTargeteds.includes(tar._id));
                if (removeds.length === 0 && news.length === 0) {
                    return;
                }
                if (array) {
                    return Promise.all(
                        news.map(async (_new) => {
                            _new[on].push(this._id);
                            return _new.save();
                        })
                        .concat(removeds.map(async (_rem) => {
                            _rem[on] = _rem[on].filter((id: ID) => id !== this._id);
                            return _rem.save();
                        }))
                    );
                } else {
                    return Promise.all(
                        news.map(async (_new) => {
                            _new[on] = this._id;
                            return _new.save();
                        }).concat(removeds.map(async (_rem) => {
                            _rem[on] = undefined;
                            return targetSchema[on].required ? _rem.remove() : _rem.save();
                        }))
                    );
                }
            } else {
                const targeted = await targetModel.findOne({ _id: this[field] });
                const oldTargeted = await targetModel.findOne({ _id: this['__old_' + field] });
                if (oldTargeted._id === targeted._id) {
                    return;
                }
                if (array) {
                    targeted[on].push(this._id);
                    oldTargeted[on] = oldTargeted[on].filter((id: ID) => id !== this._id);
                    return Promise.all([
                        targeted.save(),
                        /** TODO delete if required */
                        oldTargeted.save()
                    ]);
                } else {
                    targeted[on] = this._id;
                    oldTargeted[on] = undefined;
                    return Promise.all([
                        targeted.save(),
                        targetSchema[on].required ? oldTargeted.remove() : oldTargeted.save()
                    ]);
                }
            }
        })
    );
};

/**
 * 
 * mongoosify update payload
 */
export const convertUpdateUserForMongoose = (updateUser: UpdateUser) => {
    const mongooseUpdate = {
        id: updateUser.id,
        $set: updateUser.set ? updateUser.set : {},
        $push: updateUser.push ? Object.entries(updateUser.push).reduce((push, [field, vals]) => ({ ...push, [field]: { $each: vals } }), {}) : {},
        $pull: updateUser.pull ? Object.entries(updateUser.pull).reduce((pull, [field, vals]) => ({ ...pull, [field]: { $in: vals } }), {}) : {},
    };
    if (Object.keys(mongooseUpdate.$set).length < 1) {
        delete mongooseUpdate.$set;
    }
    if (Object.keys(mongooseUpdate.$push).length < 1) {
        delete mongooseUpdate.$push;
    }
    if (Object.keys(mongooseUpdate.$pull).length < 1) {
        delete mongooseUpdate.$pull;
    }
    return mongooseUpdate;
};

/**
 * Schema for User. set function are used to access old field value in post save/update hook 
 */
export const mainUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        select: true,
        default: undefined,
        // ref: undefined,
        set: function (username: string) {
            this['__old_username'] = this.username;
            this.username = username;
            return username;
        } 
    },
    password: {
        type: String,
        required: true,
        unique: false,
        select: false,
        default: undefined,
        // ref: undefined,
        set: function (password: string) {
            this['__old_password'] = this.password;
            this.password = password;
            return password;
        } 
    },
    /*
    store: {
        type: ObjectId,
        required: true,
        unique: false,
        select: true,
        default: undefined,
        ref: 'Store',
        set: function (store: string) {
            this['__old_store'] = this.store;
            this.password = store;
            return store;
        } 
    },
    */
    roles: {
        type: [String],
        required: true,
        unique: false,
        select: true,
        default: ['user'],
        // ref: undefined,
        set: function (roles: string[]) {
            this['__old_roles'] = this.roles;
            this.username = roles;
            return roles;
        } 
    },
    json: {
        type: Mixed,
        required: false,
        unique: false,
        select: true,
        default: {},
        // ref: undefined,
        set: function (json: any) {
            this['__old_json'] = this.json;
            this.json = json;
            return json;
        } 
    },
}, {
    minimize: false,
    timestamps: true
});

// All field '?' if not required or if select === false or if canSelect is not empty and canSelect is !== ALWAYS, skip if canSelect === NEVER
export interface User {
    id: ID;
    username: string;
    password?: string;
    roles: string[];
    json?: any;
}

// All field '?' if not required or if select === false,  if canSelect is not empty and canSelect is !== ALWAYS, skip if canSelect === NEVER resolved ObjectID
export interface PopulatedUser {
    id: ID;
    username: string;
    password?: string;
    roles: string[];
    json?: any;
}

// All field '?' if not required or if canCreate is not empty and canCreate is !== ALWAYS, skip if canCreate === NEVER
export interface CreateUser {
    id?: ID;
    username: string;
    password: string;
    json?: any;
}

export const createUserField = ['id', 'username', 'password', 'json'];

export interface UpdateUser {
    id: ID;
    set: {
        // All field '?', skip if canUpdate === NEVER
        username?: string;
        roles?: string[];
        json?: any;
    };
    push: {
        // array field '?', skip if canUpdate === NEVER
        roles?: string[];
    };
    pull: {
        roles?: string[];
    };
}

export const updateUserField = ['username', 'password', 'roles', 'json'];

// All field '?', skip if canSelect === NEVER
export interface UserProjection {
    id?: 0 | 1;
    username?: 0 | 1;
    password?: 0 | 1;
    roles?: 0 | 1;
    json?: 0 | 1;
}

// All field 1, 0 if select === false
export const defaultUserProjection = {
    id: 1,
    username: 1,
    roles: 1,
    json: 1,
};

// all related field
export interface UserPopulate {
}

// all related field that have populate === true
export const defaultUserPopulate = {
};

export type UserConditions = any;

export const defaultUserConditions = {};

export const defaultUserSync = {
    // store: { target: 'Store', on: 'users', array: true }
} as { [name: string]: { target: string, on: string, array: boolean } };

/**
 * Reverse
 * 
 * if a related field have reverse === true
 * 
 *  - On POST => add/set to one/all relation
 *  - On DELETE => filter/remove to one/all relation
 *  - On PUT => push/pull same as POST/DELETE, for set load the differential and same as POST & DELETE
 * 
 *  - if after a reverse operation, a model has a required relation to null remove it
 * 
 */

export const userSelectGuards = {
    id: [],
    username: [],
    roles: [],
    json: [],
};

export const userCreateGuards = {
    id: [],
    username: [],
    password: [],
    json: [],
};
export const userUpdateGuards = {
    username: [],
    roles: [
        (ctx: any) => Pr(ctx.user && 'admin' in ctx.user.roles ? null : { notAuthorized: 'not authorized' }),
    ],
    json: [],
};

export const runUserSelectGuards = runGuards(userSelectGuards);
export const runUserCreateGuards = runGuards(userCreateGuards);
export const runUserUpdateGuards = runGuards(userUpdateGuards);

export const userCreateValidators = {
    id: [],
    username: [
        (username: string) => Pr(username !== undefined ? null : { required: 'username required.' }),
        (username: string) => Pr(username.length > 3 ? null : { minLength: 'username too short.' }),
        (username: string) => Pr(username.length < 255 ? null : { maxLength: 'username too long.' }),
    ],
    password: [
        (password: string) => Pr(password !== undefined ? null : { required: 'password required.' }),
        (password: string) => Pr(password.length > 3 ? null : { minLength: 'password too short.' }),
        (password: string) => Pr(password.length < 255 ? null : { maxLength: 'password too long.' }),
    ],
    json: [],
};

export const userUpdateValidators = {
    id: [],
    username: [
        (username: string) => Pr(username.length > 3 ? null : { minLength: 'username too short.' }),
        (username: string) => Pr(username.length < 255 ? null : { maxLength: 'username too long.' }),
    ],
    roles: [
        (roles: string[]) => Pr(roles && roles.every(role => ['user', 'admin'].includes(role)) ? null : { unknow: `role unknow in ${roles}` }),
    ],
    json: [],
};

export const runUserCreateValidators = runValidators(userCreateValidators);
export const runUserUpdateValidators = runValidators(userUpdateValidators);
export const runUserUpdateSetValidators = runValidators(userUpdateValidators, 'set');
export const runUserUpdatePushValidators = runValidators(userUpdateValidators, 'push');
export const runUserUpdatePullValidators = runValidators(userUpdateValidators, 'pull');

mainUserSchema.pre('find', preUserFind);
mainUserSchema.pre('save', preUserSave);
mainUserSchema.pre('update', preUserUpdate);
mainUserSchema.post('save', postUserSave);
mainUserSchema.pre('update', postUserSave);

export const mainUserModel = mongoose.model('UserV4', mainUserSchema);


export class UserUtils {
    
    async getAll() {
        const r = mainUserModel.find();
        console.log('r');
        const R = await r;
        console.log('R: ', R);
        return r;
    }
    
    getById(id: ID) {
        return mainUserModel.findById(id);
    }
    
    createOne(payload: CreateUser) {
        const user = new mainUserModel(payload);
        return user.save();
    }
    
    async updateById(update: UpdateUser) {
        const user = await this.getById(update.id);
        return user.update(convertUpdateUserForMongoose(update));
    }
    
    deleteById(id: ID) {
        return mainUserModel.findByIdAndRemove(id);
    }
}

export const mainUserUtils = new UserUtils();

export class UserService {
    async getAll() {
        return mainUserUtils.getAll();
    }
    async getById(id: ID) {
        return mainUserUtils.getById(id);
    }
    async create(payload: CreateUser) {
        return mainUserUtils.createOne(payload);
    }
    async update(payload: UpdateUser) {
        return mainUserUtils.updateById(payload);
    }
    async delete(id: ID) {
        return mainUserUtils.deleteById(id);
    }
}

export const mainUserService = new UserService();

export class UserController {

    private error(error: any) {
        const ctx = getCtx();
        return {
            error: error.toString(),
            userSelectGuardErrors: ctx.userSelectGuardErrors,
            userCreateGuardErrors: ctx.userCreateGuardErrors,
            userUpdateGuardErrors: ctx.userUpdateGuardErrors,
            userCreateValidators: ctx.userCreateValidators,
            userUpdateValidators: ctx.userUpdateValidators,
        };
    }

    getAll() {
        return async (req: Request, res: Response) => {
            console.log(`Got called ...`);
            try {
                res.json({ response: await mainUserService.getAll() });
            } catch (error) {
                res.status(400).json(this.error(error));
            }
        };
    }

    getById() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                res.json({ response: await mainUserService.getById(id) });
            } catch (error) {
                res.status(400).json(this.error(error));
            }
        };
    }

    create() {
        return async (req: Request, res: Response) => {
            const payload = req.body;
            try {
                res.json({ response: await mainUserService.create(payload) });
            } catch (error) {
                res.status(400).json(this.error(error));
            }
        };
    }

    update() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            const set = req.body.set;
            const push = req.body.push;
            const pull = req.body.pull;
            try {
                res.json({ response: await mainUserService.update({ id, set, push, pull }) });
            } catch (error) {
                res.status(400).json(this.error(error));
            }
        };
    }

    delete() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                res.json({ response: await mainUserService.delete(id) });
            } catch (error) {
                res.status(400).json(this.error(error));
            }
        };
    }
}

export const mainUserController = new UserController();

export const userGetAllMiddlewares = () => getCtx().schema.user.webServices['GET /'].middlewares;
export const userGetByIdMiddlewares = () => getCtx().schema.user.webServices['POST /'].middlewares;
export const userCreateMiddlewares = () => getCtx().schema.user.webServices['GET /:id'].middlewares;
export const userUpdateMiddlewares = () => getCtx().schema.user.webServices['PUT /:id'].middlewares;
export const userDeleteMiddlewares = () => getCtx().schema.user.webServices['DELETE /:id'].middlewares;

export class UserRouter {
    applyRouter(app: Application) {
        app.use('/users', Router()
            .get('/', ...userGetAllMiddlewares(), mainUserController.getAll())
            .post('/', ...userCreateMiddlewares(), mainUserController.create())
            .get('/:id', ...userGetByIdMiddlewares(), mainUserController.getById())
            .put('/:id', ...userUpdateMiddlewares(), mainUserController.update())
            .delete('/:id', ...userDeleteMiddlewares(), mainUserController.delete())
        );
    }
}

export const mainUserRouter = new UserRouter();

/******************************************************************************************************************** */

/*
export interface Store {
    id: ID;
    name: string;
    users: ObjectID[];
    products: ObjectID[];
    json?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Category {
    id: ID;
    name: string;
    products: ObjectID[];
    json?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Media {
    id: ID;
    name: string;
    products: ObjectID;
    json?: any;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Product {
    id: ID;
    name: string;
    store: ObjectID;
    user: ObjectID;
    categories: ObjectID[];
    medias: ObjectID[];
    json?: any;
    createdAt?: Date;
    updatedAt?: Date;
}
*/