import { Singleton } from '../../common/singleton/singleton';
import { ID } from '../../generated/types';
import { mainUserService } from '../../generated/user/user';

export class TodoServiceExt extends Singleton {
    constructor() {
        super(TodoServiceExt);
    }

    reverseAddTodoOwner(userId: ID, id: ID) {
        const { utils } = mainUserService;
        return utils.addTodosTo(userId, id);
    }

    reverseRemoveTodoOwner(userId: ID, id: ID) {
        const { utils } = mainUserService;
        return utils.removeTodosFrom(userId, id);
    }
}

export const mainTodoServiceExt: TodoServiceExt = new TodoServiceExt();
