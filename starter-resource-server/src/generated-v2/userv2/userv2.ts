
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

import { gen } from '../../lib/gen/core';
                        

import {
    ID,
    Userv2Model,
    Userv2CreatePayloadModel,
    Userv2UpdatePayloadModel,
    Userv2QueryObject,
    Userv2ProjectionObject,
    Userv2PopulateObject
} from '../types';


export const fieldForCreateUserv2 = ['id', 'username', 'password', 'email', 'birthdate', 'json'];


export const fieldForUpdateSetUserv2 = ['username', 'roles', 'email', 'birthdate', 'json'];


export const fieldForUpdatePushUserv2 = ['roles'];


export const fieldForUpdatePullUserv2 = ['roles'];


export const defaultUserv2ProjectionObject = {
    username: 1 as 0 | 1,
    roles: 1 as 0 | 1,
    email: 1 as 0 | 1,
    birthdate: 1 as 0 | 1,
    json: 1 as 0 | 1,
    todos: 1 as 0 | 1,
};


export const defaultUserv2PopulateObject = {
    todos: true,
};


export const runCanSelectUserv2UsernameGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.username.guards
        && context.schema.apis.userv2.model.username.guards.canSelect;
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


export const runCanSelectUserv2PasswordGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.password.guards
        && context.schema.apis.userv2.model.password.guards.canSelect;
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


export const runCanSelectUserv2RolesGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.roles.guards
        && context.schema.apis.userv2.model.roles.guards.canSelect;
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


export const runCanSelectUserv2EmailGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.email.guards
        && context.schema.apis.userv2.model.email.guards.canSelect;
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


export const runCanSelectUserv2BirthdateGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.birthdate.guards
        && context.schema.apis.userv2.model.birthdate.guards.canSelect;
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


export const runCanSelectUserv2JsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.json.guards
        && context.schema.apis.userv2.model.json.guards.canSelect;
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


export const runCanSelectUserv2TodosGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.todos.guards
        && context.schema.apis.userv2.model.todos.guards.canSelect;
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


export const runCanCreateUserv2UsernameGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.username.guards
        && context.schema.apis.userv2.model.username.guards.canCreate;
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


export const runCanCreateUserv2PasswordGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.password.guards
        && context.schema.apis.userv2.model.password.guards.canCreate;
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


export const runCanCreateUserv2RolesGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.roles.guards
        && context.schema.apis.userv2.model.roles.guards.canCreate;
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


export const runCanCreateUserv2EmailGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.email.guards
        && context.schema.apis.userv2.model.email.guards.canCreate;
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


export const runCanCreateUserv2BirthdateGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.birthdate.guards
        && context.schema.apis.userv2.model.birthdate.guards.canCreate;
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


export const runCanCreateUserv2JsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.json.guards
        && context.schema.apis.userv2.model.json.guards.canCreate;
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


export const runCanCreateUserv2TodosGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.todos.guards
        && context.schema.apis.userv2.model.todos.guards.canCreate;
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


export const runCanUpdateUserv2UsernameGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.username.guards
        && context.schema.apis.userv2.model.username.guards.canUpdate;
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


export const runCanUpdateUserv2PasswordGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.password.guards
        && context.schema.apis.userv2.model.password.guards.canUpdate;
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


export const runCanUpdateUserv2RolesGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.roles.guards
        && context.schema.apis.userv2.model.roles.guards.canUpdate;
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


export const runCanUpdateUserv2EmailGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.email.guards
        && context.schema.apis.userv2.model.email.guards.canUpdate;
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


export const runCanUpdateUserv2BirthdateGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.birthdate.guards
        && context.schema.apis.userv2.model.birthdate.guards.canUpdate;
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


export const runCanUpdateUserv2JsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.json.guards
        && context.schema.apis.userv2.model.json.guards.canUpdate;
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


export const runCanUpdateUserv2TodosGuards = async (context: GenContext) => {
    const guards = context.schema.apis.userv2.model.todos.guards
        && context.schema.apis.userv2.model.todos.guards.canUpdate;
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


export const runUserv2UsernameValidators = (input: string, context: GenContext) => {
    const validators = context.schema.apis.userv2.model.username.validators;
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
    }, null as LibValidatorReturnUnion);
};


export const runUserv2PasswordValidators = (input: string, context: GenContext) => {
    const validators = context.schema.apis.userv2.model.password.validators;
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
    }, null as LibValidatorReturnUnion);
};


