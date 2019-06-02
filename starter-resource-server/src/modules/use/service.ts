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
import { applyStoreAPI } from '../../generated/store/store';
import { applyVideoAPI } from '../../generated/video/video';
import { mainVideoControllers } from '../video/controllers';
import { mainVideoMiddlewares } from '../video/middlewares';

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
        const multipartMiddleware = mainVideoMiddlewares.multipartMiddleware;
        const addVideoToStoreMiddleware = mainVideoMiddlewares.addVideoToStore();
        const deleteVideoFromStoreMiddleware = mainVideoMiddlewares.deleteVideoFromStore();
        
        const uploadVideoController = mainVideoControllers.uploadVideo();

        await mainMongoService.init();
        L.info(`DB: ${mainMongoService.url} connected.`);
        
        app.use(initContextMiddleware, passport.initialize());
        mainPassportRouter.applyRouter(app, '/auth');
        
        applyUserAPI(app, {
            jwtMiddleware,
        }, prettifyRouter, 'users', console);
        
        applyStoreAPI(app, {
            jwtMiddleware,
        }, prettifyRouter, 'stores', console);
        
        applyVideoAPI(app, {
            jwtMiddleware,
            multipartMiddleware,
            addVideoToStoreMiddleware,
            deleteVideoFromStoreMiddleware,
            uploadVideoController,
        }, prettifyRouter, 'videos', console);

    }
}

export const mainUseService = new UseService({});
