import { Singleton } from '../../common/singleton/singleton';
import { Request, Response } from 'express';
import { L } from '../../common/logger';

export class VideoControllers extends Singleton {
    constructor() {
        super(VideoControllers);
    }

    uploadVideo() {
        return async (req: Request, res: Response) => {
            L.info(`VideoControllers@uploadVideo: Not implemented yet.`);
            res.status(504).json({ message: `Not implemented yet.` });
        };
    }
}

export const mainVideoControllers: VideoControllers = new VideoControllers();
