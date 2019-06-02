import passport from 'passport';
import { v4 as uuid } from 'uuid';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import mongoose, { Model, Document } from 'mongoose';
import { ObjectID } from 'mongodb';
import { Singleton } from '../../common/singleton/singleton';
import { environment } from '../../environment';
import { UserModel } from '../../generated/types';

export const InvalidTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
});
export const InvalidTokenModel = mongoose.model('InvalidToken', InvalidTokenSchema);

export interface PassportServiceConfig<User> {
    User: Model<Document & User>;
    secret?: string;
    fields?: [string, string?];
}

export class PassportService<User extends { _id: string | ObjectID }> extends Singleton {

    constructor(public config: PassportServiceConfig<User>) {
        super(PassportService);
        const {
            User,
            secret = uuid(),
            fields: [username = 'username', password = 'password'] = [],
        } = config;
        console.log('USERNAME: ', username);
        console.log('PASSWORD: ', password);
        this.config = { User, secret, fields: [username, password] };
        this.setupLocalStrategy();
        this.setupJWTStrategy();
    }

    private setupLocalStrategy() {
        const { User, fields } = this.config;
        passport.use(new passportLocal.Strategy(
            async (username, password, done) => {
                const user = await User
                    .findOne({ [fields[0]]: username })
                    .select(`+${fields[0]} +${fields[1]}`);
                console.log(`Got user: `, user);
                if (!user || (user.get(`${fields[1]}`) !== password)) {
                    console.log('HERE !!!');
                    return done(null, false);
                } else {
                    return done(null, user);
                }
            }
        ));
    }

    private setupJWTStrategy() {
        const { User, secret } = this.config;
        const JWTOptions = {
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        };
        passport.use(new passportJWT.Strategy(JWTOptions, async ({ id }, done) => {
            const user = await User.findById(id);
            if (!user) {
                return done(null, false);
            } else {
                return done(null, user);
            }
        }));
    }

    localSigninMiddleware() {
        return passport.authenticate('local', { session: false });
    }

    localSignoutMiddleware() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const authorization = req.headers.authorization;
            const token = authorization ? authorization.replace('Bearer ', '') : '';
            const userId = req.user ? req.user.id : undefined;
            const auth = new InvalidTokenModel({ token, userId });
            await auth.save();
            next();
        };
    }

    jwt() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const authorization = req.headers.authorization;
            const token = authorization ? authorization.replace('Bearer ', '') : '';
            const data = await InvalidTokenModel.findOne({ token }).lean().exec();
            if (!data) {
                return passport.authenticate('jwt', { session: false })(req, res, next);
            } else {
                res.status(401).send({ message: `Invalid token.` });
            }
        };
    }

    localSigninController() {
        const {
            secret
        } = this.config;
        return async (req: Request, res: Response) => {
            const user = req.user;
            const token = JWT.sign({ user, id: user._id }, secret);
            res.json({ user, token });
        };
    }

    localSignoutController() {
        return async (req: Request, res: Response) => {
            res.json({});
        };
    }

    hasRoleMiddleware(roles: string[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const userRoles = req.user && req.user.roles ? req.user.roles : [];
            if (!roles.some(role => userRoles.includes(role))) {
                res.status(403).json({ message: 'Unauthorized.' });
            }
            next();
        };
    }
}

const {
    jwtSecret,
} = environment;

export const mainPassportService = new PassportService({
    secret: jwtSecret,
    User: UserModel
});
