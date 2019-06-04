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
    },
    routes: {
        all: {
            middlewares: [
                'jwt'
            ]
        },
        'POST /': {
            excludeMiddlewares: [
                'jwt'
            ]
        },
        'PUT /:id': {
            middlewares: [
                'self'
            ]
        },
        'DELETE /:id': {
            skip: true,
        }
    }
};
