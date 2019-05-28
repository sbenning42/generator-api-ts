import { CRUDSchemaInput } from "../utils/api-generator";

export const User: CRUDSchemaInput<{
    username: string,
    password: string,
}> = {
    name: 'User',
    props: {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    query: {
        ALL: {
            middlewares: [
                `
                middlewaresMap.hasTokenLogMiddleware,
                `
            ]
        }
    },
    mutation: {
        ALL: {
            middlewares: [
                `
                middlewaresMap.hasTokenLogMiddleware,
                `
            ]
        },
        createUser: {
            skip: true
        }
    },
    relations: {
        roles: '[Role]'
    }
};
