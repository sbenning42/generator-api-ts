import { Application, Router, Request, Response, NextFunction } from 'express';
import { Mongoose } from 'mongoose';
import { Auth, AuthModel } from '../../passport/auth';

/**
 * A auth service
 */
class AuthAPIService {
    
    async signout(token: string, userId: string) {
        const doc = { token, userId };
        const data = new AuthModel(doc);
        return data.save();
    }
}

/**
 * Turned to singleton
 */
export const mainAuthAPIService = new AuthAPIService();

/**
 * The controller class
 * 
 * All method return the actual controller function
 */
class AuthAPIControllers {
    constructor() {}
    
    signout() {
        return async (req: Request, res: Response) => {
            const authorization = req.headers.authorization;
            const token = authorization.replace('Bearer ', '');
            const userId = req.user._id;
            res.json(mainAuthAPIService.signout(token, userId));
        }
    }
}

/**
 * The router class
 */
class AuthAPIRouter {
    
    router = Router();
    controllers = new AuthAPIControllers();
    
    constructor(
        public app: Application,
        public auth: Auth
    ) {
        this.setupRouter();
        this.applyRouter();
    }

    private setupRouter() {
        this.router.post(
            '/signup',
            this.auth.localSignupMiddleware(),
            this.auth.localSigninMiddleware(),
            this.auth.localSigninController(),
        );
        this.router.post(
            '/signin',
            this.auth.localSigninMiddleware(),
            this.auth.localSigninController(),
        );
        this.router.post(
            '/signout',
            this.auth.jwt(),
            this.controllers.signout()
        );
    }
    
    applyRouter() {
        this.app.use('/auth', this.router);
    }
}

/**
 * Helper class to register the router into express application
 */
export class AuthAPI {
    router: AuthAPIRouter;
    constructor(
        public app: Application,
        public auth: Auth,
    ) {
        this.router = new AuthAPIRouter(app, auth);
    }
}
