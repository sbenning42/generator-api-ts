import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { LocalUserModel, LocalUser } from './local-user';
import mongoose from 'mongoose';

export interface AuthPayload {
    username: string;
    password: string;
}
export interface AuthResponse {
    user: LocalUser;
    token: string;
}

export const AuthSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
});
export const AuthModel = mongoose.model('Auth', AuthSchema);

const {
    JWT_SECRET,
} = process.env;

export class Auth {

    passport = passport;
    passportLocal = passportLocal;
    passportJWT = passportJWT;
    
    constructor() {
        this.setupLocalStrategy();
        this.setupJWTStrategy();
    }

    private setupLocalStrategy() {
        passport.use(new passportLocal.Strategy(
            async function(username, password, done) {
                const user = await LocalUserModel.findOne({ username: username });
                if (!user || (user.get('password') !== password)) {
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            }
        ));
    }

    private setupJWTStrategy() {
        const JWTOptions = {
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET,
        };
        passport.use(new passportJWT.Strategy(JWTOptions, async ({ id }, done) => {
            const user = await LocalUserModel.findById(id);
            if (!user) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        }));
    }

    localSignupMiddleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { username, password } = req.body;
            const user = await LocalUserModel.findOne({ username });
            if (user) {
                res.status(401).json({ message: `Username already in use.` });
            } else {
                const data = new LocalUserModel({ username, password });
                if (!await data.save()) {
                    res.status(500).json({ message: `Something went wrong.` });
                } else {
                    next();
                }
            }
        };
    }

    localSigninMiddleware() {
        return this.passport.authenticate('local', { session: false });
    }

    jwt() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const authorization = req.headers.authorization;
            const token = authorization ? authorization.replace('Bearer ', '') : '';
            const data = await AuthModel.findOne({ token }).lean().exec();
            if (!data) {
                return this.passport.authenticate('jwt', { session: false })(req, res, next);
            } else {
                res.status(401).send({ message: `Invalid token.` });
            }
        };
    }

    localSigninController() {
        return async (req: Request, res: Response) => {
            const user = req.user;
            const token = JWT.sign({ user, id: user._id }, JWT_SECRET);
            res.json({ user, token });
        };
    }
}
