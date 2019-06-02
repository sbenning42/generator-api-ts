import passport from 'passport';
import { Application } from 'express';
import { environment } from '../../environment';
import { Singleton } from '../../common/singleton/singleton';
import { mainPassportRouter } from '../passport/router';
import { mainMongoService } from '../mongo/service';
import { initContextMiddleware } from '../../config/context';
import { applyUserAPI } from '../../generated/user/user';
import { prettifyRouter } from '../../common/api-gen/prettier';
import { mainPassportService } from '../passport/service';
import { L } from '../../common/logger';

const {
} = environment;

export interface UseServiceConfig {
}

export class UseService extends Singleton {
    
    constructor(public config: UseServiceConfig) {
        super(UseService);
    }

    async use(app: Application) {

        const jwtMiddleware = mainPassportService.jwt();
        
        await mainMongoService.init();
        L.info(`DB: ${mainMongoService.url} connected.`);
        
        app.use(initContextMiddleware, passport.initialize());
        mainPassportRouter.applyRouter(app, '/auth');
        
        applyUserAPI(app, {
            jwtMiddleware,
        }, prettifyRouter, 'users', console);

    }
}

export const mainUseService = new UseService({});
