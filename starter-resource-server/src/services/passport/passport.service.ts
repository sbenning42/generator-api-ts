import passport from 'passport';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import mongoose, { Model, Document } from 'mongoose';
import { ObjectID } from 'mongodb';

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

export class PassportService<User extends { _id: string | ObjectID }> {

    passport = passport;
    passportLocal = passportLocal;
    passportJWT = passportJWT;
    
    constructor(
        private secret: string,
        private userModel: Model<Document & User>,
        private fieldName: string,
    ) {
        console.log(`User model: `, userModel);
        this.setupLocalStrategy();
        this.setupJWTStrategy();
    }

    private setupLocalStrategy() {
        passport.use(new passportLocal.Strategy(
            async (username, password, done) => {
                const user = await this.userModel.findOne({ [this.fieldName]: username }).select('+username +password');
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
            secretOrKey: this.secret,
        };
        passport.use(new passportJWT.Strategy(JWTOptions, async ({ id }, done) => {
            const user = await this.userModel.findById(id);
            if (!user) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        }));
    }

    localSignupMiddleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { [this.fieldName]: username, password } = req.body;
            const user = await this.userModel.findOne({ [this.fieldName]: username });
            if (user) {
                res.status(401).json({ message: `Username already in use.` });
            } else {
                const data = new this.userModel({ [this.fieldName]: username, password });
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

    localSignoutMiddleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const authorization = req.headers.authorization;
            const token = authorization ? authorization.replace('Bearer ', '') : '';
            const userId = req.user ? req.user.id : undefined;
            const auth = new AuthModel({ token, userId });
            await auth.save();
            next();
        };
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
            const token = JWT.sign({ user, id: user._id }, this.secret);
            res.json({ user, token });
        };
    }

    localSignoutController() {
        return async (req: Request, res: Response) => {
            res.json({});
        };
    }
}

export function createMainPassportService<User extends { _id: string | ObjectID }>(
    secret: string,
    userModel: Model<Document & User>,
    fieldName: string = 'username',
) {
    return new PassportService<User>(secret, userModel, fieldName);
}
