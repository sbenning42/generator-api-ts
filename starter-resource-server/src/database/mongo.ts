import mongoose, { Mongoose } from 'mongoose';

export class MongoService {

    private db: Mongoose;
    
    constructor(public mongoDBURL: string) {}

    async init() {
        return this.db = await mongoose.connect(
            this.mongoDBURL,
            {
                useNewUrlParser: true,
                useFindAndModify: false,
            });
    }

    async getDB() {
        if (!this.db) {
            await this.init();
        }
        return this.db;
    }
}

export const mainMongoService = new MongoService(process.env.MONGO_URL);
