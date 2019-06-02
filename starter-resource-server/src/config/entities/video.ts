import { APISchemaEntity } from "../../common/api-gen/types";
import { context } from "../context";

export const video: APISchemaEntity = {
    properties: {
        json: {
            type: Object,
            required: true,
        },
        store: {
            type: 'Store',
            required: true,
            skipCreate: true,
            skipChanges: true,
            skipAdd: true,
            skipRemove: true,
            default: () => {
                const {
                    req: {
                        user: { store }
                    }
                } = context();
                return store;
            }
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
