import { APISchemaEntity } from "../../common/api-gen/types";

export const todo: APISchemaEntity = {
    properties: {
        title: {
            type: String,
            required: true,
            unique: true
        },
        done: {
            type: Boolean,
            required: true,
        },
        owner: {
            type: 'User',
            required: true,
            skipCreate: true,
            skipAdd: true,
            skipChanges: true,
            skipRemove: true,
        },
        json: Object,
    },
    routes: {
        all: {
            middlewares: ['jwt'],
        },
        mutation: {
            middlewares: ['todoOwner']
        }
    }
};
