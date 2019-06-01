import mongoose, { Mongoose } from 'mongoose';
import { Singleton } from '../../common/singleton/singleton';
import { environment } from '../../environment';

const mongoConfig = {
    useCreateIndex: true, // as mentionned by deprecation warning
    useNewUrlParser: true, // as mentionned by deprecation warning
    useFindAndModify: false, // as mentionned by deprecation warning
};

export class MongoService extends Singleton {

    private _db: Mongoose;
    
    constructor(public url: string) {
        super(MongoService);
    }

    async init() {
        return this._db = await mongoose.connect(this.url, mongoConfig);
    }

    async db() {
        if (!this._db) {
            await this.init();
        }
        return this._db;
    }
}

const {
    mongoUrl
} = environment;

export const mainMongoService = new MongoService(mongoUrl);
