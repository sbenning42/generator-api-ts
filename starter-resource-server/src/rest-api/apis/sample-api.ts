import { Application, Router, Request, Response } from 'express';
import mongoose, { Mongoose } from 'mongoose';
import { ObjectID } from 'mongodb';
import { Auth } from '../../passport/auth';

/**
 * All APIs should declare:
 * - a typescript interface
 * - a database model (Mongoose here)
 * - some singleton services,
 * - A controller to define response methods
 * - A router to map endpoints to controller's methods
 */

export interface Sample {
    _id: string;
    title: string;
}
export interface SampleCreate {
    title: string;
}
export interface SampleChanges {
    title?: string;
}
export interface SampleUpdate {
    id: string;
    changes: SampleChanges;
}

export const SampleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    }
});
export const SampleModel = mongoose.model('Sample', SampleSchema);

/**
 * A sample service
 */
class SampleAPIService {
    async getAll() {
        return SampleModel.find({}).lean().exec();
    }
    async getById(id: string) {
        return SampleModel.findOne({ _id: new ObjectID(id) }).lean().exec();
    }
    async create(data: SampleCreate) {
        const sample = new SampleModel(data);
        return sample.save();
    }
    async update({ id, changes }: SampleUpdate) {
        return SampleModel.update({ _id: new ObjectID(id) }, changes).lean().exec();
    }
    async delete(id: string) {
        return SampleModel.deleteOne({ _id:new ObjectID(id)  });
    }
}

/**
 * Turned to singleton
 */
export const mainSampleAPIService = new SampleAPIService();

/**
 * The controller class
 * 
 * All method return the actual controller function
 */
class SampleAPIControllers {
    constructor() {}
    getAll() {
        return async (req: Request, res: Response) => {
            res.json(mainSampleAPIService.getAll());
        }
    }
    getById() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            res.json(mainSampleAPIService.getById(id));
        }
    }
    create() {
        return async (req: Request, res: Response) => {
            const data = req.body;
            res.json(mainSampleAPIService.create(data));
        }
    }
    update() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            const changes = req.body;
            res.json(mainSampleAPIService.update({ id, changes }));
        }
    }
    delete() {
        return async (req: Request, res: Response) => {
            const id = req.params.id;
            res.json(mainSampleAPIService.delete(id));
        }
    }
}

/**
 * The router class
 */
class SampleAPIRouter {
    
    router = Router();
    controllers = new SampleAPIControllers();
    
    constructor(public app: Application, public auth: Auth) {
        this.setupRouter();
        this.applyRouter();
    }

    private setupRouter() {
        this.router.get('/', this.controllers.getAll());
        this.router.get('/:id', this.controllers.getById());
        this.router.post('/', this.auth.jwt(), this.controllers.create());
        this.router.put('/:id', this.auth.jwt(), this.controllers.update());
        this.router.delete('/:id', this.auth.jwt(), this.controllers.delete());
    }
    
    applyRouter() {
        this.app.use('/samples', this.router);
    }
}

/**
 * Helper class to register the router into express application
 */
export class SampleAPI {
    router: SampleAPIRouter = new SampleAPIRouter(this.app, this.auth);
    constructor(public app: Application, public auth: Auth) {}
}
