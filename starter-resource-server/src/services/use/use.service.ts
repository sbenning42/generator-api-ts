import { Application } from "express";
import { applyUserAPI, UserRouter } from "../../apis/user/user";
import { prettifyRouter } from "../../utils/api-gen/prettier";
import { userCountController } from "../../controllers/user-count";
import { applyTodoAPI, TodoRouter } from "../../apis/todo/todo";

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

        const userRouter = new UserRouter({ userCountController });
        userRouter.applyRouter(app);
        prettifyRouter('users', userRouter.router, console);

        const todoRouter = new TodoRouter();
        todoRouter.applyRouter(app);
        prettifyRouter('todos', todoRouter.router, console);
        
        // applyUserAPI(app);
        // applyTodoAPI(app);
    }
}

export const mainUseService: UseService = new UseService();
