import { Application } from "express";

export class UseService {
    use(app: Application) {
        /**
         *
         * import { prettifyRouter } from '<api-gen folder>/prettier'; 
         * import { <Entity>Router } from '<generation folder>/<entity>/<entity>';
         * 
         * const entityRouter = new <Entity>Router();
         * entityRouter.applyRouter(app); // apply configured express Router to app
         * prettifyRouter(entityRouter.router); // log generated available endpoints
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
    }
}

export const mainUseService: UseService = new UseService();
