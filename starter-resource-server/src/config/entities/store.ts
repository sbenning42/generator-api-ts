import { APISchemaEntity } from "../../common/api-gen/types";

export const store: APISchemaEntity = {
    properties: {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        videos: [{
            type: 'Video',
            default: [],
            skipCreate: true,
            skipChanges: true,
            skipAdd: true,
            skipRemove: true,
        }]
    },
    routes: {
        mutation: {
            middlewares: ['jwtMiddleware']
        },
        'PUT /:id': {
            skip: true,
        },
        'DELETE /:id': {
            skip: true,
        },
    },
};