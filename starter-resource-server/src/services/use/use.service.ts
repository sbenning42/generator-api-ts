import { Application } from "express";
import { prettifyRouter } from "../../utils/api-gen/prettier";
import { applyTodoAPI } from "../../apis/todo/todo";
import { initContextMiddleware } from "../../config/context";
import { setCurrentIdMiddleware } from "../../middlewares/set-current-id.middleware";
import { modules } from "../../modules";
import { applyUserAPI } from "../../apis/user/user";

const userCountController = modules.User.Controllers.countUsers;

export class UseService {
    use(app: Application) {
        /**
         * 
         * import { apply<Entity>API } from '<generation folder>/<entity>/<entity>';
         * 
         * apply<Entity>API(app);
         * 
         * //
         * 
         * apply<Entity>API(app, { myMdiddleware: (req, res, next) => {...} });
         * 
         * //
         * 
         * apply<Entity>API(app, { myMdiddleware: (req, res, next) => {...} }, prettifyRouter, '<entity>s', console);
         * 
         * //
         * 
         */

        app.use(initContextMiddleware);

        applyUserAPI(app, { userCountController }, prettifyRouter, 'users', console);
        applyTodoAPI(app, { setCurrentIdMiddleware }, prettifyRouter, 'users', console);
    }
}

export const mainUseService: UseService = new UseService();
