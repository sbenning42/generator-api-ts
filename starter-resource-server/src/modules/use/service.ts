import { Application } from 'express';
import { environment } from '../../environment';
import { Singleton } from '../../common/singleton/singleton';
import { mainPassportRouter } from '../passport/router';
import { mainMongoService } from '../mongo/service';
import passport = require('passport');
import { initContextMiddleware } from '../../config/context';

const {
} = environment;

export interface UseServiceConfig {
}

export class UseService extends Singleton {
    
    constructor(public config: UseServiceConfig) {
        super(UseService);
    }

    async use(app: Application) {
        await mainMongoService.init();
        app.use(
            initContextMiddleware,
            passport.initialize(),
        );
        mainPassportRouter.applyRouter(app);
    }
}

export const mainUseService = new UseService({});
