import { ObjectID } from 'mongodb';
import { Singleton } from '../../common/singleton/singleton';
import { Request, Response, NextFunction } from 'express';
import { L } from '../../common/logger';
import { mainVideoService } from './service';

export class VideoMiddlewares extends Singleton {
    constructor() {
        super(VideoMiddlewares);
    }

    addVideoToStore() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const videoId = new ObjectID();
            req.body.id = videoId; // important to not let Mongoose create _id for us
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
                console.log('will remove from ', storeId, videoId);
                await mainVideoService.removeVideosFromStore(storeId, videoId);
                next();
            } catch (error) {
                res.status(400).json({ error, message: `Something went wrong.` })
            }
        };
    }
}

export const mainVideoMiddlewares: VideoMiddlewares = new VideoMiddlewares();
