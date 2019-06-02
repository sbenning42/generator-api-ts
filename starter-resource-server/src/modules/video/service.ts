import { Singleton } from '../../common/singleton/singleton';
import { mainStoreService as mainStoreServiceGen } from '../../generated/store/store';
import { ID } from '../../generated/types';

export class VideoService extends Singleton {

    constructor() {
        super(VideoService);
    }

    addVideosToStore(storeId: ID, ...videoIds: ID[]) {
        const { utils } = mainStoreServiceGen;
        return utils.addVideosTo(storeId, ...videoIds);
    }

    removeVideosFromStore(storeId: ID, ...videoIds: ID[]) {
        const { utils } = mainStoreServiceGen;
        return utils.removeVideosFrom(storeId, ...videoIds);
    }

}

export const mainVideoService: VideoService = new VideoService();
