
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
    Todov2Model,
    Todov2CreatePayloadModel,
    Todov2UpdatePayloadModel,
    Todov2QueryObject,
    Todov2ProjectionObject,
    Todov2PopulateObject
} from '../types';


export const fieldForCreateTodov2 = ['id', 'title', 'done', 'json'];


export const fieldForUpdateSetTodov2 = ['title', 'done', 'json'];


export const fieldForUpdatePushTodov2 = [];


export const fieldForUpdatePullTodov2 = [];


export const defaultTodov2ProjectionObject = {
    title: 1 as 0 | 1,
    done: 1 as 0 | 1,
    json: 1 as 0 | 1,
    author: 1 as 0 | 1,
};


export const defaultTodov2PopulateObject = {
    author: true,
};


export const runCanSelectTodov2TitleGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.title.guards
        && context.schema.apis.todov2.model.title.guards.canSelect;
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


export const runCanSelectTodov2DoneGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.done.guards
        && context.schema.apis.todov2.model.done.guards.canSelect;
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


export const runCanSelectTodov2JsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.json.guards
        && context.schema.apis.todov2.model.json.guards.canSelect;
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


export const runCanSelectTodov2AuthorGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.author.guards
        && context.schema.apis.todov2.model.author.guards.canSelect;
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


export const runCanCreateTodov2TitleGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.title.guards
        && context.schema.apis.todov2.model.title.guards.canCreate;
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


export const runCanCreateTodov2DoneGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.done.guards
        && context.schema.apis.todov2.model.done.guards.canCreate;
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


export const runCanCreateTodov2JsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.json.guards
        && context.schema.apis.todov2.model.json.guards.canCreate;
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


export const runCanCreateTodov2AuthorGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.author.guards
        && context.schema.apis.todov2.model.author.guards.canCreate;
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


export const runCanUpdateTodov2TitleGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.title.guards
        && context.schema.apis.todov2.model.title.guards.canUpdate;
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


export const runCanUpdateTodov2DoneGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.done.guards
        && context.schema.apis.todov2.model.done.guards.canUpdate;
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


export const runCanUpdateTodov2JsonGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.json.guards
        && context.schema.apis.todov2.model.json.guards.canUpdate;
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


