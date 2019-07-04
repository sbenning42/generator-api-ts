import { Router, Application } from 'express';
import { mainPassportService } from './service';
import { Singleton } from '../../common/singleton/singleton';

export class PassportRouter extends Singleton {

    constructor() {
        super(PassportRouter);
    }
    
    router = Router()
        
        .post(
            '/signin',
            mainPassportService.localSigninMiddleware(),
            mainPassportService.localSigninController(),
        )
        
        .post(
            '/signout',
            mainPassportService.localSignoutMiddleware(),
            mainPassportService.localSignoutController(),
        );

    applyRouter(app: Application, path: string = '/auth') {
        app.use(path, this.router);
    }

}

export const mainPassportRouter = new PassportRouter();
