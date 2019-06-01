import mongoose, { Mongoose } from 'mongoose';
import { Singleton } from '../../common/singleton/singleton';
import { environment } from '../../environment';

export class MongoService extends Singleton {

    private _db: Mongoose;
    
    constructor(public url: string) {
        super(MongoService);
    }

    async init() {
        return this._db = await mongoose.connect(this.url, { useNewUrlParser: false, useFindAndModify: true });
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
