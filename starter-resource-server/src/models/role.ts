import { CRUDSchemaInput } from "../utils/api-generator";

export const Role: CRUDSchemaInput<{
    name: string,
}> = {
    name: 'Role',
    props: {
        name: {
            type: String,
            required: true,
            unique: true
        }
    },
    relations: {
        users: '[User]'
    },
    skips: [
        'getByIdRole',
        'updateRole',
        'addRoleUsers',
    ]
};
