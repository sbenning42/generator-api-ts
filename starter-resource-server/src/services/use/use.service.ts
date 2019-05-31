import { Application } from "express";
import { applyUserAPI, UserRouter } from "../../apis/user/user";
import { prettifyRouter } from "../../utils/api-gen/prettier";

export class UseService {
    use(app: Application) {
        /**
         *
         * import { prettifyRouter } from '<api-gen folder>/prettier'; 
         * import { <Entity>Router } from '<generation folder>/<entity>/<entity>';
         * 
         * const entityRouter = new <Entity>Router();
         * entityRouter.applyRouter(app); // apply configured express Router to app
         * prettifyRouter('<entity name>', entityRouter.router, console); // log generated available endpoints
         * 
         * //
         * 
         * import { apply<Entity>API } from '<generation folder>/<entity>/<entity>';
         * 
         * apply<Entity>API(app);
         * 
         * //
         * 
         * 
         * 
         */

        const userRouter = new UserRouter();
        userRouter.applyRouter(app);
        prettifyRouter('users', userRouter.router, console);
        
        // applyUserAPI(app);
    }
}

export const mainUseService: UseService = new UseService();
