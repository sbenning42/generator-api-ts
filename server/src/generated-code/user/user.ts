
import { Request, Response, NextFunction, Application, Router } from 'express';
import { ObjectID } from 'mongodb';
import { ID, ctx as getCtx, select, create, update, _delete } from '../../common/api-gen';


export class UserUtils {

    selectAll() {
        return select('user');
    }

    selectById(id: ID) {
        return select('user', id); 
    }

    create(body: any) {
        return create('user', body);
    }

    update(id: ID, body: any) {
        return update('user', id, body);
    }

    delete(id: ID) {
        return _delete('user', id);
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


export class UserRouter {

    controller = new UserController();

    async apply(app: Application) {
        const {
            middlewares: { user: middlewares }
        } = getCtx();
        app.use('/users', Router()
            .get('/', ...(middlewares['GET /'] || []), this.controller.getAll())
            .post('/', ...(middlewares['POST /'] || []), this.controller.create())
            .get('/:id', ...(middlewares['GET /:id'] || []), this.controller.getById())
            .put('/:id', ...(middlewares['PUT /:id'] || []), this.controller.update())
            .delete('/:id', ...(middlewares['DELETE /:id'] || []), this.controller.delete())
            .put('/:id/password', ...(middlewares['PUT /:id/password'] || []))
        );
    }
}
