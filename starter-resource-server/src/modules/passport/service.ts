import passport from 'passport';
import { v4 as uuid } from 'uuid';
import passportLocal from 'passport-local';
import passportJWT from 'passport-jwt';
import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import mongoose, { Model, Document, Schema, model } from 'mongoose';
import { ObjectID } from 'mongodb';
import { Singleton } from '../../common/singleton/singleton';
import { environment } from '../../environment';
import { L } from '../../common/logger';
import { ctx } from '../../common/api-gen';
import bcrypt from 'bcrypt';

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
    User?: Model<Document & User>;
    secret?: string;
    fields?: [string, string?];
}

export class PassportService<User extends { _id: string | ObjectID }> extends Singleton {

    constructor(public config: PassportServiceConfig<User>) {
        super(PassportService);
        const {
            User = mongoose.model('User'),
            secret = uuid(),
            fields: [username = 'username', password = 'password'] = [],
        } = config;
        this.config = { User: mongoose.model('User'), secret, fields: [username, password] };
        this.setupLocalStrategy();
        this.setupJWTStrategy();
    }

    private setupLocalStrategy() {
        const { fields } = this.config;
        const User = mongoose.model('User');
        passport.use(new passportLocal.Strategy(
            async (username, password, done) => {
                const user = await User
                    .findOne({ [fields[0]]: username })
                    .select(`+${fields[0]} +${fields[1]}`)
                    .lean();
                if (!user || !(bcrypt.compare(password, user[`${fields[1]}`]))) {
                    return done(null, false);
                } else {
                    delete user[fields[1]];
                    return done(null, user);
                }
            }
        ));
    }

    private setupJWTStrategy() {
        const { secret, fields } = this.config;
        const User = mongoose.model('User');
        const JWTOptions = {
            jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secret,
        };
        passport.use(new passportJWT.Strategy(JWTOptions, async ({ id }, done) => {
            const user = await User.findById(id);
            ctx().user = user;
            ctx().req.user = user;
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
                return res.status(401).send({ message: `Invalid token.` });
            }
        };
    }

    self() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const { user, params: { id } } = req;
            if (!id || user.id !== id) {
                L.info(`Not self: `, user.id, id);
                return res.status(403).json({ message: 'Unauthorized.' });
            }
            ctx().self = id;
            next();
        };
    }

    /**
     * count
deleteMany
deleteOne
find
findOne
findOneAndDelete
findOneAndRemove
findOneAndUpdate
remove
update
updateOne
updateMany
     */

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

    hasRole(roles: string[]) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const userRoles = req.user && req.user.roles ? req.user.roles : [];
            if (!roles.some(role => userRoles.includes(role))) {
                return res.status(403).json({ message: 'Unauthorized.' });
            }
            next();
        };
    }
}

const {
    jwtSecret,
} = environment;


export const mainPassportService = new PassportService({
    secret: jwtSecret
});
