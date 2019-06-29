
import {
    Application,
    Router,
    Request,
    Response,
    NextFunction
} from 'express';
import { DocumentQuery } from 'mongoose';
import { ObjectID } from 'mongodb';
import {
    GenContext,
    LibGuardReturnUnion,
    LibValidator,
    LibValidatorReturnUnion
} from '../../lib/gen/types';
                        

import {
    ID,
    UserModel,
    UserCreatePayloadModel,
    UserUpdatePayloadModel,
    UserQueryObject,
    UserProjectionObject,
    UserPopulateObject
} from '../types';


export const fieldForCreateUser = ['id', 'username', 'password', 'email', 'birthdate', 'json'];


export const fieldForUpdateSetUser = ['username', 'roles', 'email', 'birthdate', 'json'];


export const fieldForUpdatePushUser = ['roles'];


export const fieldForUpdatePullUser = ['roles'];


export const defaultUserProjectionObject = {
    username: 1 as 0 | 1,
    roles: 1 as 0 | 1,
    email: 1 as 0 | 1,
    birthdate: 1 as 0 | 1,
    json: 1 as 0 | 1,
    todos: 1 as 0 | 1,
};


export const defaultUserPopulateObject = {
    todos: true,
};


export const runCanSelectUserUsernameGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.username.guards
        && context.schema.apis.user.model.username.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['username']: {
                            ...(step['username'] ? step['username'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserPasswordGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.password.guards
        && context.schema.apis.user.model.password.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['password']: {
                            ...(step['password'] ? step['password'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserRolesGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.roles.guards
        && context.schema.apis.user.model.roles.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['roles']: {
                            ...(step['roles'] ? step['roles'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserEmailGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.email.guards
        && context.schema.apis.user.model.email.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['email']: {
                            ...(step['email'] ? step['email'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserBirthdateGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.birthdate.guards
        && context.schema.apis.user.model.birthdate.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['birthdate']: {
                            ...(step['birthdate'] ? step['birthdate'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserJsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.json.guards
        && context.schema.apis.user.model.json.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['json']: {
                            ...(step['json'] ? step['json'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserTodosGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.todos.guards
        && context.schema.apis.user.model.todos.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['todos']: {
                            ...(step['todos'] ? step['todos'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserUsernameGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.username.guards
        && context.schema.apis.user.model.username.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['username']: {
                            ...(step['username'] ? step['username'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserPasswordGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.password.guards
        && context.schema.apis.user.model.password.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['password']: {
                            ...(step['password'] ? step['password'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserRolesGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.roles.guards
        && context.schema.apis.user.model.roles.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['roles']: {
                            ...(step['roles'] ? step['roles'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserEmailGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.email.guards
        && context.schema.apis.user.model.email.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['email']: {
                            ...(step['email'] ? step['email'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserBirthdateGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.birthdate.guards
        && context.schema.apis.user.model.birthdate.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['birthdate']: {
                            ...(step['birthdate'] ? step['birthdate'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserJsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.json.guards
        && context.schema.apis.user.model.json.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['json']: {
                            ...(step['json'] ? step['json'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserTodosGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.todos.guards
        && context.schema.apis.user.model.todos.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['todos']: {
                            ...(step['todos'] ? step['todos'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserUsernameGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.username.guards
        && context.schema.apis.user.model.username.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['username']: {
                            ...(step['username'] ? step['username'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserPasswordGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.password.guards
        && context.schema.apis.user.model.password.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['password']: {
                            ...(step['password'] ? step['password'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserRolesGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.roles.guards
        && context.schema.apis.user.model.roles.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['roles']: {
                            ...(step['roles'] ? step['roles'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserEmailGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.email.guards
        && context.schema.apis.user.model.email.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['email']: {
                            ...(step['email'] ? step['email'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserBirthdateGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.birthdate.guards
        && context.schema.apis.user.model.birthdate.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['birthdate']: {
                            ...(step['birthdate'] ? step['birthdate'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserJsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.json.guards
        && context.schema.apis.user.model.json.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['json']: {
                            ...(step['json'] ? step['json'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserTodosGuards = async (context: GenContext) => {
    const guards = context.schema.apis.user.model.todos.guards
        && context.schema.apis.user.model.todos.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['todos']: {
                            ...(step['todos'] ? step['todos'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runUserUsernameValidators = (input: string, context: GenContext) => {
    const validators = context.schema.apis.user.model.username.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = (validator as LibValidator)(input);
        if (step || validate) {
            if (!step) {
                step = validate;
            } else if (validate) {
                step = { ...step, ...validate };
            }
        }
        return step;
    }, null);
};


export const runUserPasswordValidators = (input: string, context: GenContext) => {
    const validators = context.schema.apis.user.model.password.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = (validator as LibValidator)(input);
        if (step || validate) {
            if (!step) {
                step = validate;
            } else if (validate) {
                step = { ...step, ...validate };
            }
        }
        return step;
    }, null);
};


export const runUserRolesValidators = (input: string[], context: GenContext) => {
    const validators = context.schema.apis.user.model.roles.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = (validator as LibValidator)(input);
        if (step || validate) {
            if (!step) {
                step = validate;
            } else if (validate) {
                step = { ...step, ...validate };
            }
        }
        return step;
    }, null);
};


export const runUserEmailValidators = (input: string, context: GenContext) => {
    const validators = context.schema.apis.user.model.email.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = (validator as LibValidator)(input);
        if (step || validate) {
            if (!step) {
                step = validate;
            } else if (validate) {
                step = { ...step, ...validate };
            }
        }
        return step;
    }, null);
};


export const runUserBirthdateValidators = (input: Date, context: GenContext) => {
    const validators = context.schema.apis.user.model.birthdate.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = (validator as LibValidator)(input);
        if (step || validate) {
            if (!step) {
                step = validate;
            } else if (validate) {
                step = { ...step, ...validate };
            }
        }
        return step;
    }, null);
};


export const runUserJsonValidators = (input: any, context: GenContext) => {
    const validators = context.schema.apis.user.model.json.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = (validator as LibValidator)(input);
        if (step || validate) {
            if (!step) {
                step = validate;
            } else if (validate) {
                step = { ...step, ...validate };
            }
        }
        return step;
    }, null);
};


export const runUserTodosValidators = (input: ObjectID[], context: GenContext) => {
    const validators = context.schema.apis.user.model.todos.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = (validator as LibValidator)(input);
        if (step || validate) {
            if (!step) {
                step = validate;
            } else if (validate) {
                step = { ...step, ...validate };
            }
        }
        return step;
    }, null);
};


export const runAllCanSelectUserGuards = async (context: GenContext) => {
    return Promise.all([
        runCanSelectUserUsernameGuards(context),
        runCanSelectUserPasswordGuards(context),
        runCanSelectUserRolesGuards(context),
        runCanSelectUserEmailGuards(context),
        runCanSelectUserBirthdateGuards(context),
        runCanSelectUserJsonGuards(context),
        runCanSelectUserTodosGuards(context),
    ]);
};


export const runAllCanCreateUserGuards = async (context: GenContext) => {
    return Promise.all([
        runCanCreateUserUsernameGuards(context),
        runCanCreateUserPasswordGuards(context),
        runCanCreateUserRolesGuards(context),
        runCanCreateUserEmailGuards(context),
        runCanCreateUserBirthdateGuards(context),
        runCanCreateUserJsonGuards(context),
        runCanCreateUserTodosGuards(context),
    ]);
};


export const runAllCanUpdateUserGuards = async (context: GenContext) => {
    return Promise.all([
        runCanUpdateUserUsernameGuards(context),
        runCanUpdateUserPasswordGuards(context),
        runCanUpdateUserRolesGuards(context),
        runCanUpdateUserEmailGuards(context),
        runCanUpdateUserBirthdateGuards(context),
        runCanUpdateUserJsonGuards(context),
        runCanUpdateUserTodosGuards(context),
    ]);
};


export const runAllUserValidators = (context: GenContext) => {
    const validators = Object.entries(context.schema.apis.user.model)
        .map(([fieldName, field]: [string, any]) => [fieldName, field, field.validators || {}] as [string, any, LibValidator]);
    const validations = validators.map(([fieldName, field, validators]) => Object.entries(validators)
        .map(([validatorName, validator]) => [validatorName, validator(context.req[fieldName], context)] as [string, LibValidatorReturnUnion])
    );
    if (validations.some(([validationName, validation]) => !!validation)) {
        return validations;
    }
    return null;
};


export class UserUtilityService {

    context: GenContext;

    model = UserModel;

    constructor() {
    }

    populateAll(query: any, populates: string[], idx: number = 0) {
        if (idx === populates.length) {
            return query;
        }
        return this.populateAll(query.populate(populates[idx]), populates, idx + 1);
    }

    async applyAllCanSelectGuards(query: Promise<any> | DocumentQuery<any, any>) {
        const deleteThem = (results: LibGuardReturnUnion[], instance: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete instance[fieldName];
            }));
        };
        const results = await runAllCanSelectUserGuards(this.context);
        return query
            .then(result => {
                Array.isArray(result)
                    ? result.forEach(res => deleteThem(results, res))
                    : deleteThem(results, result);
                return result;
            });
    }

    async applyAllCanCreateGuards(_payload: UserCreatePayloadModel) {
        const payload = fieldForCreateUser
            .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload[fieldName] }), {});
        const deleteThem = (results: LibGuardReturnUnion[], body: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete body[fieldName];
            }));
        };
        const results = await runAllCanCreateUserGuards(this.context);
        deleteThem(results, payload);
        return payload;
    }

    async applyAllCanUpdateGuards(_payload: UserUpdatePayloadModel) {
        const payload = {
            id: _payload.id,
            $set: fieldForUpdateSetUser
                .filter(fieldName => _payload.$set && fieldName in Object.keys(_payload.$set))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$set[fieldName] }), {}),
            $push: fieldForUpdatePushUser
                .filter(fieldName => _payload.$push && fieldName in Object.keys(_payload.$push))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$push[fieldName] }), {}),
            $pull: fieldForUpdatePullUser
                .filter(fieldName => _payload.$pull && fieldName in Object.keys(_payload.$pull))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$pull[fieldName] }), {}),
        };
        const deleteThem = (results: LibGuardReturnUnion[], body: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete body[fieldName];
            }));
        };
        const results = await runAllCanUpdateUserGuards(this.context);
        deleteThem(results, payload.$set);
        deleteThem(results, payload.$push);
        deleteThem(results, payload.$pull);
        return payload;
    }

    async find(
        mongooseQueryObject?: UserQueryObject,
        mongooseProjectionObject?: UserProjectionObject,
        mongoosePopulateObject: UserPopulateObject = {},
        mongooseQueryOptions?: any,
        lean: boolean = false,
        exec: boolean = false,
        cb?: any
    ) {
        const populates = Object.keys(mongoosePopulateObject).filter(key => mongoosePopulateObject[key]);
        const query = () => this.populateAll(this.model.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongooseQueryOptions
        ), populates);
        const queryLean = () => lean ? query().lean() : query();
        const queryExec = () => exec ? queryLean().exec(cb) : queryLean();
        return this.applyAllCanSelectGuards(queryExec());
    }

    async create(
        _createPayload: UserCreatePayloadModel,
    ) {
        const createPayload = await this.applyAllCanCreateGuards(_createPayload);
        const instance = new this.model(createPayload);
        return instance.save();
    }

    async update(
        _updatePayload: UserUpdatePayloadModel,
        lean: boolean = false,
        exec: boolean = false,
        cb?: any
    ) {
        const updatePayload = await this.applyAllCanUpdateGuards(_updatePayload);
        const query = () => this.model.findByIdAndUpdate(updatePayload.id, {
            $set: updatePayload.$set,
            $push: Object.entries(updatePayload.$push || {}).reduce((step, [fieldName, toPush]) => ({
                ...step,
                [fieldName]: { $each: toPush }
            }), {}),
            $pull: Object.entries(updatePayload.$pull || {}).reduce((step, [fieldName, toPull]) => ({
                ...step,
                [fieldName]: { $in: toPull }
            }), {}),
        });
        const queryLean = () => lean ? query().lean() : query();
        const queryExec = () => exec ? queryLean().exec(cb) : queryLean();
        return queryExec();
    }

    async delete(
        id: ID,
        lean: boolean = false,
        exec: boolean = false,
        cb?: any
    ) {
        const query = () => this.model.findByIdAndRemove(id);
        const queryLean = () => lean ? query().lean() : query();
        const queryExec = () => exec ? queryLean().exec(cb) : queryLean();
        return queryExec();
    }

    async findLean(
        mongooseQueryObject?: UserQueryObject,
        mongooseProjectionObject?: UserProjectionObject,
        mongoosePopulateObject: UserPopulateObject = {},
        mongooseQueryOptions?: any
    ) {
        return this.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongoosePopulateObject,
            mongooseQueryOptions,
            true
        );
    }

    async createLean(createPayload: UserCreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateLean(updatePayload: UserUpdatePayloadModel) {
        return this.update(updatePayload, true);
    }

    async deleteLean(id: ID) {
        return this.delete(id, true);
    }

    async findExec(
        mongooseQueryObject?: UserQueryObject,
        mongooseProjectionObject?: UserProjectionObject,
        mongoosePopulateObject: UserPopulateObject = {},
        mongooseQueryOptions?: any,
        cb?: any,
    ) {
        return this.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongoosePopulateObject,
            mongooseQueryOptions,
            false,
            true,
            cb
        );
    }

    async createExec(createPayload: UserCreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateExec(updatePayload: UserUpdatePayloadModel, cb?: any) {
        return this.update(updatePayload, false, true, cb);
    }

    async deleteExec(id: ID, cb?: any) {
        return this.delete(id, false, true, cb);
    }

    async findLeanExec(
        mongooseQueryObject?: UserQueryObject,
        mongooseProjectionObject?: UserProjectionObject,
        mongoosePopulateObject: UserPopulateObject = {},
        mongooseQueryOptions?: any,
        cb?: any
    ) {
        return this.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongoosePopulateObject,
            mongooseQueryOptions,
            true,
            true,
            cb
        );
    }

    async createLeanExec(createPayload: UserCreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateLeanExec(updatePayload: UserUpdatePayloadModel, cb?: any) {
        return this.update(updatePayload, true, true, cb);
    }

    async deleteLeanExec(id: ID, cb?: any) {
        return this.delete(id, true, true, cb);
    }
}

export const mainUserUtilityService = new UserUtilityService();



export class UserService {

    utils = mainUserUtilityService;

    constructor() {}

    async getAll() {
        return this.utils.find({}, defaultUserProjectionObject, defaultUserPopulateObject);
    }
    
    async getById(id: ID) {
        return this.utils.find({ id }, defaultUserProjectionObject, defaultUserPopulateObject);
    }
    
    async create(createPayload: UserCreatePayloadModel) {
        return this.utils.create(createPayload);
    }
    
    async update(updatePayload: UserUpdatePayloadModel) {
        return this.utils.update(updatePayload);
    }
    
    async delete(id: ID) {
        return this.utils.delete(id);
    }
}

export const mainUserService = new UserService();



/*

export class $name {
    constructor() {}
}

export const $instance = new $name();

*/


export class UserController {
    
    service = mainUserService;

    constructor() {}

    getAll() {
        return async (req: Request, res: Response) => {
            try {
                const response = await this.service.getAll();
                res.json({ response });
            } catch (error) {
                res.status(400).send(error);
            }
        };
    }
    
    getById() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                const response = await this.service.getById(id);
                res.json({ response });
            } catch (error) {
                res.status(400).send(error);
            }
        };
    }
    
    create() {
        return async (req: Request, res: Response) => {
            const payload = req.body;
            try {
                const response = await this.service.create(payload);
                res.json({ response });
            } catch (error) {
                res.status(400).send(error);
            }
        };
    }
    
    update() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            const payload = req.body;
            try {
                const response = await this.service.update({ id, ...payload });
                res.json({ response });
            } catch (error) {
                res.status(400).send(error);
            }
        };
    }
    
    delete() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            try {
                const response = await this.service.delete(id);
                res.json({ response });
            } catch (error) {
                res.status(400).send(error);
            }
        };
    }

}

export const mainUserController = new UserController();


export class UserRouter {

    controller = mainUserController;
    router: any;

    constructor() {
        this.router = Router()
            .post('/', ...undefined.schema.apis.user.webServices['POST /'].middlewares, this.controller.create())
            .delete('/:id', ...undefined.schema.apis.user.webServices['DELETE /:id'].middlewares, this.controller.delete())
            .put('/:id/password', ...undefined.schema.apis.user.webServices['PUT /:id/password'].middlewares);
    }

    applyRouter(app: Application) {
        app.use('/user', this.router);
    }

}

export const mainUserRouter = new UserRouter();


