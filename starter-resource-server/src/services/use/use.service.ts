import { Application } from "express";
import { prettifyRouter } from "../../utils/api-gen/prettier";
import { applyTodoAPI } from "../../apis/todo/todo";
import { initContextMiddleware } from "../../config/context";
import { setCurrentIdMiddleware } from "../../middlewares/set-current-id.middleware";
import { modules } from "../../modules";
import { applyUserAPI, mainUserService } from "../../apis/user/user";
import { createMainPassportService } from "../passport/passport.service";

const {
    JWT_SECRET
} = process.env;

export class UseService {
    use(app: Application) {

        const userCountController = modules.User.Controllers.countUsers;
        const UserModel = mainUserService.utils.User;
        
        const mainPassportService = createMainPassportService(JWT_SECRET, UserModel);
        const jwt = mainPassportService.jwt();

        app.post(
            '/signin',
            mainPassportService.localSigninMiddleware(),
            mainPassportService.localSigninController()
        );
        app.post(
            '/signout',
            jwt,
            mainPassportService.localSignoutMiddleware(),
            mainPassportService.localSignoutController(),
        );

        app.use(initContextMiddleware);

        applyUserAPI(app, { userCountController, jwt }, prettifyRouter, 'users', console);
        applyTodoAPI(app, { setCurrentIdMiddleware, jwt }, prettifyRouter, 'todos', console);
    }
}

export const mainUseService: UseService = new UseService();
