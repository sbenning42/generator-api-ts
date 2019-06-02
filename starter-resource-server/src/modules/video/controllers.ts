import { Singleton } from '../../common/singleton/singleton';
import { Request, Response } from 'express';
import { L } from '../../common/logger';

export class VideoControllers extends Singleton {
    constructor() {
        super(VideoControllers);
    }

    uploadVideo() {
        return async (req: Request, res: Response) => {
            L.info(`Got file: `, req['file']);
            L.info(`Got files: `, req['files']);
            L.info(`VideoControllers@uploadVideo: Not implemented yet.`);
            const file = req['files'] && req['files'].file;
            if (!file) {
                return res.status(400).json({ message: `Something went wrong.` });
            }
            res.json({ name: req['files'].file.path, json: req['files'].file });
        };
    }
}

export const mainVideoControllers: VideoControllers = new VideoControllers();
