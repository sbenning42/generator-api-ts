import { CRUDSchemaInput } from '../utils/api-generator';
import { User } from './user';
import { Role } from './role';

export const models: CRUDSchemaInput[] = [
    User,
    Role
];
