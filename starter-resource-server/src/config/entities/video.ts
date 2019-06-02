import { APISchemaEntity } from "../../common/api-gen/types";
import { context } from "../context";

export const video: APISchemaEntity = {
    properties: {
        name: {
            type: String,
            required: true,
            unique: true,
            skipChanges: true,
        },
        json: Object,
        store: {
            type: 'Store',
            required: true,
            skipCreate: true,
            skipChanges: true,
            /*
            skipAdd: true,
            skipRemove: true,
            */
            default: () => context().req.user.store
        },
    },
    routes: {
        mutation: {
            middlewares: ['jwtMiddleware']
        },
        'POST /': {
            middlewares: ['addVideoToStoreMiddleware']
        },
        'DELETE /:id': {
            middlewares: ['deleteVideoFromStoreMiddleware']
        },
        'POST /utils/upload': {
            middlewares: ['multipartMiddleware', 'uploadVideoController']
        }
    }
};
