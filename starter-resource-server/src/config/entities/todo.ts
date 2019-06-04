import { APISchemaEntity } from '../../common/api-gen/types';

export const todo: APISchemaEntity = {
    properties: {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        done: Boolean,
        tags: [{
            type: String,
            default: [],
        }],
        owner: {
            type: 'User',
            required: true,
            skipCreate: true,
            skipChanges: true,
            skipAdd: true,
            skipRemove: true,
        }
    },
    routes: {
        mutation: {
            middlewares: ['jwt', 'todoOwner']
        },
        'GET /:id/owner': {
            middlewares: ['jwt']
        },
        'POST /': {
            middlewares: ['reverseAddTodoOwner']
        },
        'DELETE /:id': {
            middlewares: ['reverseRemoveTodoOwner']
        },
        /**
         * Equivalent for `this.properties.owner.skipRemove = true`:
 
        'PUT /:id/owner/remove': {
            skip: true
        }

        */
    }
};
