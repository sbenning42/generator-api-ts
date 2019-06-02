import { ObjectID } from 'mongodb';
import { Singleton } from '../../common/singleton/singleton';
import { Request, Response, NextFunction } from 'express';
import { L } from '../../common/logger';
import { mainVideoService } from './service';

import fs from 'fs';
import multipart from 'connect-multiparty';
import { environment } from '../../environment';

const {
    uploadDir = './assets/uploads'
} = environment;

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { mode: 0o755 });
}

export class VideoMiddlewares extends Singleton {

    multipartMiddleware = multipart({ uploadDir: uploadDir });

    constructor() {
        super(VideoMiddlewares);
    }

    addVideoToStore() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const videoId = new ObjectID();
            req.body._id = videoId; // important to not let Mongoose create _id for us
            const storeId = req.user.store;
            try {
                await mainVideoService.addVideosToStore(storeId, videoId);
                next();
            } catch (error) {
                res.status(400).json({ error, message: `Something went wrong.` })
            }
        };
    }

    deleteVideoFromStore() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const videoId = req.params.id;;
            const storeId = req.user.store;
            try {
                await mainVideoService.removeVideosFromStore(storeId, videoId);
                next();
            } catch (error) {
                res.status(400).json({ error, message: `Something went wrong.` })
            }
        };
    }
}

export const mainVideoMiddlewares: VideoMiddlewares = new VideoMiddlewares();
