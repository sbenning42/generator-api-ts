import { APISchemaEntity } from "../../common/api-gen/types";

export const store: APISchemaEntity = {
    properties: {
        name: {
            type: String,
            required: true,
            unique: true,
        }
    },
    routes: {
        mutation: {
            middlewares: ['jwtMiddleware']
        },
        'PUT /:id': {
            skip: true,
        },
        'DELETE /id': {
            skip: true,
        },
    },
};