export const runUserv2RolesValidators = (input: string[], context: GenContext) => {
    const validators = context.schema.apis.userv2.model.roles.validators;
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
    }, null as LibValidatorReturnUnion);
};


export const runUserv2EmailValidators = (input: string, context: GenContext) => {
    const validators = context.schema.apis.userv2.model.email.validators;
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
    }, null as LibValidatorReturnUnion);
};


export const runUserv2BirthdateValidators = (input: Date, context: GenContext) => {
    const validators = context.schema.apis.userv2.model.birthdate.validators;
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
    }, null as LibValidatorReturnUnion);
};


export const runUserv2JsonValidators = (input: any, context: GenContext) => {
    const validators = context.schema.apis.userv2.model.json.validators;
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
    }, null as LibValidatorReturnUnion);
};


export const runUserv2TodosValidators = (input: ObjectID[], context: GenContext) => {
    const validators = context.schema.apis.userv2.model.todos.validators;
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
    }, null as LibValidatorReturnUnion);
};


export const runAllCanSelectUserv2Guards = async (context: GenContext) => {
    return Promise.all([
        runCanSelectUserv2UsernameGuards(context),
        runCanSelectUserv2PasswordGuards(context),
        runCanSelectUserv2RolesGuards(context),
        runCanSelectUserv2EmailGuards(context),
        runCanSelectUserv2BirthdateGuards(context),
        runCanSelectUserv2JsonGuards(context),
        runCanSelectUserv2TodosGuards(context),
    ]);
};


export const runAllCanCreateUserv2Guards = async (context: GenContext) => {
    return Promise.all([
        runCanCreateUserv2UsernameGuards(context),
        runCanCreateUserv2PasswordGuards(context),
        runCanCreateUserv2RolesGuards(context),
        runCanCreateUserv2EmailGuards(context),
        runCanCreateUserv2BirthdateGuards(context),
        runCanCreateUserv2JsonGuards(context),
        runCanCreateUserv2TodosGuards(context),
    ]);
};


export const runAllCanUpdateUserv2Guards = async (context: GenContext) => {
    return Promise.all([
        runCanUpdateUserv2UsernameGuards(context),
        runCanUpdateUserv2PasswordGuards(context),
        runCanUpdateUserv2RolesGuards(context),
        runCanUpdateUserv2EmailGuards(context),
        runCanUpdateUserv2BirthdateGuards(context),
        runCanUpdateUserv2JsonGuards(context),
        runCanUpdateUserv2TodosGuards(context),
    ]);
};


export const runAllUserv2Validators = (context: GenContext) => {
    const validators = Object.entries(context.schema.apis.userv2.model)
        .map(([fieldName, field]: [string, any]) => [fieldName, field, field.validators || {}] as [string, any, LibValidator]);
    const validations = validators.map(([fieldName, field, validators]) => Object.entries(validators)
        .map(([validatorName, validator]) => [validatorName, validator(context.req[fieldName], context)] as [string, LibValidatorReturnUnion])
    );
    if (validations.some(([validationName, validation]) => !!validation)) {
        return validations;
    }
    return null;
};


export class Userv2UtilityService {

    context: GenContext;

