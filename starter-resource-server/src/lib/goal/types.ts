import { ObjectID } from "mongodb";
import mongoose from 'mongoose';

export type ID = string | number | ObjectID;

export const ObjectId = mongoose.Schema.Types.ObjectId;
export const Mixed = mongoose.Schema.Types.Mixed;

export const PrCl = (thing: any) => () => Promise.resolve(thing);
export const Pr = (thing: any) => PrCl(thing)();

export const runGuards = (guardObj: { [field: string]: ((ctx: any) => Promise<{} | null>)[] }) => {
    return async (ctx: any) => {
        const guarded = await Object.entries(guardObj)
            .filter(([field, guards]) => guards && guards.length > 0)
            .map(async ([field, guards]) => [field, await Promise.all(guards.map(guard => guard(ctx)))] as [string, any])
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
            .filter(([field, validators]) => validators && validators.length > 0)
            .map(async ([field, validators]) => [field, await Promise.all(validators.map(validator => validator(path ? input[path][field] : input[field], ctx)))] as [string, any])
            .reduce(async (res$, field$) => {
                const res = await res$;
                const [field, fieldRes] = await field$;
                if (fieldRes) {
                    res[field] = fieldRes;
                }
                return res;
            }, Promise.resolve({}));
        return Object.keys(validated).length > 0 ? validated : null as any;
    };
};

export const mainUserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        select: true,
        default: undefined,
        ref: undefined
    },
    password: {
        type: String,
        required: true,
        unique: false,
        select: false,
        default: undefined,
        ref: undefined
    },
    store: {
        type: ObjectId,
        required: true,
        unique: false,
        select: true,
        default: undefined,
        ref: 'Store'
    },
    roles: {
        type: [String],
        required: true,
        unique: false,
        select: true,
        default: ['user'],
        ref: undefined
    },
    json: {
        type: Mixed,
        required: false,
        unique: false,
        select: true,
        default: {},
        ref: undefined
    },
});

// All field '?' if not required or if select === false or if canSelect is not empty and canSelect is !== ALWAYS, skip if canSelect === NEVER
export interface User {
    id: ID;
    username: string;
    password?: string;
    store: ObjectID;
    roles: string[];
    json?: any;
}

// All field '?' if not required or if select === false,  if canSelect is not empty and canSelect is !== ALWAYS, skip if canSelect === NEVER resolved ObjectID
export interface PopulatedUser {
    id: ID;
    username: string;
    password?: string;
    store: Store;
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

// All field '?', skip if canSelect === NEVER
export interface UserProjection {
    id?: 0 | 1;
    username?: 0 | 1;
    password?: 0 | 1;
    store?: 0 | 1;
    roles?: 0 | 1;
    json?: 0 | 1;
}

// All field 1, 0 if select === false
export const defaultUserProjection = {
    id: 1,
    username: 1,
    password: 0,
    store: 1,
    roles: 1,
    json: 1,
};

// all related field
export interface UserPopulate {
    store: boolean;
}

// all related field that have populate === true
export const defaultUserPopulate = {
    store: true,
};

// all related field that have populate === true
export const defaultUserPopulateAll = {
    store: true,
};

export type UserConditions = any;

export const defaultUserConditions = {};

export const defaultUserSync = {
    store: { target: 'Store', on: 'users', array: true }
};

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
    store: [],
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
export const runUserUpdateSetValidators = runValidators(userUpdateValidators, 'set');
export const runUserUpdatePushValidators = runValidators(userUpdateValidators, 'push');
export const runUserUpdatePullValidators = runValidators(userUpdateValidators, 'pull');

const ctx = undefined;

mainUserSchema.pre('find', async function() {
    let populate: any;
    switch (this['tag']) {
        case 'getAll':
        case 'getMany':
            populate = defaultUserPopulateAll;
            break;
        default:
            populate = defaultUserPopulate;
            break ;
    }
    Object.entries(populate).forEach(([field, should]) => {
        if (should) {
            this.populate(field);
        }
    });
    const thisProjection = { ...defaultUserProjection };
    const guardResults = await runUserSelectGuards(ctx);
    if (guardResults) {
        ctx.userSelectGuardErrors = guardResults;
        Object.keys(guardResults).forEach(field => {
            thisProjection[field] = 0;
        });
    }
    this.select(thisProjection);
});

mainUserSchema.pre('save', async function() {
    const guardResults = await runUserCreateGuards(ctx);
    if (guardResults) {
        ctx.userCreateGuardErrors = guardResults;
        Object.keys(guardResults).forEach(field => {
            this.set(field, undefined);
        });
    }
    const validatorResults = await runUserCreateValidators(ctx.req.body, ctx);
    if (validatorResults) {
        ctx.userCreateValidatorErrors = validatorResults;
        throw new Error(JSON.stringify(validatorResults));
    }
});

mainUserSchema.post('save', async function() {
    const synced = await Promise.all(Object.entries(defaultUserSync)
        .map(async ([field, { target, on, array }]) => {
            const targetModel = mongoose.model(target);
            if (Array.isArray(this[field])) {
                const oldTargeteds = this['__old_' + field] as ID[];
                const targeteds = await targetModel.find({ _id: { $in: this[field] } });
                const removeds = await targetModel.find({ _id: { $in: oldTargeteds } });
                const news = targeteds.filter(tar => !oldTargeteds.includes(tar._id));
                if (removeds.length === 0 && news.length === 0) {
                    return;
                }
                if (array) {
                    await Promise.all(news.map(async (_new) => {
                        _new[on].push(this._id);
                        await _new.save();
                    }));
                    await Promise.all(removeds.map(async (_rem) => {
                        _rem[on] = _rem[on].filter((id: ID) => id !== this._id);
                        await _rem.save();
                    }));
                } else {
                    await Promise.all(news.map(async (_new) => {
                        _new[on] = this._id;
                        await _new.save();
                    }));
                    await Promise.all(removeds.map(async (_rem) => {
                        _rem[on] = undefined;
                        /** TODO delete if required */
                        await _rem.save();
                    }));
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
                    await targeted.save();
                    /** TODO delete if required */
                    await oldTargeted.save();
                } else {
                    targeted[on] = this._id;
                    oldTargeted[on] = undefined;
                    await targeted.save();
                    /** TODO delete if required */
                    await oldTargeted.save();
                }
            }
        })
    );
});

export const mainUserModel = mongoose.model('User', mainUserSchema);


export class UserUtils {
    
    getAll() {}
    getMany() {}
    getOne() {}
    getById() {}
    
    createMany() {}
    createOne() {}
    
    updateMany() {}
    updateOne() {}
    updateById() {}
    
    deleteMany() {}
    deleteOne() {}
    deleteById() {}
}


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