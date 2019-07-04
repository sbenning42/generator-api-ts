
import { Request, Response, NextFunction, Application, Router } from 'express';
import { ObjectID } from 'mongodb';
import { ID, ctx as getCtx, select, create, update, _delete } from '../../common/api-gen';


export class TodoUtils {

    selectAll() {
        return select('todo');
    }

    selectById(id: ID) {
        return select('todo', id); 
    }

    create(body: any) {
        return create('todo', body);
    }

    update(id: ID, body: any) {
        return update('todo', id, body);
    }

    delete(id: ID) {
        return _delete('todo', id);
    }
}


export class TodoService {
    
    utils = new TodoUtils();

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


export class TodoController {
    
    service = new TodoService();

    getAll() {
        return async (req: Request, res: Response) => {
            try {
                res.json({
                    response: await this.service.getAll(),
                    errors: getCtx().err
                });
            } catch (error) {
                res.status(400).json({ error: error.toString(), ...getCtx().err });
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
                res.status(400).json({ error: error.toString(), ...getCtx().err });
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
                res.status(400).json({ error: error.toString(), ...getCtx().err });
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
                res.status(400).json({ error: error.toString(), ...getCtx().err });
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
                res.status(400).json({ error: error.toString(), ...getCtx().err });
            }
        };
    }
}


export class TodoRouter {

    controller = new TodoController();

    async apply(app: Application) {
        const {
            middlewares: { todo: middlewares }
        } = getCtx();
        app.use('/todos', Router()
            .get('/', ...(middlewares['GET /'] || []), this.controller.getAll())
            .post('/', ...(middlewares['POST /'] || []), this.controller.create())
            .get('/:id', ...(middlewares['GET /:id'] || []), this.controller.getById())
            .put('/:id', ...(middlewares['PUT /:id'] || []), this.controller.update())
            .delete('/:id', ...(middlewares['DELETE /:id'] || []), this.controller.delete())

        );
    }
}