    model = Userv2Model;

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
        const results = await runAllCanSelectUserv2Guards(this.context);
        return query
            .then(result => {
                Array.isArray(result)
                    ? result.forEach(res => deleteThem(results, res))
                    : deleteThem(results, result);
                return result;
            });
    }

    async applyAllCanCreateGuards(_payload: Userv2CreatePayloadModel) {
        const payload = fieldForCreateUserv2
            .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload[fieldName] }), {});
        const deleteThem = (results: LibGuardReturnUnion[], body: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete body[fieldName];
            }));
        };
        const results = await runAllCanCreateUserv2Guards(this.context);
        deleteThem(results, payload);
        return payload;
    }

    async applyAllCanUpdateGuards(_payload: Userv2UpdatePayloadModel) {
        const payload = {
            id: _payload.id,
            $set: fieldForUpdateSetUserv2
                .filter(fieldName => _payload.$set && fieldName in Object.keys(_payload.$set))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$set[fieldName] }), {}),
            $push: fieldForUpdatePushUserv2
                .filter(fieldName => _payload.$push && fieldName in Object.keys(_payload.$push))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$push[fieldName] }), {}),
            $pull: fieldForUpdatePullUserv2
                .filter(fieldName => _payload.$pull && fieldName in Object.keys(_payload.$pull))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$pull[fieldName] }), {}),
        };
        const deleteThem = (results: LibGuardReturnUnion[], body: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete body[fieldName];
            }));
        };
        const results = await runAllCanUpdateUserv2Guards(this.context);
        deleteThem(results, payload.$set);
        deleteThem(results, payload.$push);
        deleteThem(results, payload.$pull);
        return payload;
    }

    async find(
        mongooseQueryObject?: Userv2QueryObject,
        mongooseProjectionObject?: Userv2ProjectionObject,
        mongoosePopulateObject: Userv2PopulateObject = {},
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
        _createPayload: Userv2CreatePayloadModel,
    ) {
        const createPayload = await this.applyAllCanCreateGuards(_createPayload);
        const instance = new this.model(createPayload);
        return instance.save();
    }

    async update(
        _updatePayload: Userv2UpdatePayloadModel,
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
        mongooseQueryObject?: Userv2QueryObject,
        mongooseProjectionObject?: Userv2ProjectionObject,
        mongoosePopulateObject: Userv2PopulateObject = {},
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

    async createLean(createPayload: Userv2CreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateLean(updatePayload: Userv2UpdatePayloadModel) {
        return this.update(updatePayload, true);
    }

    async deleteLean(id: ID) {
        return this.delete(id, true);
    }

    async findExec(
        mongooseQueryObject?: Userv2QueryObject,
        mongooseProjectionObject?: Userv2ProjectionObject,
        mongoosePopulateObject: Userv2PopulateObject = {},
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

    async createExec(createPayload: Userv2CreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateExec(updatePayload: Userv2UpdatePayloadModel, cb?: any) {
        return this.update(updatePayload, false, true, cb);
    }

    async deleteExec(id: ID, cb?: any) {
        return this.delete(id, false, true, cb);
    }

    async findLeanExec(
        mongooseQueryObject?: Userv2QueryObject,
        mongooseProjectionObject?: Userv2ProjectionObject,
        mongoosePopulateObject: Userv2PopulateObject = {},
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

    async createLeanExec(createPayload: Userv2CreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateLeanExec(updatePayload: Userv2UpdatePayloadModel, cb?: any) {
        return this.update(updatePayload, true, true, cb);
    }

    async deleteLeanExec(id: ID, cb?: any) {
        return this.delete(id, true, true, cb);
    }
}

export const mainUserv2UtilityService = new Userv2UtilityService();



export class Userv2Service {

    utils = mainUserv2UtilityService;

    constructor() {
        this.utils.context = gen.context;
    }

    async getAll() {
        return this.utils.find({}, defaultUserv2ProjectionObject, defaultUserv2PopulateObject);
    }
    
    async getById(id: ID) {
        return this.utils.find({ id }, defaultUserv2ProjectionObject, defaultUserv2PopulateObject);
    }
    
    async create(createPayload: Userv2CreatePayloadModel) {
        return this.utils.create(createPayload);
    }
    
    async update(updatePayload: Userv2UpdatePayloadModel) {
        return this.utils.update(updatePayload);
    }
    
    async delete(id: ID) {
        return this.utils.delete(id);
    }
}

export const mainUserv2Service = new Userv2Service();



/*

export class $name {
    constructor() {}
}

export const $instance = new $name();

*/


export class Userv2Controller {
    
    service = mainUserv2Service;

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

export const mainUserv2Controller = new Userv2Controller();


export class Userv2Router {

    controller = mainUserv2Controller;
    router: any;

    constructor() {}

    initialize() {
        this.router = Router()
            .post('/', ...gen.context.schema.apis.userv2.webServices['POST /'].middlewares, this.controller.create())
            .delete('/:id', ...gen.context.schema.apis.userv2.webServices['DELETE /:id'].middlewares, this.controller.delete())
            .put('/:id/password', ...gen.context.schema.apis.userv2.webServices['PUT /:id/password'].middlewares)
            .get('/', ...gen.context.schema.apis.userv2.webServices['GET /'].middlewares, this.controller.getAll())
            .get('/:id', ...gen.context.schema.apis.userv2.webServices['GET /:id'].middlewares, this.controller.getById())
            .put('/:id', ...gen.context.schema.apis.userv2.webServices['PUT /:id'].middlewares, this.controller.update());
    }

    applyRouter(app: Application) {
        app.use('/userv2', this.router);
    }

}

export const mainUserv2Router = new Userv2Router();


