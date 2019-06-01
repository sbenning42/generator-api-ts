import { mainUserService as mainUserServiceGen } from '../../apis/user/user';

export class UserService {

    countUsers() {
        const { utils } = mainUserServiceGen;
        return utils.User.countDocuments();
    }
}

export const mainUserService: UserService = new UserService();
