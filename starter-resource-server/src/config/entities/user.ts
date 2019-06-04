import { APISchemaEntity } from '../../common/api-gen/types';

export const user: APISchemaEntity = {
    properties: {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            hidden: true,
        },
        roles: [{
            type: String,
            required: true,
            skipCreate: true,
            skipChanges: true,
            default: ['user']
        }],
        json: {
            type: Object,
            default: {}
        },
        todos: [{
            type: 'Todo',
            skipCreate: true,
            skipChanges: true,
            skipAdd: true,
            skipRemove: true,
        }]
    },
    routes: {
        all: {
            middlewares: ['jwt']
        },
        mutation: {
            middlewares: ['self'],
        },
        'POST /': {
            excludeMiddlewares: ['jwt', 'self']
        }
    }
};
