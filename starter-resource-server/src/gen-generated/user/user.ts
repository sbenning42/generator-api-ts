
import { ObjectID } from 'mongodb';
import { GenContext, GenGuardReturnUnion } from '../types';
                        

export const DefaultUserProjectionObject = {
    username: 1,
    roles: 1,
    email: 1,
    birthdate: 1,
    json: 1,
    todos: 1,
};


export const DefaultUserPopulateObject = {
    todos: true,
};


export const runCanSelectUserUsernameGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.username.guards
        && context.schema.apis.user.model.username.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['username']: {
                            ...(step['username'] ? step['username'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserPasswordGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.password.guards
        && context.schema.apis.user.model.password.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['password']: {
                            ...(step['password'] ? step['password'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserRolesGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.roles.guards
        && context.schema.apis.user.model.roles.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['roles']: {
                            ...(step['roles'] ? step['roles'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserEmailGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.email.guards
        && context.schema.apis.user.model.email.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['email']: {
                            ...(step['email'] ? step['email'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserBirthdateGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.birthdate.guards
        && context.schema.apis.user.model.birthdate.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['birthdate']: {
                            ...(step['birthdate'] ? step['birthdate'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserJsonGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.json.guards
        && context.schema.apis.user.model.json.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['json']: {
                            ...(step['json'] ? step['json'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectUserTodosGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.todos.guards
        && context.schema.apis.user.model.todos.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['todos']: {
                            ...(step['todos'] ? step['todos'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserUsernameGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.username.guards
        && context.schema.apis.user.model.username.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['username']: {
                            ...(step['username'] ? step['username'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserPasswordGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.password.guards
        && context.schema.apis.user.model.password.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['password']: {
                            ...(step['password'] ? step['password'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserRolesGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.roles.guards
        && context.schema.apis.user.model.roles.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['roles']: {
                            ...(step['roles'] ? step['roles'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserEmailGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.email.guards
        && context.schema.apis.user.model.email.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['email']: {
                            ...(step['email'] ? step['email'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserBirthdateGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.birthdate.guards
        && context.schema.apis.user.model.birthdate.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['birthdate']: {
                            ...(step['birthdate'] ? step['birthdate'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserJsonGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.json.guards
        && context.schema.apis.user.model.json.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['json']: {
                            ...(step['json'] ? step['json'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateUserTodosGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.todos.guards
        && context.schema.apis.user.model.todos.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['todos']: {
                            ...(step['todos'] ? step['todos'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserUsernameGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.username.guards
        && context.schema.apis.user.model.username.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['username']: {
                            ...(step['username'] ? step['username'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserPasswordGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.password.guards
        && context.schema.apis.user.model.password.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['password']: {
                            ...(step['password'] ? step['password'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserRolesGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.roles.guards
        && context.schema.apis.user.model.roles.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['roles']: {
                            ...(step['roles'] ? step['roles'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserEmailGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.email.guards
        && context.schema.apis.user.model.email.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['email']: {
                            ...(step['email'] ? step['email'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserBirthdateGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.birthdate.guards
        && context.schema.apis.user.model.birthdate.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['birthdate']: {
                            ...(step['birthdate'] ? step['birthdate'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserJsonGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.json.guards
        && context.schema.apis.user.model.json.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['json']: {
                            ...(step['json'] ? step['json'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateUserTodosGuards = (context: GenContext) => {
    const guards = context.schema.apis.user.model.todos.guards
        && context.schema.apis.user.model.todos.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['todos']: {
                            ...(step['todos'] ? step['todos'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runUserUsernameValidators = (input: string) => {
    const validators = context.schema.apis.user.model.username.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = validator(input);
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


export const runUserPasswordValidators = (input: string) => {
    const validators = context.schema.apis.user.model.password.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = validator(input);
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


export const runUserRolesValidators = (input: string[]) => {
    const validators = context.schema.apis.user.model.roles.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = validator(input);
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


export const runUserEmailValidators = (input: string) => {
    const validators = context.schema.apis.user.model.email.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = validator(input);
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


export const runUserBirthdateValidators = (input: Date) => {
    const validators = context.schema.apis.user.model.birthdate.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = validator(input);
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


export const runUserJsonValidators = (input: any) => {
    const validators = context.schema.apis.user.model.json.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = validator(input);
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


export const runUserTodosValidators = (input: ObjectID[]) => {
    const validators = context.schema.apis.user.model.todos.validators;
    return Object.values(validators).reduce((step, validator) => {
        const validate = validator(input);
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


export const runAllCanSelectUserGuards = (context: GenContext) => {
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


export const runAllCanCreateUserGuards = (context: GenContext) => {
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


export const runAllCanUpdateUserGuards = (context: GenContext) => {
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


export class $name {

    model = $modelName;

    constructor() {
    }

    find(
        mongooseQueryObject: $queryObject,
        mongooseProjectionObject: $projectionObject,
        mongoosePopulateObject: $populateObject,
        mongooseQueryOptions: any,
    ) {
        return this.model.find(
            mongooseQueryObject,
            mongooseProjectionObject,
            mongoosePopulateObject,
            mongooseQueryOptions
        );
    }

    create(
        createPayload: $createPayloadModel,
        mongooseProjectionObject: $projectionObject,
        mongoosePopulateObject: $populateObject,
    ) {

    }

    update() {
    }

    delete() {
    }

    findLean() {
        return this.find().lean();
    }

    createLean() {
        return this.create().lean();
    }

    updateLean() {
        return this.update().lean();
    }

    deleteLean() {
        return this.delete().lean();
    }

    findExec() {
        return this.find().exec();
    }

    createExec() {
        return this.create().exec();
    }

    updateExec() {
        return this.update().exec();
    }

    deleteExec() {
        return this.delete().exec();
    }

    findLeanExec() {
        return this.findLean().exec();
    }

    createLeanExec() {
        return this.createLean().exec();
    }

    updateLeanExec() {
        return this.updateLean().exec();
    }

    deleteLeanExec() {
        return this.deleteLean().exec();
    }
}