export const runCanUpdateTodov2AuthorGuards = async (context: GenContext) => {
    const guards = context.schema.apis.todov2.model.author.guards
        && context.schema.apis.todov2.model.author.guards.canUpdate;
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


export const runTodov2TitleValidators = (input: string, context: GenContext) => {
    const validators = context.schema.apis.todov2.model.title.validators;
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


export const runTodov2DoneValidators = (input: boolean, context: GenContext) => {
    const validators = context.schema.apis.todov2.model.done.validators;
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


export const runTodov2JsonValidators = (input: any, context: GenContext) => {
    const validators = context.schema.apis.todov2.model.json.validators;
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


export const runTodov2AuthorValidators = (input: ObjectID, context: GenContext) => {
    const validators = context.schema.apis.todov2.model.author.validators;
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


export const runAllCanSelectTodov2Guards = async (context: GenContext) => {
    console.log('here');
    return Promise.all([
        runCanSelectTodov2TitleGuards(context),
        runCanSelectTodov2DoneGuards(context),
        runCanSelectTodov2JsonGuards(context),
        runCanSelectTodov2AuthorGuards(context),
    ]);
};


export const runAllCanCreateTodov2Guards = async (context: GenContext) => {
    return Promise.all([
        runCanCreateTodov2TitleGuards(context),
        runCanCreateTodov2DoneGuards(context),
        runCanCreateTodov2JsonGuards(context),
        runCanCreateTodov2AuthorGuards(context),
    ]);
};


export const runAllCanUpdateTodov2Guards = async (context: GenContext) => {
    return Promise.all([
        runCanUpdateTodov2TitleGuards(context),
        runCanUpdateTodov2DoneGuards(context),
        runCanUpdateTodov2JsonGuards(context),
        runCanUpdateTodov2AuthorGuards(context),
    ]);
};


export const runAllTodov2Validators = (context: GenContext) => {
    const validators = Object.entries(context.schema.apis.todov2.model)
        .map(([fieldName, field]: [string, any]) => [fieldName, field, field.validators || {}] as [string, any, LibValidator]);
    const validations = validators.map(([fieldName, field, validators]) => Object.entries(validators)
        .map(([validatorName, validator]) => [validatorName, validator(context.req[fieldName], context)] as [string, LibValidatorReturnUnion])
    );
    if (validations.some(([validationName, validation]) => !!validation)) {
        return validations;
    }
    return null;
};


export class Todov2UtilityService {

    context: GenContext;

    model = Todov2Model;

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
        const results = await runAllCanSelectTodov2Guards(this.context);
        return query
            .then(result => {
                Array.isArray(result)
                    ? result.forEach(res => deleteThem(results, res))
                    : deleteThem(results, result);
                return result;
            });
    }

    async applyAllCanCreateGuards(_payload: Todov2CreatePayloadModel) {
        const payload = fieldForCreateTodov2
            .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload[fieldName] }), {});
        const deleteThem = (results: LibGuardReturnUnion[], body: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete body[fieldName];
            }));
        };
        const results = await runAllCanCreateTodov2Guards(this.context);
        deleteThem(results, payload);
        return payload;
    }

    async applyAllCanUpdateGuards(_payload: Todov2UpdatePayloadModel) {
        const payload = {
            id: _payload.id,
            $set: fieldForUpdateSetTodov2
                .filter(fieldName => _payload.$set && fieldName in Object.keys(_payload.$set))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$set[fieldName] }), {}),
            $push: fieldForUpdatePushTodov2
                .filter(fieldName => _payload.$push && fieldName in Object.keys(_payload.$push))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$push[fieldName] }), {}),
            $pull: fieldForUpdatePullTodov2
                .filter(fieldName => _payload.$pull && fieldName in Object.keys(_payload.$pull))
                .reduce((step, fieldName) => ({ ...step, [fieldName]: _payload.$pull[fieldName] }), {}),
        };
        const deleteThem = (results: LibGuardReturnUnion[], body: any) => {
            results.forEach(result => Object.keys(result || {}).forEach(fieldName => {
                delete body[fieldName];
            }));
        };
        const results = await runAllCanUpdateTodov2Guards(this.context);
        deleteThem(results, payload.$set);
        deleteThem(results, payload.$push);
        deleteThem(results, payload.$pull);
        return payload;
    }

    async find(
        mongooseQueryObject?: Todov2QueryObject,
        mongooseProjectionObject?: Todov2ProjectionObject,
        mongoosePopulateObject: Todov2PopulateObject = {},
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
        _createPayload: Todov2CreatePayloadModel,
    ) {
        const createPayload = await this.applyAllCanCreateGuards(_createPayload);
        const instance = new this.model(createPayload);
        return instance.save();
    }

    async update(
        _updatePayload: Todov2UpdatePayloadModel,
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
        mongooseQueryObject?: Todov2QueryObject,
        mongooseProjectionObject?: Todov2ProjectionObject,
        mongoosePopulateObject: Todov2PopulateObject = {},
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

    async createLean(createPayload: Todov2CreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateLean(updatePayload: Todov2UpdatePayloadModel) {
        return this.update(updatePayload, true);
    }

    async deleteLean(id: ID) {
        return this.delete(id, true);
    }

    async findExec(
        mongooseQueryObject?: Todov2QueryObject,
        mongooseProjectionObject?: Todov2ProjectionObject,
        mongoosePopulateObject: Todov2PopulateObject = {},
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

    async createExec(createPayload: Todov2CreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateExec(updatePayload: Todov2UpdatePayloadModel, cb?: any) {
        return this.update(updatePayload, false, true, cb);
    }

    async deleteExec(id: ID, cb?: any) {
        return this.delete(id, false, true, cb);
    }

    async findLeanExec(
        mongooseQueryObject?: Todov2QueryObject,
        mongooseProjectionObject?: Todov2ProjectionObject,
        mongoosePopulateObject: Todov2PopulateObject = {},
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

    async createLeanExec(createPayload: Todov2CreatePayloadModel) {
        return this.create(createPayload);
    }

    async updateLeanExec(updatePayload: Todov2UpdatePayloadModel, cb?: any) {
        return this.update(updatePayload, true, true, cb);
    }

    async deleteLeanExec(id: ID, cb?: any) {
        return this.delete(id, true, true, cb);
    }
}

export const mainTodov2UtilityService = new Todov2UtilityService();



export class Todov2Service {

    utils = mainTodov2UtilityService;

    constructor() {
        this.utils.context = gen.context;
    }

    async getAll() {
        return this.utils.find({}, defaultTodov2ProjectionObject, defaultTodov2PopulateObject);
    }
    
    async getById(id: ID) {
        return this.utils.find({ id }, defaultTodov2ProjectionObject, defaultTodov2PopulateObject);
    }
    
    async create(createPayload: Todov2CreatePayloadModel) {
        return this.utils.create(createPayload);
    }
    
    async update(updatePayload: Todov2UpdatePayloadModel) {
        return this.utils.update(updatePayload);
    }
    
    async delete(id: ID) {
        return this.utils.delete(id);
    }
}

export const mainTodov2Service = new Todov2Service();



/*

export class $name {
    constructor() {}
}

export const $instance = new $name();

*/


export class Todov2Controller {
    
    service = mainTodov2Service;

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

export const mainTodov2Controller = new Todov2Controller();


export class Todov2Router {

    controller = mainTodov2Controller;
    router: any;

    constructor() {}

    initialize() {
        this.router = Router()
            .get('/:id/author', ...gen.context.schema.apis.todov2.webServices['GET /:id/author'].middlewares)
            .get('/', ...gen.context.schema.apis.todov2.webServices['GET /'].middlewares, this.controller.getAll())
            .post('/', ...gen.context.schema.apis.todov2.webServices['POST /'].middlewares, this.controller.create())
            .get('/:id', ...gen.context.schema.apis.todov2.webServices['GET /:id'].middlewares, this.controller.getById())
            .put('/:id', ...gen.context.schema.apis.todov2.webServices['PUT /:id'].middlewares, this.controller.update())
            .delete('/:id', ...gen.context.schema.apis.todov2.webServices['DELETE /:id'].middlewares, this.controller.delete());
    }

    applyRouter(app: Application) {
        app.use('/todov2', this.router);
    }

}

export const mainTodov2Router = new Todov2Router();


