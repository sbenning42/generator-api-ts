import { APISchemaEntity } from '../../utils/api-gen/types';

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
        }]
    }
};
