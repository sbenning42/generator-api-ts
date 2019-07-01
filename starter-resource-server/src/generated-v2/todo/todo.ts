
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
    TodoModel,
    TodoCreatePayloadModel,
    TodoUpdatePayloadModel,
    TodoQueryObject,
    TodoProjectionObject,
    TodoPopulateObject
} from '../types';


export const fieldForCreateTodo = ['id', 'title', 'done', 'json'];


export const fieldForUpdateSetTodo = ['title', 'done', 'json'];


export const fieldForUpdatePushTodo = [];


export const fieldForUpdatePullTodo = [];


export const defaultTodoProjectionObject = {
    title: 1 as 0 | 1,
    done: 1 as 0 | 1,
    json: 1 as 0 | 1,
    author: 1 as 0 | 1,
};


export const defaultTodoPopulateObject = {
    author: true,
};


export const runCanSelectTodoTitleGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.title.guards
        && context.schema.apis.todo.model.title.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['title']: {
                            ...(step['title'] ? step['title'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectTodoDoneGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.done.guards
        && context.schema.apis.todo.model.done.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['done']: {
                            ...(step['done'] ? step['done'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanSelectTodoJsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.json.guards
        && context.schema.apis.todo.model.json.guards.canSelect;
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


export const runCanSelectTodoAuthorGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.author.guards
        && context.schema.apis.todo.model.author.guards.canSelect;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['author']: {
                            ...(step['author'] ? step['author'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateTodoTitleGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.title.guards
        && context.schema.apis.todo.model.title.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['title']: {
                            ...(step['title'] ? step['title'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateTodoDoneGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.done.guards
        && context.schema.apis.todo.model.done.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['done']: {
                            ...(step['done'] ? step['done'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanCreateTodoJsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.json.guards
        && context.schema.apis.todo.model.json.guards.canCreate;
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


export const runCanCreateTodoAuthorGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.author.guards
        && context.schema.apis.todo.model.author.guards.canCreate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['author']: {
                            ...(step['author'] ? step['author'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateTodoTitleGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.title.guards
        && context.schema.apis.todo.model.title.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['title']: {
                            ...(step['title'] ? step['title'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateTodoDoneGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.done.guards
        && context.schema.apis.todo.model.done.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['done']: {
                            ...(step['done'] ? step['done'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runCanUpdateTodoJsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.json.guards
        && context.schema.apis.todo.model.json.guards.canUpdate;
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


export const runCanUpdateTodoAuthorGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todo.model.author.guards
        && context.schema.apis.todo.model.author.guards.canUpdate;
    return Promise.all((guards || []).map(guard => guard(context)))
        .then((results: LibGuardReturnUnion[]) => results.reduce((step, result) => {
            if (step || result) {
                if (!step) {
                    step = result;
                } else if (result) {
                    step = {
                        ...step,
                        ['author']: {
                            ...(step['author'] ? step['author'] : {}),
                            ...result
                        }
                    };
                }
            }
            return step;
        }, null));
};


export const runTodoTitleValidators = (input: string, context: GenContext) => {
    const validators = context.schema.apis.todo.model.title.validators;
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


export const runTodoDoneValidators = (input: boolean, context: GenContext) => {
    const validators = context.schema.apis.todo.model.done.validators;
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


export const runTodoJsonValidators = (input: any, context: GenContext) => {
    const validators = context.schema.apis.todo.model.json.validators;
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


export const runTodoAuthorValidators = (input: ObjectID, context: GenContext) => {
    const validators = context.schema.apis.todo.model.author.validators;
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


export const runAllCanSelectTodoGuards = async (context: GenContext) => {
    return Promise.all([
        runCanSelectTodoTitleGuards(context),
        runCanSelectTodoDoneGuards(context),
        runCanSelectTodoJsonGuards(context),
        runCanSelectTodoAuthorGuards(context),
    ]);
};


export const runAllCanCreateTodoGuards = async (context: GenContext) => {
    return Promise.all([
        runCanCreateTodoTitleGuards(context),
        runCanCreateTodoDoneGuards(context),
        runCanCreateTodoJsonGuards(context),
        runCanCreateTodoAuthorGuards(context),
    ]);
};


export const runAllCanUpdateTodoGuards = async (context: GenContext) => {
    return Promise.all([
        runCanUpdateTodoTitleGuards(context),
        runCanUpdateTodoDoneGuards(context),
        runCanUpdateTodoJsonGuards(context),
        runCanUpdateTodoAuthorGuards(context),
    ]);
};


export const runAllTodoValidators = (context: GenContext, payload: any) => {
    const validators = Object.entries(context.schema.apis.todo.model)
        .map(([fieldName, field]: [string, any]) => [fieldName, field, field.validators || {}] as [string, any, LibValidator]);
    const validations = validators.map(([fieldName, field, validators]) => Object.entries(validators)
        .map(([validatorName, validator]) => [validatorName, validator(payload[fieldName], context)] as [string, LibValidatorReturnUnion])
    );
    if (validations.some(([validationName, validation]) => !!validation)) {
        return validations;
    }
    return null;
};


export class TodoUtilityService {

    context: GenContext;

    model = TodoModel;

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
        const results = await runAllCanSelectTodoGuards(this.context);
        return query
            .then(result => {
                Array.isArray(result)
                    ? result.forEach(res => deleteThem(results, res))
                    : deleteThem(results, result);
                return result;
            });
    }

    async applyAllCanCreateGuards(_payload: TodoCreatePayloadModel) {
        const payload = fieldForCreateTodo
            .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload[fieldName] }), {});
        const deleteThem = (results: LibGuardReturnUnion[], body: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete body[fieldName];
            }));
        };
        const results = await runAllCanCreateTodoGuards(this.context);
        deleteThem(results, payload);
        return payload as TodoCreatePayloadModel;
    }

    async applyAllCanUpdateGuards(_payload: TodoUpdatePayloadModel) {
        const payload = {
            id: _payload.id,
            $set: fieldForUpdateSetTodo
                .filter(fieldName => _payload.$set && fieldName in Object.keys(_payload.$set))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$set[fieldName] }), {}),
            $push: fieldForUpdatePushTodo
                .filter(fieldName => _payload.$push && fieldName in Object.keys(_payload.$push))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$push[fieldName] }), {}),
            $pull: fieldForUpdatePullTodo
                .filter(fieldName => _payload.$pull && fieldName in Object.keys(_payload.$pull))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$pull[fieldName] }), {}),
        };
        const deleteThem = (results: LibGuardReturnUnion[], body: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete body[fieldName];
            }));
        };
        const results = await runAllCanUpdateTodoGuards(this.context);
        deleteThem(results, payload.$set);
        deleteThem(results, payload.$push);
        deleteThem(results, payload.$pull);
        return payload as TodoUpdatePayloadModel;
    }

    applyAllValidators(context: GenContext, payload: any) {
        return runAllTodoValidators(context, payload);
    }

    async find(
        mongooseQueryObject?: TodoQueryObject,
        mongooseProjectionObject?: TodoProjectionObject,
        mongoosePopulateObject: TodoPopulateObject = {},
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
        _createPayload: TodoCreatePayloadModel,
    ) {
        const createPayload = await this.applyAllCanCreateGuards(_createPayload);
        const results = this.applyAllValidators(gen.context, createPayload);
        if (results) {
            throw new Error(JSON.stringify(results));
        }
        const instance = new this.model(createPayload);
        return instance.save();
    }

    async update(
        _updatePayload: TodoUpdatePayloadModel,
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
        const resultsForSet = this.applyAllValidators(gen.context, updatePayload.$set);
        const resultsForPush = this.applyAllValidators(gen.context, updatePayload.$push);
        const resultsForPull = this.applyAllValidators(gen.context, updatePayload.$pull);
        if (resultsForSet || resultsForPush || resultsForPull) {
            throw new Error(JSON.stringify([resultsForSet, resultsForPush, resultsForPull]));
        }
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
        mongooseQueryObject?: TodoQueryObject,
        mongooseProjectionObject?: TodoProjectionObject,
        mongoosePopulateObject: TodoPopulateObject = {},
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

    async createLean(createPayload: TodoCreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateLean(updatePayload: TodoUpdatePayloadModel) {
        return this.update(updatePayload, true);
    }

    async deleteLean(id: ID) {
        return this.delete(id, true);
    }

    async findExec(
        mongooseQueryObject?: TodoQueryObject,
        mongooseProjectionObject?: TodoProjectionObject,
        mongoosePopulateObject: TodoPopulateObject = {},
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

    async createExec(createPayload: TodoCreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateExec(updatePayload: TodoUpdatePayloadModel, cb?: any) {
        return this.update(updatePayload, false, true, cb);
    }

    async deleteExec(id: ID, cb?: any) {
        return this.delete(id, false, true, cb);
    }

    async findLeanExec(
        mongooseQueryObject?: TodoQueryObject,
        mongooseProjectionObject?: TodoProjectionObject,
        mongoosePopulateObject: TodoPopulateObject = {},
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

    async createLeanExec(createPayload: TodoCreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateLeanExec(updatePayload: TodoUpdatePayloadModel, cb?: any) {
        return this.update(updatePayload, true, true, cb);
    }

    async deleteLeanExec(id: ID, cb?: any) {
        return this.delete(id, true, true, cb);
    }
}

export const mainTodoUtilityService = new TodoUtilityService();



export class TodoService {

    utils = mainTodoUtilityService;

    constructor() {
        this.utils.context = gen.context;
    }

    async getAll() {
        const results = await this.utils.find({}, defaultTodoProjectionObject, defaultTodoPopulateObject);
        return results;
    }
    
    async getById(id: ID) {
        const result = await this.utils.find({ id }, defaultTodoProjectionObject, defaultTodoPopulateObject);
        return result;
    }
    
    async create(createPayload: TodoCreatePayloadModel) {
        const result = await this.utils.create(createPayload);
        return result;
    }
    
    async update(updatePayload: TodoUpdatePayloadModel) {
        const result = await this.utils.update(updatePayload);
        return result;
    }
    
    async delete(id: ID) {
        const result = await this.utils.delete(id);
        return result;
    }
}

export const mainTodoService = new TodoService();



/*

export class $name {
    constructor() {}
}

export const $instance = new $name();

*/


export class TodoController {
    
    service = mainTodoService;

    constructor() {}

    getAll() {
        return async (req: Request, res: Response) => {
            try {
                const response = await this.service.getAll();
                res.json({ response });
            } catch (error) {
                res.status(400).json({ error: error.toString() });
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
                res.status(400).json({ error: error.toString() });
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
                res.status(400).json({ error: error.toString() });
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
                res.status(400).json({ error: error.toString() });
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
                res.status(400).json({ error: error.toString() });
            }
        };
    }

}

export const mainTodoController = new TodoController();


export class TodoRouter {

    controller = mainTodoController;
    router: any;

    constructor() {}

    initialize() {
        this.router = Router()
            .get('/:id/author', ...gen.context.schema.apis.todo.webServices['GET /:id/author'].middlewares)
            .get('/', ...gen.context.schema.apis.todo.webServices['GET /'].middlewares, this.controller.getAll())
            .post('/', ...gen.context.schema.apis.todo.webServices['POST /'].middlewares, this.controller.create())
            .get('/:id', ...gen.context.schema.apis.todo.webServices['GET /:id'].middlewares, this.controller.getById())
            .put('/:id', ...gen.context.schema.apis.todo.webServices['PUT /:id'].middlewares, this.controller.update())
            .delete('/:id', ...gen.context.schema.apis.todo.webServices['DELETE /:id'].middlewares, this.controller.delete());
    }

    applyRouter(app: Application) {
        app.use('/todo', this.router);
    }

}

export const mainTodoRouter = new TodoRouter();


