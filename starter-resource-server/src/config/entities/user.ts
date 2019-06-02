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
        store: {
            type: 'Store',
            required: true,
            skipChanges: true,
            skipAdd: true,
            skipRemove: true,
        },
        json: {
            type: Object,
            default: {}
        },
    },
    routes: {
        all: {
            middlewares: [
                'jwtMiddleware'
            ]
        },
        'POST /': {
            excludeMiddlewares: [
                'jwtMiddleware'
            ]
        },
        'DELETE /:id': {
            skip: true,
        }
    }
};
