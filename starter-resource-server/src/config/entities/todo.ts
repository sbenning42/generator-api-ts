import { APISchemaEntity } from '../../utils/api-gen/types';
import { context } from '../context';

export const todo: APISchemaEntity = {
    properties: {
        title: {
            type: String,
            required: true,
            unique: true,
        },
        done: {
            type: Boolean,
            required: true,
            default: false,
        },
        json: [{
            type: Object,
            default: {}
        }],
        owner: {
            type: 'User',
            required: true,
            skipCreate: true,
            skipChanges: true,
            default: () => context().currentId
        }
    },
    routes: {
        'POST /': {
            middlewares: ['setCurrentIdMiddleware']
        },
        'PUT /:id/owner/add': { skip: true },
        'PUT /:id/owner/remove': { skip: true },
    }
};
