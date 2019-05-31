import { APISchemaEntity } from '../../utils/api-gen/types';

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
        json: {
            type: Object,
            default: {}
        },
        owner: {
            type: 'User',
            required: true,
            skipCreate: true,
            skipChanges: true,
        }
    },
    routes: {
        'PUT /:id/owner/add': { skip: true },
        'PUT /:id/owner/remove': { skip: true },
    }
};
