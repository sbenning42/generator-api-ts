import { mainUserControllers } from "./user/controllers";
import { mainUserMiddlewares } from "./user/middleware";
import { mainUserService } from "./user/service";

export const modules = {
    User: {
        service: mainUserService,
        Controllers: mainUserControllers,
        Middlewares: mainUserMiddlewares,
    },
};
