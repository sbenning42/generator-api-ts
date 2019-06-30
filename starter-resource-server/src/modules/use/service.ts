import passport from 'passport';
import { Application } from 'express';
import { environment } from '../../environment';
import { Singleton } from '../../common/singleton/singleton';
import { mainPassportRouter } from '../passport/router';
import { mainMongoService } from '../mongo/service';
import { initContextMiddleware } from '../../config/context';
import { applyUserAPI } from '../../generated/user/user';
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
        
        await mainMongoService.init();
        L.info(`DB: ${mainMongoService.url} connected.`);
        
        app.use(initContextMiddleware, passport.initialize());
        mainPassportRouter.applyRouter(app, '/auth');
        /*
        
        const todoOwnerConfig = {
            key: 'Todo',
            name: 'todos',
            // field: 'owner', // optional, default to 'owner'
            on: mainTodoService.utils, 
        };
        const todoOwner = mainPassportService.owner(TodoSchema, todoOwnerConfig);
        const reverseAddTodoOwner = mainTodoMiddlewares.reverseAddTodoOwner();
        const reverseRemoveTodoOwner = mainTodoMiddlewares.reverseRemoveTodoOwner();
        applyTodoAPI(app, { todoOwner, reverseAddTodoOwner, reverseRemoveTodoOwner });

        await mainGraphqlService.getSchema();
        await mainGraphqlService.applyMiddleware(app);
*/
    }
}

export const mainUseService = new UseService({});
