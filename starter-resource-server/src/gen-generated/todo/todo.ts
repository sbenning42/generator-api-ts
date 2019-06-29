
import { ObjectID } from 'mongodb';
import { GenContext, GenGuardReturnUnion } from '../types';
                        

export const DefaultTodoProjectionObject = {
    title: 1,
    done: 1,
    json: 1,
    author: 1,
};


export const DefaultTodoPopulateObject = {
    author: true,
};


export const runCanSelectTodoTitleGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.title.guards
        && context.schema.apis.todo.model.title.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['title']: {
                            ...(step['title'] ? step['title'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectTodoDoneGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.done.guards
        && context.schema.apis.todo.model.done.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['done']: {
                            ...(step['done'] ? step['done'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectTodoJsonGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.json.guards
        && context.schema.apis.todo.model.json.guards.canSelect;
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


export const runCanSelectTodoAuthorGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.author.guards
        && context.schema.apis.todo.model.author.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['author']: {
                            ...(step['author'] ? step['author'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateTodoTitleGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.title.guards
        && context.schema.apis.todo.model.title.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['title']: {
                            ...(step['title'] ? step['title'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateTodoDoneGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.done.guards
        && context.schema.apis.todo.model.done.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['done']: {
                            ...(step['done'] ? step['done'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateTodoJsonGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.json.guards
        && context.schema.apis.todo.model.json.guards.canCreate;
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


export const runCanCreateTodoAuthorGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.author.guards
        && context.schema.apis.todo.model.author.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['author']: {
                            ...(step['author'] ? step['author'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateTodoTitleGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.title.guards
        && context.schema.apis.todo.model.title.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['title']: {
                            ...(step['title'] ? step['title'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateTodoDoneGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.done.guards
        && context.schema.apis.todo.model.done.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['done']: {
                            ...(step['done'] ? step['done'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateTodoJsonGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.json.guards
        && context.schema.apis.todo.model.json.guards.canUpdate;
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


export const runCanUpdateTodoAuthorGuards = (context: GenContext) => {
    const guards = context.schema.apis.todo.model.author.guards
        && context.schema.apis.todo.model.author.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: GenGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['author']: {
                            ...(step['author'] ? step['author'], {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runTodoTitleValidators = (input: string) => {
    const validators = context.schema.apis.todo.model.title.validators;
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


export const runTodoDoneValidators = (input: boolean) => {
    const validators = context.schema.apis.todo.model.done.validators;
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


export const runTodoJsonValidators = (input: any) => {
    const validators = context.schema.apis.todo.model.json.validators;
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


export const runTodoAuthorValidators = (input: ObjectID) => {
    const validators = context.schema.apis.todo.model.author.validators;
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


export const runAllCanSelectTodoGuards = (context: GenContext) => {
    return Promise.all([
        runCanSelectTodoTitleGuards(context),
        runCanSelectTodoDoneGuards(context),
        runCanSelectTodoJsonGuards(context),
        runCanSelectTodoAuthorGuards(context),
    ]);
};


export const runAllCanCreateTodoGuards = (context: GenContext) => {
    return Promise.all([
        runCanCreateTodoTitleGuards(context),
        runCanCreateTodoDoneGuards(context),
        runCanCreateTodoJsonGuards(context),
        runCanCreateTodoAuthorGuards(context),
    ]);
};


export const runAllCanUpdateTodoGuards = (context: GenContext) => {
    return Promise.all([
        runCanUpdateTodoTitleGuards(context),
        runCanUpdateTodoDoneGuards(context),
        runCanUpdateTodoJsonGuards(context),
        runCanUpdateTodoAuthorGuards(context),
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










