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
import { UserModel, UserSchema } from '../../generated-v2/types';
import { L } from '../../common/logger';
import { context } from '../../config/context';

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
    UserSchema: Schema<Document & User>;
    secret?: string;
    fields?: [string, string?];
}

export class PassportService<User extends { _id: string | ObjectID }> extends Singleton {

    constructor(public config: PassportServiceConfig<User>) {
        super(PassportService);
        const {
            User, UserSchema,
            secret = uuid(),
            fields: [username = 'username', password = 'password'] = [],
        } = config;
        this.config = { User, UserSchema, secret, fields: [username, password] };
        this.setupLocalStrategy();
        this.setupJWTStrategy();
    }

    private setupLocalStrategy() {
        const { User, fields } = this.config;
        passport.use(new passportLocal.Strategy(
            async (username, password, done) => {
                const user = await User
                    .findOne({ [fields[0]]: username })
                    .select(`+${fields[0]} +${fields[1]}`)
                    .lean();
                if (!user || (user[`${fields[1]}`] !== password)) {
                    return done(null, false);
                } else {
                    delete user[fields[1]];
                    return done(null, user);
                }
            }
        ));
    }

    private setupJWTStrategy() {
        const { User, secret, fields } = this.config;
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
            context().self = id;
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

    owner(
        Schema: Schema<Document>,
        loc?: { key: string, on: any, name: string, field?: string },
        fors: ('deleteMany'
            |'find'
            |'deleteOne'
            |'findOne'
            |'findOneAndDelete'
            |'findOneAndRemove'
            |'findOneAndUpdate'
            |'updateOne'
            |'updateMany'
            |'remove'
            |'validate'
            |'save'
            |'update')[] = [
                'validate',
                'save',
                'find',
                'findOne',
                'findOneAndDelete',
                'findOneAndRemove',
                'findOneAndUpdate',
                'update',
                'updateMany',
                'updateOne',
                'remove',
                'deleteOne',
                'deleteMany'
            ]
    ) {
        Schema = Schema.clone();
        return async (req: Request, res: Response, _next: NextFunction) => {
            const { user: { id } } = req;
            const original = loc.on[loc.key];
            const { field = 'owner' } = loc;
            fors.forEach(_for => {
                Schema = Schema.pre(_for, function(next) {
                    if (_for === 'validate' || _for === 'save') {
                        this[field] = id;
                    } else if (_for === 'remove') {
                        if (!this[field] === id) {
                            throw new Error('Unauthorized');
                        }
                    } else {
                        this['where']({ [field]: id });
                    }
                    next();
                });
                Schema = Schema.post(_for, function(next) {
                    loc.on[loc.key] = original;
                });
            });
            context().self = id;
            loc.on[loc.key] = model(loc.key + `_PATCH_${uuid()}`, Schema, loc.name);
            _next();          
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
    secret: jwtSecret,
    User: UserModel,
    UserSchema: UserSchema
});
