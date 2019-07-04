import passport from 'passport';
import { Application } from 'express';
import { environment } from '../../environment';
import { Singleton } from '../../common/singleton/singleton';
// import { UserRouter } from '../../generated-code/user/user';

const {
} = environment;

export interface UseServiceConfig {
}

export class UseService extends Singleton {
    
    constructor(public config: UseServiceConfig) {
        super(UseService);
    }

    async use(app: Application) {
                
        app.use(passport.initialize());
        
        // new UserRouter().apply(app);

    }
}

export const mainUseService = new UseService({});
